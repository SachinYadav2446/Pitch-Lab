import os
import time
import uuid
import threading
import tempfile
import cv2
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.staticfiles import StaticFiles

import torch
from core.pipeline import MatchAnalyticsPipeline

app = FastAPI(
    title="PitchVision AI - Neural Football Analytics API",
    description="High-performance Computer Vision API for autonomous player tracking, 2D pitch homography, and physical performance telemetry.",
    version="2.0.0"
)

# Enable CORS for React frontend on localhost:5173 and other ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temporary and output directories exist
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
OUTPUTS_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)

# Mount outputs for static file serving
app.mount("/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")

# In-memory jobs store
jobs_db: Dict[str, Dict[str, Any]] = {}

def get_compute_device() -> str:
    return "cuda:0" if torch.cuda.is_available() else "cpu"

@app.get("/api/health")
def health_check():
    cuda_avail = torch.cuda.is_available()
    gpu_name = torch.cuda.get_device_name(0) if cuda_avail else "CPU (Standard)"
    yolo_present = os.path.exists("yolov8n.pt")
    
    return {
        "status": "online",
        "device": get_compute_device(),
        "gpu_name": gpu_name,
        "cuda_available": cuda_avail,
        "yolo_weights_loaded": yolo_present,
        "active_jobs": len(jobs_db)
    }

def process_video_task(job_id: str, video_path: str, max_frames: int, conf_thresh: float, model_name: str):
    """
    Background worker that runs the full MatchAnalyticsPipeline frame-by-frame.
    """
    job = jobs_db[job_id]
    job["status"] = "processing"
    job["started_at"] = time.time()
    
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")
            
        total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = float(cap.get(cv2.CAP_PROP_FPS))
        if fps <= 0 or np.isnan(fps):
            fps = 30.0
            
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        frames_to_process = min(max_frames, total_video_frames) if total_video_frames > 0 else max_frames
        job["total_frames"] = frames_to_process
        job["fps"] = round(fps, 1)
        job["resolution"] = f"{width}x{height}"
        
        # Initialize the pipeline
        device = get_compute_device()
        pipeline = MatchAnalyticsPipeline(
            model_name=model_name,
            device=device,
            conf_thresh=conf_thresh
        )
        pipeline.initialize_metrics(fps=fps)
        
        telemetry_frames = []
        last_annotated_frame = None
        start_proc_time = time.time()
        
        frame_idx = 0
        while cap.isOpened() and frame_idx < frames_to_process:
            ret, frame = cap.read()
            if not ret or frame is None:
                break
                
            # Process frame through full CV / ML pipeline
            frame_res = pipeline.process_frame(frame, frame_idx=frame_idx, total_frames=frames_to_process)
            last_annotated_frame = frame_res["annotated_frame"]
            
            # Extract structured telemetry for this frame
            timestamp_sec = round(frame_idx / fps, 3)
            
            # Extract player tracking records
            current_players = []
            if pipeline.tracker and hasattr(pipeline.tracker, 'process_frame'):
                # Collect from radar players for metric pitch data
                if hasattr(pipeline, 'homography') and pipeline.metrics:
                    # Collect players from last tracker output
                    for pid, speed in pipeline.metrics.current_speeds.items():
                        if pid == -1:
                            continue
                        # Get latest position
                        hist = pipeline.metrics.position_history.get(pid)
                        if hist and len(hist) > 0:
                            _, px, py = hist[-1]
                            current_players.append({
                                "id": pid,
                                "team": "alpha" if (pid % 2 == 0) else "beta",
                                "pitch_x": round(float(px), 2),
                                "pitch_y": round(float(py), 2),
                                "speed_kmh": round(float(speed), 1)
                            })
            
            telemetry_frames.append({
                "time": timestamp_sec,
                "frame": frame_idx,
                "players": current_players,
                "possession": frame_res.get("possession", {0: 50.0, 1: 50.0}),
                "num_players": frame_res.get("num_players", len(current_players)),
                "ball_detected": frame_res.get("ball_detected", False)
            })
            
            frame_idx += 1
            
            # Update progress
            elapsed = time.time() - start_proc_time
            proc_fps = round(frame_idx / max(elapsed, 0.001), 1)
            job["current_frame"] = frame_idx
            job["progress"] = round((frame_idx / frames_to_process) * 100, 1)
            job["processing_fps"] = proc_fps
            
        cap.release()
        
        # Save preview image if available
        preview_rel_path = None
        if last_annotated_frame is not None:
            preview_filename = f"preview_{job_id}.jpg"
            preview_path = os.path.join(OUTPUTS_DIR, preview_filename)
            cv2.imwrite(preview_path, last_annotated_frame)
            preview_rel_path = f"/outputs/{preview_filename}"
            
        # Get final summary statistics
        summary = pipeline.get_summary_statistics()
        
        job["status"] = "completed"
        job["completed_at"] = time.time()
        job["progress"] = 100.0
        job["result"] = {
            "total_frames_processed": frame_idx,
            "duration_sec": round(frame_idx / fps, 2),
            "fps": fps,
            "resolution": f"{width}x{height}",
            "preview_url": preview_rel_path,
            "possession": summary.get("possession", {0: 50.0, 1: 50.0}),
            "top_speeds": summary.get("top_speeds", []),
            "distances": summary.get("distances", [])
        }
        job["telemetry"] = telemetry_frames
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        job["status"] = "failed"
        job["error"] = str(e)
    finally:
        # Cleanup uploaded video if it was stored in temporary location
        if "is_temp" in job and job["is_temp"] and os.path.exists(video_path):
            try:
                os.remove(video_path)
            except Exception:
                pass

