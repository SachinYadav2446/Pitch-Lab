import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Download, Eye, Layers, Zap, 
  Share2, ChevronRight, CheckCircle2, Sliders, Shield, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveStudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showRings, setShowRings] = useState(true);
  const [showSpeedTags, setShowSpeedTags] = useState(true);
  const [showBallTrail, setShowBallTrail] = useState(true);
  const [showVoronoi, setShowVoronoi] = useState(false);
  const [activeTab, setActiveTab] = useState('speeds');

  // Telemetry state
  const [frameNum, setFrameNum] = useState(0);
  const [possession, setPossession] = useState({ alpha: 53.5, beta: 46.5 });
  const [peakSpeed, setPeakSpeed] = useState(33.2);

  // Canvases
  const broadcastCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);

  // Dynamic player telemetry records
  const [playerRecords, setPlayerRecords] = useState([
    { id: 7, name: 'K. Mbappé', team: 'Alpha', topSpeed: 34.8, distance: 342.1, currentSpeed: 28.4 },
    { id: 9, name: 'E. Haaland', team: 'Alpha', topSpeed: 33.6, distance: 312.4, currentSpeed: 24.2 },
    { id: 10, name: 'L. Messi', team: 'Beta', topSpeed: 31.8, distance: 298.5, currentSpeed: 21.6 },
    { id: 8, name: 'K. De Bruyne', team: 'Beta', topSpeed: 32.1, distance: 384.2, currentSpeed: 26.5 },
    { id: 4, name: 'V. van Dijk', team: 'Alpha', topSpeed: 30.5, distance: 264.0, currentSpeed: 17.1 },
    { id: 18, name: 'J. Bellingham', team: 'Beta', topSpeed: 32.7, distance: 395.0, currentSpeed: 27.8 },
  ]);

  useEffect(() => {
    const bCanvas = broadcastCanvasRef.current;
    const rCanvas = radarCanvasRef.current;
    if (!bCanvas || !rCanvas) return;

    const bCtx = bCanvas.getContext('2d');
    const rCtx = rCanvas.getContext('2d');
    let animId;

    const bw = bCanvas.width;
    const bh = bCanvas.height;
    const rw = rCanvas.width;
    const rh = rCanvas.height;

    // Standard simulated squads
    const squadAlpha = [
      { id: 1, x: bw * 0.15, y: bh * 0.5, vx: 0.1, vy: 0.2, speed: 14.2 },
      { id: 4, x: bw * 0.30, y: bh * 0.3, vx: 0.4, vy: -0.3, speed: 22.1 },
      { id: 5, x: bw * 0.28, y: bh * 0.7, vx: 0.3, vy: 0.2, speed: 20.4 },
      { id: 8, x: bw * 0.45, y: bh * 0.45, vx: 0.5, vy: 0.1, speed: 28.5 },
      { id: 7, x: bw * 0.62, y: bh * 0.32, vx: 0.7, vy: 0.4, speed: 33.2 },
      { id: 9, x: bw * 0.65, y: bh * 0.68, vx: 0.4, vy: -0.2, speed: 31.0 }
    ];

    const squadBeta = [
      { id: 21, x: bw * 0.85, y: bh * 0.5, vx: -0.1, vy: -0.2, speed: 13.8 },
      { id: 14, x: bw * 0.70, y: bh * 0.28, vx: -0.4, vy: 0.3, speed: 23.5 },
      { id: 15, x: bw * 0.72, y: bh * 0.72, vx: -0.3, vy: -0.2, speed: 22.0 },
      { id: 18, x: bw * 0.55, y: bh * 0.48, vx: -0.6, vy: 0.2, speed: 29.4 },
      { id: 10, x: bw * 0.42, y: bh * 0.35, vx: -0.5, vy: -0.3, speed: 27.8 },
      { id: 11, x: bw * 0.38, y: bh * 0.65, vx: -0.4, vy: 0.2, speed: 26.2 }
    ];

    let ball = { x: bw * 0.52, y: bh * 0.45, vx: 1.8, vy: 0.9 };
    let ballTrail = [];

    function renderLoop() {
      if (isPlaying) {
        setFrameNum(f => f + 1);
      }

      // --- 1. RENDER BROADCAST CAMERA CANVAS ---
      // Lush match pitch
      bCtx.fillStyle = '#265935';
      bCtx.fillRect(0, 0, bw, bh);

      // Grass stripes
      const stripes = 8;
      const sw = bw / stripes;
      for (let i = 0; i < stripes; i++) {
        bCtx.fillStyle = i % 2 === 0 ? '#22502F' : '#265935';
        bCtx.fillRect(i * sw, 0, sw, bh);
      }

      // White markings
      bCtx.strokeStyle = 'rgba(240, 248, 242, 0.7)';
      bCtx.lineWidth = 2;
      bCtx.strokeRect(30, 25, bw - 60, bh - 50);
      bCtx.beginPath();
      bCtx.moveTo(bw / 2, 25);
      bCtx.lineTo(bw / 2, bh - 25);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.arc(bw / 2, bh / 2, 70, 0, Math.PI * 2);
      bCtx.stroke();

      // Penalty areas
      bCtx.strokeRect(30, (bh - 180) / 2, 100, 180);
      bCtx.strokeRect(bw - 130, (bh - 180) / 2, 100, 180);

      // Update positions
      if (isPlaying) {
        squadAlpha.forEach(p => {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;
          if (p.x < 50 || p.x > bw - 50) p.vx *= -1;
          if (p.y < 40 || p.y > bh - 40) p.vy *= -1;
        });

        squadBeta.forEach(p => {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;
          if (p.x < 50 || p.x > bw - 50) p.vx *= -1;
          if (p.y < 40 || p.y > bh - 40) p.vy *= -1;
        });

        ball.x += ball.vx * speedMultiplier;
        ball.y += ball.vy * speedMultiplier;
        if (ball.x < 40 || ball.x > bw - 40) ball.vx *= -0.95;
        if (ball.y < 35 || ball.y > bh - 35) ball.vy *= -0.95;

        ballTrail.push({ x: ball.x, y: ball.y });
        if (ballTrail.length > 18) ballTrail.shift();
      }

      // Draw Ball Trail
      if (showBallTrail && ballTrail.length > 1) {
        bCtx.beginPath();
        bCtx.moveTo(ballTrail[0].x, ballTrail[0].y);
        for (let i = 1; i < ballTrail.length; i++) {
          bCtx.lineTo(ballTrail[i].x, ballTrail[i].y);
        }
        bCtx.strokeStyle = 'rgba(255, 225, 0, 0.4)';
        bCtx.lineWidth = 3;
        bCtx.stroke();
      }

      // Draw Ball
      bCtx.beginPath();
      bCtx.arc(ball.x, ball.y, 7, 0, Math.PI * 2);
      bCtx.fillStyle = '#FFEE00';
      bCtx.fill();
      bCtx.strokeStyle = '#222222';
      bCtx.lineWidth = 1.5;
      bCtx.stroke();

      // Inverted pointer over ball
      bCtx.beginPath();
      bCtx.moveTo(ball.x, ball.y - 12);
      bCtx.lineTo(ball.x - 6, ball.y - 20);
      bCtx.lineTo(ball.x + 6, ball.y - 20);
      bCtx.closePath();
      bCtx.fillStyle = '#FFEE00';
      bCtx.fill();
      bCtx.stroke();

      // Draw Players on Broadcast Canvas
      const drawPlayerBroadcast = (p, isAlpha) => {
        const teamColor = isAlpha ? '#D64933' : '#308A5B';
        const teamTextColor = '#FAF7F2';

        // 1. Tactical Ground Ring / Ellipse under feet
        if (showRings) {
          bCtx.save();
          bCtx.beginPath();
          bCtx.ellipse(p.x, p.y + 18, 18, 7, 0, 0, Math.PI * 2);
          bCtx.strokeStyle = teamColor;
          bCtx.lineWidth = 2.5;
          bCtx.stroke();
          bCtx.restore();
        }

        // 2. Player Body representation
        // Upper Jersey
        bCtx.fillStyle = teamColor;
        bCtx.fillRect(p.x - 10, p.y - 20, 20, 22);
        // Shorts
        bCtx.fillStyle = isAlpha ? '#FAF7F2' : '#222222';
        bCtx.fillRect(p.x - 9, p.y + 2, 18, 14);
        // Head
        bCtx.beginPath();
        bCtx.arc(p.x, p.y - 27, 8, 0, Math.PI * 2);
        bCtx.fillStyle = '#F5D0A9';
        bCtx.fill();

        // 3. Speed Tag HUD
        if (showSpeedTags) {
          const tagText = `#${p.id} ${p.speed}km/h`;
          bCtx.font = 'bold 10px "Space Grotesk", sans-serif';
          const tw = bCtx.measureText(tagText).width;
          
          bCtx.fillStyle = 'rgba(28, 20, 16, 0.88)';
          bCtx.fillRect(p.x - tw / 2 - 5, p.y + 28, tw + 10, 16);
          bCtx.strokeStyle = teamColor;
          bCtx.lineWidth = 1;
          bCtx.strokeRect(p.x - tw / 2 - 5, p.y + 28, tw + 10, 16);

          bCtx.fillStyle = '#FAF7F2';
          bCtx.textAlign = 'center';
          bCtx.fillText(tagText, p.x, p.y + 40);
        }
      };

      squadAlpha.forEach(p => drawPlayerBroadcast(p, true));
      squadBeta.forEach(p => drawPlayerBroadcast(p, false));

      // --- 2. RENDER 2D PITCH RADAR (TOP-DOWN) ---
      rCtx.fillStyle = '#1D3B26';
      rCtx.fillRect(0, 0, rw, rh);

      // Radar pitch lines
      rCtx.strokeStyle = 'rgba(235, 245, 238, 0.7)';
      rCtx.lineWidth = 1.2;
      rCtx.strokeRect(12, 12, rw - 24, rh - 24);
      rCtx.beginPath();
      rCtx.moveTo(rw / 2, 12);
      rCtx.lineTo(rw / 2, rh - 12);
      rCtx.stroke();
      rCtx.beginPath();
      rCtx.arc(rw / 2, rh / 2, 38, 0, Math.PI * 2);
      rCtx.stroke();

      // Scaled coordinates from Broadcast view -> Radar view
      const scaleX = (rw - 24) / bw;
      const scaleY = (rh - 24) / bh;

      // Draw players on radar
      const drawPlayerRadar = (p, isAlpha) => {
        const rx = 12 + p.x * scaleX;
        const ry = 12 + p.y * scaleY;
        const color = isAlpha ? '#D64933' : '#308A5B';

        rCtx.beginPath();
        rCtx.arc(rx, ry, 6, 0, Math.PI * 2);
        rCtx.fillStyle = color;
        rCtx.fill();
        rCtx.strokeStyle = '#FFFFFF';
        rCtx.lineWidth = 1.2;
        rCtx.stroke();

        rCtx.fillStyle = '#FFFFFF';
        rCtx.font = '8px "Space Grotesk", sans-serif';
        rCtx.textAlign = 'center';
        rCtx.fillText(p.id, rx, ry + 2.5);
      };

      squadAlpha.forEach(p => drawPlayerRadar(p, true));
      squadBeta.forEach(p => drawPlayerRadar(p, false));

      // Ball on radar
      const rbx = 12 + ball.x * scaleX;
      const rby = 12 + ball.y * scaleY;
      rCtx.beginPath();
      rCtx.arc(rbx, rby, 4.5, 0, Math.PI * 2);
      rCtx.fillStyle = '#FFEE00';
      rCtx.fill();
      rCtx.strokeStyle = '#000000';
      rCtx.lineWidth = 1;
      rCtx.stroke();

      animId = requestAnimationFrame(renderLoop);
    }

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier, showRings, showSpeedTags, showBallTrail, showVoronoi]);

  const handleExportCSV = () => {
    let csv = "Player ID,Player Name,Team,Peak Speed (km/h),Cumulative Distance (m),Current Speed (km/h)\n";
    playerRecords.forEach(p => {
      csv += `${p.id},${p.name},${p.team},${p.topSpeed},${p.distance},${p.currentSpeed}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitchlab_match_telemetry_frame_${frameNum}.csv`;
    a.click();
  };

  return (
    <section id="studio" style={{
      maxWidth: '1360px',
      margin: '40px auto 80px auto',
      padding: '0 24px'
    }}>
      {/* Studio Header Card */}
      <div className="card-luxury" style={{
        padding: '24px 30px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-green">Interactive Analytics Engine</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Frame #{frameNum}</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-espresso)', margin: 0 }}>
            Live Match Telemetry & 2D Radar Studio
          </h2>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary"
            style={{ padding: '9px 18px' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="#FAF7F2" />}
            {isPlaying ? 'Pause Feed' : 'Resume Telemetry'}
          </button>

          <button 
            onClick={() => setSpeedMultiplier(s => s === 1 ? 2 : 1)}
            className="btn-secondary"
            style={{ padding: '9px 16px', fontSize: '0.88rem' }}
          >
            <Sliders size={15} />
            {speedMultiplier}x Speed
          </button>

          <button 
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Dual Viewport */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.75fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Left: Broadcast Camera View with Overlays */}
        <div className="card-luxury" style={{ padding: '18px', background: '#FFFFFF' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="var(--forest-green)" />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>
                BROADCAST CAMERA DETECTION & TRACKING
              </span>
            </div>
            
            {/* Overlay Toggles */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
              <button 
                onClick={() => setShowRings(!showRings)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showRings ? 'var(--forest-light)' : 'transparent',
                  color: showRings ? 'var(--forest-green)' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Ground Rings
              </button>
              <button 
                onClick={() => setShowSpeedTags(!showSpeedTags)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showSpeedTags ? 'var(--forest-light)' : 'transparent',
                  color: showSpeedTags ? 'var(--forest-green)' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Speed Tags
              </button>
              <button 
                onClick={() => setShowBallTrail(!showBallTrail)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showBallTrail ? 'var(--forest-light)' : 'transparent',
                  color: showBallTrail ? 'var(--forest-green)' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Ball Trajectory
              </button>
            </div>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <canvas 
              ref={broadcastCanvasRef} 
              width={760} 
              height={440} 
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Right: 2D Pitch Radar Minimap */}
        <div className="card-luxury" style={{ padding: '18px', background: '#FFFFFF' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--forest-green)" />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>
                2D TACTICAL PITCH RADAR
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              105m × 68m METRIC
            </span>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            <canvas 
              ref={radarCanvasRef} 
              width={460} 
              height={300} 
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>

          {/* Possession Bar */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            borderRadius: '10px',
            padding: '14px 16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'Space Grotesk',
              marginBottom: '8px'
            }}>
              <span style={{ color: '#D64933' }}>TEAM ALPHA: {possession.alpha}%</span>
              <span style={{ color: '#308A5B' }}>TEAM BETA: {possession.beta}%</span>
            </div>
            
            <div style={{
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              background: '#D64933'
            }}>
              <div style={{ width: `${possession.alpha}%`, background: '#D64933' }}></div>
              <div style={{ width: `${possession.beta}%`, background: '#308A5B' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Tabs & Leaderboards */}
      <div className="card-luxury" style={{ padding: '24px 30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setActiveTab('speeds')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'speeds' ? '3px solid var(--forest-green)' : '3px solid transparent',
                color: activeTab === 'speeds' ? 'var(--forest-green)' : 'var(--text-brown)',
                fontWeight: 700,
                fontSize: '0.98rem',
                paddingBottom: '10px',
                cursor: 'pointer'
              }}
            >
              ⚡ Sprint Velocity Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab('distance')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'distance' ? '3px solid var(--forest-green)' : '3px solid transparent',
                color: activeTab === 'distance' ? 'var(--forest-green)' : 'var(--text-brown)',
                fontWeight: 700,
                fontSize: '0.98rem',
                paddingBottom: '10px',
                cursor: 'pointer'
              }}
            >
              🏃 Distance & Work-Rate (Meters)
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time metric telemetry updated at 60Hz
          </div>
        </div>

        {/* Tab Content: Speeds */}
        {activeTab === 'speeds' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {playerRecords.map((p, idx) => (
              <div key={p.id} style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-espresso)' }}>
                    #{p.id} {p.name}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: p.team === 'Alpha' ? 'var(--terracotta-light)' : 'var(--forest-light)',
                    color: p.team === 'Alpha' ? 'var(--terracotta)' : 'var(--forest-green)'
                  }}>
                    {p.team}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Space Grotesk' }}>
                    {p.topSpeed}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>km/h peak</span>
                </div>

                {/* Progress bar of speed */}
                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.topSpeed / 36) * 100}%`,
                    height: '100%',
                    background: p.team === 'Alpha' ? 'var(--terracotta)' : 'var(--forest-green)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Distance */}
        {activeTab === 'distance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {playerRecords.map((p, idx) => (
              <div key={p.id} style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-espresso)' }}>
                    #{p.id} {p.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Work-rate: High</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-espresso)', fontFamily: 'Space Grotesk' }}>
                    {p.distance}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>meters run</span>
                </div>

                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.distance / 500) * 100}%`,
                    height: '100%',
                    background: 'var(--forest-green)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
