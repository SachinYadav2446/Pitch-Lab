import React, { useState } from 'react';
import { Target, Activity, Compass, ShieldAlert, Sparkles, BarChart3 } from 'lucide-react';

export default function VoronoiFeature() {
  // 3 Tactical game states: 'overload', 'highpress', 'counter'
  const [tacticalPhase, setTacticalPhase] = useState('overload');

  // Tactical data presets for each phase
  const phaseData = {
    overload: {
      label: 'Half-Space Overload',
      alphaControl: 62.4,
      betaControl: 37.6,
      dangerZoneDom: '84.2%',
      compactness: '482 m²',
      description: 'Numerical superiority generated in the right half-space, isolating the opposition full-back and opening passing lanes into the 18-yard box.',
      alphaPlayers: [
        { id: 'A10', x: 330, y: 150, role: 'Playmaker', dominant: true },
        { id: 'A09', x: 410, y: 110, role: 'Winger' },
        { id: 'A08', x: 280, y: 190, role: 'Central Mid' },
        { id: 'A07', x: 380, y: 220, role: 'Striker' },
        { id: 'A04', x: 190, y: 170, role: 'Anchor' }
      ],
      betaPlayers: [
        { id: 'B05', x: 360, y: 90, role: 'Fullback' },
        { id: 'B04', x: 390, y: 170, role: 'Centerback' },
        { id: 'B06', x: 310, y: 240, role: 'Midfielder' },
        { id: 'B08', x: 240, y: 120, role: 'Presser' }
      ],
      ball: { x: 342, y: 145 },
      // Voronoi partition polygons for visualization
      voronoiPolygons: [
        { d: 'M 220 0 L 360 0 L 340 130 L 260 140 Z', fill: 'rgba(232, 210, 181, 0.18)', stroke: 'var(--cream-beige)' },
        { d: 'M 360 0 L 525 0 L 525 140 L 380 140 L 340 130 Z', fill: 'rgba(232, 210, 181, 0.26)', stroke: '#FFF6EB', highlight: true },
        { d: 'M 260 140 L 340 130 L 380 140 L 350 250 L 250 240 Z', fill: 'rgba(232, 210, 181, 0.22)', stroke: 'var(--cream-beige)' },
        { d: 'M 380 140 L 525 140 L 525 280 L 410 270 L 350 250 Z', fill: 'rgba(89, 9, 7, 0.35)', stroke: 'rgba(232, 210, 181, 0.4)' },
        { d: 'M 250 240 L 350 250 L 410 270 L 525 280 L 525 340 L 200 340 Z', fill: 'rgba(232, 210, 181, 0.15)', stroke: 'var(--cream-beige)' },
        { d: 'M 0 0 L 220 0 L 260 140 L 250 240 L 200 340 L 0 340 Z', fill: 'rgba(89, 9, 7, 0.42)', stroke: 'rgba(232, 210, 181, 0.35)' }
      ]
    },
    highpress: {
      label: 'High Defensive Squeeze',
      alphaControl: 54.1,
      betaControl: 45.9,
      dangerZoneDom: '68.5%',
      compactness: '320 m²',
      description: 'Ultra-compact defensive block suffocating central distribution channels and triggering aggressive sideline traps.',
      alphaPlayers: [
        { id: 'A10', x: 260, y: 160, role: 'Presser' },
        { id: 'A09', x: 300, y: 110, role: 'Winger' },
        { id: 'A08', x: 220, y: 180, role: 'Midfielder' },
        { id: 'A07', x: 290, y: 230, role: 'Presser' },
        { id: 'A04', x: 170, y: 170, role: 'Sweeper' }
      ],
      betaPlayers: [
        { id: 'B05', x: 210, y: 90, role: 'Fullback' },
        { id: 'B04', x: 340, y: 170, role: 'Centerback' },
        { id: 'B06', x: 240, y: 250, role: 'Pivot' },
        { id: 'B08', x: 150, y: 130, role: 'Defender' }
      ],
      ball: { x: 235, y: 168 },
      voronoiPolygons: [
        { d: 'M 0 0 L 270 0 L 240 150 L 150 140 L 0 100 Z', fill: 'rgba(89, 9, 7, 0.45)', stroke: 'rgba(232, 210, 181, 0.4)' },
        { d: 'M 270 0 L 525 0 L 525 180 L 310 160 L 240 150 Z', fill: 'rgba(232, 210, 181, 0.24)', stroke: 'var(--cream-beige)' },
        { d: 'M 150 140 L 240 150 L 310 160 L 280 260 L 170 250 Z', fill: 'rgba(232, 210, 181, 0.32)', stroke: '#FFF6EB', highlight: true },
        { d: 'M 310 160 L 525 180 L 525 340 L 320 340 L 280 260 Z', fill: 'rgba(89, 9, 7, 0.38)', stroke: 'rgba(232, 210, 181, 0.35)' },
        { d: 'M 0 100 L 150 140 L 170 250 L 280 260 L 320 340 L 0 340 Z', fill: 'rgba(232, 210, 181, 0.16)', stroke: 'var(--cream-beige)' }
      ]
    },
    counter: {
      label: 'Direct Transition Counter',
      alphaControl: 71.8,
      betaControl: 28.2,
      dangerZoneDom: '91.0%',
      compactness: '640 m²',
      description: 'Rapid vertical progression exploiting 38 meters of vacated transition corridor behind the opposition midfield.',
      alphaPlayers: [
        { id: 'A10', x: 380, y: 170, role: 'Runner', dominant: true },
        { id: 'A09', x: 440, y: 80, role: 'Winger' },
        { id: 'A08', x: 210, y: 160, role: 'Passer' },
        { id: 'A07', x: 420, y: 260, role: 'Support' },
        { id: 'A04', x: 120, y: 170, role: 'Anchor' }
      ],
      betaPlayers: [
        { id: 'B05', x: 410, y: 130, role: 'Chaser' },
        { id: 'B04', x: 460, y: 200, role: 'Last Man' },
        { id: 'B06', x: 260, y: 120, role: 'Beaten' },
        { id: 'B08', x: 250, y: 230, role: 'Beaten' }
      ],
      ball: { x: 360, y: 168 },
      voronoiPolygons: [
        { d: 'M 0 0 L 280 0 L 240 180 L 120 180 L 0 120 Z', fill: 'rgba(89, 9, 7, 0.38)', stroke: 'rgba(232, 210, 181, 0.35)' },
        { d: 'M 280 0 L 525 0 L 525 120 L 400 130 L 240 180 Z', fill: 'rgba(232, 210, 181, 0.28)', stroke: 'var(--cream-beige)' },
        { d: 'M 240 180 L 400 130 L 525 120 L 525 250 L 430 250 L 270 240 Z', fill: 'rgba(232, 210, 181, 0.36)', stroke: '#FFF6EB', highlight: true },
        { d: 'M 430 250 L 525 250 L 525 340 L 290 340 L 270 240 Z', fill: 'rgba(89, 9, 7, 0.42)', stroke: 'rgba(232, 210, 181, 0.35)' },
        { d: 'M 0 120 L 120 180 L 240 180 L 270 240 L 290 340 L 0 340 Z', fill: 'rgba(232, 210, 181, 0.18)', stroke: 'var(--cream-beige)' }
      ]
    }
  };

  const current = phaseData[tacticalPhase];

  return (
    <section id="space-control" style={{
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
            HEADER ROW: Section tag + Title + Phase Selectors
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
                FEATURE 02 // TACTICAL INTELLIGENCE
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
              Dynamic Space Control & Voronoi Dominance
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Quantify off-the-ball space control in real time. Mathematical spatial partitioning computes
              which team dominates every square meter of turf, detecting space creation, pressing triggers, and line-breaking corridors.
            </p>
          </div>

          {/* Tactical Phase Selector Tabs */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(89, 9, 7, 0.12)',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid rgba(89, 9, 7, 0.2)'
          }}>
            {[
              { id: 'overload', label: 'Overload Attack' },
              { id: 'highpress', label: 'High Press' },
              { id: 'counter', label: 'Fast Counter' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTacticalPhase(tab.id)}
                style={{
                  background: tacticalPhase === tab.id ? 'var(--burgundy-deep)' : 'transparent',
                  color: tacticalPhase === tab.id ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
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
            MAIN WORKSTATION DISPLAY: Voronoi Pitch Map + Analytics Cards
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {/* LEFT: Live Voronoi Pitch Simulation */}
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
            {/* Top Territory Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: 3,
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: 'var(--cream-beige)'
              }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#FFF6EB' }}>TEAM ALPHA (ATTACK): {current.alphaControl}%</span>
                </div>
                <div>
                  <span style={{ opacity: 0.8 }}>TEAM BETA (DEFEND): {current.betaControl}%</span>
                </div>
              </div>

              {/* Real-time territory progress split bar */}
              <div style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'rgba(89, 9, 7, 0.6)',
                border: '1px solid rgba(232, 210, 181, 0.3)',
                overflow: 'hidden',
                display: 'flex'
              }}>
                <div style={{
                  width: `${current.alphaControl}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #E8D2B5 0%, #FFF6EB 100%)',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
                <div style={{
                  width: `${current.betaControl}%`,
                  height: '100%',
                  background: 'rgba(89, 9, 7, 0.8)',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Voronoi Pitch Map Graphic */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0'
            }}>
              <svg
                viewBox="0 0 525 340"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  height: '280px',
                  overflow: 'visible',
                  filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.45))'
                }}
              >
                {/* 1. Underlying Pitch Base */}
                <rect
                  x="0"
                  y="0"
                  width="525"
                  height="340"
                  rx="8"
                  fill="rgba(0, 0, 0, 0.25)"
                  stroke="var(--cream-beige)"
                  strokeWidth="1.8"
                />

                {/* 2. Voronoi Polygonal Cells */}
                {current.voronoiPolygons.map((poly, idx) => (
                  <path
                    key={idx}
                    d={poly.d}
                    fill={poly.fill}
                    stroke={poly.stroke}
                    strokeWidth={poly.highlight ? '1.8' : '1'}
                    strokeDasharray={poly.highlight ? 'none' : '4 3'}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                ))}

                {/* Pitch Markings Overlay */}
                <line x1="262.5" y1="0" x2="262.5" y2="340" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.6" />
                <circle cx="262.5" cy="170" r="46" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.6" />
                <circle cx="262.5" cy="170" r="3" fill="#FFF6EB" opacity="0.8" />
                <rect x="0" y="78" width="82" height="184" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.6" />
                <rect x="443" y="78" width="82" height="184" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" opacity="0.6" />

                {/* 3. Team Alpha Players (Cream Nodes) */}
                {current.alphaPlayers.map((p) => (
                  <g key={p.id} transform={`translate(${p.x}, ${p.y})`} style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <circle r={p.dominant ? 12 : 8} fill="none" stroke="#FFF6EB" strokeWidth="1.2" opacity="0.75" />
                    <circle r="4.5" fill="#FFF6EB" />
                    <text x="12" y="4" fill="#FFF6EB" fontSize="9" fontFamily="monospace" fontWeight="700">
                      {p.id}
                    </text>
                  </g>
                ))}

                {/* 4. Team Beta Players (Burgundy-ringed Nodes) */}
                {current.betaPlayers.map((p) => (
                  <g key={p.id} transform={`translate(${p.x}, ${p.y})`} style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <circle r="8" fill="none" stroke="var(--cream-beige)" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                    <circle r="4" fill="var(--burgundy-deep)" stroke="var(--cream-beige)" strokeWidth="1.2" />
                    <text x="10" y="4" fill="var(--cream-beige)" fontSize="8.5" fontFamily="monospace" opacity="0.8">
                      {p.id}
                    </text>
                  </g>
                ))}

                {/* 5. The Ball */}
                <g transform={`translate(${current.ball.x}, ${current.ball.y})`} style={{ transition: 'transform 0.5s ease' }}>
                  <circle r="10" fill="none" stroke="#FFF6EB" strokeWidth="1.2" strokeDasharray="3 2" />
                  <circle r="3.5" fill="#FFFFFF" />
                </g>
              </svg>
            </div>

            {/* Bottom HUD: Live Tactical Breakdown */}
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
                <span style={{ opacity: 0.65 }}>DANGER ZONE DOMINANCE: </span>
                <strong style={{ color: '#FFF6EB' }}>{current.dangerZoneDom}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>TEAM COMPACTNESS: </span>
                <strong style={{ color: '#FFF6EB' }}>{current.compactness}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>CURRENT TACTICAL PHASE: </span>
                <strong style={{ color: '#FFF6EB' }}>{current.label.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 Tactical Capability Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}>
            {/* Card 1: Dynamic Voronoi Tessellation */}
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
                <Compass size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Kinematic Arrival Time Space Partitioning
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Traditional Voronoi only measures static Euclidean distance. Our engine incorporates player instantaneous velocity vectors and physical acceleration capacity to compute true time-to-intercept pitch control.
                </p>
              </div>
            </div>

            {/* Card 2: Half-Space Overloads & Space Creation */}
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
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Off-The-Ball Decoy & Space Creation Scoring
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Rewards the unsung heroes of tactical football. Automatically flags blindside decoy runs that drag central defenders away, opening high-value shooting corridors for teammates.
                </p>
              </div>
            </div>

            {/* Card 3: Defensive Line Height & Pressing Blocks */}
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
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Convex Hull Compactness & Press Resistance
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Monitors real-time geometric centroids for both squads. Calculates team compactness area in square meters and triggers tactical alerts when lines stretch beyond manageable defensive thresholds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
