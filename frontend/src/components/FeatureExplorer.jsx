import React, { useState } from 'react';
import LineSidebar from './LineSidebar';
import { ArrowRight, Check, Activity, ChevronRight } from 'lucide-react';

const FEATURES_DATA = [
  {
    id: 'homography',
    title: 'Planar Pitch Homography',
    tag: 'MODULE 01 // SPATIAL VISION',
    tagline: 'Sub-millimeter 2D metric pitch rectification via projective transformation matrix H(3x3).',
    image: '/features/feature_01_homography.jpg',
    specs: [
      { label: 'Latency', value: '1.8 ms' },
      { label: 'Precision', value: '0.8 mm' },
      { label: 'Algorithm', value: 'RANSAC + Epipolar' },
      { label: 'Throughput', value: '120 FPS' }
    ],
    subfeatures: [
      {
        id: 'h_warp',
        number: '01',
        tabLabel: 'Projective Warp',
        name: 'Projective Homography Warp H(3x3)',
        description: 'Maps raw distorted broadcast angles to an exact 105m x 68m top-down coordinate plane with sub-pixel planar alignment.',
        bullets: [
          'Direct linear transform (DLT) with 4-point correspondence',
          'RANSAC outlier elimination for camera motion compensation',
          'GPU-accelerated bilinear texture warping'
        ]
      },
      {
        id: 'h_epipolar',
        number: '02',
        tabLabel: 'Epipolar Calibration',
        name: 'Epipolar Pitch Calibration',
        description: 'Aligns broadcast lenses against calibrated pitch lines (touchlines, 18-yard box, center circle).',
        bullets: [
          'Automated landmark extraction across 12 pitch intersections',
          'Radial & tangential lens distortion polynomial correction',
          'Continuous frame-to-frame extrinsic parameter tracking'
        ]
      },
      {
        id: 'h_metric',
        number: '03',
        tabLabel: 'Metric Projection',
        name: 'Metric Coordinate Projection (105m x 68m)',
        description: 'Translates pixel displacements directly into SI metric meters and velocities across the pitch plane.',
        bullets: [
          'Standardized FIFA 105m x 68m dimension normalization',
          'Zero-elevation ground-plane restriction for player cleats',
          'Z-axis vertical ray casting for aerial ball trajectories'
        ]
      }
    ]
  },
  {
    id: 'voronoi',
    title: 'Dynamic Space & Voronoi',
    tag: 'MODULE 02 // GEOMETRIC ML',
    tagline: 'Real-time 22-player territorial partitioning, passing lane occlusion, and space dominance calculus.',
    image: '/features/feature_02_voronoi.jpg',
    specs: [
      { label: 'Latency', value: '1.4 ms' },
      { label: 'Resolution', value: '105 x 68 m' },
      { label: 'Algorithm', value: 'Delaunay + Voronoi' },
      { label: 'Throughput', value: '140 FPS' }
    ],
    subfeatures: [
      {
        id: 'v_partition',
        number: '01',
        tabLabel: '22-Player Partitioning',
        name: '22-Player Voronoi Partitioning',
        description: 'Computes continuous territorial dominance polygons bounded by pitch boundaries at 60 FPS.',
        bullets: [
          'Euclidean distance metric weighted by player sprint velocity vectors',
          'Convex hull boundary clipping at pitch touchlines and goal lines',
          'Sub-millisecond dual Delaunay triangulation graph construction'
        ]
      },
      {
        id: 'v_dominance',
        number: '02',
        tabLabel: 'Space Dominance',
        name: 'Space Dominance Ratio (m²)',
        description: 'Calculates the exact square meters controlled by Team Alpha vs Team Beta across all pitch thirds.',
        bullets: [
          'Live split possession and territorial pressure percentages',
          'Dangerous zone penetration index in the final 18-yard box',
          'Continuous overload tracking for wing attacks and half-spaces'
        ]
      },
      {
        id: 'v_passing',
        number: '03',
        tabLabel: 'Lane Occlusion',
        name: 'Passing Lane Occlusion Calculus',
        description: 'Traces line-of-sight passing ray vectors to evaluate intercepted trajectory risks and open passing options.',
        bullets: [
          'Defensive shadow cone calculation for intercepting defenders',
          'Optimal passing receiver scoring based on open space volume',
          'Autonomous pressing trigger alert when passing lanes drop to zero'
        ]
      }
    ]
  },
  {
    id: 'tracking',
    title: 'Deep Multi-Object Tracking',
    tag: 'MODULE 03 // DEEP TRACKING',
    tagline: 'YOLOv8x detection coupled with 8D Kalman filter vectors and ByteTrack low-score association.',
    image: '/features/feature_03_tracking.jpg',
    specs: [
      { label: 'Inference', value: '6.4 ms' },
      { label: 'Tracks', value: '22 + 1 Objects' },
      { label: 'Model', value: 'YOLOv8x + ByteTrack' },
      { label: 'Throughput', value: '64.9 FPS' }
    ],
    subfeatures: [
      {
        id: 't_yolo',
        number: '01',
        tabLabel: 'Feature Detection',
        name: 'YOLOv8x Feature Detection',
        description: 'High-precision CNN backbone outputting bounding box coordinates, class labels, and confidence probabilities.',
        bullets: [
          'TensorRT FP16 optimized inference taking only 6.4ms on GPU',
          'Dual detection classes: Player (Human) and Football (Micro-object)',
          'NMS IoU thresholding tuned to resolve congested goalmouth duels'
        ]
      },
      {
        id: 't_kalman',
        number: '02',
        tabLabel: 'Kalman Vectors',
        name: '8D Kalman Filter Vectors',
        description: 'Maintains state vectors [x, y, a, h, vx, vy, va, vh] to predict future positions through physical occlusions.',
        bullets: [
          'Linear motion model tracking velocity and aspect ratio evolution',
          'Smooth interpolation across missed detection frames',
          'Measurement covariance update dynamically scaled by confidence'
        ]
      },
      {
        id: 't_bytetrack',
        number: '03',
        tabLabel: 'ByteTrack Recovery',
        name: 'ByteTrack Low-Score Recovery',
        description: 'Recovers occluded or motion-blurred players using low-confidence secondary association stages.',
        bullets: [
          'First stage: Associates high-score boxes with existing tracklets',
          'Second stage: Associates remaining tracklets with low-score detections',
          'Eliminates ID switches when players cross paths during duels'
        ]
      }
    ]
  },
  {
    id: 'clustering',
    title: 'Jersey Pigment Clustering',
    tag: 'MODULE 04 // UNSUPERVISED ML',
    tagline: 'K-Means color segmentation in 3D HSV space with automatic pitch grass rejection.',
    image: '/features/feature_04_clustering.jpg',
    specs: [
      { label: 'Latency', value: '1.5 ms' },
      { label: 'Color Space', value: '3D HSV' },
      { label: 'Clustering', value: 'Adaptive K-Means' },
      { label: 'Throughput', value: '150 FPS' }
    ],
    subfeatures: [
      {
        id: 'c_hsv',
        number: '01',
        tabLabel: '3D HSV Space',
        name: '3D HSV Color Transformation',
        description: 'Converts RGB bounding box pixels into Hue, Saturation, and Value to isolate pigment invariant to shadows.',
        bullets: [
          'Decouples luminance from chromaticity for stadium shadow tolerance',
          'Gaussian hue angle weighting for circular color continuity',
          'Histogram normalization across varying floodlight temperatures'
        ]
      },
      {
        id: 'c_grass',
        number: '02',
        tabLabel: 'Grass Rejection',
        name: 'Pitch Grass Mask Rejection',
        description: 'Discards background grass pixels (Hue 35-85°) to isolate pure jersey fabric colors.',
        bullets: [
          'Morphological opening and closing filters to remove green spillover',
          'Upper-torso bounding box cropping (excluding legs and pitch turf)',
          'Edge-preserving bilateral filtering around shirt borders'
        ]
      },
      {
        id: 'c_kmeans',
        number: '03',
        tabLabel: 'Team Centroids',
        name: 'K-Means Team Centroid Convergence',
        description: 'Partitions detected players into Team Alpha, Team Beta, Goalkeepers, and Match Officials.',
        bullets: [
          'Automatic K=2/K=4 centroid convergence in < 2 iterations',
          'Temporal smoothing: locks team jersey pigments across match duration',
          'Outlier detection for yellow/black referee jerseys and neon GK kits'
        ]
      }
    ]
  },
  {
    id: 'kinematics',
    title: 'Kinematic Velocity Calculus',
    tag: 'MODULE 05 // BIOMETRICS',
    tagline: 'High-intensity running (HIR) analysis, 5 FIFA sprint zones, and deceleration G-force load telemetry.',
    image: '/features/feature_05_kinematics.jpg',
    specs: [
      { label: 'Latency', value: '1.2 ms' },
      { label: 'Sample Rate', value: '30 Hz' },
      { label: 'Method', value: 'Savitzky-Golay' },
      { label: 'Throughput', value: '180 FPS' }
    ],
    subfeatures: [
      {
        id: 'k_fifa',
        number: '01',
        tabLabel: 'FIFA Sprint Zones',
        name: '5-Zone FIFA Sprint Calculus',
        description: 'Categorizes instantaneous player ground speeds into official FIFA physical performance tiers.',
        bullets: [
          'Zone 1 (Walking: 0-7.2 km/h) to Zone 5 (Sprinting: > 25.2 km/h)',
          'Savitzky-Golay filtering over 5-frame rolling window to eliminate jitter',
          'Accumulated distance telemetry per sprint zone over 90 minutes'
        ]
      },
      {
        id: 'k_decel',
        number: '02',
        tabLabel: 'Deceleration Load',
        name: 'Deceleration G-Force & Joint Load',
        description: 'Measures negative acceleration peaks (up to -7.5 m/s²) to identify metabolic fatigue and hamstring strain risk.',
        bullets: [
          'Second derivative of position calculus: a = d²x/dt²',
          'Impact shock absorption tracking on directional cuts and slide tackles',
          'Fatigue degradation index correlating 2nd half deceleration capacity'
        ]
      },
      {
        id: 'k_leaderboard',
        number: '03',
        tabLabel: 'Sprint Leaderboard',
        name: 'Real-Time Physical Leaderboard',
        description: 'Surfaces live top sprint speeds, total distance covered, and high-intensity sprint bursts across all 22 players.',
        bullets: [
          'Instantaneous maximum velocity records (e.g. Mbappé: 36.8 km/h)',
          'Metabolic power calculation in Watts per kilogram (W/kg)',
          'Interactive selection to isolate specific athlete sprint tracks'
        ]
      }
    ]
  },
  {
    id: 'biomechanics',
    title: '3D Biomechanical Pose',
    tag: 'MODULE 06 // 3D SKELETON',
    tagline: 'ViTPose-H 17 3D skeletal landmark tracking with pelvic-thoracic rotational twist and cleat impact physics.',
    image: '/features/feature_06_biomechanics.jpg',
    specs: [
      { label: 'Latency', value: '8.2 ms' },
      { label: 'Joints', value: '17 3D Nodes' },
      { label: 'Model', value: 'ViTPose-H + Lift' },
      { label: 'Sampling', value: '240 Hz' }
    ],
    subfeatures: [
      {
        id: 'b_vitpose',
        number: '01',
        tabLabel: '17 Keypoints',
        name: 'ViTPose-H 17 Keypoint Extraction',
        description: 'Vision Transformer backbone (632M params) extracting 17 3D anatomical skeletal landmarks.',
        bullets: [
          'Tracks head, shoulders, elbows, wrists, spine, pelvis, knees, and cleats',
          'Monocular 2D-to-3D lifting using temporal spatial attention blocks',
          'High confidence scoring (0.978 average across extreme sports poses)'
        ]
      },
      {
        id: 'b_twist',
        number: '02',
        tabLabel: 'Rotational Coil',
        name: 'Torso-Pelvis Rotational Coil',
        description: 'Quantifies the elastic coil angle between the shoulder girdle and pelvic plane for maximum ball strike power.',
        bullets: [
          'Dynamic angular separation calculus (up to 34.8° in backswing)',
          'Quantifies torque generation across abdominal oblique muscles',
          'Biomechanical kinetic energy transfer tracking from core to foot'
        ]
      },
      {
        id: 'b_whip',
        number: '03',
        tabLabel: 'Cleat Strike',
        name: 'Segmental Knee Whip & Foot Strike',
        description: 'Calculates striking cleat linear velocity (106.8 km/h), knee flexion angle, and 9.8ms ball contact duration.',
        bullets: [
          'Angular velocity tracking of lower leg during downswing (840°/s)',
          'Plant foot ground reaction force absorption (2.4x body weight)',
          'Ball exit trajectory vector cone and predicted aerodynamic spin'
        ]
      }
    ]
  },
  {
    id: 'visionstudio',
    title: 'Vision Studio & 2D Radar',
    tag: 'MODULE 07 // LIVE STUDIO',
    tagline: '1080p broadcast video HUD with real-time bounding boxes, speed rings, and live 2D planar minimap.',
    image: '/features/feature_07_visionstudio.jpg',
    specs: [
      { label: 'Latency', value: '14.8 ms' },
      { label: 'Sync', value: 'Frame-Accurate' },
      { label: 'Feed', value: 'Dual HUD + Radar' },
      { label: 'Throughput', value: '64.9 FPS' }
    ],
    subfeatures: [
      {
        id: 'vs_hud',
        number: '01',
        tabLabel: 'Broadcast HUD',
        name: 'Broadcast Telemetry HUD',
        description: 'Overlays bounding boxes, player tags, velocity vectors, and foot ground rings directly on video feed.',
        bullets: [
          'Interactive timeline scrubber with Play/Pause, Rewind, and Speed multipliers',
          'Toggleable telemetry layers: BBoxes, Speed Rings, Vectors, Offside line',
          'Custom video file upload zone supporting local match footage'
        ]
      },
      {
        id: 'vs_radar',
        number: '02',
        tabLabel: '2D Pitch Radar',
        name: 'Live 2D Planar Pitch Radar',
        description: 'Birds-eye view of the 105m x 68m pitch displaying moving player dots and ball in exact synchronization.',
        bullets: [
          'Real-time 60 FPS homography coordinate projection onto pitch',
          'Dynamic Voronoi territory dominance polygons on radar canvas',
          '360° rotating radar sweeper beam for military-grade tactical aesthetics'
        ]
      },
      {
        id: 'vs_offside',
        number: '03',
        tabLabel: 'Offside Line',
        name: 'Dynamic Calibrated Offside Line',
        description: 'Continuously projects planar offside line through the second-last defender parallel to the goal line.',
        bullets: [
          'Planar geometric calibration locked to pitch coordinate space',
          'Visual hazard indicator flag with distance metric in pixels/meters',
          'Instantaneous offside infractions detection on forward line breaks'
        ]
      }
    ]
  },
  {
    id: 'pipeline',
    title: 'Autonomous Edge Pipeline',
    tag: 'MODULE 08 // PRODUCTION PIPELINE',
    tagline: 'End-to-end deep learning pipeline delivering 64.9 FPS real-time throughput with 14.8ms total latency.',
    image: '/features/feature_08_pipeline.jpg',
    specs: [
      { label: 'Total Latency', value: '14.8 ms' },
      { label: 'Throughput', value: '64.9 FPS' },
      { label: 'Engine', value: 'NVIDIA TensorRT' },
      { label: 'Streaming', value: 'WebRTC / Zero-Copy' }
    ],
    subfeatures: [
      {
        id: 'p_ingest',
        number: '01',
        tabLabel: 'NVDEC Ingest',
        name: 'NVDEC Hardware Ingestion',
        description: 'Hardware NVDEC video decoding and FP16 kernel optimization for sub-millisecond tensor processing.',
        bullets: [
          'NVDEC zero-copy memory transfer into CUDA unified memory',
          'TensorRT layer fusion reducing memory bandwidth bottlenecks',
          'Multi-stream batching for 4 concurrent broadcast camera feeds'
        ]
      },
      {
        id: 'p_sync',
        number: '02',
        tabLabel: 'Zero-Copy Interconnect',
        name: 'Zero-Copy Shared Memory Interconnect',
        description: 'Transfers inference tensors between tracking, homography, and clustering without CPU bottlenecks.',
        bullets: [
          'Zero IPC overhead via shared POSIX memory buffers',
          'Sub-millisecond synchronization barriers between vision workers',
          'Lock-free ring buffer queue for high-bandwidth telemetry broadcast'
        ]
      },
      {
        id: 'p_egress',
        number: '03',
        tabLabel: 'Low-Latency Egress',
        name: 'Sub-20ms Low-Latency Egress',
        description: 'Streams live video frames with synchronized JSON telemetry packets to tactical dashboards worldwide.',
        bullets: [
          'WebRTC video channel with ultra-low latency (< 15ms)',
          'High-throughput binary WebSocket stream for 60 FPS radar data',
          'Cloud/Edge hybrid deployable on AWS, GCP, or on-premise stadium rigs'
        ]
      }
    ]
  }
];

