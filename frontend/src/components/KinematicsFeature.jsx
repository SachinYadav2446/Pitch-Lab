import React, { useState } from 'react';
import { Gauge, Zap, TrendingUp, Activity, Flame, Award } from 'lucide-react';

export default function KinematicsFeature() {
  const [selectedZone, setSelectedZone] = useState('sprint');

  const speedZones = [
    { id: 'walking', name: 'Zone 1: Walking', range: '0 – 7 km/h', color: '#B4B6AA', percentage: '28.4%' },
    { id: 'jogging', name: 'Zone 2: Jogging', range: '7 – 15 km/h', color: '#DFCAAE', percentage: '42.1%' },
    { id: 'running', name: 'Zone 3: Running', range: '15 – 20 km/h', color: '#E8D2B5', percentage: '18.2%' },
    { id: 'highspeed', name: 'Zone 4: High Speed', range: '20 – 25 km/h', color: '#F6E7D5', percentage: '7.8%' },
    { id: 'sprint', name: 'Zone 5: Sprint', range: '> 25 km/h', color: '#FFF6EB', percentage: '3.5%', highlight: true }
  ];

  const leaderboard = [
    { rank: '01', player: '#10 Striker', topSpeed: '33.8 km/h', distance: '11.4 km', sprints: 38, team: 'Alpha' },
    { rank: '02', player: '#09 Winger', topSpeed: '32.9 km/h', distance: '10.8 km', sprints: 34, team: 'Alpha' },
    { rank: '03', player: '#05 Fullback', topSpeed: '31.4 km/h', distance: '11.1 km', sprints: 29, team: 'Beta' },
    { rank: '04', player: '#08 Midfield', topSpeed: '29.2 km/h', distance: '12.6 km', sprints: 22, team: 'Alpha' },
    { rank: '05', player: '#04 Centerback', topSpeed: '28.6 km/h', distance: '9.4 km', sprints: 16, team: 'Beta' }
  ];

  return (
    <section id="kinematics-engine" style={{
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
        {/* Header Row */}
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
                FEATURE 05 // KINEMATIC PHYSICAL TELEMETRY
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
              Metric Velocity &amp; Sprint Telemetry
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Converts pixel displacement on the 2D pitch plane into calibrated physical motion metrics.
              Extracts instantaneous velocities (km/h), high-intensity sprint distance, explosive deceleration G-forces, and physiological fatigue curves with zero GPS wearables.
            </p>
          </div>

          {/* Speed Zone Selector Pills */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(89, 9, 7, 0.12)',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid rgba(89, 9, 7, 0.2)'
          }}>
            {speedZones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                style={{
                  background: selectedZone === z.id ? 'var(--burgundy-deep)' : 'transparent',
                  color: selectedZone === z.id ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '9px 16px',
                  fontSize: '0.80rem',
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {z.range}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workstation Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {/* LEFT: Live Physical Performance Leaderboard & Velocity Chart */}
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
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              zIndex: 3
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="var(--cream-beige)" />
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--cream-beige)',
                  letterSpacing: '0.5px'
                }}>
                  MATCH SPEED LEADERBOARD // MAX ACCELERATION 4.8 m/s²
                </span>
              </div>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.70rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                SAMPLING: 30 FPS
              </span>
            </div>

            {/* Performance Leaderboard Table */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1
            }}>
              {leaderboard.map((row) => (
                <div
                  key={row.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: row.rank === '01' ? 'rgba(232, 210, 181, 0.16)' : 'rgba(0, 0, 0, 0.2)',
                    border: row.rank === '01' ? '1px solid rgba(232, 210, 181, 0.4)' : '1px solid rgba(232, 210, 181, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.80rem',
                      fontWeight: 800,
                      color: row.rank === '01' ? '#FFF6EB' : 'var(--cream-beige)',
                      opacity: row.rank === '01' ? 1 : 0.6
                    }}>
                      {row.rank}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFF6EB' }}>
                        {row.player}
                      </div>
                      <div style={{ fontSize: '0.70rem', fontFamily: 'monospace', color: 'var(--cream-beige)', opacity: 0.7 }}>
                        Team {row.team} • {row.sprints} Explosive Sprints
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: row.rank === '01' ? '#FFF6EB' : 'var(--cream-beige)'
                    }}>
                      {row.topSpeed}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--cream-beige)', opacity: 0.75 }}>
                      {row.distance} Total
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom HUD */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderTop: '1px solid rgba(232, 210, 181, 0.2)',
              paddingTop: '16px',
              marginTop: '16px',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--cream-beige)'
            }}>
              <div>
                <span style={{ opacity: 0.65 }}>SMOOTHING: </span>
                <strong style={{ color: '#FFF6EB' }}>SAVITZKY-GOLAY 7-FRAME</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>METRIC RESOLUTION: </span>
                <strong style={{ color: '#FFF6EB' }}>0.01 m/s</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>GPS ERROR: </span>
                <strong style={{ color: '#4ADE80' }}>0.0% (OPTICAL)</strong>
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
            {/* Card 1 */}
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
                <Gauge size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Planar Metric Displacement Calculus
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Measures Euclidean ground displacement directly in real-world metric space (meters) rather than pixel space. Multiplies by frame rate (30/60 FPS) to yield true physical ground velocity in km/h.
                </p>
              </div>
            </div>

            {/* Card 2 */}
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
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Rolling Exponential &amp; Savitzky-Golay Filter
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Raw video tracking contains optical jitter from camera vibrations. An adaptive low-pass filter smooths frame-to-frame noise without blunting peak sprint bursts or sudden stops.
                </p>
              </div>
            </div>

            {/* Card 3 */}
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
                <Activity size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  High-Intensity Deceleration G-Force Load
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Detects aggressive decelerations exceeding 4.0 m/s&sup2;. Tracks eccentric muscular strain on hamstrings and adductors to predict fatigue curves and protect player safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