@app.post("/api/analyze")
async def analyze_match_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    max_frames: int = Form(150),
    conf_thresh: float = Form(0.25),
    model_name: str = Form("yolov8n.pt")
):
    """
    Upload an MP4 match video and queue it for Deep Learning analysis.
    """
    job_id = f"job_{uuid.uuid4().hex[:10]}"
    file_ext = os.path.splitext(file.filename)[1].lower() or ".mp4"
    saved_filename = f"{job_id}{file_ext}"
    saved_path = os.path.join(UPLOADS_DIR, saved_filename)
    
    # Save the uploaded file
    with open(saved_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    jobs_db[job_id] = {
        "job_id": job_id,
        "filename": file.filename,
        "status": "queued",
        "progress": 0.0,
        "current_frame": 0,
        "total_frames": max_frames,
        "created_at": time.time(),
        "is_temp": False,
        "error": None
    }
    
    # Start background execution
    background_tasks.add_task(
        process_video_task,
        job_id=job_id,
        video_path=saved_path,
        max_frames=max_frames,
        conf_thresh=conf_thresh,
        model_name=model_name
    )
    
    return {
        "job_id": job_id,
        "status": "queued",
        "filename": file.filename,
        "message": "Video accepted. Processing initialized via YOLOv8 pipeline."
    }

@app.post("/api/analyze-demo")
async def analyze_demo_match(
    background_tasks: BackgroundTasks,
    max_frames: int = Form(120),
    conf_thresh: float = Form(0.25),
    model_name: str = Form("yolov8n.pt")
):
    """
    Triggers analysis on the bundled demo match (sample_match.mp4).
    """
    sample_path = os.path.join(os.path.dirname(__file__), "sample_match.mp4")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="sample_match.mp4 not found on server.")
        
    job_id = f"demo_{uuid.uuid4().hex[:8]}"
    
    jobs_db[job_id] = {
        "job_id": job_id,
        "filename": "sample_match.mp4",
        "status": "queued",
        "progress": 0.0,
        "current_frame": 0,
        "total_frames": max_frames,
        "created_at": time.time(),
        "is_temp": False,
        "error": None
    }
    
    background_tasks.add_task(
        process_video_task,
        job_id=job_id,
        video_path=sample_path,
        max_frames=max_frames,
        conf_thresh=conf_thresh,
        model_name=model_name
    )
    
    return {
        "job_id": job_id,
        "status": "queued",
        "filename": "sample_match.mp4",
        "message": "Demo match queued for live YOLOv8 analysis."
    }

@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str):
    """
    Polls the progress and results of a video analysis job.
    """
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found.")
        
    job = jobs_db[job_id]
    response = {
        "job_id": job["job_id"],
        "filename": job.get("filename", ""),
        "status": job["status"],
        "progress": job.get("progress", 0.0),
        "current_frame": job.get("current_frame", 0),
        "total_frames": job.get("total_frames", 0),
        "processing_fps": job.get("processing_fps", 0.0),
        "error": job.get("error", None)
    }
    
    if job["status"] == "completed":
        response["result"] = job.get("result", {})
        
    return response

@app.get("/api/jobs/{job_id}/telemetry")
def get_job_telemetry(job_id: str):
    """
    Returns the full JSON telemetry dataset generated for the job.
    """
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found.")
        
    job = jobs_db[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job {job_id} is still {job['status']}.")
        
    return job.get("telemetry", [])

@app.get("/api/jobs/{job_id}/csv")
def download_job_csv(job_id: str):
    """
    Exports and streams the player tracking telemetry as a downloadable CSV.
    """
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found.")
        
    job = jobs_db[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job {job_id} is not completed yet.")
        
    telemetry = job.get("telemetry", [])
    rows = []
    for frame_data in telemetry:
        t = frame_data.get("time", 0.0)
        f_idx = frame_data.get("frame", 0)
        players = frame_data.get("players", [])
        for p in players:
            rows.append({
                "time_sec": t,
                "frame_idx": f_idx,
                "player_id": p.get("id"),
                "team": p.get("team"),
                "pitch_x_m": p.get("pitch_x"),
                "pitch_y_m": p.get("pitch_y"),
                "speed_kmh": p.get("speed_kmh")
            })
            
    df = pd.DataFrame(rows)
    csv_string = df.to_csv(index=False)
    
    return Response(
        content=csv_string,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=pitchvision_{job_id}.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
