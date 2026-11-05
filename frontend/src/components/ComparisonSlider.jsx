import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Eye, Cpu, MoveHorizontal, CheckCircle2 } from 'lucide-react';

export default function ComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
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

  // Render both views on separate canvas layers
  useEffect(() => {
    const rawC = rawCanvasRef.current;
    const aiC = aiCanvasRef.current;
    if (!rawC || !aiC) return;

    const rawCtx = rawC.getContext('2d');
    const aiCtx = aiC.getContext('2d');

    const w = rawC.width;
    const h = rawC.height;

    // Fixed realistic match frame positions
    const players = [
      { id: 7, x: w * 0.58, y: h * 0.42, team: 0, speed: 33.2, name: 'Mbappé' },
      { id: 9, x: w * 0.65, y: h * 0.68, team: 0, speed: 29.4, name: 'Haaland' },
      { id: 4, x: w * 0.32, y: h * 0.30, team: 0, speed: 21.0, name: 'van Dijk' },
      { id: 8, x: w * 0.44, y: h * 0.52, team: 0, speed: 26.5, name: 'De Bruyne' },
      { id: 18, x: w * 0.52, y: h * 0.46, team: 1, speed: 28.1, name: 'Bellingham' },
      { id: 10, x: w * 0.40, y: h * 0.36, team: 1, speed: 24.8, name: 'Messi' },
      { id: 15, x: w * 0.72, y: h * 0.62, team: 1, speed: 23.0, name: 'Rodri' }
    ];
    const ball = { x: w * 0.55, y: h * 0.44 };

    // Function to draw base grass & pitch
    const drawBasePitch = (ctx) => {
      // Lush grass
      ctx.fillStyle = '#265935';
      ctx.fillRect(0, 0, w, h);

      // Stripes
      const stripes = 8;
      const sw = w / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#22502F' : '#265935';
        ctx.fillRect(i * sw, 0, sw, h);
      }

      // Markings
      ctx.strokeStyle = 'rgba(240, 248, 242, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(40, 30, w - 80, h - 60);
      ctx.beginPath();
      ctx.moveTo(w / 2, 30);
      ctx.lineTo(w / 2, h - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Penalty box
      ctx.strokeRect(40, (h - 200) / 2, 120, 200);
      ctx.strokeRect(w - 160, (h - 200) / 2, 120, 200);

      // Draw Raw Players
      players.forEach(p => {
        const teamColor = p.team === 0 ? '#D64933' : '#308A5B';
        ctx.fillStyle = teamColor;
        ctx.fillRect(p.x - 12, p.y - 24, 24, 26);
        ctx.fillStyle = p.team === 0 ? '#FAF7F2' : '#222222';
        ctx.fillRect(p.x - 11, p.y + 2, 22, 16);
        ctx.beginPath();
        ctx.arc(p.x, p.y - 32, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#F5D0A9';
        ctx.fill();
      });

      // Raw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEE00';
      ctx.fill();
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // 1. Draw Raw Canvas
    drawBasePitch(rawCtx);

    // 2. Draw AI Canvas (Base Pitch + Neural Overlays)
    drawBasePitch(aiCtx);

    // AI Homography Perspective Grid lines (Subtle glowing tactical mesh)
    aiCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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

    // AI Tactical Ground Rings & Badges
    players.forEach(p => {
      const teamColor = p.team === 0 ? '#D64933' : '#308A5B';

      // Ground Ellipse
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

      // Bounding Box
      aiCtx.strokeStyle = teamColor;
      aiCtx.lineWidth = 1.5;
      aiCtx.strokeRect(p.x - 16, p.y - 44, 32, 66);

      // HUD Badge with Speed
      const badgeText = `#${p.id} ${p.name} · ${p.speed} km/h`;
      aiCtx.font = 'bold 11px "Space Grotesk", sans-serif';
      const tw = aiCtx.measureText(badgeText).width;

      aiCtx.fillStyle = 'rgba(28, 20, 16, 0.9)';
      aiCtx.fillRect(p.x - tw / 2 - 8, p.y + 32, tw + 16, 18);
      aiCtx.strokeStyle = teamColor;
      aiCtx.lineWidth = 1;
      aiCtx.strokeRect(p.x - tw / 2 - 8, p.y + 32, tw + 16, 18);

      aiCtx.fillStyle = '#FAF7F2';
      aiCtx.textAlign = 'center';
      aiCtx.fillText(badgeText, p.x, p.y + 45);
    });

    // Inverted Neon Pointer over ball
    aiCtx.beginPath();
    aiCtx.moveTo(ball.x, ball.y - 14);
    aiCtx.lineTo(ball.x - 8, ball.y - 24);
    aiCtx.lineTo(ball.x + 8, ball.y - 24);
    aiCtx.closePath();
    aiCtx.fillStyle = '#00F5FF';
    aiCtx.fill();
    aiCtx.strokeStyle = '#000000';
    aiCtx.lineWidth = 1.5;
    aiCtx.stroke();

    // Trajectory vector
    aiCtx.beginPath();
    aiCtx.moveTo(ball.x, ball.y);
    aiCtx.lineTo(ball.x + 45, ball.y - 20);
    aiCtx.strokeStyle = '#00F5FF';
    aiCtx.lineWidth = 2.5;
    aiCtx.stroke();
  }, []);

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '60px auto',
      padding: '0 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-green">Interactive Vision Comparison</span>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', marginTop: '8px', marginBottom: '12px' }}>
          Slide to Reveal Neural Tracking Telemetry
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-brown)', maxWidth: '640px', margin: '0 auto' }}>
          Drag the horizontal divider to compare raw broadcast video against PITCHLAB’s real-time computer vision inference.
        </p>
      </div>

      {/* Interactive Split Viewport Container */}
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
          maxWidth: '1080px',
          margin: '0 auto',
          height: '520px',
          borderRadius: '18px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          boxShadow: '0 12px 40px rgba(40, 30, 20, 0.12)',
          border: '1px solid var(--border-strong)',
          userSelect: 'none'
        }}
      >
        {/* Layer 1: AI Vision View (Right Layer) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <canvas 
            ref={aiCanvasRef} 
            width={1080} 
            height={520} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Label: AI Vision */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'rgba(34, 81, 51, 0.9)',
            color: '#FAF7F2',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.6px',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Cpu size={15} />
            PITCHLAB NEURAL VISION (ACTIVE)
          </div>
        </div>

        {/* Layer 2: Raw Broadcast View (Left Layer clipped by slider) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${sliderPos}%`,
          height: '100%',
          overflow: 'hidden',
          borderRight: '2px solid #FAF7F2'
        }}>
          <canvas 
            ref={rawCanvasRef} 
            width={1080} 
            height={520} 
            style={{ width: '1080px', maxWidth: 'none', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Label: Raw Broadcast */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            background: 'rgba(28, 20, 16, 0.85)',
            color: '#FAF7F2',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.6px',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Eye size={15} />
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
          width: '4px',
          background: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#FAF7F2',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--forest-green)',
            color: 'var(--forest-green)'
          }}>
            <MoveHorizontal size={20} />
          </div>
        </div>
      </div>

      {/* Interactive Drag Hint */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: 600
      }}>
        <MoveHorizontal size={16} />
        <span>Drag slider left or right to explore computer vision detection fidelity</span>
      </div>
    </section>
  );
}
