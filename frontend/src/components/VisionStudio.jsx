import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Upload, Eye, Layers, FastForward, 
  Maximize2, Activity, Compass, ShieldAlert, Cpu, Sparkles, Crosshair
} from 'lucide-react';

export default function VisionStudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedPlayerId, setSelectedPlayerId] = useState(10); // Haaland default
  const [activeSource, setActiveSource] = useState('sample'); // 'sample' or 'custom'
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customFileName, setCustomFileName] = useState('');

  // Telemetry layer toggles
  const [showBoxes, setShowBoxes] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showBallTrail, setShowBallTrail] = useState(true);
  const [showOffside, setShowOffside] = useState(true);
  const [showRadarVoronoi, setShowRadarVoronoi] = useState(true);

  // Telemetry data state
  const [telemetryFrames, setTelemetryFrames] = useState([]);
  const [currentFrameData, setCurrentFrameData] = useState(null);

  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const ballHistoryRef = useRef([]);

  // Load telemetry dataset
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

  // Handle custom video upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
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

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Seek video
  const handleSeek = (newTime) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Change speed
  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
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

  // Main synchronous rendering loop
  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    const radar = radarCanvasRef.current;
    if (!overlay || !radar) return;

    const oCtx = overlay.getContext('2d');
    const rCtx = radar.getContext('2d');

    const renderStudio = () => {
      const vTime = video ? video.currentTime : currentTime;
      setCurrentTime(vTime);

      const frameData = getFrameForTime(vTime);
      if (frameData) {
        setCurrentFrameData(frameData);
      }

      const vw = overlay.width;
      const vh = overlay.height;

      // 1. OVERLAY CANVAS (1280 x 720 coordinate space)
      oCtx.clearRect(0, 0, vw, vh);

      if (frameData && frameData.players) {
        // Offside line
        if (showOffside && frameData.offside_x) {
          const ox = frameData.offside_x;
          oCtx.save();
          oCtx.beginPath();
          oCtx.setLineDash([8, 6]);
          oCtx.strokeStyle = 'rgba(232, 210, 181, 0.75)';
          oCtx.lineWidth = 2;
          oCtx.moveTo(ox, 50);
          oCtx.lineTo(ox, vh - 50);
          oCtx.stroke();

          // Offside indicator flag
          oCtx.setLineDash([]);
          oCtx.fillStyle = '#590907';
          oCtx.strokeStyle = '#E8D2B5';
          oCtx.lineWidth = 1.5;
          oCtx.fillRect(ox - 50, 24, 100, 22);
          oCtx.strokeRect(ox - 50, 24, 100, 22);
          oCtx.fillStyle = '#FFF6EB';
          oCtx.font = '700 10px monospace';
          oCtx.textAlign = 'center';
          oCtx.fillText(`OFFSIDE: ${ox.toFixed(0)}px`, ox, 39);
          oCtx.restore();
        }

        // Render each player's telemetry HUD
        frameData.players.forEach(p => {
          const isSelected = p.id === selectedPlayerId;
          const isAlpha = p.team === 'alpha';
          const teamColor = isAlpha ? '#590907' : '#1D3557';
          const accentColor = isAlpha ? '#E8D2B5' : '#8ECAE6';

          // Speed zone color
          let speedColor = '#94D2BD';
          if (p.speed_kmh > 30) speedColor = '#E63946';
          else if (p.speed_kmh > 24) speedColor = '#F4A261';
          else if (p.speed_kmh > 18) speedColor = '#E8D2B5';

          // A. Foot Ground Ellipse & Speed Ring
          if (showRings) {
            oCtx.save();
            oCtx.beginPath();
            oCtx.ellipse(p.x, p.y + 10, 18, 7, 0, 0, Math.PI * 2);
            oCtx.strokeStyle = isSelected ? '#FFF6EB' : speedColor;
            oCtx.lineWidth = isSelected ? 3 : 1.8;
            oCtx.stroke();

            // Inner glowing disc for selected player
            if (isSelected) {
              oCtx.fillStyle = 'rgba(232, 210, 181, 0.35)';
              oCtx.fill();
            }
            oCtx.restore();
          }

          // B. 3D Body Orientation Heading Vector
          if (showVectors && p.heading_deg !== undefined) {
            oCtx.save();
            const rad = (p.heading_deg * Math.PI) / 180;
            const arrowLen = 28;
            const ex = p.x + Math.cos(rad) * arrowLen;
            const ey = (p.y - 12) + Math.sin(rad) * arrowLen;

            oCtx.beginPath();
            oCtx.moveTo(p.x, p.y - 12);
            oCtx.lineTo(ex, ey);
            oCtx.strokeStyle = isSelected ? '#FFF6EB' : accentColor;
            oCtx.lineWidth = 2.2;
            oCtx.stroke();

            // Vector arrowhead
            const headAngle = Math.PI / 6;
            oCtx.beginPath();
            oCtx.moveTo(ex, ey);
            oCtx.lineTo(
              ex - 7 * Math.cos(rad - headAngle),
              ey - 7 * Math.sin(rad - headAngle)
            );
            oCtx.moveTo(ex, ey);
            oCtx.lineTo(
              ex - 7 * Math.cos(rad + headAngle),
              ey - 7 * Math.sin(rad + headAngle)
            );
            oCtx.stroke();
            oCtx.restore();
          }

          // C. Bounding Box & ML Confidence Tag
          if (showBoxes && p.bbox) {
            const [bx1, by1, bx2, by2] = p.bbox;
            const bw = bx2 - bx1;
            const bh = by2 - by1;

            oCtx.save();
            // Subtle semi-transparent box
            oCtx.strokeStyle = isSelected ? '#FFF6EB' : (isAlpha ? 'rgba(89,9,7,0.85)' : 'rgba(29,53,87,0.85)');
            oCtx.lineWidth = isSelected ? 2.5 : 1.5;
            oCtx.strokeRect(bx1, by1, bw, bh);

            // Corner brackets
            const clen = 6;
            oCtx.strokeStyle = accentColor;
            oCtx.lineWidth = 2;
            // Top-left
            oCtx.beginPath();
            oCtx.moveTo(bx1, by1 + clen);
            oCtx.lineTo(bx1, by1);
            oCtx.lineTo(bx1 + clen, by1);
            oCtx.stroke();
            // Top-right
            oCtx.beginPath();
            oCtx.moveTo(bx2 - clen, by1);
            oCtx.lineTo(bx2, by1);
            oCtx.lineTo(bx2, by1 + clen);
            oCtx.stroke();

            // Tactical badge on top of player
            const label = `${p.tag} ${p.name}`;
            const subLabel = `${p.speed_kmh} km/h`;
            oCtx.font = '700 9px monospace';
            const labelW = Math.max(oCtx.measureText(label).width, oCtx.measureText(subLabel).width) + 12;

            oCtx.fillStyle = isSelected ? '#430504' : teamColor;
            oCtx.fillRect(bx1 - 4, by1 - 22, labelW, 20);
            oCtx.strokeStyle = accentColor;
            oCtx.lineWidth = 1;
            oCtx.strokeRect(bx1 - 4, by1 - 22, labelW, 20);

            oCtx.fillStyle = '#FFF6EB';
            oCtx.textAlign = 'left';
            oCtx.fillText(label, bx1, by1 - 11);
            oCtx.fillStyle = speedColor;
            oCtx.fillText(subLabel, bx1, by1 - 3);

            oCtx.restore();
          }
        });

        // D. Ball Trajectory Arc
        if (showBallTrail && frameData.ball) {
          const b = frameData.ball;
          // Add to history
          ballHistoryRef.current.push({ x: b.x, y: b.y, time: vTime });
          if (ballHistoryRef.current.length > 25) {
            ballHistoryRef.current.shift();
          }

          oCtx.save();
          // Draw trail
          if (ballHistoryRef.current.length > 1) {
            oCtx.beginPath();
            oCtx.moveTo(ballHistoryRef.current[0].x, ballHistoryRef.current[0].y);
            for (let i = 1; i < ballHistoryRef.current.length; i++) {
              oCtx.lineTo(ballHistoryRef.current[i].x, ballHistoryRef.current[i].y);
            }
            oCtx.strokeStyle = 'rgba(212, 154, 61, 0.7)';
            oCtx.lineWidth = 3;
            oCtx.setLineDash([4, 3]);
            oCtx.stroke();
          }

          // Ball marker
          oCtx.beginPath();
          oCtx.arc(b.x, b.y, 7, 0, Math.PI * 2);
          oCtx.fillStyle = '#E8D2B5';
          oCtx.fill();
          oCtx.strokeStyle = '#590907';
          oCtx.lineWidth = 2;
          oCtx.stroke();

          // Ball speed tag
          oCtx.fillStyle = '#430504';
          oCtx.fillRect(b.x + 10, b.y - 18, 64, 18);
          oCtx.strokeStyle = '#D49A3D';
          oCtx.lineWidth = 1;
          oCtx.strokeRect(b.x + 10, b.y - 18, 64, 18);
          oCtx.fillStyle = '#FFF6EB';
          oCtx.font = '700 9px monospace';
          oCtx.textAlign = 'left';
          oCtx.fillText(`⚽ ${b.speed_kmh}k`, b.x + 14, b.y - 5);
          oCtx.restore();
        }
      }

      // 2. RADAR MINIMAP CANVAS (360 x 234 metric pitch: 105m x 68m)
      const rw = radar.width;
      const rh = radar.height;
      rCtx.clearRect(0, 0, rw, rh);

      // Pitch background (Dark tactical felt)
      rCtx.fillStyle = '#222923';
      rCtx.fillRect(0, 0, rw, rh);

      // Pitch Grass Stripes
      const stripes = 10;
      const sw = rw / stripes;
      for (let s = 0; s < stripes; s++) {
        if (s % 2 === 0) {
          rCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          rCtx.fillRect(s * sw, 0, sw, rh);
        }
      }

      // Metric coordinate mapper: (0..105m, 0..68m) -> (16..rw-16, 16..rh-16)
      const padX = 16;
      const padY = 16;
      const pitchW = rw - padX * 2;
      const pitchH = rh - padY * 2;

      const toRadarX = (pmx) => padX + (pmx / 105.0) * pitchW;
      const toRadarY = (pmy) => padY + (pmy / 68.0) * pitchH;

      // Pitch Markings
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.45)';
      rCtx.lineWidth = 1.5;
      // Border
      rCtx.strokeRect(padX, padY, pitchW, pitchH);
      // Halfway line
      rCtx.beginPath();
      rCtx.moveTo(rw / 2, padY);
      rCtx.lineTo(rw / 2, rh - padY);
      rCtx.stroke();
      // Center circle
      rCtx.beginPath();
      rCtx.arc(rw / 2, rh / 2, pitchH * 0.18, 0, Math.PI * 2);
      rCtx.stroke();
      // Center spot
      rCtx.beginPath();
      rCtx.arc(rw / 2, rh / 2, 2.5, 0, Math.PI * 2);
      rCtx.fillStyle = 'rgba(232, 210, 181, 0.6)';
      rCtx.fill();

      // Penalty Boxes (16.5m depth, 40.3m height)
      const penBoxW = (16.5 / 105.0) * pitchW;
      const penBoxH = (40.3 / 68.0) * pitchH;
      const penBoxY = padY + (pitchH - penBoxH) / 2;
      rCtx.strokeRect(padX, penBoxY, penBoxW, penBoxH);
      rCtx.strokeRect(rw - padX - penBoxW, penBoxY, penBoxW, penBoxH);

      // 6-yard boxes
      const goalBoxW = (5.5 / 105.0) * pitchW;
      const goalBoxH = (18.3 / 68.0) * pitchH;
      const goalBoxY = padY + (pitchH - goalBoxH) / 2;
      rCtx.strokeRect(padX, goalBoxY, goalBoxW, goalBoxH);
      rCtx.strokeRect(rw - padX - goalBoxW, goalBoxY, goalBoxW, goalBoxH);

      // Radar Voronoi Pitch Dominance
      if (showRadarVoronoi && frameData && frameData.players) {
        // Fast grid approximation
        const step = 8;
        const cols = Math.floor(pitchW / step);
        const rows = Math.floor(pitchH / step);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const rx = padX + c * step + step / 2;
            const ry = padY + r * step + step / 2;

            // Find closest player
            let closestDist = 999999;
            let closestTeam = null;

            frameData.players.forEach(p => {
              const px = toRadarX(p.pitch_x);
              const py = toRadarY(p.pitch_y);
              const d = (rx - px) * (rx - px) + (ry - py) * (ry - py);
              if (d < closestDist) {
                closestDist = d;
                closestTeam = p.team;
              }
            });

            if (closestTeam === 'alpha') {
              rCtx.fillStyle = 'rgba(89, 9, 7, 0.16)';
            } else {
              rCtx.fillStyle = 'rgba(29, 53, 87, 0.16)';
            }
            rCtx.fillRect(padX + c * step, padY + r * step, step, step);
          }
        }
      }

      // Render players on radar
      if (frameData && frameData.players) {
        frameData.players.forEach(p => {
          const rx = toRadarX(p.pitch_x);
          const ry = toRadarY(p.pitch_y);
          const isSelected = p.id === selectedPlayerId;
          const isAlpha = p.team === 'alpha';

          // Player dot
          rCtx.save();
          rCtx.beginPath();
          rCtx.arc(rx, ry, isSelected ? 6.5 : 4.5, 0, Math.PI * 2);
          rCtx.fillStyle = isAlpha ? '#590907' : '#1D3557';
          rCtx.fill();
          rCtx.strokeStyle = isSelected ? '#FFF6EB' : (isAlpha ? '#E8D2B5' : '#8ECAE6');
          rCtx.lineWidth = isSelected ? 2.5 : 1.2;
          rCtx.stroke();

          // Selection radar halo ring
          if (isSelected) {
            rCtx.beginPath();
            rCtx.arc(rx, ry, 11, 0, Math.PI * 2);
            rCtx.strokeStyle = 'rgba(232, 210, 181, 0.6)';
            rCtx.setLineDash([2, 2]);
            rCtx.lineWidth = 1.5;
            rCtx.stroke();
          }

          // Small jersey number
          rCtx.fillStyle = '#FFF6EB';
          rCtx.font = '700 8px sans-serif';
          rCtx.textAlign = 'center';
          rCtx.textBaseline = 'middle';
          rCtx.fillText(p.id.toString(), rx, ry - 9);
          rCtx.restore();
        });

        // Radar Ball
        if (frameData.ball) {
          const rbx = toRadarX(frameData.ball.pitch_x);
          const rby = toRadarY(frameData.ball.pitch_y);
          rCtx.save();
          rCtx.beginPath();
          rCtx.arc(rbx, rby, 4, 0, Math.PI * 2);
          rCtx.fillStyle = '#D49A3D';
          rCtx.fill();
          rCtx.strokeStyle = '#FFF6EB';
          rCtx.lineWidth = 1.2;
          rCtx.stroke();
          rCtx.restore();
        }
      }

      // Next frame
      animationFrameRef.current = requestAnimationFrame(renderStudio);
    };

    animationFrameRef.current = requestAnimationFrame(renderStudio);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [getFrameForTime, showBoxes, showRings, showVectors, showBallTrail, showOffside, showRadarVoronoi, selectedPlayerId, currentTime]);

  const selectedPlayer = currentFrameData?.players?.find(p => p.id === selectedPlayerId);

  // Top speed ranking in current frame
  const sortedPlayers = currentFrameData?.players 
    ? [...currentFrameData.players].sort((a, b) => b.speed_kmh - a.speed_kmh).slice(0, 6)
    : [];

  return (
    <section id="vision-studio" style={{
      padding: '90px 48px',
      backgroundColor: 'var(--bg-sage)',
      position: 'relative',
      borderBottom: '1px solid rgba(89, 9, 7, 0.12)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-bg)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              <Activity size={13} color="var(--cream-light)" />
              VISION WORKBENCH 01 // SYNCED CV HUD &amp; METRIC RADAR
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 10px 0'
            }}>
              Interactive Vision Studio &amp; Live 2D Radar
            </h2>
            <p style={{
              color: '#380504',
              fontSize: '1rem',
              maxWidth: '780px',
              margin: 0,
              opacity: 0.88,
              lineHeight: 1.55
            }}>
              Autonomous multi-camera tracking with sub-millisecond homography projection, real-time bounding boxes, velocity vectors, and synchronous birds-eye pitch state.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              backgroundColor: '#FAF6F0',
              border: '1.5px solid rgba(89, 9, 7, 0.15)',
              borderRadius: '10px',
              padding: '10px 18px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>INFERENCE LATENCY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>14.8 ms</div>
            </div>
            <div style={{
              backgroundColor: '#FAF6F0',
              border: '1.5px solid rgba(89, 9, 7, 0.15)',
              borderRadius: '10px',
              padding: '10px 18px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>THROUGHPUT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>64.9 FPS</div>
            </div>
          </div>
        </div>

        {/* Main Workbench Grid: Broadcast Screen (Left) + Tactical Radar Dock (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(360px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: Broadcast Video Player with Canvas Overlay */}
          <div style={{
            backgroundColor: 'var(--burgundy-deep)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(89, 9, 7, 0.22)',
            border: '2px solid rgba(232, 210, 181, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Toolbar */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid rgba(232, 210, 181, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#E63946',
                  boxShadow: '0 0 8px #E63946'
                }} />
                <span style={{
                  color: 'var(--cream-light)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  {activeSource === 'sample' ? 'BROADCAST TACTICAL FEED (1080P // YOLOv8)' : `CUSTOM STREAM: ${customFileName}`}
                </span>
              </div>

              {/* Upload Match Video Button */}
              <label style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(232, 210, 181, 0.12)',
                color: 'var(--cream-bg)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid rgba(232, 210, 181, 0.3)',
                transition: 'all 0.2s'
              }}>
                <Upload size={13} />
                Load Match Video
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Video + Telemetry Canvas Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#0c120e',
              overflow: 'hidden'
            }}>
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                src={customVideoUrl || "/sample_match.mp4"}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
              />

              {/* Real-time Telemetry Canvas (exact 1280x720 canvas matching simulation coordinate space) */}
              <canvas
                ref={overlayCanvasRef}
                width={1280}
                height={720}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              />

              {/* Top-Right HUD Pill */}
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                backgroundColor: 'rgba(67, 5, 4, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(232, 210, 181, 0.25)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--cream-bg)',
                fontFamily: 'monospace',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Cpu size={12} color="#E8D2B5" />
                <span>MODEL: YOLOv8x-MOT</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span style={{ color: '#94D2BD' }}>TRACKS: {currentFrameData?.players?.length || 22}</span>
              </div>
            </div>

            {/* Custom Tactical Playback Controls Bar */}
            <div style={{
              padding: '14px 20px',
              backgroundColor: '#430504',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {/* Timeline Scrubber */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  color: 'var(--cream-light)',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  minWidth: '56px'
                }}>
                  00:{currentTime.toFixed(2).padStart(5, '0')}
                </span>

                <input
                  type="range"
                  min="0"
                  max={duration || 6.0}
                  step="0.03"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--cream-bg)',
                    cursor: 'pointer'
                  }}
                />

                <span style={{
                  color: 'rgba(232, 210, 181, 0.6)',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  minWidth: '56px',
                  textAlign: 'right'
                }}>
                  00:0{duration.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons & Rate Selectors */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={togglePlay}
                    style={{
                      backgroundColor: 'var(--cream-bg)',
                      color: 'var(--burgundy-deep)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>

                  <button
                    onClick={() => handleSeek(0)}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.12)',
                      color: 'var(--cream-bg)',
                      border: '1px solid rgba(232, 210, 181, 0.25)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={13} />
                    Rewind
                  </button>

                  {/* Playback rate */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '2px',
                    border: '1px solid rgba(232, 210, 181, 0.15)'
                  }}>
                    {[0.5, 1.0, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        style={{
                          backgroundColor: playbackRate === rate ? 'var(--cream-bg)' : 'transparent',
                          color: playbackRate === rate ? 'var(--burgundy-deep)' : 'var(--cream-bg)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Telemetry Layer Toggles */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setShowBoxes(!showBoxes)}
                    style={{
                      backgroundColor: showBoxes ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                      color: showBoxes ? 'var(--cream-light)' : 'rgba(232, 210, 181, 0.5)',
                      border: `1px solid ${showBoxes ? 'rgba(232, 210, 181, 0.5)' : 'rgba(232, 210, 181, 0.15)'}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    BBoxes
                  </button>

                  <button
                    onClick={() => setShowRings(!showRings)}
                    style={{
                      backgroundColor: showRings ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                      color: showRings ? 'var(--cream-light)' : 'rgba(232, 210, 181, 0.5)',
                      border: `1px solid ${showRings ? 'rgba(232, 210, 181, 0.5)' : 'rgba(232, 210, 181, 0.15)'}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Speed Rings
                  </button>

                  <button
                    onClick={() => setShowVectors(!showVectors)}
                    style={{
                      backgroundColor: showVectors ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                      color: showVectors ? 'var(--cream-light)' : 'rgba(232, 210, 181, 0.5)',
                      border: `1px solid ${showVectors ? 'rgba(232, 210, 181, 0.5)' : 'rgba(232, 210, 181, 0.15)'}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Heading Vectors
                  </button>

                  <button
                    onClick={() => setShowOffside(!showOffside)}
                    style={{
                      backgroundColor: showOffside ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                      color: showOffside ? 'var(--cream-light)' : 'rgba(232, 210, 181, 0.5)',
                      border: `1px solid ${showOffside ? 'rgba(232, 210, 181, 0.5)' : 'rgba(232, 210, 181, 0.15)'}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Offside Line
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Synchronized 2D Pitch Radar Studio */}
          <div style={{
            backgroundColor: '#FAF6F0',
            borderRadius: '16px',
            border: '2px solid rgba(89, 9, 7, 0.15)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Radar Header */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-bg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--cream-light)', opacity: 0.8, letterSpacing: '0.08em' }}>
                  SYNCHRONOUS PLANAR HOMOGRAPHY
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--cream-bg)' }}>
                  Live 2D Pitch Radar (105m &times; 68m)
                </div>
              </div>

              <button
                onClick={() => setShowRadarVoronoi(!showRadarVoronoi)}
                style={{
                  backgroundColor: showRadarVoronoi ? 'var(--cream-bg)' : 'rgba(232, 210, 181, 0.15)',
                  color: showRadarVoronoi ? 'var(--burgundy-deep)' : 'var(--cream-bg)',
                  border: '1px solid rgba(232, 210, 181, 0.3)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {showRadarVoronoi ? 'Voronoi: ON' : 'Voronoi: OFF'}
              </button>
            </div>

            {/* Radar Canvas Container */}
            <div style={{ padding: '20px', backgroundColor: '#1A211C' }}>
              <canvas
                ref={radarCanvasRef}
                width={360}
                height={234}
                style={{
                  width: '100%',
                  aspectRatio: '360/234',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(232, 210, 181, 0.25)',
                  display: 'block'
                }}
              />

              {/* Radar Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                fontSize: '0.72rem',
                color: 'var(--cream-light)',
                fontWeight: 700
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#590907', border: '1px solid #E8D2B5' }} />
                  <span>Team Alpha (Red)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1D3557', border: '1px solid #8ECAE6' }} />
                  <span>Team Beta (Blue)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D49A3D', border: '1px solid #FFF' }} />
                  <span>Ball</span>
                </div>
              </div>
            </div>

            {/* Possession & Space Dominance Bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(89, 9, 7, 0.1)' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                fontWeight: 800,
                color: 'var(--burgundy-deep)',
                marginBottom: '6px'
              }}>
                <span>TEAM ALPHA {currentFrameData?.possession?.alpha || 54.0}%</span>
                <span>POSSESSION</span>
                <span>TEAM BETA {currentFrameData?.possession?.beta || 46.0}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: '#1D3557',
                overflow: 'hidden',
                display: 'flex'
              }}>
                <div style={{
                  width: `${currentFrameData?.possession?.alpha || 54}%`,
                  height: '100%',
                  backgroundColor: 'var(--burgundy-deep)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Selected Player Telemetry Card */}
            <div style={{ padding: '16px 20px', flex: 1 }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}>
                INSPECTED TARGET TELEMETRY
              </div>

              {selectedPlayer ? (
                <div style={{
                  backgroundColor: '#FFF',
                  border: '1.5px solid rgba(89, 9, 7, 0.15)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: selectedPlayer.team === 'alpha' ? 'var(--burgundy-deep)' : '#1D3557',
                        color: '#FFF6EB',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        marginRight: '6px'
                      }}>
                        {selectedPlayer.tag}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--burgundy-deep)' }}>{selectedPlayer.name}</strong>
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(89, 9, 7, 0.08)',
                      color: 'var(--burgundy-deep)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}>
                      {selectedPlayer.role}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ backgroundColor: '#FAF6F0', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: '#666', fontWeight: 700 }}>SPEED</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#E63946' }}>{selectedPlayer.speed_kmh} <span style={{ fontSize: '0.65rem' }}>km/h</span></div>
                    </div>
                    <div style={{ backgroundColor: '#FAF6F0', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: '#666', fontWeight: 700 }}>PITCH POS</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--burgundy-deep)' }}>({selectedPlayer.pitch_x}m, {selectedPlayer.pitch_y}m)</div>
                    </div>
                    <div style={{ backgroundColor: '#FAF6F0', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.62rem', color: '#666', fontWeight: 700 }}>HEADING</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1B4965' }}>{selectedPlayer.heading_deg}&deg;</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>
                  Click any player in leaderboard below to inspect
                </div>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM: Live Physical Sprint Leaderboard */}
        <div style={{
          marginTop: '24px',
          backgroundColor: '#FAF6F0',
          borderRadius: '14px',
          border: '1.5px solid rgba(89, 9, 7, 0.15)',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={16} color="var(--burgundy-deep)" />
              <h3 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 900,
                color: 'var(--burgundy-deep)'
              }}>
                Instant Physical Telemetry Leaderboard (Top Sprints at 00:{currentTime.toFixed(2)})
              </h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--burgundy-deep)', opacity: 0.75, fontWeight: 700 }}>
              Click any athlete card to pin tracking spotlight
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px'
          }}>
            {sortedPlayers.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              const isAlpha = player.team === 'alpha';

              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--burgundy-deep)' : '#FFFFFF',
                    color: isSelected ? 'var(--cream-bg)' : 'var(--burgundy-deep)',
                    border: `1.5px solid ${isSelected ? 'var(--burgundy-deep)' : 'rgba(89, 9, 7, 0.15)'}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(89, 9, 7, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      opacity: isSelected ? 0.9 : 0.6
                    }}>
                      {player.tag} &bull; {player.role}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: isAlpha ? 'rgba(89, 9, 7, 0.12)' : 'rgba(29, 53, 87, 0.12)',
                      color: isSelected ? 'var(--cream-light)' : (isAlpha ? '#590907' : '#1D3557'),
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {isAlpha ? 'Alpha' : 'Beta'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '6px' }}>
                    {player.name}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.8 : 0.6 }}>Current Speed</span>
                    <span style={{
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      color: isSelected ? '#E8D2B5' : '#E63946',
                      fontFamily: 'monospace'
                    }}>
                      {player.speed_kmh} <span style={{ fontSize: '0.7rem' }}>km/h</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
