import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Upload, Eye, Layers, FastForward, 
  Maximize2, Activity, Compass, ShieldAlert, Cpu, Sparkles, Crosshair, Radio
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
  const [showScanner, setShowScanner] = useState(true);

  // Telemetry data state
  const [telemetryFrames, setTelemetryFrames] = useState([]);
  const [currentFrameData, setCurrentFrameData] = useState(null);

  const videoRef = useRef(null);
  const broadcastCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const ballHistoryRef = useRef([]);
  const radarSweepAngleRef = useRef(0);
  const scanLineYRef = useRef(0);

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
    setIsPlaying(prev => {
      const next = !prev;
      if (videoRef.current && activeSource === 'custom') {
        if (next) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      return next;
    });
  };

  // Seek video / animation
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

  // Main synchronous rendering loop with rich animations
  useEffect(() => {
    const bCanvas = broadcastCanvasRef.current;
    const rCanvas = radarCanvasRef.current;
    if (!bCanvas || !rCanvas) return;

    const bCtx = bCanvas.getContext('2d');
    const rCtx = rCanvas.getContext('2d');
    let lastTimestamp = performance.now();

    const renderStudio = (timestamp) => {
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Update time progression if playing
      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + dt * playbackRate;
          return next > (duration || 6.0) ? 0 : next;
        });
      }

      // Rotate radar sweep beam
      radarSweepAngleRef.current = (radarSweepAngleRef.current + dt * 2.2) % (Math.PI * 2);

      // Move broadcast CV scanline
      scanLineYRef.current = (scanLineYRef.current + dt * 180) % 720;

      const vTime = currentTime;
      const frameData = getFrameForTime(vTime);
      if (frameData) {
        setCurrentFrameData(frameData);
      }

      const bw = bCanvas.width;
      const bh = bCanvas.height;

      // ========================================================
      // 1. BROADCAST VIEW (Authentic HD Grass Pitch + Tracking HUD)
      // ========================================================
      // Base Pitch Green
      bCtx.fillStyle = '#1D3B24';
      bCtx.fillRect(0, 0, bw, bh);

      // Grass mowing cut stripes (12 alternating stripes)
      const numStripes = 12;
      const stripeW = bw / numStripes;
      for (let s = 0; s < numStripes; s++) {
        if (s % 2 === 0) {
          bCtx.fillStyle = '#18331E';
          bCtx.fillRect(s * stripeW, 40, stripeW, bh - 80);
        }
      }

      // Pitch White Markings
      bCtx.save();
      bCtx.strokeStyle = 'rgba(245, 248, 245, 0.75)';
      bCtx.lineWidth = 2.5;

      // Outer Touchline Rect: x: [100, bw-100], y: [50, bh-50]
      bCtx.strokeRect(100, 50, bw - 200, bh - 100);

      // Halfway line
      bCtx.beginPath();
      bCtx.moveTo(bw / 2, 50);
      bCtx.lineTo(bw / 2, bh - 50);
      bCtx.stroke();

      // Center Circle & Spot
      bCtx.beginPath();
      bCtx.arc(bw / 2, bh / 2, 92, 0, Math.PI * 2);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.arc(bw / 2, bh / 2, 4.5, 0, Math.PI * 2);
      bCtx.fillStyle = '#F5F8F5';
      bCtx.fill();

      // Left Penalty Box (18-yard box)
      bCtx.strokeRect(100, 180, 180, bh - 360);
      // Left 6-yard box
      bCtx.strokeRect(100, 260, 60, bh - 520);
      // Left Penalty Spot
      bCtx.beginPath();
      bCtx.arc(215, bh / 2, 4, 0, Math.PI * 2);
      bCtx.fill();

      // Right Penalty Box (18-yard box)
      bCtx.strokeRect(bw - 280, 180, 180, bh - 360);
      // Right 6-yard box
      bCtx.strokeRect(bw - 160, 260, 60, bh - 520);
      // Right Penalty Spot
      bCtx.beginPath();
      bCtx.arc(bw - 215, bh / 2, 4, 0, Math.PI * 2);
      bCtx.fill();

      // Subtle stadium floodlight vignetting
      const grad = bCtx.createRadialGradient(bw / 2, bh / 2, 180, bw / 2, bh / 2, bw * 0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.48)');
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, bw, bh);
      bCtx.restore();

      // CV Scanning Beam Animation across the broadcast feed
      if (showScanner) {
        bCtx.save();
        const sy = scanLineYRef.current;
        const scanGrad = bCtx.createLinearGradient(0, sy - 18, 0, sy + 6);
        scanGrad.addColorStop(0, 'rgba(232, 210, 181, 0)');
        scanGrad.addColorStop(0.8, 'rgba(232, 210, 181, 0.18)');
        scanGrad.addColorStop(1, 'rgba(232, 210, 181, 0.65)');
        bCtx.fillStyle = scanGrad;
        bCtx.fillRect(100, sy - 18, bw - 200, 24);

        bCtx.strokeStyle = 'rgba(232, 210, 181, 0.75)';
        bCtx.lineWidth = 1.2;
        bCtx.beginPath();
        bCtx.moveTo(100, sy + 6);
        bCtx.lineTo(bw - 100, sy + 6);
        bCtx.stroke();
        bCtx.restore();
      }

      // Render Telemetry Layers on Broadcast
      if (frameData && frameData.players) {
        // Offside line
        if (showOffside && frameData.offside_x) {
          const ox = frameData.offside_x;
          bCtx.save();
          bCtx.beginPath();
          bCtx.setLineDash([8, 6]);
          bCtx.strokeStyle = 'rgba(232, 210, 181, 0.9)';
          bCtx.lineWidth = 2;
          bCtx.moveTo(ox, 50);
          bCtx.lineTo(ox, bh - 50);
          bCtx.stroke();

          // Offside indicator flag
          bCtx.setLineDash([]);
          bCtx.fillStyle = '#590907';
          bCtx.strokeStyle = '#E8D2B5';
          bCtx.lineWidth = 1;
          bCtx.fillRect(ox - 52, 22, 104, 22);
          bCtx.strokeRect(ox - 52, 22, 104, 22);
          bCtx.fillStyle = '#FFF6EB';
          bCtx.font = '800 10px monospace';
          bCtx.textAlign = 'center';
          bCtx.fillText(`OFFSIDE: ${ox.toFixed(0)}px`, ox, 37);
          bCtx.restore();
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

          // 1. Draw Player Figure (Shirt, Shorts, Head)
          bCtx.save();
          // Shadow under feet
          bCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          bCtx.beginPath();
          bCtx.ellipse(p.x, p.y + 6, 10, 4, 0, 0, Math.PI * 2);
          bCtx.fill();

          // Head
          bCtx.fillStyle = '#F5D0A9';
          bCtx.beginPath();
          bCtx.arc(p.x, p.y - 32, 6, 0, Math.PI * 2);
          bCtx.fill();

          // Shirt
          bCtx.fillStyle = isAlpha ? '#8C120E' : '#1D4E89';
          bCtx.fillRect(p.x - 8, p.y - 25, 16, 18);
          // Team outline on shirt
          bCtx.strokeStyle = isAlpha ? '#E8D2B5' : '#FFF';
          bCtx.lineWidth = 1;
          bCtx.strokeRect(p.x - 8, p.y - 25, 16, 18);

          // Shorts
          bCtx.fillStyle = isAlpha ? '#FFF' : '#152538';
          bCtx.fillRect(p.x - 7, p.y - 7, 14, 12);
          bCtx.restore();

          // A. Foot Ground Ellipse & Speed Ring
          if (showRings) {
            bCtx.save();
            bCtx.beginPath();
            bCtx.ellipse(p.x, p.y + 8, 18, 7, 0, 0, Math.PI * 2);
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : speedColor;
            bCtx.lineWidth = isSelected ? 2.8 : 1.6;
            bCtx.stroke();

            // Inner glowing disc for selected player
            if (isSelected) {
              bCtx.fillStyle = 'rgba(232, 210, 181, 0.35)';
              bCtx.fill();
            }
            bCtx.restore();
          }

          // B. 3D Body Orientation Heading Vector
          if (showVectors && p.heading_deg !== undefined) {
            bCtx.save();
            const rad = (p.heading_deg * Math.PI) / 180;
            const arrowLen = 26;
            const ex = p.x + Math.cos(rad) * arrowLen;
            const ey = (p.y - 12) + Math.sin(rad) * arrowLen;

            bCtx.beginPath();
            bCtx.moveTo(p.x, p.y - 12);
            bCtx.lineTo(ex, ey);
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : accentColor;
            bCtx.lineWidth = 2;
            bCtx.stroke();

            // Arrowhead
            const headAngle = Math.PI / 6;
            bCtx.beginPath();
            bCtx.moveTo(ex, ey);
            bCtx.lineTo(
              ex - 6 * Math.cos(rad - headAngle),
              ey - 6 * Math.sin(rad - headAngle)
            );
            bCtx.moveTo(ex, ey);
            bCtx.lineTo(
              ex - 6 * Math.cos(rad + headAngle),
              ey - 6 * Math.sin(rad + headAngle)
            );
            bCtx.stroke();
            bCtx.restore();
          }

          // C. Bounding Box & ML Confidence Tag
          if (showBoxes && p.bbox) {
            const [bx1, by1, bx2, by2] = p.bbox;
            const bw = bx2 - bx1;
            const bh = by2 - by1;

            bCtx.save();
            // Subtle crisp box
            bCtx.strokeStyle = isSelected ? '#FFF6EB' : (isAlpha ? 'rgba(140,18,14,0.75)' : 'rgba(29,78,137,0.75)');
            bCtx.lineWidth = isSelected ? 2 : 1.2;
            bCtx.strokeRect(bx1, by1, bw, bh);

            // Technical Corner Brackets
            const clen = 5;
            bCtx.strokeStyle = accentColor;
            bCtx.lineWidth = 1.8;
            bCtx.beginPath();
            bCtx.moveTo(bx1, by1 + clen);
            bCtx.lineTo(bx1, by1);
            bCtx.lineTo(bx1 + clen, by1);
            bCtx.moveTo(bx2 - clen, by1);
            bCtx.lineTo(bx2, by1);
            bCtx.lineTo(bx2, by1 + clen);
            bCtx.stroke();

            // Tactical badge on top of player
            const label = `${p.tag} ${p.name}`;
            const subLabel = `${p.speed_kmh} km/h`;
            bCtx.font = '800 9px monospace';
            const labelW = Math.max(bCtx.measureText(label).width, bCtx.measureText(subLabel).width) + 10;

            bCtx.fillStyle = isSelected ? '#430504' : teamColor;
            bCtx.fillRect(bx1 - 2, by1 - 22, labelW, 20);
            bCtx.strokeStyle = accentColor;
            bCtx.lineWidth = 1;
            bCtx.strokeRect(bx1 - 2, by1 - 22, labelW, 20);

            bCtx.fillStyle = '#FFF6EB';
            bCtx.textAlign = 'left';
            bCtx.fillText(label, bx1 + 2, by1 - 11);
            bCtx.fillStyle = speedColor;
            bCtx.fillText(subLabel, bx1 + 2, by1 - 3);

            bCtx.restore();
          }
        });

        // D. Ball Trajectory Arc
        if (showBallTrail && frameData.ball) {
          const b = frameData.ball;
          ballHistoryRef.current.push({ x: b.x, y: b.y, time: vTime });
          if (ballHistoryRef.current.length > 25) {
            ballHistoryRef.current.shift();
          }

          bCtx.save();
          // Trail
          if (ballHistoryRef.current.length > 1) {
            bCtx.beginPath();
            bCtx.moveTo(ballHistoryRef.current[0].x, ballHistoryRef.current[0].y);
            for (let i = 1; i < ballHistoryRef.current.length; i++) {
              bCtx.lineTo(ballHistoryRef.current[i].x, ballHistoryRef.current[i].y);
            }
            bCtx.strokeStyle = 'rgba(212, 154, 61, 0.75)';
            bCtx.lineWidth = 2.5;
            bCtx.setLineDash([4, 3]);
            bCtx.stroke();
          }

          // Ball Shadow
          bCtx.fillStyle = 'rgba(0,0,0,0.5)';
          bCtx.beginPath();
          bCtx.ellipse(b.x, b.y + 4, 6, 3, 0, 0, Math.PI * 2);
          bCtx.fill();

          // Ball Body
          bCtx.beginPath();
          bCtx.arc(b.x, b.y, 6.5, 0, Math.PI * 2);
          bCtx.fillStyle = '#FFF6EB';
          bCtx.fill();
          bCtx.strokeStyle = '#222';
          bCtx.lineWidth = 1.5;
          bCtx.stroke();

          // Ball speed tag
          bCtx.fillStyle = '#430504';
          bCtx.fillRect(b.x + 8, b.y - 18, 62, 18);
          bCtx.strokeStyle = '#D49A3D';
          bCtx.lineWidth = 1;
          bCtx.strokeRect(b.x + 8, b.y - 18, 62, 18);
          bCtx.fillStyle = '#FFF6EB';
          bCtx.font = '800 9px monospace';
          bCtx.textAlign = 'left';
          bCtx.fillText(`⚽ ${b.speed_kmh}k`, b.x + 12, b.y - 5);
          bCtx.restore();
        }
      }

      // ========================================================
      // 2. FLOATING 2D TACTICAL RADAR (NO ENCLOSING BOX!)
      // ========================================================
      const rw = rCanvas.width;
      const rh = rCanvas.height;
      rCtx.clearRect(0, 0, rw, rh);

      // Pitch background (Dark tactical felt with subtle vignette)
      rCtx.fillStyle = '#162019';
      rCtx.fillRect(0, 0, rw, rh);

      // Grass stripes on radar
      const rStripes = 10;
      const rsw = rw / rStripes;
      for (let s = 0; s < rStripes; s++) {
        if (s % 2 === 0) {
          rCtx.fillStyle = 'rgba(255, 255, 255, 0.015)';
          rCtx.fillRect(s * rsw, 0, rsw, rh);
        }
      }

      // Metric coordinate mapper
      const padX = 14;
      const padY = 14;
      const pitchW = rw - padX * 2;
      const pitchH = rh - padY * 2;

      const toRadarX = (pmx) => padX + (pmx / 105.0) * pitchW;
      const toRadarY = (pmy) => padY + (pmy / 68.0) * pitchH;

      // Pitch Markings
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.45)';
      rCtx.lineWidth = 1.2;
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

      // Penalty Boxes
      const penBoxW = (16.5 / 105.0) * pitchW;
      const penBoxH = (40.3 / 68.0) * pitchH;
      const penBoxY = padY + (pitchH - penBoxH) / 2;
      rCtx.strokeRect(padX, penBoxY, penBoxW, penBoxH);
      rCtx.strokeRect(rw - padX - penBoxW, penBoxY, penBoxW, penBoxH);

      // Radar Voronoi Pitch Dominance
      if (showRadarVoronoi && frameData && frameData.players) {
        const step = 8;
        const cols = Math.floor(pitchW / step);
        const rows = Math.floor(pitchH / step);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const rx = padX + c * step + step / 2;
            const ry = padY + r * step + step / 2;

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
              rCtx.fillStyle = 'rgba(89, 9, 7, 0.18)';
            } else {
              rCtx.fillStyle = 'rgba(29, 53, 87, 0.18)';
            }
            rCtx.fillRect(padX + c * step, padY + r * step, step, step);
          }
        }
      }

      // Active Radar Sweeper Beam (360° Circular Sweep Animation)
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

      // Sweeper Leading Ray
      rCtx.beginPath();
      rCtx.moveTo(rw / 2, rh / 2);
      rCtx.lineTo(
        rw / 2 + Math.cos(sweepAngle) * sweepRadius,
        rh / 2 + Math.sin(sweepAngle) * sweepRadius
      );
      rCtx.strokeStyle = 'rgba(232, 210, 181, 0.45)';
      rCtx.lineWidth = 1.2;
      rCtx.stroke();
      rCtx.restore();

      // Render players on radar
      if (frameData && frameData.players) {
        frameData.players.forEach(p => {
          const rx = toRadarX(p.pitch_x);
          const ry = toRadarY(p.pitch_y);
          const isSelected = p.id === selectedPlayerId;
          const isAlpha = p.team === 'alpha';

          rCtx.save();
          rCtx.beginPath();
          rCtx.arc(rx, ry, isSelected ? 6 : 4, 0, Math.PI * 2);
          rCtx.fillStyle = isAlpha ? '#590907' : '#1D3557';
          rCtx.fill();
          rCtx.strokeStyle = isSelected ? '#FFF6EB' : (isAlpha ? '#E8D2B5' : '#8ECAE6');
          rCtx.lineWidth = isSelected ? 2.2 : 1;
          rCtx.stroke();

          // Selection radar halo ring
          if (isSelected) {
            rCtx.beginPath();
            rCtx.arc(rx, ry, 10, 0, Math.PI * 2);
            rCtx.strokeStyle = 'rgba(232, 210, 181, 0.7)';
            rCtx.setLineDash([2, 2]);
            rCtx.lineWidth = 1.2;
            rCtx.stroke();
          }

          // Small jersey number
          rCtx.fillStyle = '#FFF6EB';
          rCtx.font = '800 7px sans-serif';
          rCtx.textAlign = 'center';
          rCtx.textBaseline = 'middle';
          rCtx.fillText(p.id.toString(), rx, ry - 8);
          rCtx.restore();
        });

        // Radar Ball
        if (frameData.ball) {
          const rbx = toRadarX(frameData.ball.pitch_x);
          const rby = toRadarY(frameData.ball.pitch_y);
          rCtx.save();
          rCtx.beginPath();
          rCtx.arc(rbx, rby, 3.8, 0, Math.PI * 2);
          rCtx.fillStyle = '#D49A3D';
          rCtx.fill();
          rCtx.strokeStyle = '#FFF6EB';
          rCtx.lineWidth = 1;
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
  }, [getFrameForTime, showBoxes, showRings, showVectors, showBallTrail, showOffside, showRadarVoronoi, showScanner, selectedPlayerId, currentTime, isPlaying, playbackRate, duration]);

  const selectedPlayer = currentFrameData?.players?.find(p => p.id === selectedPlayerId);

  // Top speed ranking in current frame
  const sortedPlayers = currentFrameData?.players 
    ? [...currentFrameData.players].sort((a, b) => b.speed_kmh - a.speed_kmh).slice(0, 6)
    : [];

  return (
    <section id="vision-studio" style={{
      padding: '80px 48px 100px',
      backgroundColor: 'var(--bg-sage)',
      position: 'relative',
      borderBottom: '1px solid rgba(89, 9, 7, 0.15)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* ========================================================
            SECTION HEADER: HIGH CONTRAST, EDITORIAL & SHARP
            ======================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            {/* High-Contrast Category Pill (Sharp 2px radius) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-bg)',
              padding: '5px 12px',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <Activity size={13} color="var(--cream-light)" />
              <span>SYSTEM 01 // AUTONOMOUS VISION WORKBENCH</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 10px 0'
            }}>
              Interactive Vision Studio &amp; Live 2D Radar
            </h2>

            <p style={{
              color: '#380504',
              fontSize: '0.98rem',
              maxWidth: '780px',
              margin: 0,
              opacity: 0.9,
              lineHeight: 1.5
            }}>
              Autonomous multi-camera tracking with sub-millisecond homography projection, real-time bounding boxes, velocity vectors, and synchronous birds-eye pitch state.
            </p>
          </div>

          {/* Floating High-Contrast HUD Specs (Sharp 2px radius) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              backgroundColor: 'var(--cream-light)',
              border: '1.5px solid var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '8px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', letterSpacing: '0.04em' }}>INFERENCE LATENCY</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>14.8 ms</div>
            </div>

            <div style={{
              backgroundColor: 'var(--cream-light)',
              border: '1.5px solid var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '8px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', letterSpacing: '0.04em' }}>THROUGHPUT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>64.9 FPS</div>
            </div>

            <div style={{
              backgroundColor: 'var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--cream-bg)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#2A9D8F',
                boxShadow: '0 0 8px #2A9D8F'
              }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE SYNC</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            MAIN WORKBENCH: BROADCAST SCREEN (LEFT) + FLOATING RADAR HUD (RIGHT)
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(360px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: Broadcast Video / Synthetic Simulation View */}
          <div style={{
            backgroundColor: 'var(--burgundy-deep)',
            borderRadius: '2px', // Sharp architectural radius
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(89, 9, 7, 0.2)',
            border: '1.5px solid rgba(89, 9, 7, 0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Toolbar (High contrast, bright text) */}
            <div style={{
              padding: '10px 18px',
              borderBottom: '1px solid rgba(232, 210, 181, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#430504'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#E63946',
                  boxShadow: '0 0 6px #E63946'
                }} />
                <span style={{
                  color: 'var(--cream-bg)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  {activeSource === 'sample' ? 'BROADCAST TACTICAL FEED (1080P // YOLOv8)' : `CUSTOM FEED: ${customFileName}`}
                </span>
              </div>

              {/* Upload Match Video Button (Sharp 2px radius) */}
              <label style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(232, 210, 181, 0.15)',
                color: 'var(--cream-bg)',
                padding: '5px 12px',
                borderRadius: '2px',
                fontSize: '0.72rem',
                fontWeight: 800,
                border: '1px solid rgba(232, 210, 181, 0.35)',
                transition: 'all 0.15s'
              }}>
                <Upload size={12} color="var(--cream-light)" />
                <span>Load Match Video</span>
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
              backgroundColor: '#16281B',
              overflow: 'hidden'
            }}>
              {/* Optional Custom Video Element */}
              {activeSource === 'custom' && customVideoUrl && (
                <video
                  ref={videoRef}
                  src={customVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                />
              )}

              {/* Real-time Broadcast Telemetry Canvas */}
              <canvas
                ref={broadcastCanvasRef}
                width={1280}
                height={720}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              />

              {/* Top-Right HUD Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '14px',
                backgroundColor: 'rgba(67, 5, 4, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(232, 210, 181, 0.3)',
                borderRadius: '2px',
                padding: '5px 10px',
                color: 'var(--cream-bg)',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Cpu size={12} color="#E8D2B5" />
                <span>YOLOv8x-MOT</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span style={{ color: '#94D2BD' }}>TRACKS: {currentFrameData?.players?.length || 22}</span>
              </div>
            </div>

            {/* Tactical Playback Controls Bar */}
            <div style={{
              padding: '12px 18px',
              backgroundColor: '#430504',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: '1px solid rgba(232, 210, 181, 0.15)'
            }}>
              {/* Timeline Scrubber */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  color: 'var(--cream-light)',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  fontWeight: 800,
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
                  color: 'rgba(232, 210, 181, 0.7)',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  minWidth: '56px',
                  textAlign: 'right'
                }}>
                  00:0{duration.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons & Layer Selectors */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={togglePlay}
                    style={{
                      backgroundColor: 'var(--cream-bg)',
                      color: 'var(--burgundy-deep)',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '6px 14px',
                      fontWeight: 900,
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>

                  <button
                    onClick={() => handleSeek(0)}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.15)',
                      color: 'var(--cream-bg)',
                      border: '1px solid rgba(232, 210, 181, 0.3)',
                      borderRadius: '2px',
                      padding: '6px 10px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={12} />
                    Rewind
                  </button>

                  {/* Playback rate */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '2px',
                    padding: '2px',
                    border: '1px solid rgba(232, 210, 181, 0.2)'
                  }}>
                    {[0.5, 1.0, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        style={{
                          backgroundColor: playbackRate === rate ? 'var(--cream-bg)' : 'transparent',
                          color: playbackRate === rate ? 'var(--burgundy-deep)' : 'var(--cream-bg)',
                          border: 'none',
                          borderRadius: '2px',
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer Toggles (Sharp 2px radius) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { label: 'BBoxes', state: showBoxes, setter: setShowBoxes },
                    { label: 'Speed Rings', state: showRings, setter: setShowRings },
                    { label: 'Heading', state: showVectors, setter: setShowVectors },
                    { label: 'Offside Line', state: showOffside, setter: setShowOffside },
                    { label: 'CV Scan', state: showScanner, setter: setShowScanner }
                  ].map(layer => (
                    <button
                      key={layer.label}
                      onClick={() => layer.setter(!layer.state)}
                      style={{
                        backgroundColor: layer.state ? 'rgba(232, 210, 181, 0.22)' : 'transparent',
                        color: layer.state ? 'var(--cream-light)' : 'rgba(232, 210, 181, 0.55)',
                        border: `1px solid ${layer.state ? 'rgba(232, 210, 181, 0.6)' : 'rgba(232, 210, 181, 0.18)'}`,
                        borderRadius: '2px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
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

          {/* ========================================================
              RIGHT: FLOATING TACTICAL RADAR STUDIO (NOT INSIDE A BOX!)
              - Floating directly on the sage canvas
              - 360° rotating radar sweep line
              - Floating tactical stat chips & telemetry capsule
              ======================================================== */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* Floating Radar Header Strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 2px'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--burgundy-deep)',
                  letterSpacing: '0.08em'
                }}>
                  <Radio size={12} color="var(--burgundy-deep)" />
                  LIVE PLANAR RADAR (105m &times; 68m)
                </div>
              </div>

              {/* Voronoi Dominance Pill */}
              <button
                onClick={() => setShowRadarVoronoi(!showRadarVoronoi)}
                style={{
                  backgroundColor: showRadarVoronoi ? 'var(--burgundy-deep)' : 'transparent',
                  color: showRadarVoronoi ? 'var(--cream-bg)' : 'var(--burgundy-deep)',
                  border: '1.5px solid var(--burgundy-deep)',
                  borderRadius: '2px',
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.04em'
                }}
              >
                {showRadarVoronoi ? 'VORONOI: ACTIVE' : 'VORONOI: OFF'}
              </button>
            </div>

            {/* Floating Radar Canvas (Sharp 2px border, No outer box container!) */}
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
                style={{
                  width: '100%',
                  aspectRatio: '360/234',
                  display: 'block'
                }}
              />

              {/* Floating Radar Legend Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '10px',
                right: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: 'var(--cream-light)',
                fontWeight: 800,
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                padding: '4px 8px',
                borderRadius: '2px',
                border: '1px solid rgba(232, 210, 181, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#590907', border: '1px solid #E8D2B5' }} />
                  <span>Alpha (Red)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#1D3557', border: '1px solid #8ECAE6' }} />
                  <span>Beta (Blue)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D49A3D', border: '1px solid #FFF' }} />
                  <span>Ball</span>
                </div>
              </div>
            </div>

            {/* Floating Possession Strip (No card wrapper!) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '2px 0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                fontWeight: 900,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.04em'
              }}>
                <span>TEAM ALPHA {currentFrameData?.possession?.alpha || 54.0}%</span>
                <span style={{ opacity: 0.6, fontSize: '0.68rem' }}>POSSESSION RATIO</span>
                <span>TEAM BETA {currentFrameData?.possession?.beta || 46.0}%</span>
              </div>

              {/* Animated split bar with sharp 2px radius */}
              <div style={{
                width: '100%',
                height: '7px',
                borderRadius: '2px',
                backgroundColor: '#1D3557',
                overflow: 'hidden',
                display: 'flex',
                border: '1px solid rgba(89, 9, 7, 0.25)'
              }}>
                <div style={{
                  width: `${currentFrameData?.possession?.alpha || 54}%`,
                  height: '100%',
                  backgroundColor: 'var(--burgundy-deep)',
                  transition: 'width 0.2s ease'
                }} />
              </div>
            </div>

            {/* Floating Inspected Target Capsule (Sharp 2px radius, translucent, no heavy box) */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '12px 16px',
              boxShadow: '0 4px 14px rgba(89, 9, 7, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: 'var(--burgundy-deep)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  TARGET KINEMATICS
                </div>

                {selectedPlayer && (
                  <span style={{
                    backgroundColor: selectedPlayer.team === 'alpha' ? 'var(--burgundy-deep)' : '#1D3557',
                    color: '#FFF6EB',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}>
                    {selectedPlayer.tag} &bull; {selectedPlayer.role}
                  </span>
                )}
              </div>

              {selectedPlayer ? (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '8px'
                  }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--burgundy-deep)', fontWeight: 900 }}>
                      {selectedPlayer.name}
                    </strong>
                    <span style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: '#E63946',
                      fontFamily: 'monospace'
                    }}>
                      {selectedPlayer.speed_kmh} <span style={{ fontSize: '0.7rem' }}>km/h</span>
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(89, 9, 7, 0.06)',
                      padding: '6px',
                      borderRadius: '2px'
                    }}>
                      <div style={{ fontSize: '0.62rem', color: '#555', fontWeight: 800 }}>PITCH METRIC</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>
                        ({selectedPlayer.pitch_x}m, {selectedPlayer.pitch_y}m)
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(89, 9, 7, 0.06)',
                      padding: '6px',
                      borderRadius: '2px'
                    }}>
                      <div style={{ fontSize: '0.62rem', color: '#555', fontWeight: 800 }}>HEADING ANGLE</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>
                        {selectedPlayer.heading_deg}&deg;
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#666', fontSize: '0.76rem', textAlign: 'center', padding: '10px' }}>
                  Click any player in leaderboard below to track
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================
            BOTTOM: INSTANT SPRINT LEADERBOARD (SHARP 2PX RADIUS)
            ======================================================== */}
        <div style={{
          marginTop: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(6px)',
          borderRadius: '2px', // Sharp radius
          border: '1.5px solid var(--burgundy-deep)',
          padding: '16px 20px',
          boxShadow: '0 4px 14px rgba(89, 9, 7, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={15} color="var(--burgundy-deep)" />
              <h3 style={{
                margin: 0,
                fontSize: '0.92rem',
                fontWeight: 900,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}>
                Instant Physical Telemetry Leaderboard (Top Sprints at 00:{currentTime.toFixed(2)})
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--burgundy-deep)', opacity: 0.8, fontWeight: 800 }}>
              Click any card to pin target tracking spotlight
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
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
                    border: `1.5px solid ${isSelected ? 'var(--burgundy-deep)' : 'rgba(89, 9, 7, 0.2)'}`,
                    borderRadius: '2px', // Sharp 2px radius
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      opacity: isSelected ? 0.9 : 0.65
                    }}>
                      {player.tag} &bull; {player.role}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor: isAlpha ? 'rgba(89, 9, 7, 0.12)' : 'rgba(29, 53, 87, 0.12)',
                      color: isSelected ? 'var(--cream-light)' : (isAlpha ? '#590907' : '#1D3557'),
                      padding: '1px 5px',
                      borderRadius: '2px'
                    }}>
                      {isAlpha ? 'Alpha' : 'Beta'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '4px' }}>
                    {player.name}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.68rem', opacity: isSelected ? 0.8 : 0.6 }}>Velocity</span>
                    <span style={{
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      color: isSelected ? '#E8D2B5' : '#E63946',
                      fontFamily: 'monospace'
                    }}>
                      {player.speed_kmh} <span style={{ fontSize: '0.68rem' }}>km/h</span>
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
