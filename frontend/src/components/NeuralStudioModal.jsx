import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Play, CheckCircle2, AlertCircle, Cpu, 
  Download, FileSpreadsheet, Activity, ChevronRight, RefreshCw, Zap
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

export default function NeuralStudioModal({ isOpen, onClose }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [maxFrames, setMaxFrames] = useState(100);
  
  // Job State
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null); // 'queued', 'processing', 'completed', 'failed'
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [processingFps, setProcessingFps] = useState(0);
  const [jobResult, setJobResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const pollIntervalRef = useRef(null);

  // Check backend health on mount / open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setBackendStatus({
              online: true,
              checking: false,
              device: data.device,
              gpu: data.gpu_name,
              yolo: data.yolo_weights_loaded
            });
          }
        } else {
          if (isMounted) setBackendStatus({ online: false, checking: false });
        }
      } catch (err) {
        if (isMounted) setBackendStatus({ online: false, checking: false });
      }
    };

    checkHealth();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Clean up poll timer on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Poll job status
  const startPolling = (jobId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Job polling error");
        const data = await res.json();

        setJobStatus(data.status);
        setProgress(data.progress || 0);
        setCurrentFrame(data.current_frame || 0);
        setTotalFrames(data.total_frames || 0);
        setProcessingFps(data.processing_fps || 0);

        if (data.status === 'completed') {
          clearInterval(pollIntervalRef.current);
          setJobResult(data.result);
        } else if (data.status === 'failed') {
          clearInterval(pollIntervalRef.current);
          setErrorMsg(data.error || "Processing failed on server.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);
  };

  // Launch Demo Match Analysis
  const handleRunDemo = async () => {
    setErrorMsg(null);
    setJobResult(null);
    setJobStatus('queued');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('max_frames', maxFrames.toString());

      const res = await fetch(`${API_BASE}/api/analyze-demo`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to start demo analysis");
      }

      const data = await res.json();
      setCurrentJobId(data.job_id);
      startPolling(data.job_id);
    } catch (err) {
      setJobStatus('failed');
      setErrorMsg(err.message);
    }
  };

  // Launch Custom Upload Analysis
  const handleRunUpload = async () => {
    if (!selectedFile) return;

    setErrorMsg(null);
    setJobResult(null);
    setJobStatus('queued');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('max_frames', maxFrames.toString());

      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to upload and start analysis");
      }

      const data = await res.json();
      setCurrentJobId(data.job_id);
      startPolling(data.job_id);
    } catch (err) {
      setJobStatus('failed');
      setErrorMsg(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(20, 3, 3, 0.78)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#380504',
        backgroundImage: 'linear-gradient(165deg, #4A0806 0%, #290302 100%)',
        border: '1.5px solid rgba(232, 210, 181, 0.3)',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(89, 9, 7, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(232, 210, 181, 0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#300403'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              backgroundColor: 'rgba(232, 210, 181, 0.15)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={18} color="var(--cream-beige)" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif',
                color: '#FFF6EB',
                letterSpacing: '-0.02em'
              }}>
                Neural Match Vision Workbench
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.74rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                Direct Python FastAPI Execution: YOLOv8 Object Detection, ByteTrack, &amp; 2D Pitch Homography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cream-beige)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Backend Status Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(232, 210, 181, 0.15)',
            borderRadius: '6px',
            padding: '10px 16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: backendStatus.online ? '#4ADE80' : '#F87171',
                boxShadow: backendStatus.online ? '0 0 8px #4ADE80' : '0 0 8px #F87171'
              }} />
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                fontFamily: 'Space Grotesk, monospace',
                color: '#FFF6EB'
              }}>
                {backendStatus.online 
                  ? `FASTAPI ENGINE ONLINE (PORT 8001)` 
                  : backendStatus.checking 
                  ? 'CONNECTING TO PYTHON BACKEND...' 
                  : 'BACKEND OFFLINE (Run: python -m uvicorn server:app --port 8001)'}
              </span>
            </div>

            {backendStatus.online && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.70rem', color: 'var(--cream-beige)' }}>
                <span>Compute: <strong>{backendStatus.gpu || backendStatus.device}</strong></span>
                <span>•</span>
                <span>Weights: <strong>YOLOv8 Active</strong></span>
              </div>
            )}
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(232, 210, 181, 0.15)', paddingBottom: '12px' }}>
            <button
              onClick={() => setActiveTab('demo')}
              style={{
                background: activeTab === 'demo' ? 'var(--cream-beige)' : 'rgba(232, 210, 181, 0.1)',
                color: activeTab === 'demo' ? 'var(--burgundy-deep)' : 'var(--cream-beige)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontWeight: 800,
                fontSize: '0.80rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              1. Demo Match Footage (sample_match.mp4)
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              style={{
                background: activeTab === 'upload' ? 'var(--cream-beige)' : 'rgba(232, 210, 181, 0.1)',
                color: activeTab === 'upload' ? 'var(--burgundy-deep)' : 'var(--cream-beige)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontWeight: 800,
                fontSize: '0.80rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              2. Custom Match Upload (.mp4 / .mov)
            </button>
          </div>

          {/* Main Controls Area */}
          {!jobStatus || jobStatus === 'failed' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {activeTab === 'demo' ? (
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(232, 210, 181, 0.2)',
                  borderRadius: '6px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '0.86rem', color: '#FFF6EB', fontWeight: 700 }}>
                    Pre-loaded 1080p Tactical Match (sample_match.mp4)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.80rem', color: 'var(--cream-beige)', opacity: 0.85, lineHeight: 1.5 }}>
                    Executes real YOLOv8 object detection, ByteTrack Kalman filtering, and planar homography directly on the bundled 11v11 match footage on your machine.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--cream-beige)' }}>
                      Frames to process:
                      <select
                        value={maxFrames}
                        onChange={(e) => setMaxFrames(Number(e.target.value))}
                        style={{
                          marginLeft: '8px',
                          background: '#300403',
                          border: '1px solid rgba(232, 210, 181, 0.3)',
                          color: '#FFF6EB',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.78rem'
                        }}
                      >
                        <option value={30}>30 Frames (~1 sec / Fast)</option>
                        <option value={60}>60 Frames (~2 sec / Balanced)</option>
                        <option value={120}>120 Frames (~4 sec / Standard)</option>
                        <option value={180}>180 Frames (Full Sequence)</option>
                      </select>
                    </label>

                    <button
                      onClick={handleRunDemo}
                      disabled={!backendStatus.online}
                      style={{
                        backgroundColor: backendStatus.online ? 'var(--cream-beige)' : 'rgba(232, 210, 181, 0.3)',
                        color: 'var(--burgundy-deep)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 22px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: backendStatus.online ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <Play size={14} fill="var(--burgundy-deep)" />
                      <span>Execute Deep Learning Pipeline</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px dashed rgba(232, 210, 181, 0.35)',
                  borderRadius: '6px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Upload size={32} color="var(--cream-beige)" />
                  <div style={{ fontSize: '0.88rem', color: '#FFF6EB', fontWeight: 700 }}>
                    {selectedFile ? selectedFile.name : 'Upload Your Match Video'}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--cream-beige)', opacity: 0.8 }}>
                    Accepts .mp4, .mov, or .webm match footage. Runs frame-by-frame YOLOv8 detection &amp; homography calibration.
                  </p>

                  <input
                    type="file"
                    id="modal-video-input"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />

                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <label
                      htmlFor="modal-video-input"
                      style={{
                        backgroundColor: 'rgba(232, 210, 181, 0.15)',
                        border: '1px solid rgba(232, 210, 181, 0.4)',
                        color: '#FFF6EB',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {selectedFile ? 'Change File' : 'Browse Files'}
                    </label>

                    {selectedFile && (
                      <button
                        onClick={handleRunUpload}
                        disabled={!backendStatus.online}
                        style={{
                          backgroundColor: 'var(--cream-beige)',
                          color: 'var(--burgundy-deep)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 20px',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Play size={12} fill="var(--burgundy-deep)" />
                        <span>Upload &amp; Analyze</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#FECACA',
                  fontSize: '0.80rem'
                }}>
                  <AlertCircle size={16} color="#F87171" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          ) : jobStatus === 'processing' || jobStatus === 'queued' ? (
            /* Live Progress View */
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(232, 210, 181, 0.2)',
              borderRadius: '6px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={16} className="tactical-scanner-beam" color="var(--cream-beige)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF6EB' }}>
                    Running Deep Learning Inference...
                  </span>
                </div>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.84rem',
                  color: 'var(--cream-beige)',
                  fontWeight: 700
                }}>
                  {progress.toFixed(1)}% ({currentFrame}/{totalFrames} Frames)
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                overflow: 'hidden',
                border: '1px solid rgba(232, 210, 181, 0.2)'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#4ADE80',
                  backgroundImage: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                <span>Processing Pipeline: YOLOv8 + ByteTrack + Homography</span>
                <span>Throughput: {processingFps} FPS</span>
              </div>
            </div>
          ) : jobStatus === 'completed' && jobResult ? (
            /* Completed Results View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '6px',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#4ADE80" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF6EB' }}>
                    Neural Inference Complete // {jobResult.total_frames_processed} Frames Analyzed
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`${API_BASE}/api/jobs/${currentJobId}/telemetry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`pitchvision_telemetry_${currentJobId}.json`}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.15)',
                      border: '1px solid rgba(232, 210, 181, 0.4)',
                      color: '#FFF6EB',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Download size={12} />
                    <span>Download JSON</span>
                  </a>

                  <a
                    href={`${API_BASE}/api/jobs/${currentJobId}/csv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`pitchvision_metrics_${currentJobId}.csv`}
                    style={{
                      backgroundColor: 'var(--cream-beige)',
                      color: 'var(--burgundy-deep)',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FileSpreadsheet size={12} />
                    <span>Download CSV</span>
                  </a>
                </div>
              </div>

              {/* Visual Preview Image */}
              {jobResult.preview_url && (
                <div style={{
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(232, 210, 181, 0.25)',
                  backgroundColor: '#162019'
                }}>
                  <div style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    color: 'var(--cream-beige)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>NEURAL HUD PREVIEW // YOLOv8 BOUNDING BOXES &amp; 2D HOMOGRAPHY RADAR</span>
                    <span>1280x720</span>
                  </div>
                  <img
                    src={`${API_BASE}${jobResult.preview_url}`}
                    alt="Processed Frame Preview"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => {
                    setJobStatus(null);
                    setJobResult(null);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(232, 210, 181, 0.3)',
                    color: 'var(--cream-beige)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Run Another Analysis
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}
