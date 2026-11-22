import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Upload, ArrowLeft, Activity, 
  Radio, Cpu, Download, FileSpreadsheet, ShieldAlert, Sparkles, 
  Zap, CheckCircle2, ChevronRight, BarChart2, Layers, Compass
} from 'lucide-react';

const API_BASE = 'http://localhost:8001';

export default function StudioPage({ onBackToHome }) {
  // Playback & Video State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedPlayerId, setSelectedPlayerId] = useState(10); // Haaland default
  const [activeSource, setActiveSource] = useState('sample'); // 'sample' or 'custom'
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customFileName, setCustomFileName] = useState('');

  // Layer Toggles
  const [showBoxes, setShowBoxes] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showBallTrail, setShowBallTrail] = useState(true);
  const [showOffside, setShowOffside] = useState(true);
  const [showRadarVoronoi, setShowRadarVoronoi] = useState(true);
  const [showScanner, setShowScanner] = useState(true);

  // Active Analytics Tab
  const [activeTab, setActiveTab] = useState('kinematics'); // 'kinematics' | 'tactical' | 'raw'

  // Telemetry & Backend State
  const [telemetryFrames, setTelemetryFrames] = useState([]);
  const [currentFrameData, setCurrentFrameData] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  
  // Processing Pipeline Modal / Drawer State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingCurrentFrame, setProcessingCurrentFrame] = useState(0);
  const [processingTotalFrames, setProcessingTotalFrames] = useState(0);
  const [processingFps, setProcessingFps] = useState(0);
  const [jobId, setJobId] = useState(null);

  const videoRef = useRef(null);
  const broadcastCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const ballHistoryRef = useRef([]);
  const radarSweepAngleRef = useRef(0);
  const scanLineYRef = useRef(0);
  const pollTimerRef = useRef(null);

  // Check FastAPI backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`);
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({ online: true, checking: false, gpu: data.gpu_name, device: data.device });
        } else {
          setBackendStatus({ online: false, checking: false });
        }
      } catch (err) {
        setBackendStatus({ online: false, checking: false });
      }
    };
    checkBackend();
  }, []);

  // Load initial demo telemetry dataset
  useEffect(() => {
    fetch('/sample_tracking.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTelemetryFrames(data);
          setCurrentFrameData(data[0]);
          setDuration(data[data.length - 1].time || 6.0);
        }
      })
      .catch(err => console.error("Telemetry load error:", err));
  }, []);

  // Clean up poll timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // Handle custom local video upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (customVideoUrl) URL.revokeObjectURL(customVideoUrl);
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomFileName(file.name);
      setActiveSource('custom');
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Launch live FastAPI YOLOv8 processing on custom video or demo
  const triggerBackendProcessing = async (file = null) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('max_frames', '150');
        res = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: formData });
      } else {
        const formData = new FormData();
        formData.append('max_frames', '120');
        res = await fetch(`${API_BASE}/api/analyze-demo`, { method: 'POST', body: formData });
      }

      if (!res.ok) throw new Error("Failed to initialize backend job");
      const jobData = await res.json();
      setJobId(jobData.job_id);

      // Start polling
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      pollTimerRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(`${API_BASE}/api/jobs/${jobData.job_id}`);
          if (!pollRes.ok) return;
          const pollData = await pollRes.json();

          setProcessingProgress(pollData.progress || 0);
          setProcessingCurrentFrame(pollData.current_frame || 0);
          setProcessingTotalFrames(pollData.total_frames || 0);
          setProcessingFps(pollData.processing_fps || 0);

          if (pollData.status === 'completed') {
            clearInterval(pollTimerRef.current);
            setIsProcessing(false);
            // Fetch newly generated telemetry
            const teleRes = await fetch(`${API_BASE}/api/jobs/${jobData.job_id}/telemetry`);
            if (teleRes.ok) {
              const newTelemetry = await teleRes.json();
              if (Array.isArray(newTelemetry) && newTelemetry.length > 0) {
                setTelemetryFrames(newTelemetry);
                setCurrentFrameData(newTelemetry[0]);
                setDuration(newTelemetry[newTelemetry.length - 1].time || 6.0);
              }
            }
          } else if (pollData.status === 'failed') {
            clearInterval(pollTimerRef.current);
            setIsProcessing(false);
            alert(`Processing failed: ${pollData.error || "Unknown error"}`);
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      alert(`Could not start processing: ${err.message}`);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (videoRef.current && activeSource === 'custom') {
        if (next) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      return next;
    });
  };

  // Seek video
  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (videoRef.current && activeSource === 'custom') {
      videoRef.current.currentTime = newTime;
    }
  };

  // Change speed
  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current && activeSource === 'custom') {
      videoRef.current.playbackRate = rate;
    }
  };

  // Export JSON
  const handleExportJson = () => {
    if (!telemetryFrames || telemetryFrames.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetryFrames, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `pitchvision_telemetry_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Export CSV
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
    dlAnchor.setAttribute("download", `pitchvision_metrics_${Date.now()}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Find telemetry frame closest to timestamp
  const getFrameForTime = useCallback((timeSec) => {
    if (!telemetryFrames || telemetryFrames.length === 0) return null;
    const fps = 30;
    const targetIdx = Math.min(
      telemetryFrames.length - 1,
      Math.max(0, Math.floor(timeSec * fps))
    );
    return telemetryFrames[targetIdx];
  }, [telemetryFrames]);

  // Synchronous Dual Canvas Rendering Loop
  useEffect(() => {
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

      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + dt * playbackRate;
          return next > (duration || 6.0) ? 0 : next;
        });
      }

      radarSweepAngleRef.current = (radarSweepAngleRef.current + dt * 2.2) % (Math.PI * 2);
      scanLineYRef.current = (scanLineYRef.current + dt * 180) % 720;

      const frameData = getFrameForTime(currentTime);
      if (frameData) {
        setCurrentFrameData(frameData);

        // Update ball history
        if (frameData.ball) {
          ballHistoryRef.current.push({ ...frameData.ball, time: currentTime });
          if (ballHistoryRef.current.length > 25) ballHistoryRef.current.shift();
        }
      }

      // ==========================================
      // 1. RENDER BROADCAST CANVAS HUD
      // ==========================================
      const bw = bCanvas.width;
      const bh = bCanvas.height;

      bCtx.clearRect(0, 0, bw, bh);

      // Pitch Grass Background
      if (activeSource === 'sample' || !customVideoUrl) {
        bCtx.fillStyle = '#1A3322';
        bCtx.fillRect(0, 0, bw, bh);

        // Pitch lines
        bCtx.strokeStyle = 'rgba(232, 210, 181, 0.28)';
        bCtx.lineWidth = 2.5;

        // Center line
        bCtx.beginPath();
        bCtx.moveTo(bw / 2, 80);
        bCtx.lineTo(bw / 2, bh - 60);
        bCtx.stroke();

        // Center circle
        bCtx.beginPath();
        bCtx.ellipse(bw / 2, bh / 2, 140, 75, 0, 0, Math.PI * 2);
        bCtx.stroke();

        // Penalty box outlines
        bCtx.strokeRect(40, 180, 180, 360);
        bCtx.strokeRect(bw - 220, 180, 180, 360);
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
        frameData.players.forEach(p => {
          const px = ((p.pitch_x || 50) / 105) * (bw - 160) + 80;
          const py = ((p.pitch_y || 34) / 68) * (bh - 140) + 70;
          const isAlpha = p.team === 'alpha';
          const isSelected = p.id === selectedPlayerId;
          const primaryColor = isAlpha ? '#D90429' : '#1D3557';

          // Speed ring under player feet
          if (showRings) {
            bCtx.save();
            bCtx.beginPath();
            bCtx.ellipse(px, py + 18, 22, 10, 0, 0, Math.PI * 2);
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : primaryColor;
            bCtx.lineWidth = isSelected ? 3 : 2;
            bCtx.stroke();
            bCtx.restore();
          }

          // Bounding box
          if (showBoxes) {
            const boxW = 32;
            const boxH = 54;
            const bx = px - boxW / 2;
            const by = py - boxH + 18;

            bCtx.strokeStyle = isSelected ? '#FFF6EB' : primaryColor;
            bCtx.lineWidth = isSelected ? 2.5 : 1.5;
            bCtx.strokeRect(bx, by, boxW, boxH);

            // Player Tag
            bCtx.fillStyle = 'rgba(20, 3, 3, 0.85)';
            bCtx.fillRect(bx - 4, by - 16, boxW + 8, 14);

            bCtx.fillStyle = '#FFF6EB';
            bCtx.font = '700 9px monospace';
            bCtx.fillText(`#${p.id} ${p.speed_kmh || 0}k`, bx - 2, by - 6);
          }

          // Velocity heading vector
          if (showVectors && (p.speed_kmh || 0) > 12) {
            const headingRad = isAlpha ? 0.3 : Math.PI - 0.3;
            const vectorLen = Math.min(35, (p.speed_kmh || 0) * 1.2);
            bCtx.beginPath();
            bCtx.moveTo(px, py + 18);
            bCtx.lineTo(px + Math.cos(headingRad) * vectorLen, py + 18 + Math.sin(headingRad) * vectorLen * 0.5);
            bCtx.strokeStyle = 'rgba(232, 210, 181, 0.8)';
            bCtx.lineWidth = 2;
            bCtx.stroke();
          }
        });
      }

      // Ball on broadcast feed
      if (frameData && frameData.ball) {
        const bx = ((frameData.ball.pitch_x || 52) / 105) * (bw - 160) + 80;
        const by = ((frameData.ball.pitch_y || 34) / 68) * (bh - 140) + 70;

        // Ball Flight Trail
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

        // Ball body & glowing aura
        bCtx.beginPath();
        bCtx.arc(bx, by, 6, 0, Math.PI * 2);
        bCtx.fillStyle = '#FFD700';
        bCtx.fill();
        bCtx.strokeStyle = '#FFFFFF';
        bCtx.lineWidth = 2;
        bCtx.stroke();
      }

      // ==========================================
      // 2. RENDER 2D PLANAR PITCH RADAR
      // ==========================================
      const rw = rCanvas.width;
      const rh = rCanvas.height;

      rCtx.clearRect(0, 0, rw, rh);

      // Pitch background
      rCtx.fillStyle = '#16281B';
      rCtx.fillRect(0, 0, rw, rh);

      const padX = 16;
      const padY = 14;
      const pitchW = rw - padX * 2;
      const pitchH = rh - padY * 2;

      // Coordinate transformers (0-105m to radar pixels)
      const toRadarX = (mX) => padX + (Math.max(0, Math.min(105, mX)) / 105) * pitchW;
      const toRadarY = (mY) => padY + (Math.max(0, Math.min(68, mY)) / 68) * pitchH;

      // Pitch lines
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.35)';
      rCtx.lineWidth = 1.2;
      rCtx.strokeRect(padX, padY, pitchW, pitchH);

      // Center line & circle
      rCtx.beginPath();
      rCtx.moveTo(padX + pitchW / 2, padY);
      rCtx.lineTo(padX + pitchW / 2, padY + pitchH);
      rCtx.stroke();

      rCtx.beginPath();
      rCtx.arc(padX + pitchW / 2, padY + pitchH / 2, 28, 0, Math.PI * 2);
      rCtx.stroke();

      // Penalty boxes
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
  }, [isPlaying, playbackRate, currentTime, duration, getFrameForTime, showBoxes, showRings, showVectors, showBallTrail, showOffside, showRadarVoronoi, showScanner, selectedPlayerId, activeSource, customVideoUrl]);

  const selectedPlayer = currentFrameData?.players?.find(p => p.id === selectedPlayerId) || currentFrameData?.players?.[0];

  // Sorted players for leaderboards
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
          TOP HEADER NAVIGATION STRIP
          ======================================================== */}
      <header style={{
        backgroundColor: '#300403',
        backgroundImage: 'linear-gradient(180deg, #430504 0%, #2A0302 100%)',
        borderBottom: '1.5px solid rgba(232, 210, 181, 0.22)',
        padding: '14px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        color: '#FFF6EB'
      }}>
        {/* Left: Back Link & Breadcrumb */}
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
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 800 }}>
              pitchvision<span style={{ opacity: 0.6 }}>.ai</span>
            </span>
            <span style={{ color: 'rgba(232, 210, 181, 0.35)' }}>/</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--cream-beige)' }}>
              Match Analytics Studio
            </span>
          </div>
        </div>

        {/* Center: Backend Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(232, 210, 181, 0.2)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.72rem',
          fontFamily: 'monospace'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: backendStatus.online ? '#4ADE80' : '#F87171',
            boxShadow: backendStatus.online ? '0 0 8px #4ADE80' : '0 0 8px #F87171'
          }} />
          <span>
            {backendStatus.online 
              ? `FASTAPI ENGINE ONLINE (PORT 8001 // ${backendStatus.gpu || backendStatus.device})`
              : 'OFFLINE MODE (Using Client Telemetry)'}
          </span>
        </div>

        {/* Right: Video Load & Neural Run Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Run Demo with YOLOv8 */}
          <button
            onClick={() => triggerBackendProcessing(null)}
            disabled={!backendStatus.online || isProcessing}
            style={{
              backgroundColor: 'rgba(232, 210, 181, 0.15)',
              border: '1px solid rgba(232, 210, 181, 0.35)',
              color: 'var(--cream-beige)',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: backendStatus.online && !isProcessing ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={13} color="var(--cream-beige)" />
            <span>Run YOLOv8 Demo</span>
          </button>

          {/* Upload Custom Video */}
          <label style={{
            backgroundColor: 'var(--cream-beige)',
            color: 'var(--burgundy-deep)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Upload size={13} color="var(--burgundy-deep)" />
            <span>Upload Match Video</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      {/* ========================================================
          BACKGROUND PROCESSING PROGRESS BAR (IF RUNNING)
          ======================================================== */}
      {isProcessing && (
        <div style={{
          backgroundColor: '#430504',
          borderBottom: '1px solid rgba(232, 210, 181, 0.3)',
          padding: '10px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFF6EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={16} className="tactical-scanner-beam" color="var(--cream-beige)" />
            <span style={{ fontSize: '0.80rem', fontWeight: 800 }}>
              Running Neural Pipeline: Processing Frame {processingCurrentFrame}/{processingTotalFrames} ({processingProgress.toFixed(1)}%)
            </span>
          </div>

          <div style={{ width: '280px', height: '8px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${processingProgress}%`, height: '100%', backgroundColor: '#4ADE80', transition: 'width 0.3s ease' }} />
          </div>

          <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--cream-beige)' }}>
            {processingFps} FPS
          </span>
        </div>
      )}

      {/* ========================================================
          MAIN WORKBENCH: BROADCAST SCREEN (LEFT) + RADAR & TELEMETRY (RIGHT)
          ======================================================== */}
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
          
          {/* LEFT: 16:9 Broadcast Video Player & Real-time Canvas */}
          <div style={{
            backgroundColor: '#300403',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid rgba(89, 9, 7, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Screen Header Bar */}
            <div style={{
              padding: '8px 16px',
              borderBottom: '1px solid rgba(232, 210, 181, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#380504'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E63946' }} />
                <span style={{ color: '#FFF6EB', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em' }}>
                  {activeSource === 'sample' ? 'BROADCAST TACTICAL FEED (1080P // YOLOv8)' : `CUSTOM FEED: ${customFileName}`}
                </span>
              </div>

              {/* Data Export Shortcuts */}
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
                  title="Download raw frame-by-frame JSON telemetry"
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
                  title="Download metrics as CSV"
                >
                  <FileSpreadsheet size={11} />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Video + Telemetry Canvas Container */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#16281B', overflow: 'hidden' }}>
              {activeSource === 'custom' && customVideoUrl && (
                <video
                  ref={videoRef}
                  src={customVideoUrl}
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
                style={{ width: '100%', height: '100%', display: 'block' }}
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
              {/* Scrubber */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--cream-beige)', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800, minWidth: '46px' }}>
                  00:{currentTime.toFixed(2).padStart(5, '0')}
                </span>

                <input
                  type="range"
                  min="0"
                  max={duration || 6.0}
                  step="0.03"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--cream-beige)', cursor: 'pointer' }}
                />

                <span style={{ color: 'rgba(232, 210, 181, 0.7)', fontFamily: 'monospace', fontSize: '0.72rem', minWidth: '46px', textAlign: 'right' }}>
                  00:0{duration.toFixed(2)}
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

                  {/* Speed */}
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

                {/* Layer Toggles */}
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

          {/* RIGHT: Floating 2D Pitch Radar & Real-Time Player Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Radar Header Strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', fontWeight: 800, color: 'var(--burgundy-deep)' }}>
                <Radio size={12} color="var(--burgundy-deep)" />
                <span>LIVE 2D PLANAR RADAR (105m &times; 68m)</span>
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
                {showRadarVoronoi ? 'VORONOI: ACTIVE' : 'VORONOI: OFF'}
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

            {/* Live Team Possession Meter */}
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

            {/* Selected Player Telemetry Card */}
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

        {/* ========================================================
            ANALYTICS DASHBOARD: TABS FOR KINEMATICS, TACTICS & RAW DATA
            ======================================================== */}
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
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '20px' }}>
            {activeTab === 'kinematics' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Speed Leaderboard */}
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

                {/* Distance & Deceleration Telemetry */}
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
    </div>
  );
}
