import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Eye, Cpu, MoveHorizontal } from 'lucide-react';

export default function ComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const rawCanvasRef = useRef(null);
  const aiCanvasRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX);
  };

  useEffect(() => {
    const rawC = rawCanvasRef.current;
    const aiC = aiCanvasRef.current;
    if (!rawC || !aiC) return;

    const rawCtx = rawC.getContext('2d');
    const aiCtx = aiC.getContext('2d');

    const w = rawC.width;
    const h = rawC.height;

    const players = [
      { id: 7, x: w * 0.58, y: h * 0.42, team: 0, speed: 34.8, name: 'Mbappé' },
      { id: 9, x: w * 0.65, y: h * 0.68, team: 0, speed: 31.4, name: 'Haaland' },
      { id: 4, x: w * 0.32, y: h * 0.30, team: 0, speed: 22.2, name: 'van Dijk' },
      { id: 8, x: w * 0.44, y: h * 0.52, team: 0, speed: 27.5, name: 'De Bruyne' },
      { id: 18, x: w * 0.52, y: h * 0.46, team: 1, speed: 28.1, name: 'Bellingham' },
      { id: 10, x: w * 0.40, y: h * 0.36, team: 1, speed: 25.8, name: 'Messi' },
      { id: 15, x: w * 0.72, y: h * 0.62, team: 1, speed: 24.0, name: 'Rodri' }
    ];
    const ball = { x: w * 0.55, y: h * 0.44 };

    const drawBasePitch = (ctx) => {
      ctx.fillStyle = '#0E1712';
      ctx.fillRect(0, 0, w, h);

      const stripes = 8;
      const sw = w / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#0B130E' : '#0E1712';
        ctx.fillRect(i * sw, 0, sw, h);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(40, 30, w - 80, h - 60);
      ctx.beginPath();
      ctx.moveTo(w / 2, 30);
      ctx.lineTo(w / 2, h - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeRect(40, (h - 200) / 2, 120, 200);
      ctx.strokeRect(w - 160, (h - 200) / 2, 120, 200);

      players.forEach(p => {
        const teamColor = p.team === 0 ? '#FF7E00' : '#FFFFFF';
        ctx.fillStyle = teamColor;
        ctx.fillRect(p.x - 12, p.y - 24, 24, 26);
        ctx.fillStyle = p.team === 0 ? '#FFFFFF' : '#0F172A';
        ctx.fillRect(p.x - 11, p.y + 2, 22, 16);
        ctx.beginPath();
        ctx.arc(p.x, p.y - 32, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#F5D0A9';
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FF7E00';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    drawBasePitch(rawCtx);
    drawBasePitch(aiCtx);

    // AI Homography Grid
    aiCtx.strokeStyle = 'rgba(255, 126, 0, 0.2)';
    aiCtx.lineWidth = 1;
    for (let x = 60; x < w - 60; x += 60) {
      aiCtx.beginPath();
      aiCtx.moveTo(x, 30);
      aiCtx.lineTo(x, h - 30);
      aiCtx.stroke();
    }
    for (let y = 50; y < h - 30; y += 50) {
      aiCtx.beginPath();
      aiCtx.moveTo(40, y);
      aiCtx.lineTo(w - 40, y);
      aiCtx.stroke();
    }

    // AI Ground Rings & Velocity Tags
    players.forEach(p => {
      const teamColor = p.team === 0 ? '#FF7E00' : '#FFFFFF';

      aiCtx.save();
      aiCtx.beginPath();
      aiCtx.ellipse(p.x, p.y + 20, 22, 9, 0, 0, Math.PI * 2);
      aiCtx.strokeStyle = teamColor;
      aiCtx.lineWidth = 3;
      aiCtx.stroke();

      aiCtx.beginPath();
      aiCtx.ellipse(p.x, p.y + 20, 18, 7, 0, 0, Math.PI * 2);
      aiCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      aiCtx.lineWidth = 1;
      aiCtx.stroke();
      aiCtx.restore();

      aiCtx.strokeStyle = teamColor;
      aiCtx.lineWidth = 1.5;
      aiCtx.strokeRect(p.x - 16, p.y - 44, 32, 66);

      const badgeText = `#${p.id} ${p.name} · ${p.speed} km/h`;
      aiCtx.font = 'bold 11px "Space Grotesk", sans-serif';
      const tw = aiCtx.measureText(badgeText).width;

      aiCtx.fillStyle = 'rgba(8, 11, 16, 0.92)';
      aiCtx.fillRect(p.x - tw / 2 - 8, p.y + 32, tw + 16, 18);
      aiCtx.strokeStyle = teamColor;
      aiCtx.lineWidth = 1;
      aiCtx.strokeRect(p.x - tw / 2 - 8, p.y + 32, tw + 16, 18);

      aiCtx.fillStyle = '#FFFFFF';
      aiCtx.textAlign = 'center';
      aiCtx.fillText(badgeText, p.x, p.y + 45);
    });

    aiCtx.beginPath();
    aiCtx.moveTo(ball.x, ball.y - 14);
    aiCtx.lineTo(ball.x - 8, ball.y - 24);
    aiCtx.lineTo(ball.x + 8, ball.y - 24);
    aiCtx.closePath();
    aiCtx.fillStyle = '#FF7E00';
    aiCtx.fill();
    aiCtx.strokeStyle = '#FFFFFF';
    aiCtx.lineWidth = 1.5;
    aiCtx.stroke();
  }, []);

  return (
    <section style={{
      maxWidth: '1360px',
      margin: '70px auto 90px auto',
      padding: '0 48px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge-orange">Interactive Optical Vision Comparison</span>
        <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '14px', letterSpacing: '-1px' }}>
          Slide to Reveal Neural Telemetry
        </h2>
        <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Drag the horizontal divider to contrast raw camera footage against SportAnalytics’ deep learning inference layer.
        </p>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1120px',
          margin: '0 auto',
          height: '520px',
          borderRadius: '18px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid var(--border-medium)',
          userSelect: 'none'
        }}
      >
        {/* Layer 1: AI Vision View */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <canvas 
            ref={aiCanvasRef} 
            width={1120} 
            height={520} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'rgba(255, 126, 0, 0.2)',
            color: '#FFFFFF',
            border: '1px solid var(--orange-primary)',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.6px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Cpu size={16} color="var(--orange-primary)" />
            SPORTANALYTICS NEURAL ENGINE (ACTIVE)
          </div>
        </div>

        {/* Layer 2: Raw Broadcast View */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${sliderPos}%`,
          height: '100%',
          overflow: 'hidden',
          borderRight: '2px solid var(--orange-primary)'
        }}>
          <canvas 
            ref={rawCanvasRef} 
            width={1120} 
            height={520} 
            style={{ width: '1120px', maxWidth: 'none', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            background: 'rgba(8, 11, 16, 0.9)',
            color: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.6px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Eye size={16} />
            RAW BROADCAST FEED (UNPROCESSED)
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          width: '3px',
          background: 'var(--orange-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#080B10',
            boxShadow: '0 0 20px var(--orange-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--orange-primary)',
            color: 'var(--orange-primary)'
          }}>
            <MoveHorizontal size={20} />
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
        fontWeight: 600
      }}>
        <MoveHorizontal size={16} color="var(--orange-primary)" />
        <span>Drag slider horizontally to inspect computer vision detection precision</span>
      </div>
    </section>
  );
}
