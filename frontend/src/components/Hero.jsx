import React, { useRef, useState, useEffect } from 'react';
import { Zap, ArrowRight, Play, Pause, Compass, Layers } from 'lucide-react';

export default function Hero({ onLaunchStudio }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPassingLanes, setShowPassingLanes] = useState(true);
  const [showFormation, setShowFormation] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width;
    const height = canvas.height;

    // Tactical Squad: Warm Cream Beige (#E8D2B5) vs Deep Burgundy (#590907)
    const players = [
      // Attacking Team (Warm Cream Beige)
      { id: 1, x: width * 0.16, y: height * 0.50, vx: 0.1, vy: 0.15, team: 'cream', num: 1 },
      { id: 2, x: width * 0.32, y: height * 0.22, vx: 0.35, vy: -0.15, team: 'cream', num: 2 },
      { id: 3, x: width * 0.30, y: height * 0.44, vx: 0.2, vy: 0.1, team: 'cream', num: 4 },
      { id: 4, x: width * 0.30, y: height * 0.58, vx: 0.2, vy: -0.1, team: 'cream', num: 5 },
      { id: 5, x: width * 0.32, y: height * 0.78, vx: 0.3, vy: 0.2, team: 'cream', num: 3 },
      { id: 6, x: width * 0.46, y: height * 0.50, vx: 0.4, vy: 0.25, team: 'cream', num: 6 },
      { id: 7, x: width * 0.54, y: height * 0.32, vx: 0.45, vy: -0.2, team: 'cream', num: 8 },
      { id: 8, x: width * 0.56, y: height * 0.68, vx: 0.35, vy: 0.3, team: 'cream', num: 10 },
      { id: 9, x: width * 0.72, y: height * 0.24, vx: 0.5, vy: 0.2, team: 'cream', num: 7 },
      { id: 10, x: width * 0.76, y: height * 0.50, vx: 0.4, vy: -0.25, team: 'cream', num: 9 },
      { id: 11, x: width * 0.70, y: height * 0.76, vx: 0.55, vy: -0.3, team: 'cream', num: 11 },

      // Defending Team (Deep Burgundy)
      { id: 12, x: width * 0.90, y: height * 0.50, vx: -0.1, vy: -0.1, team: 'burgundy', num: 13 },
      { id: 13, x: width * 0.78, y: height * 0.28, vx: -0.3, vy: 0.2, team: 'burgundy', num: 12 },
      { id: 14, x: width * 0.80, y: height * 0.43, vx: -0.35, vy: -0.15, team: 'burgundy', num: 15 },
      { id: 15, x: width * 0.80, y: height * 0.57, vx: -0.3, vy: 0.15, team: 'burgundy', num: 14 },
      { id: 16, x: width * 0.78, y: height * 0.72, vx: -0.25, vy: -0.2, team: 'burgundy', num: 16 },
      { id: 17, x: width * 0.62, y: height * 0.26, vx: -0.4, vy: 0.25, team: 'burgundy', num: 17 },
      { id: 18, x: width * 0.64, y: height * 0.44, vx: -0.45, vy: -0.2, team: 'burgundy', num: 18 },
      { id: 19, x: width * 0.64, y: height * 0.56, vx: -0.35, vy: 0.3, team: 'burgundy', num: 20 },
      { id: 20, x: width * 0.62, y: height * 0.74, vx: -0.4, vy: -0.2, team: 'burgundy', num: 21 },
      { id: 21, x: width * 0.48, y: height * 0.42, vx: -0.25, vy: 0.2, team: 'burgundy', num: 19 },
      { id: 22, x: width * 0.46, y: height * 0.58, vx: -0.2, vy: -0.25, team: 'burgundy', num: 99 },
    ];

    let ball = {
      x: width * 0.54,
      y: height * 0.32,
      targetPlayer: 9,
      speed: 3.5,
      trail: []
    };

    function renderPitch() {
      // 1. Deep Burgundy Tactical Turf (#380504)
      ctx.fillStyle = '#2D0403';
      ctx.fillRect(0, 0, width, height);

      // Mowing stripes
      const stripes = 12;
      const stripeW = width / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#260303' : '#330504';
        ctx.fillRect(i * stripeW, 0, stripeW, height);
      }

      // 2. Pitch Markings in Warm Cream Beige (#E8D2B5)
      ctx.strokeStyle = 'rgba(232, 210, 181, 0.45)';
      ctx.lineWidth = 1.6;

      const pad = 24;
      ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

      // Center Line
      ctx.beginPath();
      ctx.moveTo(width / 2, pad);
      ctx.lineTo(width / 2, height - pad);
      ctx.stroke();

      // Center Circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
      ctx.stroke();

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
    }

    function renderTactics() {
      // Formation Mesh Triangles
      if (showFormation) {
        const creamPlayers = players.filter(p => p.team === 'cream');
        ctx.strokeStyle = 'rgba(232, 210, 181, 0.22)';
        ctx.fillStyle = 'rgba(232, 210, 181, 0.05)';
        ctx.lineWidth = 1;

        const triangles = [
          [creamPlayers[5], creamPlayers[6], creamPlayers[7]],
          [creamPlayers[6], creamPlayers[8], creamPlayers[9]],
          [creamPlayers[7], creamPlayers[9], creamPlayers[10]],
          [creamPlayers[1], creamPlayers[5], creamPlayers[6]],
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
      }

      // Passing Lanes
      if (showPassingLanes) {
        const passer = players.find(p => p.id === 7);
        const receiver = players.find(p => p.id === 9);

        if (passer && receiver) {
          ctx.strokeStyle = 'rgba(232, 210, 181, 0.7)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(passer.x, passer.y);
          ctx.lineTo(receiver.x, receiver.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Update & Draw Players
      players.forEach(p => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;

          const margin = 35;
          if (p.x < margin || p.x > width - margin) p.vx *= -1;
          if (p.y < margin || p.y > height - margin) p.vy *= -1;
        }

        // Outer ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = p.team === 'cream' ? 'rgba(232, 210, 181, 0.2)' : 'rgba(89, 9, 7, 0.4)';
        ctx.strokeStyle = p.team === 'cream' ? '#E8D2B5' : '#8F1411';
        ctx.lineWidth = 1.4;
        ctx.fill();
        ctx.stroke();

        // Core jersey
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = p.team === 'cream' ? '#E8D2B5' : '#590907';
        ctx.fill();

        // Number
        ctx.fillStyle = p.team === 'cream' ? '#380504' : '#E8D2B5';
        ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.num.toString(), p.x, p.y);
      });

      // Ball Update
      if (isPlaying) {
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

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#E8D2B5';
      ctx.shadowBlur = 10;
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
  }, [isPlaying, showPassingLanes, showFormation]);

  return (
    <section style={{
      position: 'relative',
      maxWidth: '1420px',
      margin: '0 auto',
      padding: '36px 32px 60px',
      width: '100%'
    }}>
      {/* SVG Clip Path Definition (Normalized Object Bounding Box) */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id="vortex-hero-cutout" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.46 0.06
              A 0.04 0.06 0 0 1 0.50 0.00
              L 0.96 0.00
              A 0.04 0.06 0 0 1 1.00 0.06
              L 1.00 0.94
              A 0.04 0.06 0 0 1 0.96 1.00
              L 0.04 1.00
              A 0.04 0.06 0 0 1 0.00 0.94
              L 0.00 0.70
              A 0.04 0.06 0 0 1 0.04 0.64
              L 0.42 0.64
              A 0.04 0.06 0 0 0 0.46 0.58
              L 0.46 0.06
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Main Unified Canvas Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '660px',
        display: 'flex'
      }}>

        {/* ========================================================
            LEFT SECTION: Text Block (Upper-Left Quadrant)
            ======================================================== */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '45%',
          minWidth: '380px',
          paddingRight: '36px',
          paddingTop: '8px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Main Headline (Deep Burgundy #590907 on Muted Sage Grey #A5A79B) */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 4.2vw, 4.1rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: 'var(--burgundy-deep)',
            marginBottom: '26px'
          }}>
            Autonomous Sub-Pixel<br />
            <span style={{
              color: 'var(--burgundy-deep)',
              textDecoration: 'underline',
              textUnderlineOffset: '10px',
              textDecorationThickness: '3.5px',
              textDecorationColor: 'var(--burgundy-deep)'
            }}>
              Player Tracking
            </span> & Deep<br />
            Homography.
          </h1>

          {/* Middle Row: Preview Card in Warm Cream Beige + Description */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '32px'
          }}>
            {/* Mini Radar / Preview Thumbnail Box in Warm Cream Beige #E8D2B5 */}
            <div style={{
              width: '82px',
              height: '82px',
              minWidth: '82px',
              borderRadius: '14px',
              background: 'var(--cream-beige)',
              border: '1.5px solid rgba(89, 9, 7, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(89, 9, 7, 0.15)'
            }}>
              {/* Pitch Radar rings in Deep Burgundy */}
              <div style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px dashed rgba(89, 9, 7, 0.35)',
                animation: 'spin 20s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1.5px solid var(--burgundy-deep)'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--burgundy-deep)',
                boxShadow: '0 0 8px rgba(89, 9, 7, 0.5)'
              }} />
              <span style={{
                position: 'absolute',
                bottom: '4px',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.4px'
              }}>
                60 FPS Fix
              </span>
            </div>

            {/* Description Text */}
            <p style={{
              fontSize: '0.94rem',
              lineHeight: 1.6,
              color: 'var(--text-burgundy-muted)',
              fontWeight: 500
            }}>
              Unified multi-camera deep learning pipeline for professional football: continuous sub-pixel player tracking coupled with physical velocity regression in &lt;16 ms.
            </p>
          </div>

          {/* Action Button Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-cream-secondary"
            >
              {isPlaying ? <Pause size={15} color="#590907" /> : <Play size={15} color="#590907" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Simulation'}</span>
            </button>

            <button
              onClick={onLaunchStudio}
              className="btn-burgundy-primary"
            >
              <span>Tactical Console</span>
              <ArrowRight size={15} color="var(--cream-beige)" />
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT & BOTTOM: Custom Notched Interactive Tactical Canvas
            (Video Removed, Replaced with Real-Time 2D Radar Simulation)
            ======================================================== */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          {/* Glowing Contour Line in Deep Burgundy #590907 */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 7,
              pointerEvents: 'none'
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 46 6
                A 4 6 0 0 1 50 0
                L 96 0
                A 4 6 0 0 1 100 6
                L 100 94
                A 4 6 0 0 1 96 100
                L 4 100
                A 4 6 0 0 1 0 94
                L 0 70
                A 4 6 0 0 1 4 64
                L 42 64
                A 4 6 0 0 0 46 58
                L 46 6
                Z
              "
              fill="none"
              stroke="#590907"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 8px rgba(89, 9, 7, 0.45))' }}
            />
          </svg>

          {/* Real-Time HTML5 Interactive Canvas clipped to Custom Notch Shape */}
          <div style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'url(#vortex-hero-cutout)',
            WebkitClipPath: 'url(#vortex-hero-cutout)',
            background: '#2D0403',
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}>
            <canvas
              ref={canvasRef}
              width={1200}
              height={660}
              style={{
                width: '100%',
                height: '100%',
                display: 'block'
              }}
            />
          </div>

          {/* ========================================================
              HUD OVERLAYS in Deep Burgundy #590907 & Warm Cream Beige #E8D2B5
              ======================================================== */}
          
          {/* 1. Top-Right Broadcast Chip */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            zIndex: 8,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: '20px',
            background: 'rgba(89, 9, 7, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--cream-beige)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--cream-beige)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(89, 9, 7, 0.3)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--cream-beige)',
              boxShadow: '0 0 8px #FFF0DC'
            }} />
            <span>OPTICAL TRACKER 74° ORBIT • 4K BROADCAST</span>
          </div>

          {/* 2. Bottom-Left Extended Shelf Chips in Warm Cream Beige (Under text block) */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '28px',
            zIndex: 8,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'var(--cream-beige)',
              border: '1px solid rgba(89, 9, 7, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--burgundy-deep)',
              boxShadow: '0 2px 10px rgba(89, 9, 7, 0.15)'
            }}>
              <span style={{ opacity: 0.75 }}>TRACK FIX:</span>
              <span style={{ color: 'var(--burgundy-deep)', fontWeight: 800 }}>0.8% MAE</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'var(--cream-beige)',
              border: '1px solid rgba(89, 9, 7, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--burgundy-deep)',
              boxShadow: '0 2px 10px rgba(89, 9, 7, 0.15)'
            }}>
              <span style={{ opacity: 0.75 }}>SPRINT:</span>
              <span style={{ color: 'var(--burgundy-deep)', fontWeight: 800 }}>34.2 km/h</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'var(--cream-beige)',
              border: '1px solid rgba(89, 9, 7, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--burgundy-deep)',
              boxShadow: '0 2px 10px rgba(89, 9, 7, 0.15)'
            }}>
              <span style={{ opacity: 0.75 }}>GPU:</span>
              <span style={{ color: 'var(--burgundy-deep)', fontWeight: 800 }}>&lt; 16 ms</span>
            </div>
          </div>

          {/* 3. Bottom-Right Telemetry Card in Deep Burgundy #590907 */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '28px',
            zIndex: 8,
            padding: '14px 20px',
            borderRadius: '16px',
            background: 'rgba(89, 9, 7, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--cream-beige)',
            boxShadow: '0 10px 30px rgba(89, 9, 7, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Wireframe Cylinder in Warm Cream Beige */}
            <div style={{
              width: '36px',
              height: '42px',
              border: '1.5px dashed var(--cream-beige)',
              borderRadius: '18px / 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(232, 210, 181, 0.3)'
            }}>
              <div style={{ width: '100%', height: '1px', background: 'var(--cream-beige)', margin: '4px 0' }} />
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--cream-beige)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cream-beige)' }} />
                <span>BOB-SYS-01 • MATCH BROADCAST</span>
              </div>

              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--cream-beige)',
                marginTop: '3px'
              }}>
                114.8 km/h <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span> 540 RPM
              </div>

              <div style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'rgba(232, 210, 181, 0.75)',
                marginTop: '2px'
              }}>
                Fix: 105m × 68m FIFA Standard Pitch
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
