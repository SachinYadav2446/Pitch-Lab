import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Download, Eye, Layers, Sliders
} from 'lucide-react';

export default function LiveStudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showRings, setShowRings] = useState(true);
  const [showSpeedTags, setShowSpeedTags] = useState(true);
  const [showBallTrail, setShowBallTrail] = useState(true);
  const [activeTab, setActiveTab] = useState('speeds');

  const [frameNum, setFrameNum] = useState(0);
  const [possession, setPossession] = useState({ alpha: 54.2, beta: 45.8 });

  const broadcastCanvasRef = useRef(null);
  const radarCanvasRef = useRef(null);

  const [playerRecords] = useState([
    { id: 7, name: 'K. Mbappé', team: 'Team Orange', topSpeed: 34.8, distance: 342.1, currentSpeed: 28.4 },
    { id: 9, name: 'E. Haaland', team: 'Team Orange', topSpeed: 33.6, distance: 312.4, currentSpeed: 24.2 },
    { id: 10, name: 'L. Messi', team: 'Team White', topSpeed: 31.8, distance: 298.5, currentSpeed: 21.6 },
    { id: 8, name: 'K. De Bruyne', team: 'Team White', topSpeed: 32.1, distance: 384.2, currentSpeed: 26.5 },
    { id: 4, name: 'V. van Dijk', team: 'Team Orange', topSpeed: 30.5, distance: 264.0, currentSpeed: 17.1 },
    { id: 18, name: 'J. Bellingham', team: 'Team White', topSpeed: 32.7, distance: 395.0, currentSpeed: 27.8 },
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

    const squadAlpha = [
      { id: 1, x: bw * 0.15, y: bh * 0.5, vx: 0.1, vy: 0.2, speed: 18.2 },
      { id: 4, x: bw * 0.30, y: bh * 0.3, vx: 0.4, vy: -0.3, speed: 22.4 },
      { id: 5, x: bw * 0.28, y: bh * 0.7, vx: 0.3, vy: 0.2, speed: 21.1 },
      { id: 8, x: bw * 0.45, y: bh * 0.45, vx: 0.5, vy: 0.1, speed: 28.6 },
      { id: 7, x: bw * 0.62, y: bh * 0.32, vx: 0.7, vy: 0.4, speed: 34.8 },
      { id: 9, x: bw * 0.65, y: bh * 0.68, vx: 0.4, vy: -0.2, speed: 31.0 }
    ];

    const squadBeta = [
      { id: 21, x: bw * 0.85, y: bh * 0.5, vx: -0.1, vy: -0.2, speed: 17.5 },
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

      // 1. BROADCAST CANVAS
      bCtx.fillStyle = '#0E1712';
      bCtx.fillRect(0, 0, bw, bh);

      const stripes = 8;
      const sw = bw / stripes;
      for (let i = 0; i < stripes; i++) {
        bCtx.fillStyle = i % 2 === 0 ? '#0B130E' : '#0E1712';
        bCtx.fillRect(i * sw, 0, sw, bh);
      }

      bCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      bCtx.lineWidth = 2;
      bCtx.strokeRect(30, 25, bw - 60, bh - 50);
      bCtx.beginPath();
      bCtx.moveTo(bw / 2, 25);
      bCtx.lineTo(bw / 2, bh - 25);
      bCtx.stroke();
      bCtx.beginPath();
      bCtx.arc(bw / 2, bh / 2, 70, 0, Math.PI * 2);
      bCtx.stroke();

      bCtx.strokeRect(30, (bh - 180) / 2, 100, 180);
      bCtx.strokeRect(bw - 130, (bh - 180) / 2, 100, 180);

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

      if (showBallTrail && ballTrail.length > 1) {
        bCtx.beginPath();
        bCtx.moveTo(ballTrail[0].x, ballTrail[0].y);
        for (let i = 1; i < ballTrail.length; i++) {
          bCtx.lineTo(ballTrail[i].x, ballTrail[i].y);
        }
        bCtx.strokeStyle = 'rgba(255, 126, 0, 0.4)';
        bCtx.lineWidth = 3;
        bCtx.stroke();
      }

      bCtx.beginPath();
      bCtx.arc(ball.x, ball.y, 7, 0, Math.PI * 2);
      bCtx.fillStyle = '#FF7E00';
      bCtx.fill();
      bCtx.strokeStyle = '#FFFFFF';
      bCtx.lineWidth = 1.5;
      bCtx.stroke();

      bCtx.beginPath();
      bCtx.moveTo(ball.x, ball.y - 12);
      bCtx.lineTo(ball.x - 6, ball.y - 20);
      bCtx.lineTo(ball.x + 6, ball.y - 20);
      bCtx.closePath();
      bCtx.fillStyle = '#FF7E00';
      bCtx.fill();
      bCtx.stroke();

      const drawPlayerBroadcast = (p, isAlpha) => {
        const teamColor = isAlpha ? '#FF7E00' : '#FFFFFF';

        if (showRings) {
          bCtx.save();
          bCtx.beginPath();
          bCtx.ellipse(p.x, p.y + 18, 18, 7, 0, 0, Math.PI * 2);
          bCtx.strokeStyle = teamColor;
          bCtx.lineWidth = 2.5;
          bCtx.stroke();
          bCtx.restore();
        }

        bCtx.fillStyle = teamColor;
        bCtx.fillRect(p.x - 10, p.y - 20, 20, 22);
        bCtx.fillStyle = isAlpha ? '#FFFFFF' : '#0F172A';
        bCtx.fillRect(p.x - 9, p.y + 2, 18, 14);
        bCtx.beginPath();
        bCtx.arc(p.x, p.y - 27, 8, 0, Math.PI * 2);
        bCtx.fillStyle = '#F5D0A9';
        bCtx.fill();

        if (showSpeedTags) {
          const tagText = `#${p.id} ${p.speed}km/h`;
          bCtx.font = 'bold 10px "Space Grotesk", sans-serif';
          const tw = bCtx.measureText(tagText).width;
          
          bCtx.fillStyle = 'rgba(8, 11, 16, 0.92)';
          bCtx.fillRect(p.x - tw / 2 - 5, p.y + 28, tw + 10, 16);
          bCtx.strokeStyle = teamColor;
          bCtx.lineWidth = 1;
          bCtx.strokeRect(p.x - tw / 2 - 5, p.y + 28, tw + 10, 16);

          bCtx.fillStyle = '#FFFFFF';
          bCtx.textAlign = 'center';
          bCtx.fillText(tagText, p.x, p.y + 40);
        }
      };

      squadAlpha.forEach(p => drawPlayerBroadcast(p, true));
      squadBeta.forEach(p => drawPlayerBroadcast(p, false));

      // 2. RADAR VIEW
      rCtx.fillStyle = '#08120B';
      rCtx.fillRect(0, 0, rw, rh);

      rCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      rCtx.lineWidth = 1.2;
      rCtx.strokeRect(12, 12, rw - 24, rh - 24);
      rCtx.beginPath();
      rCtx.moveTo(rw / 2, 12);
      rCtx.lineTo(rw / 2, rh - 12);
      rCtx.stroke();
      rCtx.beginPath();
      rCtx.arc(rw / 2, rh / 2, 38, 0, Math.PI * 2);
      rCtx.stroke();

      const scaleX = (rw - 24) / bw;
      const scaleY = (rh - 24) / bh;

      const drawPlayerRadar = (p, isAlpha) => {
        const rx = 12 + p.x * scaleX;
        const ry = 12 + p.y * scaleY;
        const color = isAlpha ? '#FF7E00' : '#FFFFFF';

        rCtx.beginPath();
        rCtx.arc(rx, ry, 6, 0, Math.PI * 2);
        rCtx.fillStyle = color;
        rCtx.fill();
        rCtx.strokeStyle = isAlpha ? '#FFFFFF' : '#0F172A';
        rCtx.lineWidth = 1.2;
        rCtx.stroke();

        rCtx.fillStyle = isAlpha ? '#FFFFFF' : '#0F172A';
        rCtx.font = 'bold 8px "Space Grotesk", sans-serif';
        rCtx.textAlign = 'center';
        rCtx.fillText(p.id, rx, ry + 2.5);
      };

      squadAlpha.forEach(p => drawPlayerRadar(p, true));
      squadBeta.forEach(p => drawPlayerRadar(p, false));

      const rbx = 12 + ball.x * scaleX;
      const rby = 12 + ball.y * scaleY;
      rCtx.beginPath();
      rCtx.arc(rbx, rby, 4.5, 0, Math.PI * 2);
      rCtx.fillStyle = '#FF7E00';
      rCtx.fill();
      rCtx.strokeStyle = '#FFFFFF';
      rCtx.lineWidth = 1;
      rCtx.stroke();

      animId = requestAnimationFrame(renderLoop);
    }

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier, showRings, showSpeedTags, showBallTrail]);

  const handleExportCSV = () => {
    let csv = "Player ID,Player Name,Club,Peak Speed (km/h),Cumulative Distance (m),Current Speed (km/h)\n";
    playerRecords.forEach(p => {
      csv += `${p.id},${p.name},${p.team},${p.topSpeed},${p.distance},${p.currentSpeed}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sportanalytics_telemetry_frame_${frameNum}.csv`;
    a.click();
  };

  return (
    <section id="studio" style={{
      maxWidth: '1360px',
      margin: '60px auto 100px auto',
      padding: '0 48px'
    }}>
      <div className="card-luxury" style={{
        padding: '28px 36px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid var(--orange-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge-orange">Interactive Optical Studio</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Frame #{frameNum}</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
            Live Match Telemetry & 2D Tactical Radar
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary"
            style={{ padding: '10px 22px' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="#FFFFFF" />}
            {isPlaying ? 'Pause Tracking' : 'Resume Telemetry'}
          </button>

          <button 
            onClick={() => setSpeedMultiplier(s => s === 1 ? 2 : 1)}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Sliders size={16} />
            {speedMultiplier}x Playback
          </button>

          <button 
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.9rem', borderColor: 'var(--orange-border)', color: 'var(--orange-primary)' }}
          >
            <Download size={16} />
            Export Telemetry CSV
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.75fr',
        gap: '28px',
        marginBottom: '28px'
      }}>
        {/* Left: Broadcast Camera View with Overlays */}
        <div className="card-luxury" style={{ padding: '22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="var(--orange-primary)" />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
                BROADCAST CAMERA DETECTION & TRACKING
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
              <button 
                onClick={() => setShowRings(!showRings)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showRings ? 'var(--orange-subtle)' : 'transparent',
                  color: showRings ? 'var(--orange-primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Ground Rings
              </button>
              <button 
                onClick={() => setShowSpeedTags(!showSpeedTags)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showSpeedTags ? 'var(--orange-subtle)' : 'transparent',
                  color: showSpeedTags ? 'var(--orange-primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Velocity Badges
              </button>
              <button 
                onClick={() => setShowBallTrail(!showBallTrail)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: showBallTrail ? 'var(--orange-subtle)' : 'transparent',
                  color: showBallTrail ? 'var(--orange-primary)' : 'var(--text-muted)',
                  fontWeight: 700,
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
        <div className="card-luxury" style={{ padding: '22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="var(--orange-primary)" />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
                2D TACTICAL PITCH RADAR
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              105m × 68m METRIC PLANE
            </span>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <canvas 
              ref={radarCanvasRef} 
              width={460} 
              height={300} 
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>

          {/* Possession Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              fontFamily: 'Space Grotesk',
              marginBottom: '10px'
            }}>
              <span style={{ color: 'var(--orange-primary)' }}>TEAM ORANGE: {possession.alpha}%</span>
              <span style={{ color: '#FFFFFF' }}>TEAM WHITE: {possession.beta}%</span>
            </div>
            
            <div style={{
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ width: `${possession.alpha}%`, background: 'var(--orange-primary)' }}></div>
              <div style={{ width: `${possession.beta}%`, background: '#FFFFFF' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Tabs & Leaderboards */}
      <div className="card-luxury" style={{ padding: '30px 36px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <button 
              onClick={() => setActiveTab('speeds')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'speeds' ? '3px solid var(--orange-primary)' : '3px solid transparent',
                color: activeTab === 'speeds' ? 'var(--orange-primary)' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '1.02rem',
                fontFamily: 'Space Grotesk',
                paddingBottom: '12px',
                cursor: 'pointer'
              }}
            >
              ⚡ Peak Sprint Velocity Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab('distance')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'distance' ? '3px solid var(--orange-primary)' : '3px solid transparent',
                color: activeTab === 'distance' ? 'var(--orange-primary)' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '1.02rem',
                fontFamily: 'Space Grotesk',
                paddingBottom: '12px',
                cursor: 'pointer'
              }}
            >
              🏃 Cumulative Distance & High-Speed Running (Meters)
            </button>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Real-time optical telemetry updated at 120Hz
          </div>
        </div>

        {activeTab === 'speeds' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {playerRecords.map((p) => (
              <div key={p.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                    #{p.id} {p.name}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '10px',
                    background: p.team === 'Team Orange' ? 'var(--orange-subtle)' : 'rgba(255, 255, 255, 0.1)',
                    color: p.team === 'Team Orange' ? 'var(--orange-primary)' : '#FFFFFF'
                  }}>
                    {p.team}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'Space Grotesk' }}>
                    {p.topSpeed}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>km/h peak sprint</span>
                </div>

                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.topSpeed / 36) * 100}%`,
                    height: '100%',
                    background: p.team === 'Team Orange' ? 'var(--orange-primary)' : '#FFFFFF'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'distance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {playerRecords.map((p) => (
              <div key={p.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                    #{p.id} {p.name}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--orange-primary)', fontWeight: 700 }}>Metabolic Load: High</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                    {p.distance}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>meters covered</span>
                </div>

                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(p.distance / 500) * 100}%`,
                    height: '100%',
                    background: 'var(--orange-primary)'
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