export default function FeatureExplorer() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [activeSubfeatureIndex, setActiveSubfeatureIndex] = useState(0);

  const sidebarItems = FEATURES_DATA.map(f => f.title);
  const currentFeature = FEATURES_DATA[activeFeatureIndex] || FEATURES_DATA[0];
  const currentSubfeature = currentFeature.subfeatures[activeSubfeatureIndex] || currentFeature.subfeatures[0];

  const handleFeatureSelect = (index) => {
    setActiveFeatureIndex(index);
    setActiveSubfeatureIndex(0);
  };

  return (
    <section id="features-explorer" style={{
      position: 'relative',
      width: '100%',
      backgroundColor: 'var(--bg-sage)',
      padding: '54px 48px 74px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* ========================================================
            TOP HEADER: COMPACT, EDITORIAL
            ======================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--burgundy-deep)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px',
              opacity: 0.75
            }}>
              SYSTEM MATRIX // 08 DEEP LEARNING MODULES
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.025em',
              margin: 0,
              lineHeight: 1.1
            }}>
              Tactical Vision Architecture
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.74rem',
            color: 'var(--burgundy-deep)',
            fontWeight: 800
          }}>
            <span>8 Production Systems</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span style={{ color: '#1B4965' }}>64.9 FPS Ingestion</span>
          </div>
        </div>

        {/* ========================================================
            MAIN LAYOUT:
            LEFT: LineSidebar
            RIGHT: Clean, Compact, Professional Stage
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: LineSidebar (Floating freely) */}
          <div style={{ position: 'sticky', top: '32px' }}>
            <LineSidebar
              items={sidebarItems}
              accentColor="#590907"
              textColor="#380504"
              markerColor="rgba(89, 9, 7, 0.35)"
              showIndex={true}
              showMarker={true}
              proximityRadius={85}
              maxShift={22}
              falloff="smooth"
              markerLength={44}
              markerGap={0}
              tickScale={0.5}
              scaleTick={true}
              itemGap={15}
              fontSize={0.96}
              smoothing={90}
              defaultActive={0}
              onItemClick={(idx) => handleFeatureSelect(idx)}
            />
          </div>

          {/* ========================================================
              RIGHT: CLEAN, PROFESSIONAL, TIGHTENED STAGE
              - No heavy card boxes
              - High-contrast, legible subfeature tabs
              - Compact visual artwork next to crisp technical points
              ======================================================== */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingLeft: '6px'
          }}>
            
            {/* 1. Feature Title, Tag & Compact Specs */}
            <div>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.08em',
                marginBottom: '4px',
                opacity: 0.75
              }}>
                {currentFeature.tag}
              </div>

              <h3 style={{
                margin: '0 0 6px 0',
                fontSize: '1.75rem',
                fontWeight: 900,
                color: 'var(--burgundy-deep)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                {currentFeature.title}
              </h3>

              <p style={{
                margin: '0 0 10px 0',
                fontSize: '0.88rem',
                color: '#380504',
                lineHeight: 1.45,
                opacity: 0.88
              }}>
                {currentFeature.tagline}
              </p>

              {/* Compact Inline Tech Chips */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {currentFeature.specs.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(89, 9, 7, 0.08)',
                      border: '1px solid rgba(89, 9, 7, 0.15)',
                      borderRadius: '2px',
                      padding: '2px 8px',
                      fontSize: '0.70rem',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ color: '#5C473B', opacity: 0.8 }}>{s.label}:</span>
                    <strong style={{ color: 'var(--burgundy-deep)', fontWeight: 800 }}>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Subfeatures Switcher (Clean, High-Contrast Segmented Tabs) */}
            <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              paddingTop: '6px'
            }}>
              {currentFeature.subfeatures.map((sub, idx) => {
                const isActive = activeSubfeatureIndex === idx;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubfeatureIndex(idx)}
                    style={{
                      backgroundColor: isActive ? 'var(--burgundy-deep)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--burgundy-deep)',
                      border: `1.5px solid ${isActive ? 'var(--burgundy-deep)' : 'rgba(89, 9, 7, 0.3)'}`,
                      borderRadius: '2px',
                      padding: '5px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ opacity: isActive ? 0.75 : 0.55, fontFamily: 'monospace', fontSize: '0.68rem' }}>
                      {sub.number}
                    </span>
                    <span>{sub.tabLabel || sub.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Side-by-Side: Compact Visual Preview (Left) + Technical Points (Right) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '260px minmax(0, 1fr)',
              gap: '24px',
              alignItems: 'start',
              paddingTop: '10px'
            }}>
              
              {/* Compact Visual Preview (16:10 ratio, clean and tight) */}
              <div style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(89, 9, 7, 0.12)',
                border: '1px solid rgba(89, 9, 7, 0.25)',
                backgroundColor: '#162019'
              }}>
                <img
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '16/11',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Minimalist Overlay Footnote */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(7, 9, 89, 0.90)',
                  padding: '5px 10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.62rem',
                  color: '#FFF6EB',
                  fontWeight: 800
                }}>
                  <span>NEURAL TELEMETRY</span>
                  <span style={{ color: '#E8D2B5', fontFamily: 'monospace' }}>60 FPS</span>
                </div>
              </div>

              {/* Subfeature Algorithmic Breakdown */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '1.08rem',
                    fontWeight: 900,
                    color: 'var(--burgundy-deep)',
                    letterSpacing: '-0.01em'
                  }}>
                    {currentSubfeature.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.84rem',
                    color: '#380504',
                    lineHeight: 1.45,
                    opacity: 0.88
                  }}>
                    {currentSubfeature.description}
                  </p>
                </div>

                {/* Tight Bullets */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {currentSubfeature.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        fontSize: '0.80rem',
                        color: '#281D17',
                        fontWeight: 600,
                        lineHeight: 1.4
                      }}
                    >
                      <span style={{ color: 'var(--burgundy-deep)', fontWeight: 900 }}>&bull;</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Next Step Action Button */}
                <div style={{
                  paddingTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {activeSubfeatureIndex < currentFeature.subfeatures.length - 1 ? (
                    <button
                      onClick={() => setActiveSubfeatureIndex(prev => prev + 1)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--burgundy-deep)',
                        border: 'none',
                        padding: 0,
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Next Subfeature ({currentFeature.subfeatures[activeSubfeatureIndex + 1].tabLabel})</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFeatureSelect((activeFeatureIndex + 1) % FEATURES_DATA.length)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--burgundy-deep)',
                        border: 'none',
                        padding: 0,
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Next System ({FEATURES_DATA[(activeFeatureIndex + 1) % FEATURES_DATA.length].title})</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
