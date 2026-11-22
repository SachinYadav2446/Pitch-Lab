import React, { useState } from 'react';
import LineSidebar from './LineSidebar';
import { 
  Activity, Cpu, ShieldCheck, Zap, Layers, Sparkles, 
  ArrowRight, CheckCircle2, ChevronRight, BarChart3, Crosshair 
} from 'lucide-react';

const FEATURES_DATA = [
  {
    id: 'homography',
    title: 'Planar Pitch Homography Engine',
    tag: 'MODULE 01 // SPATIAL VISION',
    tagline: 'Sub-millimeter 2D metric pitch rectification via projective transformation matrix H(3x3).',
    image: '/features/feature_01_homography.jpg',
    specs: { latency: '1.8 ms', accuracy: '0.8 mm', model: 'RANSAC + Epipolar', throughput: '120 FPS' },
    subfeatures: [
      {
        id: 'h_warp',
        name: 'Projective Homography Warp',
        description: 'Maps raw distorted camera angles to an exact 105m x 68m top-down coordinate plane with sub-pixel planar alignment.',
        bullets: ['Direct linear transform (DLT) with 4-point minimum correspondence', 'Robust RANSAC outlier elimination for camera motion compensation', 'Hardware-accelerated bilinear texture warping on GPU']
      },
      {
        id: 'h_epipolar',
        name: 'Epipolar Pitch Calibration',
        description: 'Aligns multi-angle broadcast lenses against calibrated keypoint lines (touchlines, 18-yard box, center circle).',
        bullets: ['Automated pitch landmark extraction (12 intersection points)', 'Lens distortion polynomial correction (radial & tangential)', 'Continuous frame-to-frame extrinsic camera parameter tracking']
      },
      {
        id: 'h_metric',
        name: 'Metric Coordinate Projection',
        description: 'Translates pixel screen displacements directly into SI metric meters and velocities across the pitch plane.',
        bullets: ['Standardized FIFA 105m x 68m international dimension normalization', 'Zero elevation ground-plane restriction for player feet', 'Z-coordinate vertical ray casting for aerial ball trajectories']
      }
    ]
  },
  {
    id: 'voronoi',
    title: 'Dynamic Space Control & Voronoi Dominance',
    tag: 'MODULE 02 // GEOMETRIC ML',
    tagline: 'Real-time 22-player territorial partitioning, passing lane occlusion, and space dominance calculus.',
    image: '/features/feature_02_voronoi.jpg',
    specs: { latency: '1.4 ms', resolution: '105x68 Grid', model: 'Delaunay + Voronoi', throughput: '140 FPS' },
    subfeatures: [
      {
        id: 'v_partition',
        name: '22-Player Voronoi Partitioning',
        description: 'Dynamically computes continuous territorial dominance polygons bounded by pitch boundaries at 60 FPS.',
        bullets: ['Euclidean distance metric weighted by player sprint velocity vectors', 'Convex hull boundary clipping at pitch touchlines and goal lines', 'Sub-millisecond dual Delaunay triangulation graph construction']
      },
      {
        id: 'v_dominance',
        name: 'Space Dominance Ratio (m²)',
        description: 'Calculates the exact square meters controlled by Team Alpha vs Team Beta in defensive, middle, and attacking thirds.',
        bullets: ['Live split possession and territorial pressure percentages', 'Dangerous zone penetration index in the final 18-yard box', 'Continuous overload tracking for wing attacks and half-spaces']
      },
      {
        id: 'v_passing',
        name: 'Passing Lane Occlusion Calculus',
        description: 'Traces line-of-sight passing ray vectors to evaluate intercepted trajectory risks and open passing options.',
        bullets: ['Defensive shadow cone calculation for intercepting defenders', 'Optimal passing receiver scoring based on open space volume', 'Autonomous pressing trigger alert when passing lanes drop to 0']
      }
    ]
  },
  {
    id: 'tracking',
    title: 'Deep Multi-Object Tracking & ByteTrack Re-ID',
    tag: 'MODULE 03 // DEEP TRACKING',
    tagline: 'YOLOv8x detection coupled with 8D Kalman filter vectors and ByteTrack low-score association.',
    image: '/features/feature_03_tracking.jpg',
    specs: { latency: '6.4 ms', tracks: '22+1 Objects', model: 'YOLOv8x + ByteTrack', throughput: '64.9 FPS' },
    subfeatures: [
      {
        id: 't_yolo',
        name: 'YOLOv8x Deep Feature Detection',
        description: 'High-precision CNN backbone outputting bounding box coordinates, class labels, and confidence probabilities.',
        bullets: ['TensorRT FP16 optimized inference taking only 6.4ms on GPU', 'Dual detection classes: Player (Human) and Football (Micro-object)', 'NMS IoU thresholding tuned to resolve congested goalmouth scrambles']
      },
      {
        id: 't_kalman',
        name: '8D Kalman Filter State Estimation',
        description: 'Maintains state vectors [x, y, a, h, vx, vy, va, vh] to predict future positions through physical occlusions.',
        bullets: ['Linear motion model tracking velocity and aspect ratio evolution', 'Smooth interpolation across missed detection frames', 'Measurement covariance update dynamically scaled by detection confidence']
      },
      {
        id: 't_bytetrack',
        name: 'ByteTrack Low-Score Recovery',
        description: 'Recovers occluded or motion-blurred players using low-confidence secondary association stages.',
        bullets: ['First stage: Associates high-score boxes with existing tracklets', 'Second stage: Associates remaining tracklets with low-score detections', 'Eliminates ID switches when players cross paths during duels']
      }
    ]
  },
  {
    id: 'clustering',
    title: 'Automated Jersey Pigment Clustering',
    tag: 'MODULE 04 // UNSUPERVISED ML',
    tagline: 'K-Means color segmentation in 3D HSV space with automatic pitch grass rejection.',
    image: '/features/feature_04_clustering.jpg',
    specs: { latency: '1.5 ms', colorSpace: '3D HSV', model: 'Adaptive K-Means', throughput: '150 FPS' },
    subfeatures: [
      {
        id: 'c_hsv',
        name: '3D HSV Space Transformation',
        description: 'Converts RGB bounding box pixels into Hue, Saturation, and Value to isolate pigment invariant to shadows.',
        bullets: ['Decouples luminance from chromaticity for stadium shadow tolerance', 'Gaussian hue angle weighting for circular color continuity', 'Histogram normalization across varying floodlight temperatures']
      },
      {
        id: 'c_grass',
        name: 'Pitch Grass Mask Rejection',
        description: 'Discards background grass pixels (Hue 35-85°) to isolate pure jersey fabric colors.',
        bullets: ['Morphological opening and closing filters to remove green spillover', 'Upper-torso bounding box cropping (excluding legs and pitch turf)', 'Edge-preserving bilateral filtering around shirt borders']
      },
      {
        id: 'c_kmeans',
        name: 'K-Means Team Centroid Clustering',
        description: 'Partitions detected players into Team Alpha (Burgundy), Team Beta (Blue), Goalkeepers, and Match Officials.',
        bullets: ['Automatic K=2/K=4 centroid convergence in < 2 iterations', 'Temporal smoothing: locks team jersey pigments across match duration', 'Outlier detection for yellow/black referee jerseys and neon GK kits']
      }
    ]
  },
  {
    id: 'kinematics',
    title: 'Metric Kinematic Velocity Calculus',
    tag: 'MODULE 05 // BIOMETRICS',
    tagline: 'High-intensity running (HIR) analysis, 5 FIFA sprint zones, and deceleration G-force load telemetry.',
    image: '/features/feature_05_kinematics.jpg',
    specs: { latency: '1.2 ms', sampleRate: '30 Hz', model: 'Savitzky-Golay Calc', throughput: '180 FPS' },
    subfeatures: [
      {
        id: 'k_fifa',
        name: '5-Zone FIFA Sprint Calculus',
        description: 'Categorizes instantaneous player ground speeds into official FIFA physical performance tiers.',
        bullets: ['Zone 1 (Walking: 0-7.2 km/h) to Zone 5 (Sprinting: > 25.2 km/h)', 'Savitzky-Golay filtering over 5-frame rolling window to eliminate jitter', 'Accumulated distance telemetry per sprint zone over 90 minutes']
      },
      {
        id: 'k_decel',
        name: 'Deceleration G-Force & Joint Load',
        description: 'Measures negative acceleration peaks (up to -7.5 m/s²) to identify metabolic fatigue and hamstring strain risk.',
        bullets: ['Second derivative of position calculus: a = d²x/dt²', 'Impact shock absorption tracking on directional cuts and slide tackles', 'Fatigue degradation index correlating 2nd half deceleration capacity']
      },
      {
        id: 'k_leaderboard',
        name: 'Real-Time Physical Leaderboard',
        description: 'Surfaces live top sprint speeds, total distance covered, and high-intensity sprint bursts across all 22 players.',
        bullets: ['Instantaneous maximum velocity records (e.g. Mbappé: 36.8 km/h)', 'Metabolic power calculation in Watts per kilogram (W/kg)', 'Interactive selection to isolate specific athlete sprint tracks']
      }
    ]
  },
  {
    id: 'biomechanics',
    title: '3D Biomechanical Pose & Strike Engine',
    tag: 'MODULE 06 // 3D SKELETON',
    tagline: 'ViTPose-H 17 3D skeletal landmark tracking with pelvic-thoracic rotational twist and cleat impact physics.',
    image: '/features/feature_06_biomechanics.jpg',
    specs: { latency: '8.2 ms', joints: '17 3D Nodes', model: 'ViTPose-H + Lift', throughput: '48 FPS' },
    subfeatures: [
      {
        id: 'b_vitpose',
        name: 'ViTPose-H 17 Keypoint Extraction',
        description: 'Vision Transformer backbone (632M params) extracting 17 3D anatomical skeletal landmarks.',
        bullets: ['Tracks head, shoulders, elbows, wrists, spine, pelvis, knees, and cleats', 'Monocular 2D-to-3D lifting using temporal spatial attention blocks', 'High confidence scoring (0.978 average across extreme sports poses)']
      },
      {
        id: 'b_twist',
        name: 'Torso-Pelvis Rotational Separation',
        description: 'Quantifies the elastic coil angle between the shoulder girdle and pelvic plane for maximum ball strike power.',
        bullets: ['Dynamic angular separation calculus (up to 34.8° in backswing)', 'Quantifies torque generation across abdominal oblique muscles', 'Biomechanical kinetic energy transfer tracking from core to foot']
      },
      {
        id: 'b_whip',
        name: 'Segmental Knee Whip & Foot Strike',
        description: 'Calculates striking cleat linear velocity (106.8 km/h), knee flexion angle, and 9.8ms ball contact duration.',
        bullets: ['Angular velocity tracking of lower leg during downswing (840°/s)', 'Plant foot ground reaction force absorption (2.4x body weight)', 'Ball exit trajectory vector cone and predicted aerodynamic spin']
      }
    ]
  },
  {
    id: 'visionstudio',
    title: 'Vision Studio & Synchronized 2D Radar',
    tag: 'MODULE 07 // LIVE STUDIO',
    tagline: '1080p broadcast video HUD with real-time bounding boxes, speed rings, and live 2D planar minimap.',
    image: '/features/feature_07_visionstudio.jpg',
    specs: { latency: '14.8 ms', sync: 'Frame-Accurate', model: 'Dual HUD + Radar', throughput: '64.9 FPS' },
    subfeatures: [
      {
        id: 'vs_hud',
        name: '1080p Broadcast Telemetry HUD',
        description: 'Overlays bounding boxes, player tags, velocity vectors, and foot ground rings directly on video feed.',
        bullets: ['Interactive timeline scrubber with Play/Pause, Rewind, and Speed multipliers', 'Toggleable telemetry layers: BBoxes, Speed Rings, Vectors, Offside line', 'Custom video file upload zone supporting local match footage']
      },
      {
        id: 'vs_radar',
        name: 'Live 2D Planar Pitch Radar',
        description: 'Birds-eye view of the 105m x 68m pitch displaying moving player dots and ball in exact synchronization.',
        bullets: ['Real-time 60 FPS homography coordinate projection onto pitch', 'Dynamic Voronoi territory dominance polygons on radar canvas', '360° rotating radar sweeper beam for military-grade tactical aesthetics']
      },
      {
        id: 'vs_offside',
        name: 'Dynamic Calibrated Offside Guideline',
        description: 'Continuously projects planar offside line through the second-last defender parallel to the goal line.',
        bullets: ['Planar geometric calibration locked to pitch coordinate space', 'Visual hazard indicator flag with distance metric in pixels/meters', 'Instantaneous offside infractions detection on forward line breaks']
      }
    ]
  },
  {
    id: 'pipeline',
    title: 'Autonomous Edge Pipeline Architecture',
    tag: 'MODULE 08 // PRODUCTION PIPELINE',
    tagline: 'End-to-end deep learning pipeline delivering 64.9 FPS real-time throughput with 14.8ms total latency.',
    image: '/features/feature_08_pipeline.jpg',
    specs: { latency: '14.8 ms Total', throughput: '64.9 FPS', platform: 'NVIDIA TensorRT', stream: 'WebRTC / Zero-Copy' },
    subfeatures: [
      {
        id: 'p_ingest',
        name: 'Hardware Ingestion & TensorRT Optimization',
        description: 'Hardware NVDEC video decoding and FP16 kernel optimization for sub-millisecond tensor processing.',
        bullets: ['NVDEC zero-copy memory transfer into CUDA unified memory', 'TensorRT layer fusion reducing memory bandwidth bottlenecks', 'Multi-stream batching for 4 concurrent broadcast camera feeds']
      },
      {
        id: 'p_sync',
        name: 'Zero-Copy Shared Memory Interconnect',
        description: 'Transfers inference tensors between tracking, homography, and clustering without CPU bottlenecks.',
        bullets: ['Zero IPC overhead via shared POSIX memory buffers', 'Sub-millisecond synchronization barriers between vision workers', 'Lock-free ring buffer queue for high-bandwidth telemetry broadcast']
      },
      {
        id: 'p_egress',
        name: 'Sub-20ms WebRTC & WebSocket Egress',
        description: 'Streams live video frames with synchronized JSON telemetry packets to tactical dashboards worldwide.',
        bullets: ['WebRTC video channel with ultra-low latency (< 15ms)', 'High-throughput binary WebSocket stream for 60 FPS radar data', 'Cloud/Edge hybrid deployable on AWS, GCP, or on-premise stadium rigs']
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
    setActiveSubfeatureIndex(0); // Reset subfeature tab on feature switch
  };

  return (
    <section id="features-explorer" style={{
      position: 'relative',
      width: '100%',
      backgroundColor: 'var(--bg-sage)',
      padding: '80px 48px 120px',
      boxSizing: 'border-box',
      borderTop: '1.5px solid rgba(89, 9, 7, 0.15)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
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
              <span>CORE ARCHITECTURE // INTERACTIVE FEATURE &amp; SUBFEATURE MATRIX</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.1rem, 3.4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 10px 0'
            }}>
              Tactical Vision Systems &amp; Subfeatures
            </h2>

            <p style={{
              color: '#380504',
              fontSize: '1rem',
              maxWidth: '820px',
              margin: 0,
              opacity: 0.9,
              lineHeight: 1.55
            }}>
              Hover and select any vision system on the line sidebar to explore its deep learning architecture, 
              epipolar mathematics, and granular subfeature telemetry.
            </p>
          </div>

          {/* Quick HUD Metric Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              backgroundColor: 'var(--cream-light)',
              border: '1.5px solid var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '8px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', letterSpacing: '0.04em' }}>TOTAL MODULES</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>8 Core Systems</div>
            </div>

            <div style={{
              backgroundColor: 'var(--cream-light)',
              border: '1.5px solid var(--burgundy-deep)',
              borderRadius: '2px',
              padding: '8px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', letterSpacing: '0.04em' }}>PIPELINE SPEED</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>64.9 FPS</div>
            </div>
          </div>
        </div>

        {/* ========================================================
            TWO-COLUMN WORKBENCH: 
            LEFT: LineSidebar
            RIGHT: Feature & Subfeature Showcase Stage
            ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 360px) minmax(0, 1fr)',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: LineSidebar from React Bits */}
          <div style={{
            position: 'sticky',
            top: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid var(--burgundy-deep)',
            borderRadius: '2px',
            padding: '24px 28px 24px 16px',
            boxShadow: '0 8px 24px rgba(89, 9, 7, 0.06)'
          }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--burgundy-deep)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              paddingLeft: '12px',
              opacity: 0.75
            }}>
              SELECT SYSTEM TO INSPECT
            </div>

            <LineSidebar
              items={sidebarItems}
              accentColor="#590907"
              textColor="#380504"
              markerColor="rgba(89, 9, 7, 0.45)"
              showIndex={true}
              showMarker={true}
              proximityRadius={90}
              maxShift={26}
              falloff="smooth"
              markerLength={50}
              markerGap={0}
              tickScale={0.5}
              scaleTick={true}
              itemGap={20}
              fontSize={0.96}
              smoothing={100}
              defaultActive={0}
              onItemClick={(idx) => handleFeatureSelect(idx)}
            />
          </div>

          {/* RIGHT: Active Feature & Subfeatures Stage */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--burgundy-deep)',
            borderRadius: '2px',
            boxShadow: '0 12px 32px rgba(89, 9, 7, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Stage Header Banner */}
            <div style={{
              backgroundColor: 'var(--burgundy-deep)',
              padding: '20px 28px',
              color: 'var(--cream-bg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  color: 'var(--cream-light)',
                  letterSpacing: '0.08em',
                  marginBottom: '4px'
                }}>
                  {currentFeature.tag}
                </div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#FFF6EB'
                }}>
                  {currentFeature.title}
                </h3>
              </div>

              {/* Real-time specs pill */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {Object.entries(currentFeature.specs).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      backgroundColor: 'rgba(232, 210, 181, 0.15)',
                      border: '1px solid rgba(232, 210, 181, 0.3)',
                      borderRadius: '2px',
                      padding: '4px 8px',
                      fontSize: '0.68rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    <span style={{ opacity: 0.65, textTransform: 'uppercase' }}>{k}: </span>
                    <strong style={{ color: '#FFF6EB' }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Tagline bar */}
            <div style={{
              padding: '12px 28px',
              backgroundColor: 'rgba(89, 9, 7, 0.06)',
              borderBottom: '1px solid rgba(89, 9, 7, 0.12)',
              fontSize: '0.88rem',
              color: '#380504',
              fontWeight: 700
            }}>
              {currentFeature.tagline}
            </div>

            {/* Interactive Subfeatures Navigation Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1.5px solid var(--burgundy-deep)',
              backgroundColor: '#FAF6F0',
              overflowX: 'auto'
            }}>
              {currentFeature.subfeatures.map((sub, idx) => {
                const isActive = activeSubfeatureIndex === idx;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubfeatureIndex(idx)}
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      padding: '14px 18px',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? 'var(--burgundy-deep)' : '#5C473B',
                      border: 'none',
                      borderRight: '1px solid rgba(89, 9, 7, 0.12)',
                      borderBottom: isActive ? '3px solid var(--burgundy-deep)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      opacity: isActive ? 1 : 0.6,
                      marginBottom: '2px'
                    }}>
                      SUBFEATURE 0{idx + 1}
                    </div>
                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: 900
                    }}>
                      {sub.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Content Body: Visual Card Preview + Granular Technical Deep Dive */}
            <div style={{
              padding: '28px',
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 380px) minmax(0, 1fr)',
              gap: '28px',
              alignItems: 'start'
            }}>
              {/* Feature High-Res Visual Card */}
              <div style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1.5px solid var(--burgundy-deep)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                backgroundColor: '#162019'
              }}>
                <img
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {/* Visual Card HUD Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(7, 9, 89, 0.88)',
                  backdropFilter: 'blur(6px)',
                  padding: '10px 14px',
                  borderTop: '1px solid rgba(181, 210, 232, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#FFF6EB', fontWeight: 800 }}>
                    NEURAL TELEMETRY
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(235, 246, 255, 0.15)',
                    color: '#E8D2B5',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontFamily: 'monospace'
                  }}>
                    60 FPS LOCK
                  </span>
                </div>
              </div>

              {/* Subfeature Granular Technical Breakdown */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--burgundy-deep)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}>
                    ACTIVE SUBFEATURE DEEP DIVE
                  </div>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: 'var(--burgundy-deep)'
                  }}>
                    {currentSubfeature.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.94rem',
                    color: '#380504',
                    lineHeight: 1.6,
                    opacity: 0.9
                  }}>
                    {currentSubfeature.description}
                  </p>
                </div>

                {/* Algorithmic Technical Pillars */}
                <div style={{
                  backgroundColor: '#FAF6F0',
                  border: '1px solid rgba(89, 9, 7, 0.15)',
                  borderRadius: '2px',
                  padding: '18px 20px'
                }}>
                  <div style={{
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    color: 'var(--burgundy-deep)',
                    letterSpacing: '0.06em',
                    marginBottom: '12px'
                  }}>
                    CORE ALGORITHMIC CAPABILITIES
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {currentSubfeature.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <CheckCircle2 size={16} color="var(--burgundy-deep)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.86rem', color: '#281D17', fontWeight: 600, lineHeight: 1.45 }}>
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA & Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(89, 9, 7, 0.1)'
                }}>
                  <span style={{ fontSize: '0.74rem', color: '#666', fontWeight: 700 }}>
                    Inspecting {currentFeature.title} &bull; Subfeature {activeSubfeatureIndex + 1} of {currentFeature.subfeatures.length}
                  </span>

                  {activeSubfeatureIndex < currentFeature.subfeatures.length - 1 ? (
                    <button
                      onClick={() => setActiveSubfeatureIndex(prev => prev + 1)}
                      style={{
                        backgroundColor: 'var(--burgundy-deep)',
                        color: 'var(--cream-bg)',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '8px 16px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Next Subfeature</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFeatureSelect((activeFeatureIndex + 1) % FEATURES_DATA.length)}
                      style={{
                        backgroundColor: 'var(--burgundy-deep)',
                        color: 'var(--cream-bg)',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '8px 16px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Next System</span>
                      <ArrowRight size={13} />
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
