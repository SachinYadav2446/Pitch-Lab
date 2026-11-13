import React, { useEffect, useRef } from 'react';
import { Play, Sparkles, Layers, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onLaunchStudio }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width;
    const height = canvas.height;

    // Simulated squads: Orange vs White
    const players = [
      // Team Orange (Attack)
      { id: 1, x: width * 0.16, y: height * 0.5, vx: 0.1, vy: 0.2, team: 0, speed: 18.2 },
      { id: 4, x: width * 0.32, y: height * 0.26, vx: 0.4, vy: -0.2, team: 0, speed: 22.4 },
      { id: 5, x: width * 0.30, y: height * 0.74, vx: 0.3, vy: 0.2, team: 0, speed: 21.1 },
      { id: 8, x: width * 0.46, y: height * 0.40, vx: 0.5, vy: 0.1, team: 0, speed: 28.6 },
      { id: 10, x: width * 0.48, y: height * 0.65, vx: -0.2, vy: 0.4, team: 0, speed: 26.2 },
      { id: 7, x: width * 0.62, y: height * 0.30, vx: 0.6, vy: 0.3, team: 0, speed: 34.8 },
      { id: 9, x: width * 0.64, y: height * 0.70, vx: 0.4, vy: -0.3, team: 0, speed: 29.8 },

      // Team White (Defense)
      { id: 21, x: width * 0.84, y: height * 0.5, vx: -0.1, vy: -0.2, team: 1, speed: 17.5 },
      { id: 14, x: width * 0.68, y: height * 0.28, vx: -0.3, vy: 0.2, team: 1, speed: 23.1 },
      { id: 15, x: width * 0.70, y: height * 0.72, vx: -0.4, vy: -0.2, team: 1, speed: 24.0 },
      { id: 18, x: width * 0.55, y: height * 0.42, vx: -0.5, vy: -0.1, team: 1, speed: 27.5 },
      { id: 20, x: width * 0.52, y: height * 0.62, vx: 0.2, vy: -0.3, team: 1, speed: 25.8 },
      { id: 11, x: width * 0.40, y: height * 0.32, vx: -0.4, vy: 0.1, team: 1, speed: 26.4 },
      { id: 17, x: width * 0.38, y: height * 0.68, vx: -0.3, vy: 0.2, team: 1, speed: 28.2 },
    ];

    let ball = { x: width * 0.52, y: height * 0.48, vx: 1.4, vy: 0.7 };

    function drawPitch() {
      // Dark realistic grass
      ctx.fillStyle = '#0D1711';
      ctx.fillRect(0, 0, width, height);

      // Grass stripes
      const numStripes = 10;
      const stripeW = width / numStripes;
      for (let i = 0; i < numStripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#0B130E' : '#0D1711';
        ctx.fillRect(i * stripeW, 0, stripeW, height);
      }

      // Pitch white lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;

      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Halfway line & Center circle
      ctx.beginPath();
      ctx.moveTo(width / 2, 16);
      ctx.lineTo(width / 2, height - 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 54, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
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

        if (p.x < 30 || p.x > width - 30) p.vx *= -1;
        if (p.y < 30 || p.y > height - 30) p.vy *= -1;

        const dx = ball.x - p.x;
        const dy = ball.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        const teamColor = p.team === 0 ? '#FF7E00' : '#FFFFFF';
        
        // Aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = p.team === 0 ? 'rgba(255, 126, 0, 0.25)' : 'rgba(255, 255, 255, 0.18)';
        ctx.fill();

        // Player dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = teamColor;
        ctx.fill();
        ctx.strokeStyle = p.team === 0 ? '#FFFFFF' : '#1E293B';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Direction vector
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 15, p.y + p.vy * 15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // ID label
        ctx.fillStyle = p.team === 0 ? '#FFFFFF' : '#0F172A';
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.id, p.x, p.y + 3);
      });

      // Ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < 24 || ball.x > width - 24) ball.vx *= -0.92;
      if (ball.y < 24 || ball.y > height - 24) ball.vy *= -0.92;

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF7E00';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
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
      position: 'relative',
      overflow: 'hidden',
      padding: '90px 48px 80px 48px',
      background: 'radial-gradient(circle at 50% 20%, rgba(255, 126, 0, 0.08) 0%, rgba(8, 11, 16, 0.95) 70%)'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '56px',
        alignItems: 'center'
      }}>
        {/* Left Column: Explore. Improve. Win. */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <Sparkles size={14} />
              REVOLUTIONIZE SPORTS PERFORMANCE WITH INTELLIGENT ANALYTICS
            </div>

            <h1 style={{
              fontSize: '4.6rem',
              lineHeight: 1.05,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '16px',
              letterSpacing: '-1.5px'
            }}>
              Explore. Improve. <span className="gradient-text-orange">Win.</span>
            </h1>

            {/* SportAnalytics Orange Divider Bar */}
            <div style={{
              width: '72px',
              height: '4px',
              background: 'var(--orange-primary)',
              borderRadius: '2px',
              marginBottom: '24px'
            }} />

            <p style={{
              fontSize: '1.2rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: '38px',
              maxWidth: '580px'
            }}>
              Discover the ultimate edge in sports performance with our cutting-edge digital platform, offering comprehensive computer vision and spatial data analytics for soccer and beyond.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <button 
                onClick={onLaunchStudio}
                className="btn-primary" 
                style={{ fontSize: '1.05rem', padding: '14px 32px' }}
              >
                <Play size={18} fill="#FFFFFF" />
                Explore Platform
              </button>
              <a 
                href="#services"
                className="btn-secondary"
                style={{ fontSize: '1.05rem', padding: '14px 28px', textDecoration: 'none' }}
              >
                Discover Solutions
              </a>
            </div>

            {/* Metric Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'Space Grotesk' }}>
                  800+
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Tactical & Physical KPIs
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                  105 × 68m
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Metric Pitch Plane
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'Space Grotesk' }}>
                  120 FPS
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Real-time Edge Latency
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Holographic 2D Tactical Radar Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="card-luxury" style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #131A26 0%, #0D121B 100%)',
            borderColor: 'var(--orange-border)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={20} color="var(--orange-primary)" />
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF', letterSpacing: '0.5px' }}>
                  SPORTANALYTICS 2D RADAR ENGINE
                </span>
              </div>
              <span className="badge-orange" style={{ padding: '3px 10px', fontSize: '0.72rem' }}>
                LIVE 60 HZ
              </span>
            </div>

            {/* Pitch Canvas */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
              <canvas 
                ref={canvasRef} 
                width={560} 
                height={360} 
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />

              {/* Floating Chips */}
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                display: 'flex',
                gap: '10px'
              }}>
                <div style={{
                  background: 'rgba(8, 11, 16, 0.92)',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: '1px solid var(--orange-border)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange-primary)' }}></span>
                  TEAM ORANGE: 54%
                </div>
                <div style={{
                  background: 'rgba(8, 11, 16, 0.92)',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-subtle)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }}></span>
                  TEAM WHITE: 46%
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(8, 11, 16, 0.92)',
                color: 'var(--orange-primary)',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                fontFamily: 'Space Grotesk',
                border: '1px solid var(--orange-border)',
                backdropFilter: 'blur(8px)'
              }}>
                PEAK SPRINT: 34.8 KM/H
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.84rem',
              color: 'var(--text-muted)'
            }}>
              <span>Standard Metric Projection (105.0m × 68.0m)</span>
              <span style={{ color: 'var(--orange-primary)', fontWeight: 700 }}>Optical Homography Matrix</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
