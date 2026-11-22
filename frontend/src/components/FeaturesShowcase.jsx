import React, { useState, useRef } from 'react';
import FlexCarousel from './FlexCarousel';
import { 
  Sparkles, Layers, Sliders, Play, Maximize2, Activity, Cpu, ArrowRight 
} from 'lucide-react';

const FEATURE_ITEMS = [
  {
    src: '/features/feature_01_homography.jpg',
    alt: 'Planar Pitch Homography Engine',
    title: 'Planar Pitch Homography Engine',
    subtitle: 'Module 01 // Sub-Millimeter 2D Metric Pitch Rectification H(3x3)'
  },
  {
    src: '/features/feature_02_voronoi.jpg',
    alt: 'Dynamic Space Control & Voronoi Dominance',
    title: 'Dynamic Space Control & Voronoi Dominance',
    subtitle: 'Module 02 // Real-Time 22-Player Territorial Partitioning & Overload Calculus'
  },
  {
    src: '/features/feature_03_tracking.jpg',
    alt: 'Deep Multi-Object Tracking & Re-ID',
    title: 'Deep Multi-Object Tracking & ByteTrack Re-ID',
    subtitle: 'Module 03 // YOLOv8x + 8D Kalman Filter + Low-Score Association'
  },
  {
    src: '/features/feature_04_clustering.jpg',
    alt: 'Automated Jersey Pigment Clustering',
    title: 'Automated Jersey Pigment Clustering',
    subtitle: 'Module 04 // Unsupervised K-Means in 3D HSV Space with Grass Rejection'
  },
  {
    src: '/features/feature_05_kinematics.jpg',
    alt: 'Metric Velocity & FIFA Sprint Telemetry',
    title: 'Metric Kinematic Velocity Calculus',
    subtitle: 'Module 05 // High-Intensity Running (HIR) & Deceleration G-Force Load'
  },
  {
    src: '/features/feature_06_biomechanics.jpg',
    alt: '3D Biomechanical Pose & Strike Mechanics',
    title: '3D Biomechanical Pose & Strike Engine',
    subtitle: 'Module 06 // ViTPose-H 17 Keypoints, Torso Coil & Kinetic Chain Whip'
  },
  {
    src: '/features/feature_07_visionstudio.jpg',
    alt: 'Interactive Vision Studio & Live 2D Radar',
    title: 'Vision Studio & Synchronized 2D Radar',
    subtitle: 'Module 07 // Broadcast Telemetry HUD & Live 105m x 68m Planar Minimap'
  },
  {
    src: '/features/feature_08_pipeline.jpg',
    alt: 'Autonomous Edge Pipeline Architecture',
    title: 'Autonomous Production Pipeline',
    subtitle: 'Module 08 // 64.9 FPS Real-Time Throughput & 14.8ms End-to-End Latency'
  }
];

export default function FeaturesShowcase() {
  const [currentPreset, setCurrentPreset] = useState('liquid');
  const [activeCardHeight, setActiveCardHeight] = useState(0.55);
  const [activeGap, setActiveGap] = useState(16);
  const [activeSqueeze, setActiveSqueeze] = useState(0.22);
  const [activeFit, setActiveFit] = useState('natural');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const presets = [
    { id: 'liquid', label: 'Liquid Glass' },
    { id: 'ribbon', label: 'Tactical Ribbon' },
    { id: 'vortex', label: 'Vortex Lens' },
    { id: 'arch', label: 'Arch Flow' }
  ];

  const currentItem = FEATURE_ITEMS[selectedIndex] || FEATURE_ITEMS[0];

  return (
    <section id="features-showcase" style={{
      position: 'relative',
      width: '100%',
      backgroundColor: 'var(--bg-sage)',
      padding: '70px 0 100px',
      overflow: 'hidden',
      borderTop: '1px solid rgba(89, 9, 7, 0.15)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 48px',
        boxSizing: 'border-box'
      }}>
        {/* Section Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-bg)',
              padding: '5px 12px',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <Activity size={13} color="var(--cream-light)" />
              <span>SYSTEM ARCHITECTURE // INTERACTIVE WEBGL FEATURE CAROUSEL</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 10px 0'
            }}>
              Autonomous Spatial Vision Modules
            </h2>

            <p style={{
              color: '#380504',
              fontSize: '1rem',
              maxWidth: '820px',
              margin: 0,
              opacity: 0.9,
              lineHeight: 1.55
            }}>
              Explore our complete suite of deep learning, computer vision, and biomechanical intelligence systems. 
              Drag, scroll, or click cards to focus and inspect real-time neural inference weights.
            </p>
          </div>

          {/* Interactive WebGL Preset Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid var(--burgundy-deep)',
            padding: '4px',
            borderRadius: '2px'
          }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--burgundy-deep)',
              padding: '0 8px',
              letterSpacing: '0.04em'
            }}>
              LENS PRESET:
            </span>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => setCurrentPreset(p.id)}
                style={{
                  backgroundColor: currentPreset === p.id ? 'var(--burgundy-deep)' : 'transparent',
                  color: currentPreset === p.id ? 'var(--cream-bg)' : 'var(--burgundy-deep)',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '5px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main WebGL FlexCarousel Container */}
      <div style={{
        width: '100%',
        height: '620px',
        position: 'relative'
      }}>
        <FlexCarousel
          items={FEATURE_ITEMS}
          preset={currentPreset}
          intro="rise"
          cardHeight={activeCardHeight}
          gap={activeGap}
          radius={2}
          fit={activeFit}
          squeeze={activeSqueeze}
          focusOnClick
          captions
          captureWheel={false}
          autoplay={false}
          onChange={(index) => setSelectedIndex(index)}
        />
      </div>

      {/* Bottom Architectural HUD Strip */}
      <div style={{
        maxWidth: '1440px',
        margin: '24px auto 0',
        padding: '0 48px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid var(--burgundy-deep)',
          borderRadius: '2px',
          padding: '14px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(89, 9, 7, 0.06)'
        }}>
          {/* Active Module Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2A9D8F',
              boxShadow: '0 0 6px #2A9D8F'
            }} />
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>
                FOCUSED ARCHITECTURE MODULE
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--burgundy-deep)' }}>
                {currentItem.title}
              </div>
            </div>
          </div>

          {/* Quick Technical Specs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>INFERENCE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>14.8 ms</div>
            </div>
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>THROUGHPUT</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>64.9 FPS</div>
            </div>
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>PRECISION</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#E63946', fontFamily: 'monospace' }}>Sub-MM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
