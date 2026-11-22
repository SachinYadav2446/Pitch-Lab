import React, { useState, useEffect } from 'react';
import { Layers, Crosshair, Cpu, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomographyFeature() {
  // Interactive view state: 'camera' (perspective) vs 'pitch' (flat 2D radar metric)
  const [activeView, setActiveView] = useState('pitch');
  // Simulated matrix values for tactical authentic feel
  const [matrixSeed, setMatrixSeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatrixSeed((prev) => (prev + 1) % 100);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="homography" style={{
      width: '100%',
      position: 'relative',
      backgroundColor: 'var(--bg-sage)',
      padding: '100px 32px 120px',
      borderTop: '1.5px solid rgba(89, 9, 7, 0.15)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Background blueprint grid continuity */}
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        {/* ========================================================
            HEADER ROW: Section tag + Title + View Toggle
            ======================================================== */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(89, 9, 7, 0.08)',
              border: '1px solid rgba(89, 9, 7, 0.2)',
              borderRadius: '20px',
              padding: '6px 14px',
              marginBottom: '14px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--burgundy-deep)'
              }} />
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.6px'
              }}>
                FEATURE 01 // SPATIAL VISION CORE
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'var(--burgundy-deep)',
              marginBottom: '12px'
            }}>
              Planar Pitch Homography Engine
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Eliminates the need for in-stadium optical rigs or player GPS vests. Transform dynamic, moving
              broadcast camera feeds into calibrated FIFA-standard 2D metric pitch coordinates ($105\text{m} \times 68\text{m}$) in real-time.
            </p>
          </div>

          {/* Perspective View Switcher */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(89, 9, 7, 0.12)',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid rgba(89, 9, 7, 0.2)'
          }}>
            <button
              onClick={() => setActiveView('camera')}
              style={{
                background: activeView === 'camera' ? 'var(--burgundy-deep)' : 'transparent',
                color: activeView === 'camera' ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                border: 'none',
                borderRadius: '20px',
                padding: '9px 20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Eye size={14} />
              <span>Broadcast View (3D)</span>
            </button>

            <button
              onClick={() => setActiveView('pitch')}
              style={{
                background: activeView === 'pitch' ? 'var(--burgundy-deep)' : 'transparent',
                color: activeView === 'pitch' ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                border: 'none',
                borderRadius: '20px',
                padding: '9px 20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Crosshair size={14} />
              <span>Metric 2D Radar</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            MAIN WORKSTATION DISPLAY: Interactive Pitch + Telemetry Cards
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {/* LEFT: Live Interactive Pitch Plane Visualization */}
          <div style={{
            background: 'linear-gradient(165deg, #590907 0%, #3D0504 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 16px 40px rgba(89, 9, 7, 0.28), 0 0 25px rgba(0, 0, 0, 0.2)',
            border: '1.5px solid rgba(232, 210, 181, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '460px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top HUD Status bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 3,
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF6EB',
                  boxShadow: '0 0 8px #FFF6EB'
                }} />
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--cream-beige)',
                  letterSpacing: '0.5px'
                }}>
                  {activeView === 'pitch' ? 'HOMOGRAPHY MATRIX: 3x3 PERSPECTIVE NORMALIZED' : 'RAW BROADCAST PTZ CAMERA PERSPECTIVE'}
                </span>
              </div>

              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.70rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                CALIB RMSE: 0.082m
              </span>
            </div>

            {/* Interactive Pitch Canvas Graphic */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '800px',
              padding: '20px 0'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '520px',
                height: '280px',
                position: 'relative',
                transform: activeView === 'camera'
                  ? 'rotateX(52deg) rotateZ(-12deg) scale(0.92)'
                  : 'rotateX(0deg) rotateZ(0deg) scale(1)',
                transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d'
              }}>
                {/* Tactical Pitch Surface */}
                <svg
                  viewBox="0 0 525 340"
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.45))'
                  }}
                >
                  {/* Pitch Turf Base */}
                  <rect
                    x="0"
                    y="0"
                    width="525"
                    height="340"
                    rx="8"
                    fill="rgba(232, 210, 181, 0.07)"
                    stroke="var(--cream-beige)"
                    strokeWidth="1.8"
                  />

                  {/* Pitch Halfway Line */}
                  <line x1="262.5" y1="0" x2="262.5" y2="340" stroke="var(--cream-beige)" strokeWidth="1.4" opacity="0.85" />

                  {/* Center Circle & Center Spot */}
                  <circle cx="262.5" cy="170" r="46" fill="none" stroke="var(--cream-beige)" strokeWidth="1.4" opacity="0.85" />
                  <circle cx="262.5" cy="170" r="3.5" fill="#FFF6EB" />

                  {/* Left Penalty Area (18-yard box) */}
                  <rect x="0" y="78" width="82" height="184" fill="none" stroke="var(--cream-beige)" strokeWidth="1.4" opacity="0.85" />
                  {/* Left 6-yard box */}
                  <rect x="0" y="122" width="28" height="96" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.75" />
                  {/* Left Penalty Spot & Arc */}
                  <circle cx="55" cy="170" r="3" fill="#FFF6EB" />
                  <path d="M 82 135 A 46 46 0 0 1 82 205" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />

                  {/* Right Penalty Area */}
                  <rect x="443" y="78" width="82" height="184" fill="none" stroke="var(--cream-beige)" strokeWidth="1.4" opacity="0.85" />
                  {/* Right 6-yard box */}
                  <rect x="497" y="122" width="28" height="96" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.75" />
                  {/* Right Penalty Spot & Arc */}
                  <circle cx="470" cy="170" r="3" fill="#FFF6EB" />
                  <path d="M 443 135 A 46 46 0 0 0 443 205" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />

                  {/* 4 Corner Kick Arcs */}
                  <path d="M 0 16 A 16 16 0 0 1 16 0" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />
                  <path d="M 0 324 A 16 16 0 0 0 16 340" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />
                  <path d="M 509 0 A 16 16 0 0 1 525 16" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />
                  <path d="M 509 340 A 16 16 0 0 0 525 324" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.8" />

                  {/* Live Tracked Player Nodes on the Pitch */}
                  {/* Team Alpha (Cream filled nodes) */}
                  {[
                    { x: 180, y: 140, id: 'A-08', speed: '24.2' },
                    { x: 240, y: 195, id: 'A-10', speed: '28.6', striker: true },
                    { x: 210, y: 270, id: 'A-07', speed: '19.4' },
                    { x: 130, y: 170, id: 'A-04', speed: '14.1' },
                    { x: 340, y: 110, id: 'A-09', speed: '31.2' }
                  ].map((p) => (
                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                      {/* Pulse ring */}
                      <circle r="9" fill="none" stroke="var(--cream-beige)" strokeWidth="1" opacity="0.6" />
                      {/* Node core */}
                      <circle r="4.5" fill="#FFF6EB" />
                      {/* Tactical coordinate tag */}
                      <text x="12" y="4" fill="var(--cream-beige)" fontSize="9" fontFamily="monospace" fontWeight="700">
                        {p.id}
                      </text>
                    </g>
                  ))}

                  {/* The Ball Node */}
                  <g transform="translate(248, 188)">
                    <circle r="12" fill="none" stroke="#FFF6EB" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle r="4" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom HUD: Live Homography Matrix Telemetry */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderTop: '1px solid rgba(232, 210, 181, 0.2)',
              paddingTop: '16px',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--cream-beige)'
            }}>
              <div>
                <span style={{ opacity: 0.65 }}>TRANSFORMATION MATRIX H: </span>
                <span style={{ color: '#FFF6EB', fontWeight: 700 }}>
                  [1.042, -0.194, 38.4 | 0.081, 1.205, 14.2 | 0.0001, 0.0003, 1.0]
                </span>
              </div>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span>FPS: <strong style={{ color: '#FFF6EB' }}>60.0</strong></span>
                <span>LATENCY: <strong style={{ color: '#FFF6EB' }}>13.4 ms</strong></span>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 Architecture Capability Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}>
            {/* Card 1: Camera Invariance */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}>
              <div style={{
                background: 'var(--burgundy-deep)',
                color: 'var(--cream-beige)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Layers size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Broadcast PTZ Camera Invariance
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Dynamically detects pitch intersection lines and penalty curves on every frame. Automatically tracks across pan, tilt, and zoom movements without requiring pre-calibrated stadium hardware.
                </p>
              </div>
            </div>

            {/* Card 2: 29 Keypoint Pitch Topology */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}>
              <div style={{
                background: 'var(--burgundy-deep)',
                color: 'var(--cream-beige)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Crosshair size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  29 Pitch Keypoint Topological Calibration
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Solves planar homography using robust RANSAC optimization over 29 canonical pitch intersections, achieving sub-10cm root-mean-square positional precision.
                </p>
              </div>
            </div>

            {/* Card 3: Real-Time Sub-16ms Inference */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}>
              <div style={{
                background: 'var(--burgundy-deep)',
                color: 'var(--cream-beige)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Cpu size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Sub-16ms Real-Time Stream Inference
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Optimized matrix projection computed in &lt;16ms on consumer GPUs, allowing live broadcast overlays and real-time tactical feed delivery at 60 FPS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
