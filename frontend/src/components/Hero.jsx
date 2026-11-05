import React, { useEffect, useRef, useState } from 'react';
import { Play, Activity, Sparkles, Layers, ArrowUpRight, Gauge, ShieldCheck, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onLaunchStudio }) {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ topSpeed: 31.4, possession: 52, activePlayers: 22 });

  // Real-time animated 2D pitch radar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Pitch standard dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Create 14 simulated players (7 red, 7 blue) and 1 ball
    const players = [
      // Team Alpha (Red/Terracotta)
      { id: 1, x: width * 0.18, y: height * 0.5, vx: 0.2, vy: 0.1, team: 0, speed: 18.2 },
      { id: 4, x: width * 0.32, y: height * 0.25, vx: 0.4, vy: -0.2, team: 0, speed: 22.4 },
      { id: 5, x: width * 0.30, y: height * 0.75, vx: 0.3, vy: 0.2, team: 0, speed: 21.1 },
      { id: 8, x: width * 0.45, y: height * 0.40, vx: 0.5, vy: 0.1, team: 0, speed: 28.6 },
      { id: 10, x: width * 0.48, y: height * 0.65, vx: -0.2, vy: 0.4, team: 0, speed: 26.2 },
      { id: 7, x: width * 0.60, y: height * 0.30, vx: 0.6, vy: 0.3, team: 0, speed: 32.4 },
      { id: 9, x: width * 0.62, y: height * 0.70, vx: 0.4, vy: -0.3, team: 0, speed: 29.8 },

      // Team Beta (Forest Teal)
      { id: 21, x: width * 0.82, y: height * 0.5, vx: -0.2, vy: -0.1, team: 1, speed: 17.5 },
      { id: 14, x: width * 0.68, y: height * 0.28, vx: -0.3, vy: 0.2, team: 1, speed: 23.1 },
      { id: 15, x: width * 0.70, y: height * 0.72, vx: -0.4, vy: -0.2, team: 1, speed: 24.0 },
      { id: 18, x: width * 0.55, y: height * 0.42, vx: -0.5, vy: -0.1, team: 1, speed: 27.5 },
      { id: 20, x: width * 0.52, y: height * 0.62, vx: 0.2, vy: -0.3, team: 1, speed: 25.8 },
      { id: 11, x: width * 0.40, y: height * 0.32, vx: -0.4, vy: 0.1, team: 1, speed: 26.4 },
      { id: 17, x: width * 0.38, y: height * 0.68, vx: -0.3, vy: 0.2, team: 1, speed: 28.2 },
    ];

    let ball = { x: width * 0.52, y: height * 0.48, vx: 1.2, vy: 0.6 };

    function drawPitch() {
      // Background turf in deep tactical green
      ctx.fillStyle = '#22482E';
      ctx.fillRect(0, 0, width, height);

      // Pitch stripes
      const numStripes = 10;
      const stripeW = width / numStripes;
      for (let i = 0; i < numStripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#1E4029' : '#22482E';
        ctx.fillRect(i * stripeW, 0, stripeW, height);
      }

      // Pitch white lines
      ctx.strokeStyle = 'rgba(235, 245, 238, 0.65)';
      ctx.lineWidth = 1.5;

      // Touchline / Goal lines
      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Halfway line & Center circle
      ctx.beginPath();
      ctx.moveTo(width / 2, 16);
      ctx.lineTo(width / 2, height - 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 54, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(235, 245, 238, 0.8)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Penalty Boxes
      const boxW = 80;
      const boxH = 170;
      ctx.strokeRect(16, (height - boxH) / 2, boxW, boxH);
      ctx.strokeRect(width - 16 - boxW, (height - boxH) / 2, boxW, boxH);

      // 6-yard boxes
      const smallBoxW = 28;
      const smallBoxH = 80;
      ctx.strokeRect(16, (height - smallBoxH) / 2, smallBoxW, smallBoxH);
      ctx.strokeRect(width - 16 - smallBoxW, (height - smallBoxH) / 2, smallBoxW, smallBoxH);
    }

    function animate() {
      drawPitch();

      // Update and draw players
      players.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce within pitch bounds
        if (p.x < 30 || p.x > width - 30) p.vx *= -1;
        if (p.y < 30 || p.y > height - 30) p.vy *= -1;

        // Subtle target pulling toward ball
        const dx = ball.x - p.x;
        const dy = ball.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        // Draw Player circle
        const teamColor = p.team === 0 ? '#D64933' : '#3BA273';
        
        // Aura / shadow
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 30, 20, 0.4)';
        ctx.fill();

        // Main dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = teamColor;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Velocity trail vector
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 14, p.y + p.vy * 14);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Player ID label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.id, p.x, p.y + 3);
      });

      // Update and draw ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < 24 || ball.x > width - 24) ball.vx *= -0.92;
      if (ball.y < 24 || ball.y > height - 24) ball.vy *= -0.92;

      // Ball glow
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFDD00';
      ctx.fill();
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '70px 24px 50px 24px',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: '48px',
      alignItems: 'center'
    }}>
      {/* Left Column: Value Proposition */}
      <div>
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
            <Sparkles size={14} />
            NEXT-GEN COMPUTER VISION FOR FOOTBALL ANALYTICS
          </div>

          <h1 style={{
            fontSize: '3.3rem',
            lineHeight: 1.12,
            fontWeight: 800,
            color: 'var(--text-espresso)',
            marginBottom: '20px'
          }}>
            Turn Raw Match Footage Into <span style={{ color: 'var(--forest-green)', position: 'relative' }}>
              Spatial Intelligence.
            </span>
          </h1>

          <p style={{
            fontSize: '1.14rem',
            lineHeight: 1.6,
            color: 'var(--text-brown)',
            marginBottom: '32px',
            maxWidth: '560px'
          }}>
            Broadcast cameras distort spatial distance. <strong>PITCHLAB</strong> leverages YOLOv8 deep learning and projective homography to extract true player velocity, voronoi space control, and synchronized 2D tactical pitch telemetry in real-time.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button 
              onClick={onLaunchStudio}
              className="btn-primary" 
              style={{ fontSize: '1.05rem', padding: '13px 28px' }}
            >
              <Play size={18} fill="#FAF7F2" />
              Launch Interactive Studio
            </button>
            <a 
              href="#architecture"
              className="btn-secondary"
              style={{ fontSize: '1.05rem', padding: '13px 26px', textDecoration: 'none' }}
            >
              <Layers size={18} />
              View Vision Pipeline
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'Space Grotesk' }}>
                105 × 68m
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Standard Pitch Calibration
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--terracotta)', fontFamily: 'Space Grotesk' }}>
                &lt; 15 ms
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                RTX 4050 Latency
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-espresso)', fontFamily: 'Space Grotesk' }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Player ID Persistence
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Holographic 2D Tactical Radar Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="card-luxury" style={{
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          background: '#FDFBF7'
        }}>
          {/* Top Bar of Holographic Widget */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--forest-green)" />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>
                2D TACTICAL RADAR TELEMETRY
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                background: 'var(--forest-light)',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                LIVE 60 FPS
              </span>
            </div>
          </div>

          {/* Interactive Animated Pitch Canvas */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1A3E26', position: 'relative' }}>
            <canvas 
              ref={canvasRef} 
              width={540} 
              height={350} 
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />

            {/* Floating Telemetry Chips */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              gap: '8px'
            }}>
              <div style={{
                background: 'rgba(28, 20, 16, 0.85)',
                color: '#FAF7F2',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D64933' }}></span>
                ALPHA: 54%
              </div>
              <div style={{
                background: 'rgba(28, 20, 16, 0.85)',
                color: '#FAF7F2',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3BA273' }}></span>
                BETA: 46%
              </div>
            </div>

            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(28, 20, 16, 0.85)',
              color: '#00E676',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'Space Grotesk',
              backdropFilter: 'blur(4px)'
            }}>
              PEAK SPRINT: 32.4 KM/H
            </div>
          </div>

          {/* Under-canvas Caption */}
          <div style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <span>Metric Space Projection (0.0 - 105.0m, 0.0 - 68.0m)</span>
            <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>Zero Perspective Distortion</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
