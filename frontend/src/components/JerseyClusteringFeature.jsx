import React, { useState } from 'react';
import { Palette, Filter, Layers, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

export default function JerseyClusteringFeature() {
  const [activeCluster, setActiveCluster] = useState('alpha');

  const clusters = {
    alpha: {
      name: 'Team Alpha (Home)',
      role: 'Outfield Squad A',
      rgb: 'rgb(232, 210, 181)',
      hex: '#E8D2B5',
      hsv: 'H: 34° • S: 22% • V: 91%',
      confidence: '99.2%',
      samplePlayers: ['#10 Striker', '#08 Midfield', '#09 Winger', '#04 Anchor'],
      dominantFeatures: 'Cream Beige Primary with Warm White Ribbing'
    },
    beta: {
      name: 'Team Beta (Away)',
      role: 'Outfield Squad B',
      rgb: 'rgb(89, 9, 7)',
      hex: '#590907',
      hsv: 'H: 2° • S: 92% • V: 35%',
      confidence: '98.7%',
      samplePlayers: ['#05 Fullback', '#04 Centerback', '#06 Pivot', '#11 Forward'],
      dominantFeatures: 'Deep Burgundy Base with Dark Charcoal Stripes'
    },
    officials: {
      name: 'Match Officials',
      role: 'Referees & Linesmen',
      rgb: 'rgb(220, 240, 70)',
      hex: '#DCF046',
      hsv: 'H: 68° • S: 72% • V: 94%',
      confidence: '99.6%',
      samplePlayers: ['Lead Referee', 'Assistant Ref 1', 'Assistant Ref 2'],
      dominantFeatures: 'High-Vis Fluorescent Neon Yellow'
    }
  };

  const current = clusters[activeCluster];

  return (
    <section id="clustering-engine" style={{
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
                FEATURE 04 // UNSUPERVISED MACHINE LEARNING
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
              Automated Jersey Pigment Clustering
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Eliminates manual squad labeling. Automatically crops player upper-torso regions, isolates pigments from pitch grass in HSV color space, and clusters athletes into Home, Away, and Match Officials using unsupervised K-Means in &lt;1.4 ms.
            </p>
          </div>

          {/* Cluster Switcher */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(89, 9, 7, 0.12)',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid rgba(89, 9, 7, 0.2)'
          }}>
            {[
              { id: 'alpha', label: 'Team Alpha (Home)' },
              { id: 'beta', label: 'Team Beta (Away)' },
              { id: 'officials', label: 'Match Officials' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCluster(tab.id)}
                style={{
                  background: activeCluster === tab.id ? 'var(--burgundy-deep)' : 'transparent',
                  color: activeCluster === tab.id ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
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

        {/* Main Workstation Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {/* LEFT: Live Pigment Cluster Workbench */}
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
            {/* Top Status */}
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
                  backgroundColor: current.hex,
                  boxShadow: `0 0 8px ${current.hex}`
                }} />
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--cream-beige)',
                  letterSpacing: '0.5px'
                }}>
                  CLUSTER K=3 // {current.name.toUpperCase()} ({current.confidence} CONF)
                </span>
              </div>

              <span style={{
                fontFamily: 'monospace',
                fontSize: '0.70rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                HSV ISOLATION TIME: 1.2ms
              </span>
            </div>

            {/* Visual Color Spectrum Canvas */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
              padding: '10px 0'
            }}>
              {/* Torso Crop Mockup & HSV Extraction */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(232, 210, 181, 0.2)'
              }}>
                {/* Visual Swatch */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '12px',
                  backgroundColor: current.hex,
                  border: '2px solid #FFF6EB',
                  boxShadow: `0 8px 24px ${current.hex}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Palette size={32} color={activeCluster === 'beta' ? '#FFF6EB' : '#590907'} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--cream-beige)', opacity: 0.7 }}>
                    CLUSTER CENTROID VECTOR
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF6EB', letterSpacing: '-0.02em' }}>
                    {current.name}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.80rem', color: 'var(--cream-beige)' }}>
                    {current.hsv}
                  </div>
                  <div style={{ fontSize: '0.80rem', color: 'var(--cream-beige)', opacity: 0.85 }}>
                    {current.dominantFeatures}
                  </div>
                </div>
              </div>

              {/* HSV Grass Mask Rejection Bar */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(232, 210, 181, 0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'monospace', color: 'var(--cream-beige)' }}>
                  <span>PITCH TURF REJECTION MASK (HSV: 35° – 75°)</span>
                  <span style={{ color: '#4ADE80', fontWeight: 700 }}>99.8% FILTERED</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  borderRadius: '5px',
                  background: 'linear-gradient(90deg, #E8D2B5 0%, #E8D2B5 20%, #430504 20%, #430504 45%, #22c55e 45%, #15803d 75%, #DCF046 75%, #DCF046 100%)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--cream-beige)', opacity: 0.65 }}>
                  <span>Team Beta (Red)</span>
                  <span>Team Alpha (Cream)</span>
                  <span>Pitch Grass (Filtered)</span>
                  <span>Referees (Neon)</span>
                </div>
              </div>
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
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--cream-beige)'
            }}>
              <div>
                <span style={{ opacity: 0.65 }}>ALGORITHM: </span>
                <strong style={{ color: '#FFF6EB' }}>K-MEANS ++ (K=3)</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>COLOR SPACE: </span>
                <strong style={{ color: '#FFF6EB' }}>HSV + CIELAB</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>SAMPLES TRACKED: </span>
                <strong style={{ color: '#FFF6EB' }}>22 PLAYERS</strong>
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
                <Filter size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Adaptive HSV Green Turf Suppression
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Filters pitch grass pixels dynamically before clustering. Isolates hue angles between 35&deg; and 75&deg; to ensure green shadows and stadium lighting artifacts never contaminate jersey pigment identification.
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
                <Layers size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Anatomical Upper-Torso Crop Extraction
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Samples exclusively from the top 45% of each YOLO bounding box, filtering out shorts, socks, skin tones, and cleats. Guarantees 99.2% cluster purity on jersey colors.
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
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--burgundy-deep)',
                  marginBottom: '6px'
                }}>
                  Unsupervised K-Means++ Convergence
                </h4>
                <p style={{
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  color: 'var(--text-burgundy-muted)',
                  fontWeight: 500
                }}>
                  Converges within 8 iterations to establish definitive cluster centroids for Squad A, Squad B, and Referees, requiring zero manual pre-match training or color registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
