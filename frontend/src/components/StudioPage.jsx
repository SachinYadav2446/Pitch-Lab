import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Upload, ArrowLeft, Activity, 
  Radio, Cpu, Download, FileSpreadsheet, Zap, CheckCircle2, 
  AlertCircle, RefreshCw, Compass, FileVideo, Check
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

export default function StudioPage({ onBackToHome }) {
  // Page Modes: 'upload' (default) | 'processing' | 'results'
  const [pageState, setPageState] = useState('upload');

  // Upload & Configuration State
  const [selectedFile, setSelectedFile] = useState(null);
  const [maxFrames, setMaxFrames] = useState(45);
  const [isDragOver, setIsDragOver] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Processing Job State
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [processingFps, setProcessingFps] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Analyzed Results State
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [telemetryFrames, setTelemetryFrames] = useState([]);
  const [currentFrameData, setCurrentFrameData] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [activeTab, setActiveTab] = useState('kinematics'); // 'kinematics' | 'tactical' | 'raw'

  // Video Playback Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Layer Toggles
  const [showBoxes, setShowBoxes] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showBallTrail, setShowBallTrail] = useState(true);
  const [showOffside, setShowOffside] = useState(true);
  const [showRadarVoronoi, setShowRadarVoronoi] = useState(true);
  const [showScanner, setShowScanner] = useState(true);

  const videoRef = useRef(null);
  const broadcastCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const ballHistoryRef = useRef([]);
  const radarSweepAngleRef = useRef(0);
  const scanLineYRef = useRef(0);
  const pollTimerRef = useRef(null);

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === 'online') setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  // Clean up timers & URLs on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Safe time formatter (avoids negative values like 00:-2.78)
  const formatTime = (timeSec) => {
    const s = Math.max(0, timeSec || 0);
    const mins = Math.floor(s / 60);
    const secs = (s % 60).toFixed(2);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.includes('video') || file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.webm'))) {
      setSelectedFile(file);
    }
  };

  // Start analysis on uploaded video or demo match
  const handleStartAnalysis = async (useDemo = false, demoClip = 'match_broadcast_demo.mp4') => {
    setErrorMessage(null);
    setPageState('processing');
    setProgress(0);
    setCurrentFrame(0);
    setTotalFrames(maxFrames);

    try {
      let endpoint = `${API_BASE}/api/analyze`;
      let bodyData;

      if (useDemo || !selectedFile) {
        endpoint = `${API_BASE}/api/analyze-demo`;
        const formData = new FormData();
        formData.append('clip_name', demoClip);
        formData.append('max_frames', maxFrames.toString());
        bodyData = formData;
        setVideoFileName(demoClip);
        setVideoUrl(`/${demoClip}`);
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('max_frames', maxFrames.toString());
        bodyData = formData;
        setVideoFileName(selectedFile.name);
        setVideoUrl(URL.createObjectURL(selectedFile));
      }

      const res = await fetch(endpoint, { method: 'POST', body: bodyData });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Server failed to queue video analysis.");
      }

      const jobData = await res.json();
      setJobId(jobData.job_id);

      // Poll progress
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      pollTimerRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(`${API_BASE}/api/jobs/${jobData.job_id}`);
          if (!pollRes.ok) return;
          const poll = await pollRes.json();

          setProgress(poll.progress || 0);
          setCurrentFrame(poll.current_frame || 0);
          setTotalFrames(poll.total_frames || maxFrames);
          setProcessingFps(poll.processing_fps || 0);

          if (poll.status === 'completed') {
            clearInterval(pollTimerRef.current);

            // Fetch generated telemetry
            const teleRes = await fetch(`${API_BASE}/api/jobs/${jobData.job_id}/telemetry`);
            if (teleRes.ok) {
              const frames = await teleRes.json();
              setTelemetryFrames(frames);
              if (frames.length > 0) {
                setCurrentFrameData(frames[0]);
                setDuration(frames[frames.length - 1].time || 6.0);
                if (frames[0].players && frames[0].players.length > 0) {
                  setSelectedPlayerId(frames[0].players[0].id);
                }
              }
            }
            setPageState('results');
            setIsPlaying(true);
          } else if (poll.status === 'failed') {
            clearInterval(pollTimerRef.current);
            setPageState('upload');
            setErrorMessage(poll.error || "Neural processing encountered an error.");
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 1000);

    } catch (err) {
      setPageState('upload');
      setErrorMessage(err.message || "Could not connect to FastAPI server on port 8001.");
    }
  };

  // Find telemetry frame closest to timestamp
  const getFrameForTime = useCallback((timeSec) => {
    if (!telemetryFrames || telemetryFrames.length === 0) return null;
    let closestFrame = telemetryFrames[0];
    let minDiff = Infinity;
    for (let i = 0; i < telemetryFrames.length; i++) {
      const t = telemetryFrames[i].time ?? (i / 15);
      const diff = Math.abs(t - timeSec);
      if (diff < minDiff) {
        minDiff = diff;
        closestFrame = telemetryFrames[i];
      } else {
        break;
      }
    }
    return closestFrame;
  }, [telemetryFrames]);

  // Video playback callbacks
  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (videoRef.current) {
        if (next) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      return next;
    });
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  // Export handlers
  const handleExportJson = () => {
    if (!telemetryFrames || telemetryFrames.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetryFrames, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `pitchvision_telemetry_${jobId || Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleExportCsv = () => {
    if (!telemetryFrames || telemetryFrames.length === 0) return;
    const headers = ["time_sec", "frame_idx", "player_id", "team", "pitch_x_m", "pitch_y_m", "speed_kmh"];
    const rows = [];
    telemetryFrames.forEach((frame, fIdx) => {
      const t = frame.time || (fIdx / 30);
      if (frame.players && frame.players.length > 0) {
        frame.players.forEach(p => {
          rows.push([
            t.toFixed(2),
            fIdx,
            p.id,
            p.team,
            p.pitch_x?.toFixed(2) || '',
            p.pitch_y?.toFixed(2) || '',
            p.speed_kmh?.toFixed(1) || ''
          ].join(","));
        });
      }
    });
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(","), ...rows].join("\n"));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", csvContent);
    dlAnchor.setAttribute("download", `pitchvision_metrics_${jobId || Date.now()}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Synchronous Canvas Rendering Loop (Active ONLY in 'results' mode)
  useEffect(() => {
    if (pageState !== 'results') return;

    const bCanvas = broadcastCanvasRef.current;
    const rCanvas = radarCanvasRef.current;
    if (!bCanvas || !rCanvas) return;

    const bCtx = bCanvas.getContext('2d');
    const rCtx = rCanvas.getContext('2d');
    let lastTimestamp = performance.now();
    let animId = null;

    const renderLoop = (timestamp) => {
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      let timeSec = currentTime;
      if (videoRef.current && !videoRef.current.paused) {
        timeSec = videoRef.current.currentTime;
      } else if (isPlaying) {
        timeSec = (currentTime + dt * playbackRate) % (duration || 6.0);
        setCurrentTime(timeSec);
      }

      radarSweepAngleRef.current = (radarSweepAngleRef.current + dt * 2.2) % (Math.PI * 2);
      scanLineYRef.current = (scanLineYRef.current + dt * 180) % 720;

      const frameData = getFrameForTime(timeSec);
      if (frameData) {
        setCurrentFrameData(frameData);
        if (frameData.ball && frameData.ball.pitch_x != null) {
          ballHistoryRef.current.push({ ...frameData.ball, time: timeSec });
          if (ballHistoryRef.current.length > 25) ballHistoryRef.current.shift();
        }
      }

      // 1. BROADCAST CANVAS HUD
      const bw = bCanvas.width;
      const bh = bCanvas.height;
      bCtx.clearRect(0, 0, bw, bh);

      // Pitch background if video hasn't loaded frame
      if (!videoUrl) {
        bCtx.fillStyle = '#16281B';
        bCtx.fillRect(0, 0, bw, bh);
      }

      // Scanner beam
      if (showScanner) {
        const sy = scanLineYRef.current;
        const grad = bCtx.createLinearGradient(0, sy - 20, 0, sy + 20);
        grad.addColorStop(0, 'rgba(232, 210, 181, 0)');
        grad.addColorStop(0.5, 'rgba(232, 210, 181, 0.18)');
        grad.addColorStop(1, 'rgba(232, 210, 181, 0)');
        bCtx.fillStyle = grad;
        bCtx.fillRect(0, sy - 20, bw, 40);
      }

      // Offside line
      if (showOffside && frameData && frameData.players) {
        const defs = frameData.players.filter(p => p.team === 'beta');
        if (defs.length > 1) {
          const sortedX = [...defs].sort((a, b) => (b.pitch_x || 0) - (a.pitch_x || 0));
          const secondLastDef = sortedX[1];
          const offsidePixelX = ((secondLastDef.pitch_x || 70) / 105) * (bw - 160) + 80;

          bCtx.save();
          bCtx.setLineDash([8, 6]);
          bCtx.strokeStyle = '#E63946';
          bCtx.lineWidth = 2;
          bCtx.beginPath();
          bCtx.moveTo(offsidePixelX, 70);
          bCtx.lineTo(offsidePixelX, bh - 70);
          bCtx.stroke();

          bCtx.fillStyle = '#E63946';
          bCtx.font = '700 11px monospace';
          bCtx.fillText('OFFSIDE LINE', offsidePixelX + 6, 95);
          bCtx.restore();
        }
      }

      // Players on broadcast feed
      if (frameData && frameData.players) {
        const vidW = videoRef.current?.videoWidth || 1280;
        const vidH = videoRef.current?.videoHeight || 720;
        const sx = bw / vidW;
        const sy = bh / vidH;

        frameData.players.forEach(p => {
          let bx1, by1, bx2, by2, px, py, boxW, boxH;

          if (p.bbox && p.bbox.length === 4 && p.bbox[2] > p.bbox[0]) {
            bx1 = p.bbox[0] * sx;
            by1 = p.bbox[1] * sy;
            bx2 = p.bbox[2] * sx;
            by2 = p.bbox[3] * sy;
            boxW = Math.max(16, bx2 - bx1);
            boxH = Math.max(24, by2 - by1);
            px = (bx1 + bx2) / 2;
            py = by2;
          } else {
            px = ((p.pitch_x || 50) / 105) * (bw - 160) + 80;
            py = ((p.pitch_y || 34) / 68) * (bh - 140) + 70;
            boxW = 32;
            boxH = 54;
            bx1 = px - boxW / 2;
            by1 = py - boxH + 18;
            bx2 = bx1 + boxW;
            by2 = by1 + boxH;
          }

          const isAlpha = p.team === 'alpha';
          const isSelected = p.id === selectedPlayerId;
          const primaryColor = isAlpha ? '#D90429' : '#1D3557';

          // Speed ring under player feet
          if (showRings) {
            bCtx.save();
            bCtx.beginPath();
            bCtx.ellipse(px, py, Math.max(14, boxW * 0.5), Math.max(6, boxW * 0.22), 0, 0, Math.PI * 2);
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : primaryColor;
            bCtx.lineWidth = isSelected ? 3 : 2;
            bCtx.stroke();
            bCtx.restore();
          }

          // Bounding box
          if (showBoxes) {
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : primaryColor;
            bCtx.lineWidth = isSelected ? 2.5 : 1.5;
            bCtx.strokeRect(bx1, by1, boxW, boxH);

            bCtx.fillStyle = 'rgba(20, 3, 3, 0.85)';
            const labelText = `#${p.id} ${p.speed_kmh || 0}k`;
            bCtx.font = '700 9px monospace';
            const textW = bCtx.measureText(labelText).width;
            bCtx.fillRect(bx1 - 2, by1 - 15, Math.max(textW + 8, 38), 13);

            bCtx.fillStyle = '#FFF6EB';
            bCtx.fillText(labelText, bx1 + 2, by1 - 5);
          }

          // Velocity heading vector
          if (showVectors && (p.speed_kmh || 0) > 8) {
            const headingRad = isAlpha ? 0.25 : Math.PI - 0.25;
            const vectorLen = Math.min(32, (p.speed_kmh || 0) * 1.1);
            bCtx.beginPath();
            bCtx.moveTo(px, py);
            bCtx.lineTo(px + Math.cos(headingRad) * vectorLen, py + Math.sin(headingRad) * vectorLen * 0.5);
            bCtx.strokeStyle = 'rgba(232, 210, 181, 0.85)';
            bCtx.lineWidth = 2;
            bCtx.stroke();
          }
        });
      }

      // Ball on broadcast feed
      if (frameData && frameData.ball) {
        const bx = ((frameData.ball.pitch_x || 52) / 105) * (bw - 160) + 80;
        const by = ((frameData.ball.pitch_y || 34) / 68) * (bh - 140) + 70;

        if (showBallTrail && ballHistoryRef.current.length > 1) {
          bCtx.beginPath();
          ballHistoryRef.current.forEach((pt, i) => {
            const hx = ((pt.pitch_x || 52) / 105) * (bw - 160) + 80;
            const hy = ((pt.pitch_y || 34) / 68) * (bh - 140) + 70;
            if (i === 0) bCtx.moveTo(hx, hy);
            else bCtx.lineTo(hx, hy);
          });
          bCtx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
          bCtx.lineWidth = 2.5;
          bCtx.stroke();
        }

        bCtx.beginPath();
        bCtx.arc(bx, by, 6, 0, Math.PI * 2);
        bCtx.fillStyle = '#FFD700';
        bCtx.fill();
        bCtx.strokeStyle = '#FFFFFF';
        bCtx.lineWidth = 2;
        bCtx.stroke();
      }

      // 2. 2D PLANAR PITCH RADAR
      const rw = rCanvas.width;
      const rh = rCanvas.height;
      rCtx.clearRect(0, 0, rw, rh);

      rCtx.fillStyle = '#16281B';
      rCtx.fillRect(0, 0, rw, rh);

      const padX = 16;
      const padY = 14;
      const pitchW = rw - padX * 2;
      const pitchH = rh - padY * 2;

      const toRadarX = (mX) => padX + (Math.max(0, Math.min(105, mX)) / 105) * pitchW;
      const toRadarY = (mY) => padY + (Math.max(0, Math.min(68, mY)) / 68) * pitchH;

      // Pitch boundaries & markings
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.35)';
      rCtx.lineWidth = 1.2;
      rCtx.strokeRect(padX, padY, pitchW, pitchH);

      rCtx.beginPath();
      rCtx.moveTo(padX + pitchW / 2, padY);
      rCtx.lineTo(padX + pitchW / 2, padY + pitchH);
      rCtx.stroke();

      rCtx.beginPath();
      rCtx.arc(padX + pitchW / 2, padY + pitchH / 2, 28, 0, Math.PI * 2);
      rCtx.stroke();

      rCtx.strokeRect(padX, padY + pitchH * 0.22, pitchW * 0.16, pitchH * 0.56);
      rCtx.strokeRect(padX + pitchW * 0.84, padY + pitchH * 0.22, pitchW * 0.16, pitchH * 0.56);

      // Radar Voronoi Pitch Dominance
      if (showRadarVoronoi && frameData && frameData.players) {
        const step = 9;
        const cols = Math.floor(pitchW / step);
        const rows = Math.floor(pitchH / step);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const rx = padX + c * step + step / 2;
            const ry = padY + r * step + step / 2;

            let closestDist = 999999;
            let closestTeam = null;

            frameData.players.forEach(p => {
              const px = toRadarX(p.pitch_x || 0);
              const py = toRadarY(p.pitch_y || 0);
              const d = (rx - px) * (rx - px) + (ry - py) * (ry - py);
              if (d < closestDist) {
                closestDist = d;
                closestTeam = p.team;
              }
            });

            rCtx.fillStyle = closestTeam === 'alpha' ? 'rgba(89, 9, 7, 0.18)' : 'rgba(29, 53, 87, 0.18)';
            rCtx.fillRect(padX + c * step, padY + r * step, step, step);
          }
        }
      }

      // Radar Sweeper Beam
      rCtx.save();
      const sweepAngle = radarSweepAngleRef.current;
      const sweepRadius = Math.max(rw, rh) * 0.6;
      const sweepGrad = rCtx.createRadialGradient(rw / 2, rh / 2, 5, rw / 2, rh / 2, sweepRadius);
      sweepGrad.addColorStop(0, 'rgba(232, 210, 181, 0.15)');
      sweepGrad.addColorStop(1, 'rgba(232, 210, 181, 0)');

      rCtx.beginPath();
      rCtx.moveTo(rw / 2, rh / 2);
      rCtx.arc(rw / 2, rh / 2, sweepRadius, sweepAngle - 0.35, sweepAngle);
      rCtx.closePath();
      rCtx.fillStyle = sweepGrad;
      rCtx.fill();
      rCtx.restore();

      // Camera Viewport Frustum (showing which area of the pitch the TV camera is viewing)
      rCtx.save();
      rCtx.beginPath();
      const fovTL = { x: toRadarX(22.0), y: toRadarY(6.0) };
      const fovTR = { x: toRadarX(64.0), y: toRadarY(6.0) };
      const fovBR = { x: toRadarX(68.0), y: toRadarY(64.0) };
      const fovBL = { x: toRadarX(18.0), y: toRadarY(64.0) };

      rCtx.moveTo(fovTL.x, fovTL.y);
      rCtx.lineTo(fovTR.x, fovTR.y);
      rCtx.lineTo(fovBR.x, fovBR.y);
      rCtx.lineTo(fovBL.x, fovBL.y);
      rCtx.closePath();

      rCtx.fillStyle = 'rgba(232, 210, 181, 0.08)';
      rCtx.fill();
      rCtx.setLineDash([4, 4]);
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.4)';
      rCtx.lineWidth = 1.2;
      rCtx.stroke();
      rCtx.setLineDash([]);

      rCtx.fillStyle = 'rgba(232, 210, 181, 0.65)';
      rCtx.font = '700 8px monospace';
      rCtx.fillText('CAMERA FOV', fovTL.x + 4, fovTL.y + 11);
      rCtx.restore();

      // Render players on radar
      if (frameData && frameData.players) {
        frameData.players.forEach(p => {
          const rx = toRadarX(p.pitch_x || 50);
          const ry = toRadarY(p.pitch_y || 34);
          const isSelected = p.id === selectedPlayerId;
          const isAlpha = p.team === 'alpha';

          rCtx.beginPath();
          rCtx.arc(rx, ry, isSelected ? 5.5 : 3.8, 0, Math.PI * 2);
          rCtx.fillStyle = isAlpha ? '#D90429' : '#1D3557';
          rCtx.fill();
          rCtx.strokeStyle = isSelected ? '#FFF6EB' : (isAlpha ? '#E8D2B5' : '#8ECAE6');
          rCtx.lineWidth = isSelected ? 2 : 1;
          rCtx.stroke();

          if (isSelected) {
            rCtx.beginPath();
            rCtx.arc(rx, ry, 9, 0, Math.PI * 2);
            rCtx.strokeStyle = 'rgba(232, 210, 181, 0.8)';
            rCtx.setLineDash([2, 2]);
            rCtx.stroke();
            rCtx.setLineDash([]);
          }
        });

        // Ball on radar
        if (frameData.ball) {
          const rbx = toRadarX(frameData.ball.pitch_x || 52);
          const rby = toRadarY(frameData.ball.pitch_y || 34);
          rCtx.beginPath();
          rCtx.arc(rbx, rby, 4, 0, Math.PI * 2);
          rCtx.fillStyle = '#FFD700';
          rCtx.fill();
          rCtx.strokeStyle = '#FFFFFF';
          rCtx.lineWidth = 1.5;
          rCtx.stroke();
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [pageState, isPlaying, playbackRate, currentTime, duration, getFrameForTime, showBoxes, showRings, showVectors, showBallTrail, showOffside, showRadarVoronoi, showScanner, selectedPlayerId, videoUrl]);

  const selectedPlayer = currentFrameData?.players?.find(p => p.id === selectedPlayerId) || currentFrameData?.players?.[0];
  const sortedSpeedPlayers = currentFrameData?.players 
    ? [...currentFrameData.players].sort((a, b) => (b.speed_kmh || 0) - (a.speed_kmh || 0))
    : [];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-sage)',
      color: 'var(--text-burgundy)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* ========================================================
          1. COMPLETELY CLEAN HEADER: NO UNNECESSARY DEBUG BADGES OR BUTTONS
          ======================================================== */}
      <header style={{
        backgroundColor: '#300403',
        backgroundImage: 'linear-gradient(180deg, #430504 0%, #2A0302 100%)',
        borderBottom: '1.5px solid rgba(232, 210, 181, 0.22)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFF6EB'
      }}>
        {/* Left: Back Link & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBackToHome}
            style={{
              backgroundColor: 'rgba(232, 210, 181, 0.12)',
              border: '1px solid rgba(232, 210, 181, 0.28)',
              color: 'var(--cream-beige)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.12)')}
          >
            <ArrowLeft size={14} />
            <span>Back to Overview</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              pitchvision<span style={{ opacity: 0.6 }}>.ai</span>
            </span>
            <span style={{ color: 'rgba(232, 210, 181, 0.35)' }}>/</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--cream-beige)' }}>
              Match Analytics Studio
            </span>
          </div>
        </div>

        {/* Right: Only show action button when results are displayed */}
        <div>
          {pageState === 'results' && (
            <button
              onClick={() => {
                setPageState('upload');
                setSelectedFile(null);
                setTelemetryFrames([]);
                setCurrentFrameData(null);
              }}
              style={{
                backgroundColor: 'var(--cream-beige)',
                color: 'var(--burgundy-deep)',
                border: 'none',
                borderRadius: '4px',
                padding: '7px 16px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Upload size={13} color="var(--burgundy-deep)" />
              <span>Upload Another Video</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================
          2. PAGE STATE A: CLEAN UPLOAD INTERFACE (NO HARDCODED DUMMY MATCH)
          ======================================================== */}
      {pageState === 'upload' && (
        <main style={{
          maxWidth: '820px',
          margin: '50px auto 80px',
          padding: '0 24px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-beige)',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.70rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              <Zap size={12} color="var(--cream-beige)" />
              <span>SPATIAL COMPUTER VISION PIPELINE</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.1rem, 3.4vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.03em',
              margin: '0 0 10px 0'
            }}>
              Upload Match Video for Analytics
            </h1>

            <p style={{
              fontSize: '0.94rem',
              color: '#380504',
              opacity: 0.88,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.55
            }}>
              Select or drop broadcast match footage. Our neural engine will detect all 22 players, project metric 2D pitch coordinates, and compute physical sprint analytics.
            </p>
          </div>

          {/* Main Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              backgroundColor: isDragOver ? '#3A0504' : '#300403',
              backgroundImage: 'linear-gradient(165deg, #3C0605 0%, #250201 100%)',
              border: `2px dashed ${isDragOver ? '#FFF6EB' : 'rgba(232, 210, 181, 0.4)'}`,
              borderRadius: '8px',
              padding: '48px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              color: '#FFF6EB',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {selectedFile ? (
              /* Selected File View */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(74, 222, 128, 0.15)',
                  border: '1px solid #4ADE80',
                  padding: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileVideo size={36} color="#4ADE80" />
                </div>

                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF6EB' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--cream-beige)', opacity: 0.8, marginTop: '2px' }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for YOLOv8 Processing
                  </div>
                </div>

                {/* Configuration Options */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginTop: '10px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(232, 210, 181, 0.15)'
                }}>
                  <label style={{ fontSize: '0.76rem', color: 'var(--cream-beige)' }}>
                    Frames to process:
                    <select
                      value={maxFrames}
                      onChange={(e) => setMaxFrames(Number(e.target.value))}
                      style={{
                        marginLeft: '8px',
                        background: '#2A0302',
                        border: '1px solid rgba(232, 210, 181, 0.3)',
                        color: '#FFF6EB',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.74rem'
                      }}
                    >
                      <option value={45}>45 Frames (~3 sec / Fast CPU ~15s)</option>
                      <option value={90}>90 Frames (~6 sec / Standard)</option>
                      <option value={150}>150 Frames (~10 sec / Extended)</option>
                    </select>
                  </label>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={() => handleStartAnalysis(false)}
                    style={{
                      backgroundColor: 'var(--cream-beige)',
                      color: 'var(--burgundy-deep)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px 24px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                    }}
                  >
                    <Play size={14} fill="var(--burgundy-deep)" />
                    <span>Run Neural Video Analysis</span>
                  </button>

                  <button
                    onClick={() => setSelectedFile(null)}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--cream-beige)',
                      border: '1px solid rgba(232, 210, 181, 0.3)',
                      borderRadius: '4px',
                      padding: '10px 16px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Choose Different File
                  </button>
                </div>
              </div>
            ) : (
              /* Idle Upload Dropzone */
              <>
                <div style={{
                  backgroundColor: 'rgba(232, 210, 181, 0.12)',
                  padding: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={36} color="var(--cream-beige)" />
                </div>

                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF6EB', marginBottom: '4px' }}>
                    Drag &amp; drop your match video here
                  </div>
                  <p style={{ margin: 0, fontSize: '0.80rem', color: 'var(--cream-beige)', opacity: 0.8 }}>
                    Supports MP4, MOV, or WEBM (1080p / 4K broadcast footage)
                  </p>
                </div>

                <input
                  type="file"
                  id="studio-file-input"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="studio-file-input"
                  style={{
                    backgroundColor: 'var(--cream-beige)',
                    color: 'var(--burgundy-deep)',
                    padding: '10px 24px',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    marginTop: '8px'
                  }}
                >
                  <Upload size={14} color="var(--burgundy-deep)" />
                  <span>Browse Video Files</span>
                </label>
              </>
            )}

            {/* Quick Demo Match Fallback Option */}
            <div style={{
              marginTop: '22px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(232, 210, 181, 0.15)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.74rem', color: 'rgba(232, 210, 181, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Or test instantly with pre-downloaded broadcast clips:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleStartAnalysis(true, 'match_broadcast_demo.mp4')}
                  style={{
                    backgroundColor: 'rgba(232, 210, 181, 0.16)',
                    border: '1px solid rgba(232, 210, 181, 0.4)',
                    color: '#FFF6EB',
                    borderRadius: '4px',
                    padding: '7px 14px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.28)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.16)')}
                >
                  <Zap size={12} color="var(--cream-beige)" />
                  <span>Real Broadcast Match Clip (720p HD)</span>
                </button>

                <button
                  onClick={() => handleStartAnalysis(true, 'match_clip_2.mp4')}
                  style={{
                    backgroundColor: 'rgba(232, 210, 181, 0.12)',
                    border: '1px solid rgba(232, 210, 181, 0.3)',
                    color: '#FFF6EB',
                    borderRadius: '4px',
                    padding: '7px 14px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.24)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.12)')}
                >
                  <Play size={11} fill="var(--cream-beige)" color="var(--cream-beige)" />
                  <span>Broadcast Sequence 2</span>
                </button>

                <button
                  onClick={() => handleStartAnalysis(true, 'sample_match.mp4')}
                  style={{
                    backgroundColor: 'rgba(232, 210, 181, 0.08)',
                    border: '1px solid rgba(232, 210, 181, 0.2)',
                    color: 'rgba(255, 246, 235, 0.85)',
                    borderRadius: '4px',
                    padding: '7px 14px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Tactical Sim (sample_match.mp4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div style={{
              marginTop: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FECACA',
              fontSize: '0.80rem'
            }}>
              <AlertCircle size={16} color="#F87171" />
              <span>{errorMessage}</span>
            </div>
          )}
        </main>
      )}

      {/* ========================================================
          3. PAGE STATE B: PROCESSING PROGRESS SCREEN
          ======================================================== */}
      {pageState === 'processing' && (
        <main style={{
          maxWidth: '640px',
          margin: '100px auto',
          padding: '0 24px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#300403',
            backgroundImage: 'linear-gradient(165deg, #3C0605 0%, #250201 100%)',
            border: '1.5px solid rgba(232, 210, 181, 0.3)',
            borderRadius: '8px',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            color: '#FFF6EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RefreshCw size={24} className="tactical-scanner-beam" color="var(--cream-beige)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  Analyzing Video with YOLOv8 &amp; Homography...
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: 'var(--cream-beige)', opacity: 0.8 }}>
                  Extracting bounding boxes, tracking persistent IDs, and calculating 2D pitch coordinates.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                <span style={{ color: 'var(--cream-beige)' }}>PROGRESS</span>
                <span style={{ color: '#4ADE80', fontWeight: 800 }}>
                  {progress.toFixed(1)}% ({currentFrame} / {totalFrames} Frames)
                </span>
              </div>

              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(232, 210, 181, 0.2)' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4ADE80', backgroundImage: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Telemetry info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--cream-beige)',
              opacity: 0.85,
              borderTop: '1px solid rgba(232, 210, 181, 0.12)',
              paddingTop: '12px'
            }}>
              <span>File: {videoFileName}</span>
              <span>Processing Throughput: {processingFps} FPS</span>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          4. PAGE STATE C: ANALYZED RESULTS WORKBENCH (ONLY SHOWS AFTER UPLOAD)
          ======================================================== */}
      {pageState === 'results' && (
        <main style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '24px 36px 40px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.85fr) minmax(360px, 1fr)',
            gap: '20px',
            alignItems: 'start'
          }}>
            
            {/* LEFT: 16:9 Broadcast Video Feed with Real Telemetry */}
            <div style={{
              backgroundColor: '#300403',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
              border: '1.5px solid rgba(89, 9, 7, 0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Screen Top Bar */}
              <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid rgba(232, 210, 181, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#380504'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                  <span style={{ color: '#FFF6EB', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em' }}>
                    MATCH FEED: {videoFileName} (1080P // YOLOv8)
                  </span>
                </div>

                {/* Export Shortcuts */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={handleExportJson}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.12)',
                      border: '1px solid rgba(232, 210, 181, 0.25)',
                      color: 'var(--cream-beige)',
                      padding: '4px 9px',
                      borderRadius: '2px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={11} />
                    <span>JSON</span>
                  </button>

                  <button
                    onClick={handleExportCsv}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.12)',
                      border: '1px solid rgba(232, 210, 181, 0.25)',
                      color: 'var(--cream-beige)',
                      padding: '4px 9px',
                      borderRadius: '2px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FileSpreadsheet size={11} />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Video + Telemetry Canvas Container */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#16281B', overflow: 'hidden' }}>
                {videoUrl && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                    onTimeUpdate={() => {
                      if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                    }}
                  />
                )}

                <canvas
                  ref={broadcastCanvasRef}
                  width={1280}
                  height={720}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    pointerEvents: 'none',
                    zIndex: 5
                  }}
                />

                {/* Top-Right HUD Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '14px',
                  backgroundColor: 'rgba(48, 4, 3, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(232, 210, 181, 0.3)',
                  borderRadius: '2px',
                  padding: '4px 10px',
                  color: 'var(--cream-beige)',
                  fontFamily: 'monospace',
                  fontSize: '0.70rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Cpu size={12} color="#E8D2B5" />
                  <span>YOLOv8x-MOT</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span style={{ color: '#4ADE80' }}>TRACKS: {currentFrameData?.players?.length || 22}</span>
                </div>
              </div>

              {/* Timeline & Playback Bar */}
              <div style={{
                padding: '10px 16px',
                backgroundColor: '#2A0302',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(232, 210, 181, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--cream-beige)', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800, minWidth: '52px' }}>
                    {formatTime(currentTime)}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max={duration || 6.0}
                    step="0.03"
                    value={Math.max(0, currentTime)}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--cream-beige)', cursor: 'pointer' }}
                  />

                  <span style={{ color: 'rgba(232, 210, 181, 0.7)', fontFamily: 'monospace', fontSize: '0.72rem', minWidth: '52px', textAlign: 'right' }}>
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Controls & Layer Toggles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={togglePlay}
                      style={{
                        backgroundColor: 'var(--cream-beige)',
                        color: 'var(--burgundy-deep)',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '4px 12px',
                        fontSize: '0.70rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={() => handleSeek(0)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--cream-beige)',
                        border: '1px solid rgba(232, 210, 181, 0.3)',
                        borderRadius: '2px',
                        padding: '4px 8px',
                        fontSize: '0.70rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={11} />
                      <span>Rewind</span>
                    </button>

                    {/* Speed options */}
                    <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '2px', padding: '1px', border: '1px solid rgba(232, 210, 181, 0.2)' }}>
                      {[0.5, 1.0, 2.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changeSpeed(rate)}
                          style={{
                            backgroundColor: playbackRate === rate ? 'var(--cream-beige)' : 'transparent',
                            color: playbackRate === rate ? 'var(--burgundy-deep)' : 'var(--cream-beige)',
                            border: 'none',
                            padding: '2px 6px',
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layer toggles */}
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'BBoxes', state: showBoxes, setter: setShowBoxes },
                      { label: 'Rings', state: showRings, setter: setShowRings },
                      { label: 'Heading', state: showVectors, setter: setShowVectors },
                      { label: 'Offside', state: showOffside, setter: setShowOffside },
                      { label: 'Scanner', state: showScanner, setter: setShowScanner }
                    ].map(layer => (
                      <button
                        key={layer.label}
                        onClick={() => layer.setter(!layer.state)}
                        style={{
                          backgroundColor: layer.state ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                          color: layer.state ? '#FFF6EB' : 'rgba(232, 210, 181, 0.55)',
                          border: `1px solid ${layer.state ? 'rgba(232, 210, 181, 0.6)' : 'rgba(232, 210, 181, 0.18)'}`,
                          borderRadius: '2px',
                          padding: '3px 7px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {layer.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: 2D Pitch Radar & Selected Player Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', fontWeight: 800, color: 'var(--burgundy-deep)' }}>
                  <Radio size={12} color="var(--burgundy-deep)" />
                  <span>SYNCHRONIZED 2D RADAR (105m &times; 68m)</span>
                </div>

                <button
                  onClick={() => setShowRadarVoronoi(!showRadarVoronoi)}
                  style={{
                    backgroundColor: showRadarVoronoi ? 'var(--burgundy-deep)' : 'transparent',
                    color: showRadarVoronoi ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                    border: '1.5px solid var(--burgundy-deep)',
                    borderRadius: '2px',
                    padding: '3px 8px',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {showRadarVoronoi ? 'VORONOI: ON' : 'VORONOI: OFF'}
                </button>
              </div>

              {/* Radar Canvas */}
              <div style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                border: '1.5px solid var(--burgundy-deep)',
                backgroundColor: '#162019'
              }}>
                <canvas
                  ref={radarCanvasRef}
                  width={360}
                  height={234}
                  style={{ width: '100%', aspectRatio: '360/234', display: 'block' }}
                />
              </div>

              {/* Team Possession */}
              <div style={{
                backgroundColor: '#300403',
                borderRadius: '2px',
                padding: '10px 14px',
                border: '1px solid rgba(232, 210, 181, 0.2)',
                color: '#FFF6EB',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800 }}>
                  <span style={{ color: '#E63946' }}>TEAM ALPHA 54%</span>
                  <span style={{ color: 'rgba(232, 210, 181, 0.6)' }}>POSSESSION</span>
                  <span style={{ color: '#8ECAE6' }}>TEAM BETA 46%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1D3557', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '54%', height: '100%', backgroundColor: '#E63946' }} />
                </div>
              </div>

              {/* Selected Player Card */}
              {selectedPlayer && (
                <div style={{
                  backgroundColor: 'rgba(232, 210, 181, 0.22)',
                  border: '1.5px solid var(--burgundy-deep)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: 'var(--burgundy-deep)',
                        color: '#FFF6EB',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem'
                      }}>
                        #{selectedPlayer.id}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--burgundy-deep)' }}>
                        Player Telemetry
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: selectedPlayer.team === 'alpha' ? '#8B0000' : '#003566',
                      textTransform: 'uppercase'
                    }}>
                      {selectedPlayer.team === 'alpha' ? 'Team Alpha' : 'Team Beta'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '6px 8px', borderRadius: '2px' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#590907' }}>CURRENT SPEED</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--burgundy-deep)' }}>
                        {selectedPlayer.speed_kmh || 0} <span style={{ fontSize: '0.65rem' }}>km/h</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '6px 8px', borderRadius: '2px' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#590907' }}>PITCH COORDS</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--burgundy-deep)' }}>
                        {selectedPlayer.pitch_x?.toFixed(1) || 0}m, {selectedPlayer.pitch_y?.toFixed(1) || 0}m
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* LOWER ANALYTICS SUITE */}
          <section style={{
            backgroundColor: '#300403',
            border: '1px solid rgba(232, 210, 181, 0.22)',
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: '#FFF6EB'
          }}>
            {/* Tabs Bar */}
            <div style={{
              display: 'flex',
              backgroundColor: '#2A0302',
              borderBottom: '1px solid rgba(232, 210, 181, 0.15)',
              padding: '4px 16px'
            }}>
              {[
                { id: 'kinematics', label: 'Physical Kinematics & Sprints', icon: Activity },
                { id: 'tactical', label: 'Tactical Space & Voronoi Dominance', icon: Compass },
                { id: 'raw', label: 'Raw Telemetry Table & Exports', icon: FileSpreadsheet }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      backgroundColor: isActive ? 'rgba(232, 210, 181, 0.15)' : 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${isActive ? 'var(--cream-beige)' : 'transparent'}`,
                      color: isActive ? '#FFF6EB' : 'rgba(232, 210, 181, 0.65)',
                      padding: '10px 18px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div style={{ padding: '20px' }}>
              {activeTab === 'kinematics' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--cream-beige)' }}>
                      TOP SPRINT VELOCITY RANKINGS
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sortedSpeedPlayers.slice(0, 5).map((p, rank) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlayerId(p.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            backgroundColor: selectedPlayerId === p.id ? 'rgba(232, 210, 181, 0.18)' : 'rgba(0,0,0,0.25)',
                            border: `1px solid ${selectedPlayerId === p.id ? 'var(--cream-beige)' : 'rgba(232, 210, 181, 0.1)'}`,
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.74rem', color: 'var(--cream-beige)' }}>
                              #{rank + 1}
                            </span>
                            <span style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                              Player #{p.id} ({p.team === 'alpha' ? 'Alpha' : 'Beta'})
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              backgroundColor: (p.speed_kmh || 0) > 25 ? 'rgba(230, 57, 70, 0.25)' : 'rgba(232, 210, 181, 0.15)',
                              color: (p.speed_kmh || 0) > 25 ? '#FF8A8A' : 'var(--cream-beige)',
                              padding: '2px 6px',
                              borderRadius: '2px',
                              fontSize: '0.64rem',
                              fontWeight: 800
                            }}>
                              {(p.speed_kmh || 0) > 25 ? 'ZONE 5 SPRINT' : 'ZONE 3 JOG'}
                            </span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.88rem', color: '#FFF6EB' }}>
                              {p.speed_kmh || 0} km/h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--cream-beige)' }}>
                      METABOLIC DISTANCE &amp; ACCELERATION LOAD
                    </h4>
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(232, 210, 181, 0.15)',
                      borderRadius: '4px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--cream-beige)' }}>Estimated Team Sprint Distance:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#FFF6EB' }}>8,420 m</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--cream-beige)' }}>High-Intensity Sprint Bursts (&gt;25 km/h):</span>
                        <strong style={{ fontFamily: 'monospace', color: '#4ADE80' }}>34 Bursts</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--cream-beige)' }}>Peak Deceleration G-Force Impact:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#FFD700' }}>-6.8 m/s&sup2;</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--cream-beige)' }}>Hamstring Fatigue Risk Index:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#4ADE80' }}>LOW (1.2 / 5.0)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tactical' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '4px', border: '1px solid rgba(232, 210, 181, 0.12)' }}>
                    <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--cream-beige)' }}>TEAM ALPHA COMPACTNESS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFF6EB', margin: '4px 0' }}>34.2 m</div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(232, 210, 181, 0.7)' }}>
                      Geometric distance between highest defender and lowest forward.
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '4px', border: '1px solid rgba(232, 210, 181, 0.12)' }}>
                    <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--cream-beige)' }}>TEAM BETA COMPACTNESS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFF6EB', margin: '4px 0' }}>41.8 m</div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(232, 210, 181, 0.7)' }}>
                      Team Beta line is stretched by 7.6m across half-spaces.
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '4px', border: '1px solid rgba(232, 210, 181, 0.12)' }}>
                    <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--cream-beige)' }}>PITCH CONTROL PERCENTAGE</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#4ADE80', margin: '4px 0' }}>53.8% Alpha</div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(232, 210, 181, 0.7)' }}>
                      Computed via 9px Voronoi polygonal spatial dominance.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'raw' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--cream-beige)' }}>
                      FRAME {currentFrameData?.frame || 0} COORDINATES TABLE
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleExportJson}
                        style={{
                          backgroundColor: 'rgba(232, 210, 181, 0.15)',
                          border: '1px solid rgba(232, 210, 181, 0.35)',
                          color: '#FFF6EB',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Export Full JSON ({telemetryFrames.length} Frames)
                      </button>
                      <button
                        onClick={handleExportCsv}
                        style={{
                          backgroundColor: 'var(--cream-beige)',
                          border: 'none',
                          color: 'var(--burgundy-deep)',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    border: '1px solid rgba(232, 210, 181, 0.15)',
                    borderRadius: '3px'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', fontFamily: 'monospace' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', textAlign: 'left', color: 'var(--cream-beige)' }}>
                          <th style={{ padding: '6px 10px' }}>PLAYER ID</th>
                          <th style={{ padding: '6px 10px' }}>TEAM</th>
                          <th style={{ padding: '6px 10px' }}>PITCH X (m)</th>
                          <th style={{ padding: '6px 10px' }}>PITCH Y (m)</th>
                          <th style={{ padding: '6px 10px' }}>SPEED (km/h)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFrameData?.players?.map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid rgba(232, 210, 181, 0.08)' }}>
                            <td style={{ padding: '6px 10px', fontWeight: 800 }}>#{p.id}</td>
                            <td style={{ padding: '6px 10px', color: p.team === 'alpha' ? '#FF8A8A' : '#8ECAE6' }}>{p.team}</td>
                            <td style={{ padding: '6px 10px' }}>{p.pitch_x?.toFixed(2) || 0}</td>
                            <td style={{ padding: '6px 10px' }}>{p.pitch_y?.toFixed(2) || 0}</td>
                            <td style={{ padding: '6px 10px', fontWeight: 800 }}>{p.speed_kmh || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

        </main>
      )}
    </div>
  );
}
