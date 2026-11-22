import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Compass, Layers, Zap, Eye, ChevronRight, Activity, Cpu } from 'lucide-react';

export default function Hero({ onLaunchStudio }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPassingLanes, setShowPassingLanes] = useState(true);
  const [showVoronoi, setShowVoronoi] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width;
    const height = canvas.height;

    // 4-3-3 Attack (Ivory Cream) vs 4-4-2 Defense (Vivid Crimson)
    const players = [
      // Attacking Team (Warm Ivory Cream)
      { id: 1, x: width * 0.12, y: height * 0.50, vx: 0.1, vy: 0.15, team: 'ivory', num: 1, role: 'GK' },
      { id: 2, x: width * 0.28, y: height * 0.22, vx: 0.35, vy: -0.15, team: 'ivory', num: 2, role: 'RB' },
      { id: 3, x: width * 0.25, y: height * 0.42, vx: 0.2, vy: 0.1, team: 'ivory', num: 4, role: 'CB' },
      { id: 4, x: width * 0.25, y: height * 0.58, vx: 0.2, vy: -0.1, team: 'ivory', num: 5, role: 'CB' },
      { id: 5, x: width * 0.28, y: height * 0.78, vx: 0.3, vy: 0.2, team: 'ivory', num: 3, role: 'LB' },
      { id: 6, x: width * 0.44, y: height * 0.50, vx: 0.4, vy: 0.25, team: 'ivory', num: 6, role: 'DM' },
      { id: 7, x: width * 0.52, y: height * 0.32, vx: 0.45, vy: -0.2, team: 'ivory', num: 8, role: 'CM' },
      { id: 8, x: width * 0.54, y: height * 0.68, vx: 0.35, vy: 0.3, team: 'ivory', num: 10, role: 'AM' },
      { id: 9, x: width * 0.72, y: height * 0.24, vx: 0.5, vy: 0.2, team: 'ivory', num: 7, role: 'RW' },
      { id: 10, x: width * 0.76, y: height * 0.50, vx: 0.4, vy: -0.25, team: 'ivory', num: 9, role: 'ST' },
      { id: 11, x: width * 0.70, y: height * 0.76, vx: 0.55, vy: -0.3, team: 'ivory', num: 11, role: 'LW' },

      // Defending Team (Crimson Burgundy)
      { id: 12, x: width * 0.90, y: height * 0.50, vx: -0.1, vy: -0.1, team: 'crimson', num: 13, role: 'GK' },
      { id: 13, x: width * 0.78, y: height * 0.28, vx: -0.3, vy: 0.2, team: 'crimson', num: 12, role: 'RB' },
      { id: 14, x: width * 0.80, y: height * 0.43, vx: -0.35, vy: -0.15, team: 'crimson', num: 15, role: 'CB' },
      { id: 15, x: width * 0.80, y: height * 0.57, vx: -0.3, vy: 0.15, team: 'crimson', num: 14, role: 'CB' },
      { id: 16, x: width * 0.78, y: height * 0.72, vx: -0.25, vy: -0.2, team: 'crimson', num: 16, role: 'LB' },
      { id: 17, x: width * 0.62, y: height * 0.26, vx: -0.4, vy: 0.25, team: 'crimson', num: 17, role: 'RM' },
      { id: 18, x: width * 0.64, y: height * 0.44, vx: -0.45, vy: -0.2, team: 'crimson', num: 18, role: 'CM' },
      { id: 19, x: width * 0.64, y: height * 0.56, vx: -0.35, vy: 0.3, team: 'crimson', num: 20, role: 'CM' },
      { id: 20, x: width * 0.62, y: height * 0.74, vx: -0.4, vy: -0.2, team: 'crimson', num: 21, role: 'LM' },
      { id: 21, x: width * 0.48, y: height * 0.42, vx: -0.25, vy: 0.2, team: 'crimson', num: 19, role: 'CF' },
      { id: 22, x: width * 0.46, y: height * 0.58, vx: -0.2, vy: -0.25, team: 'crimson', num: 99, role: 'ST' },
    ];

    let ball = {
      x: width * 0.53,
      y: height * 0.33,
      targetPlayer: 9,
      speed: 3.6,
      trail: []
    };

    let tick = 0;

    function renderPitch() {
      // 1. Deep Burgundy Turf
      ctx.fillStyle = '#1B0204';
      ctx.fillRect(0, 0, width, height);

      // Mowing stripes
      const stripes = 12;
      const stripeW = width / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#160203' : '#200205';
        ctx.fillRect(i * stripeW, 0, stripeW, height);
      }

      // 2. Pitch Markings in Luminous Warm Ivory Cream
      ctx.strokeStyle = 'rgba(255, 240, 220, 0.42)';
      ctx.lineWidth = 1.6;

      const pad = 24;
      ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

      // Center Halfway Line
      ctx.beginPath();
      ctx.moveTo(width / 2, pad);
      ctx.lineTo(width / 2, height - pad);
      ctx.stroke();

      // Center Circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
      ctx.stroke();

      // Center Spot
      ctx.fillStyle = '#FFF0DC';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Penalty Boxes
      const boxW = 100;
      const boxH = 200;
      ctx.strokeRect(pad, (height - boxH) / 2, boxW, boxH);
      ctx.strokeRect(width - pad - boxW, (height - boxH) / 2, boxW, boxH);

      // 6-Yard Boxes
      const sBoxW = 34;
      const sBoxH = 90;
      ctx.strokeRect(pad, (height - sBoxH) / 2, sBoxW, sBoxH);
      ctx.strokeRect(width - pad - sBoxW, (height - sBoxH) / 2, sBoxW, sBoxH);

      // Penalty Spots
      ctx.beginPath();
      ctx.arc(pad + 74, height / 2, 3, 0, Math.PI * 2);
      ctx.arc(width - pad - 74, height / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Corner Arcs
      const cRadius = 14;
      ctx.beginPath();
      ctx.arc(pad, pad, cRadius, 0, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(pad, height - pad, cRadius, -Math.PI / 2, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - pad, pad, cRadius, Math.PI / 2, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - pad, height - pad, cRadius, Math.PI, -Math.PI / 2);
      ctx.stroke();
    }

    function renderTactics() {
      // Draw Team Formation Mesh / Voronoi Space Triangles
      if (showVoronoi) {
        const ivoryPlayers = players.filter(p => p.team === 'ivory');
        ctx.strokeStyle = 'rgba(255, 240, 220, 0.22)';
        ctx.fillStyle = 'rgba(255, 240, 220, 0.05)';
        ctx.lineWidth = 1;

        const triangles = [
          [ivoryPlayers[5], ivoryPlayers[6], ivoryPlayers[7]],
          [ivoryPlayers[6], ivoryPlayers[8], ivoryPlayers[9]],
          [ivoryPlayers[7], ivoryPlayers[9], ivoryPlayers[10]],
          [ivoryPlayers[1], ivoryPlayers[5], ivoryPlayers[6]],
        ];

        triangles.forEach(tri => {
          if (tri[0] && tri[1] && tri[2]) {
            ctx.beginPath();
            ctx.moveTo(tri[0].x, tri[0].y);
            ctx.lineTo(tri[1].x, tri[1].y);
            ctx.lineTo(tri[2].x, tri[2].y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        });

        // Crimson Defensive Block Line
        const crimsonDefenders = players.filter(p => p.team === 'crimson' && ['RB', 'CB', 'LB'].includes(p.role));
        if (crimsonDefenders.length >= 4) {
          ctx.strokeStyle = 'rgba(224, 53, 66, 0.45)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(crimsonDefenders[0].x, crimsonDefenders[0].y);
          for (let i = 1; i < crimsonDefenders.length; i++) {
            ctx.lineTo(crimsonDefenders[i].x, crimsonDefenders[i].y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Passing Lanes to target if enabled
      if (showPassingLanes) {
        const passer = players.find(p => p.id === 7); // CM (num 8)
        const receiver = players.find(p => p.id === 9); // RW (num 7)

        if (passer && receiver) {
          ctx.strokeStyle = '#FFF0DC';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(passer.x, passer.y);
          ctx.lineTo(receiver.x, receiver.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Passing vector speed chip
          const midX = (passer.x + receiver.x) / 2;
          const midY = (passer.y + receiver.y) / 2;
          ctx.fillStyle = '#FFF0DC';
          ctx.fillRect(midX - 38, midY - 11, 76, 22);
          ctx.strokeStyle = '#48060B';
          ctx.lineWidth = 1;
          ctx.strokeRect(midX - 38, midY - 11, 76, 22);

          ctx.fillStyle = '#48060B';
          ctx.font = 'bold 10px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('PASS 28.4 m/s', midX, midY);
        }
      }

      // Update and draw players
      players.forEach(p => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;

          const margin = 35;
          if (p.x < margin || p.x > width - margin) p.vx *= -1;
          if (p.y < margin || p.y > height - margin) p.vy *= -1;
        }

        // Velocity Vectors
        if (showVectors) {
          const arrowLen = 14;
          const endX = p.x + p.vx * arrowLen;
          const endY = p.y + p.vy * arrowLen;

          ctx.strokeStyle = p.team === 'ivory' ? 'rgba(255, 240, 220, 0.7)' : 'rgba(224, 53, 66, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }

        // Player Outer Pulse Ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        if (p.team === 'ivory') {
          ctx.fillStyle = 'rgba(255, 240, 220, 0.22)';
          ctx.strokeStyle = '#FFF0DC';
        } else {
          ctx.fillStyle = 'rgba(224, 53, 66, 0.25)';
          ctx.strokeStyle = '#E03542';
        }
        ctx.lineWidth = 1.4;
        ctx.fill();
        ctx.stroke();

        // Player Core Jersey Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = p.team === 'ivory' ? '#FFF0DC' : '#E03542';
        ctx.fill();

        // Jersey Number Label
        ctx.fillStyle = p.team === 'ivory' ? '#340407' : '#FFF0DC';
        ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.num.toString(), p.x, p.y);
      });

      // Animate Match Ball
      if (isPlaying) {
        tick++;
        const target = players.find(p => p.id === ball.targetPlayer);
        if (target) {
          const dx = target.x - ball.x;
          const dy = target.y - ball.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 8) {
            ball.x += (dx / dist) * ball.speed;
            ball.y += (dy / dist) * ball.speed;
          } else {
            const targets = [9, 10, 8, 7];
            const currentIdx = targets.indexOf(ball.targetPlayer);
            ball.targetPlayer = targets[(currentIdx + 1) % targets.length];
          }

          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > 8) ball.trail.shift();
        }
      }

      // Draw Ball Trail
      ball.trail.forEach((pos, idx) => {
        const alpha = (idx + 1) / ball.trail.length * 0.45;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3 * ((idx + 1) / ball.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 220, ${alpha})`;
        ctx.fill();
      });

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFF0DC';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      renderPitch();
      renderTactics();
      animationFrameId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, showPassingLanes, showVoronoi, showVectors]);

  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px 80px',
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 1. Category Pill (Warm Ivory Cream on Deep Burgundy) */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '22px' }}
      >
        <div className="badge-cream">
          <Activity size={14} color="#FFF0DC" />
          <span>COMPUTER VISION & TACTICAL INTELLIGENCE</span>
        </div>
      </motion.div>

      {/* 2. Editorial Headline: Explore. Improve. Win. */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ textAlign: 'center', maxWidth: '980px', marginBottom: '22px' }}
      >
        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.8vw, 4.6rem)',
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: '-0.035em',
          color: 'var(--cream-primary)',
          marginBottom: '16px',
          textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
        }}>
          Explore. Improve. Win.
        </h1>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
          fontWeight: 600,
          color: 'var(--cream-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          opacity: 0.95
        }}>
          Turn Raw Broadcast Video Into Dynamic 2D Pitch Radar & Tactical Intelligence.
        </p>
      </motion.div>

      {/* 3. Subtitle Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ textAlign: 'center', maxWidth: '780px', marginBottom: '38px' }}
      >
        <p style={{
          fontSize: '1.08rem',
          lineHeight: 1.68,
          color: 'var(--text-secondary)',
          fontWeight: 450
        }}>
          Built for professional clubs, performance directors, and match analysts.
          Our computer vision pipeline tracks all 22 players with YOLOv8, projects real-world pitch homography,
          and delivers instant spatial dominance telemetry with zero camera calibration hardware required.
        </p>
      </motion.div>

      {/* 4. Action Buttons & Micro-Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '52px'
        }}
      >
        <button
          onClick={onLaunchStudio}
          className="btn-cream-primary"
          style={{ padding: '15px 34px', fontSize: '1rem' }}
        >
          <span>Explore Tactical Engine</span>
          <ChevronRight size={18} />
        </button>

        <a
          href="#architecture"
          className="btn-burgundy-glass"
          style={{ padding: '15px 30px', fontSize: '1rem' }}
        >
          <Layers size={18} />
          <span>View Pipeline Architecture</span>
        </a>
      </motion.div>

      {/* 5. Centerpiece: Interactive Tactical Pitch Canvas Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '1180px',
          borderRadius: '24px',
          background: 'var(--bg-burgundy-card)',
          border: '1.5px solid var(--cream-border-strong)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.65), 0 0 35px rgba(255, 240, 220, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Canvas Visualizer Header Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '16px 24px',
          background: 'rgba(52, 4, 7, 0.85)',
          borderBottom: '1px solid var(--cream-border)',
          gap: '12px'
        }}>
          {/* Status Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FFF0DC',
              boxShadow: '0 0 10px #FFF0DC'
            }} />
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--cream-primary)',
              letterSpacing: '0.5px'
            }}>
              LIVE 2D HOMOGRAPHY SIMULATOR
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--cream-secondary)',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 240, 220, 0.08)',
              border: '1px solid var(--cream-border)'
            }}>
              105m × 68m FIFA Standard
            </span>
          </div>

          {/* Interactive Layer Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowVoronoi(!showVoronoi)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-border)',
                background: showVoronoi ? 'var(--cream-primary)' : 'rgba(255, 240, 220, 0.08)',
                color: showVoronoi ? '#340407' : 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={13} />
              <span>Formation Mesh</span>
            </button>

            <button
              onClick={() => setShowPassingLanes(!showPassingLanes)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-border)',
                background: showPassingLanes ? 'var(--cream-primary)' : 'rgba(255, 240, 220, 0.08)',
                color: showPassingLanes ? '#340407' : 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={13} />
              <span>Passing Lanes</span>
            </button>

            <button
              onClick={() => setShowVectors(!showVectors)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-border)',
                background: showVectors ? 'var(--cream-primary)' : 'rgba(255, 240, 220, 0.08)',
                color: showVectors ? '#340407' : 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={13} />
              <span>Speed Vectors</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-primary)',
                background: 'var(--cream-primary)',
                color: '#340407',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* The Tactical Pitch Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '520px', background: '#1B0204' }}>
          <canvas
            ref={canvasRef}
            width={1180}
            height={520}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* HUD Floating Micro-Card: Top Left (Field Dominance) */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'rgba(34, 2, 4, 0.92)',
            border: '1px solid var(--cream-border-strong)',
            backdropFilter: 'blur(10px)',
            color: '#FFF0DC',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.8px', color: 'var(--cream-secondary)', textTransform: 'uppercase' }}>
              Field Dominance
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 800, color: '#FFF0DC' }}>
                62.4%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cream-muted)' }}>Ivory</span>
              <span style={{ margin: '0 4px', color: 'rgba(255, 240, 220, 0.3)' }}>|</span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 800, color: '#E03542' }}>
                37.6%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cream-muted)' }}>Crimson</span>
            </div>
          </div>

          {/* HUD Floating Micro-Card: Top Right (GPU Telemetry) */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'rgba(34, 2, 4, 0.92)',
            border: '1px solid var(--cream-border-strong)',
            backdropFilter: 'blur(10px)',
            color: '#FFF0DC',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 240, 220, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--cream-border)'
            }}>
              <Cpu size={18} color="#FFF0DC" />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--cream-secondary)', textTransform: 'uppercase' }}>
                Inference Latency
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 800, color: '#FFF0DC' }}>
                16.4 ms <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-muted)' }}>(60.8 FPS)</span>
              </div>
            </div>
          </div>

          {/* HUD Floating Micro-Card: Bottom Left (Tactical Defensive Line) */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(34, 2, 4, 0.92)',
            border: '1px solid var(--cream-border-strong)',
            backdropFilter: 'blur(8px)',
            color: '#FFF0DC',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFF0DC', boxShadow: '0 0 6px #FFF0DC' }} />
            <span>Defensive Compactness: <strong>21.4m Line Gap (High Block)</strong></span>
          </div>

          {/* HUD Floating Micro-Card: Bottom Right (Homography Status) */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(34, 2, 4, 0.92)',
            border: '1px solid var(--cream-border-strong)',
            backdropFilter: 'blur(8px)',
            color: '#FFF0DC',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Eye size={14} color="#FFF0DC" />
            <span>Homography Matrix: <strong>Planar Projection Validated</strong></span>
          </div>
        </div>

        {/* Feature Summary Bar beneath Canvas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: 'var(--cream-border)',
          borderTop: '1px solid var(--cream-border)'
        }}>
          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              01 • Optical Tracking
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              YOLOv8 Real-Time Detect
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Detects and tracks 22 players + referee + match ball at 60 FPS.
            </div>
          </div>

          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              02 • Perspective Warping
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              Homography Projection
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Maps broadcast pixel coordinates (u, v) into metric 2D pitch space (X, Y).
            </div>
          </div>

          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              03 • Spatial Analytics
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              Voronoi & Speed Vectors
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Extracts high-speed sprint zones, formation compactness, and passing corridors.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
