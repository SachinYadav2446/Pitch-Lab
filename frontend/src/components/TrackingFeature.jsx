import React, { useState } from 'react';
import { Scan, Cpu, ShieldCheck, RefreshCw, Zap, Sliders } from 'lucide-react';

export default function TrackingFeature() {
  // 3 Modes: 'detection' (YOLO boxes), 'tracking' (Kalman vectors), 'reid' (Occlusion recovery)
  const [activeMode, setActiveMode] = useState('tracking');

  // Simulated player detections with bounding box coordinates and velocities
  const detections = [
    {
      id: 10,
      role: 'Striker',
      team: 'alpha',
      bbox: { x: 195, y: 110, w: 72, h: 145 },
      conf: 0.964,
      speed: '28.4 km/h',
      kalmanFuture: { x: 235, y: 125 },
      status: 'High Conf Track'
    },
    {
      id: 4,
      role: 'Centerback',
      team: 'beta',
      bbox: { x: 285, y: 120, w: 75, h: 150 },
      conf: 0.938,
      speed: '22.1 km/h',
      kalmanFuture: { x: 295, y: 140 },
      status: 'Contested Duel'
    },
    {
      id: 9,
      role: 'Winger',
      team: 'alpha',
      bbox: { x: 380, y: 65, w: 64, h: 128 },
      conf: 0.912,
      speed: '31.8 km/h',
      kalmanFuture: { x: 420, y: 80 },
      status: 'Sprint Attack'
    },
    {
      id: 7,
      role: 'Midfielder',
      team: 'alpha',
      bbox: { x: 85, y: 130, w: 68, h: 136 },
      conf: 0.947,
      speed: '18.6 km/h',
      kalmanFuture: { x: 105, y: 145 },
      status: 'Support'
    }
  ];

  return (
    <section id="tracking-engine" style={{
      width: '100%',
      position: 'relative',
      backgroundColor: 'var(--bg-sage)',
      padding: '100px 32px 120px',
      borderTop: '1.5px solid rgba(89, 9, 7, 0.15)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
      }}>
        {/* ========================================================
            HEADER ROW: Section tag + Title + Mode Switcher
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
                FEATURE 03 // DEEP LEARNING VISION
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
              Deep Multi-Object Tracking &amp; Re-ID
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Powered by custom-tuned YOLOv8 and ByteTrack. Detects all 22 players and the match ball at sub-pixel resolution,
              preserving continuous identity persistence across high-speed physical duels, camera pans, and severe player occlusions.
            </p>
          </div>

          {/* Interactive Inspection Mode Switcher */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(89, 9, 7, 0.12)',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid rgba(89, 9, 7, 0.2)'
          }}>
            {[
              { id: 'detection', label: 'YOLOv8 BBoxes' },
              { id: 'tracking', label: 'ByteTrack & Kalman' },
              { id: 'reid', label: 'Occlusion Re-ID' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                style={{
                  background: activeMode === tab.id ? 'var(--burgundy-deep)' : 'transparent',
                  color: activeMode === tab.id ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '9px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            MAIN WORKSTATION DISPLAY: Live Detection Screen + Tech Cards
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {/* LEFT: Live Multi-Object Detection HUD Canvas */}
          <div style={{
            background: 'linear-gradient(165deg, #590907 0%, #3D0504 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 16px 40px rgba(89, 9, 7, 0.28), 0 0 25px rgba(0, 0, 0, 0.2)',
            border: '1.5px solid rgba(232, 210, 181, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '480px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top HUD Telemetry Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 3,
              marginBottom: '16px'
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
                  {activeMode === 'detection' && 'YOLOV8 ANCHOR-FREE DETECTIONS (COCO CLS 0 & 32)'}
                  {activeMode === 'tracking' && 'BYTETRACK KALMAN 8D STATE ESTIMATION & VELOCITY'}
                  {activeMode === 'reid' && 'HUNGARIAN BIPARTITE MATCHING & RE-IDENTIFICATION'}
                </span>
              </div>

              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.70rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                INFERENCE: 8.2ms
              </span>
            </div>

            {/* Video Bounding Box Canvas Graphic */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0'
            }}>
              <svg
                viewBox="0 0 540 320"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  height: '280px',
                  overflow: 'visible',
                  filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.45))'
                }}
              >
                {/* Simulated Match Frame Background with pitch perspective lines */}
                <rect
                  x="0"
                  y="0"
                  width="540"
                  height="320"
                  rx="8"
                  fill="rgba(0, 0, 0, 0.3)"
                  stroke="var(--cream-beige)"
                  strokeWidth="1.6"
                />

                {/* Perspective Pitch lines across the broadcast frame */}
                <line x1="0" y1="210" x2="540" y2="210" stroke="rgba(232, 210, 181, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="270" y1="90" x2="270" y2="320" stroke="rgba(232, 210, 181, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 120 320 L 220 90" stroke="rgba(232, 210, 181, 0.15)" strokeWidth="1" />
                <path d="M 420 320 L 320 90" stroke="rgba(232, 210, 181, 0.15)" strokeWidth="1" />

                {/* Player Detections & Tracking Overlays */}
                {detections.map((p) => {
                  const isAlpha = p.team === 'alpha';
                  const boxBorder = isAlpha ? 'var(--cream-beige)' : 'rgba(232, 210, 181, 0.6)';
                  return (
                    <g key={p.id}>
                      {/* 1. Tactical Bounding Box */}
                      <rect
                        x={p.bbox.x}
                        y={p.bbox.y}
                        width={p.bbox.w}
                        height={p.bbox.h}
                        fill={isAlpha ? 'rgba(232, 210, 181, 0.12)' : 'rgba(89, 9, 7, 0.25)'}
                        stroke={boxBorder}
                        strokeWidth="1.5"
                        strokeDasharray={activeMode === 'reid' ? '4 2' : 'none'}
                        rx="4"
                      />

                      {/* 2. Target Corner Crosshairs */}
                      <path d={`M ${p.bbox.x} ${p.bbox.y + 12} L ${p.bbox.x} ${p.bbox.y} L ${p.bbox.x + 12} ${p.bbox.y}`} stroke="#FFF6EB" strokeWidth="2" fill="none" />
                      <path d={`M ${p.bbox.x + p.bbox.w - 12} ${p.bbox.y} L ${p.bbox.x + p.bbox.w} ${p.bbox.y} L ${p.bbox.x + p.bbox.w} ${p.bbox.y + 12}`} stroke="#FFF6EB" strokeWidth="2" fill="none" />
                      <path d={`M ${p.bbox.x} ${p.bbox.y + p.bbox.h - 12} L ${p.bbox.x} ${p.bbox.y + p.bbox.h} L ${p.bbox.x + 12} ${p.bbox.y + p.bbox.h}`} stroke="#FFF6EB" strokeWidth="2" fill="none" />
                      <path d={`M ${p.bbox.x + p.bbox.w - 12} ${p.bbox.y + p.bbox.h} L ${p.bbox.x + p.bbox.w} ${p.bbox.y + p.bbox.h} L ${p.bbox.x + p.bbox.w} ${p.bbox.y + p.bbox.h - 12}`} stroke="#FFF6EB" strokeWidth="2" fill="none" />

                      {/* 3. Top Tag: ID + Confidence */}
                      <rect
                        x={p.bbox.x}
                        y={p.bbox.y - 20}
                        width={p.bbox.w + 14}
                        height="18"
                        rx="3"
                        fill="#3D0605"
                        stroke="rgba(232, 210, 181, 0.45)"
                        strokeWidth="1"
                      />
                      <text
                        x={p.bbox.x + 5}
                        y={p.bbox.y - 7}
                        fill="var(--cream-beige)"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        #{p.id} • {(p.conf * 100).toFixed(1)}%
                      </text>

                      {/* 4. Kalman Velocity Vector (in tracking mode) */}
                      {activeMode === 'tracking' && (
                        <g>
                          <line
                            x1={p.bbox.x + p.bbox.w / 2}
                            y1={p.bbox.y + p.bbox.h}
                            x2={p.kalmanFuture.x}
                            y2={p.kalmanFuture.y}
                            stroke="#FFF6EB"
                            strokeWidth="1.8"
                            strokeDasharray="3 2"
                          />
                          <circle cx={p.kalmanFuture.x} cy={p.kalmanFuture.y} r="3" fill="#FFF6EB" />
                        </g>
                      )}

                      {/* 5. Foot Contact Ground Ellipse */}
                      <ellipse
                        cx={p.bbox.x + p.bbox.w / 2}
                        cy={p.bbox.y + p.bbox.h}
                        rx={p.bbox.w / 2.2}
                        ry="6"
                        fill="none"
                        stroke="var(--cream-beige)"
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })}

                {/* Match Ball Tracking */}
                <g transform="translate(255, 235)">
                  <circle r="12" fill="none" stroke="#FFF6EB" strokeWidth="1.4" strokeDasharray="3 2" />
                  <circle r="4" fill="#FFFFFF" />
                  {/* Ball velocity vector */}
                  <line x1="0" y1="0" x2="28" y2="-18" stroke="#FFF6EB" strokeWidth="1.6" />
                  <polygon points="28,-18 22,-14 26,-8" fill="#FFF6EB" />
                  <text x="14" y="16" fill="var(--cream-beige)" fontSize="8.5" fontFamily="monospace" fontWeight="700">
                    BALL (98.8%)
                  </text>
                </g>
              </svg>
            </div>

            {/* Bottom HUD: Live Deep Learning Benchmarks */}
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
                <span style={{ opacity: 0.65 }}>IDF1 IDENTIFICATION: </span>
                <strong style={{ color: '#FFF6EB' }}>96.8%</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>mAP@50 (PLAYERS): </span>
                <strong style={{ color: '#FFF6EB' }}>93.4%</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>DEVICE: </span>
                <strong style={{ color: '#FFF6EB' }}>CUDA FP16</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>ACTIVE TRACKS: </span>
                <strong style={{ color: '#FFF6EB' }}>22 PLAYERS + 1 BALL</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 Deep Learning Technical Architecture Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}>
            {/* Card 1: Multi-Scale Anchor-Free YOLOv8 */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start'
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
                <Scan size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Anchor-Free CSPDarknet Feature Pyramid
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Eliminates predefined anchor boxes. Predicts object center-ness and sub-pixel bounding box coordinates directly across multi-scale feature pyramids (P3, P4, P5), accurately detecting distant players as small as 16&times;16 pixels.
                </p>
              </div>
            </div>

            {/* Card 2: Two-Stage ByteTrack Association */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start'
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
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Two-Stage ByteTrack Low-Score Recovery
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Standard trackers discard low-confidence detections. ByteTrack splits detections into high and low score tiers, matching high-confidence boxes first, then using low-confidence detections to recover occluded players and motion-blurred frames.
                </p>
              </div>
            </div>

            {/* Card 3: 8D Kalman State Estimation & Re-ID */}
            <div style={{
              background: 'rgba(89, 9, 7, 0.06)',
              border: '1.5px solid rgba(89, 9, 7, 0.18)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start'
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
                  8-Dimensional Kalman Filter State Memory
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Maintains an 8D continuous kinematic state vector per player. If two athletes cross paths or one completely eclipses another for up to 30 frames (1.0s), the track identity is preserved with zero ID swapping upon reappearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
