import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, RotateCw, Play, Pause, Zap, Crosshair, 
  ChevronRight, Compass, ShieldCheck, Flame, Cpu, Gauge
} from 'lucide-react';

export default function BiomechanicsFeature() {
  const [activePhase, setActivePhase] = useState('impact'); // 'backswing', 'drive', 'impact', 'followthrough'
  const [rotationAngle, setRotationAngle] = useState(25); // degrees yaw
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [selectedJoint, setSelectedJoint] = useState('right_knee');
  const [showPlanes, setShowPlanes] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // 4 Strike Phases Data (3D coordinates centered at pelvis (0,0,0) in cm)
  // X: Lateral, Y: Vertical (-Y is UP, +Y is DOWN), Z: Depth
  const strikePhases = {
    backswing: {
      title: 'Phase 1: Backswing & Torso Coiling',
      timing: '-0.24s pre-impact',
      cleatSpeed: '18.4 km/h',
      kneeAngle: '118.2°',
      torsoSeparation: '34.8°',
      kineticPower: '640 W',
      description: 'Maximum elastic stretch of the hip flexors and abdominal obliques. Pelvis rotates forward while shoulders lag behind, creating maximum elastic potential energy.',
      keypoints: {
        pelvis: [0, 0, 0],
        spine: [2, -28, -5],
        sternum: [5, -52, -10],
        neck: [6, -68, -12],
        head: [7, -82, -14],
        left_shoulder: [-18, -62, -2],
        right_shoulder: [26, -60, -22],
        left_elbow: [-30, -42, 6],
        right_elbow: [38, -44, -36],
        left_wrist: [-26, -20, 14],
        right_wrist: [32, -22, -40],
        left_hip: [-14, 4, 2],
        right_hip: [14, 2, -6],
        left_knee: [-18, 48, 12], // Plant leg
        right_knee: [24, 38, -38], // Striking leg loaded backward
        left_ankle: [-16, 94, 18], // Plant foot
        right_ankle: [18, 14, -68], // Striking cleat pulled far back
        plant_toe: [-15, 100, 28],
        strike_toe: [16, 8, -78]
      }
    },
    drive: {
      title: 'Phase 2: Knee Drive & Segmental Whip',
      timing: '-0.08s pre-impact',
      cleatSpeed: '72.6 km/h',
      kneeAngle: '136.5°',
      torsoSeparation: '22.4°',
      kineticPower: '1,840 W',
      description: 'Rapid forward thigh acceleration driven by the iliopsoas and rectus femoris. The lower leg lags behind, storing kinetic whip energy before explosive knee extension.',
      keypoints: {
        pelvis: [0, 0, 0],
        spine: [0, -28, 0],
        sternum: [2, -52, -2],
        neck: [3, -68, -3],
        head: [4, -82, -4],
        left_shoulder: [-19, -62, 10],
        right_shoulder: [23, -60, -14],
        left_elbow: [-32, -46, 18],
        right_elbow: [36, -42, -24],
        left_wrist: [-28, -24, 24],
        right_wrist: [28, -20, -26],
        left_hip: [-14, 4, 6],
        right_hip: [14, 2, -4],
        left_knee: [-16, 48, 16],
        right_knee: [20, 36, 12], // Thigh drove forward
        left_ankle: [-14, 94, 20],
        right_ankle: [18, 62, -34], // Foot whipping through
        plant_toe: [-13, 100, 30],
        strike_toe: [19, 68, -42]
      }
    },
    impact: {
      title: 'Phase 3: Ball-Cleat Impact Point',
      timing: '0.00s strike contact',
      cleatSpeed: '106.8 km/h',
      kneeAngle: '162.8°',
      torsoSeparation: '12.1°',
      kineticPower: '3,450 W',
      description: 'Instantaneous energy transfer over 9.8 milliseconds. Plant foot firmly anchored absorbing 2.4x body weight while the striking foot locks at maximum linear velocity.',
      keypoints: {
        pelvis: [0, 0, 0],
        spine: [-2, -28, 4],
        sternum: [-2, -52, 6],
        neck: [-1, -68, 7],
        head: [0, -82, 8],
        left_shoulder: [-20, -62, 18],
        right_shoulder: [20, -60, -4],
        left_elbow: [-34, -48, 22],
        right_elbow: [32, -44, -12],
        left_wrist: [-30, -26, 26],
        right_wrist: [22, -22, -14],
        left_hip: [-14, 4, 8],
        right_hip: [14, 2, 0],
        left_knee: [-15, 48, 18],
        right_knee: [12, 38, 38], // Knee extended forward
        left_ankle: [-14, 94, 22],
        right_ankle: [10, 88, 54], // Cleat impacts ball
        plant_toe: [-13, 100, 32],
        strike_toe: [8, 92, 68]
      }
    },
    followthrough: {
      title: 'Phase 4: Follow-Through & Deceleration',
      timing: '+0.18s post-impact',
      cleatSpeed: '64.2 km/h',
      kneeAngle: '174.5°',
      torsoSeparation: '-14.6°',
      kineticPower: '980 W',
      description: 'Eccentric deceleration across the hamstring and gluteal chain. Striking foot rises in an upward arc while the torso leans forward to preserve dynamic balance.',
      keypoints: {
        pelvis: [0, 0, 0],
        spine: [-6, -26, 12],
        sternum: [-8, -48, 20],
        neck: [-8, -64, 24],
        head: [-8, -78, 28],
        left_shoulder: [-22, -58, 28],
        right_shoulder: [16, -56, 12],
        left_elbow: [-34, -46, 24],
        right_elbow: [28, -46, 6],
        left_wrist: [-28, -26, 22],
        right_wrist: [18, -26, 2],
        left_hip: [-14, 4, 8],
        right_hip: [14, 2, 4],
        left_knee: [-14, 48, 16],
        right_knee: [6, 24, 62], // High forward leg
        left_ankle: [-14, 94, 20],
        right_ankle: [4, 46, 88], // Cleat elevated
        plant_toe: [-13, 100, 30],
        strike_toe: [2, 44, 98]
      }
    }
  };

  const currentData = strikePhases[activePhase];

  // Skeletal Bones (Pairs of keypoints to connect)
  const bones = [
    // Torso & Head
    ['pelvis', 'spine'],
    ['spine', 'sternum'],
    ['sternum', 'neck'],
    ['neck', 'head'],
    // Shoulders
    ['sternum', 'left_shoulder'],
    ['sternum', 'right_shoulder'],
    // Left Arm
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    // Right Arm
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    // Pelvic girdle
    ['pelvis', 'left_hip'],
    ['pelvis', 'right_hip'],
    // Left Leg (Plant)
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    ['left_ankle', 'plant_toe'],
    // Right Leg (Striking)
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle'],
    ['right_ankle', 'strike_toe']
  ];

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, cw, ch);

      // Dark tactical stadium background
      ctx.fillStyle = '#181E19';
      ctx.fillRect(0, 0, cw, ch);

      // Ground grid lines with 3D perspective
      ctx.strokeStyle = 'rgba(232, 210, 181, 0.08)';
      ctx.lineWidth = 1;
      const groundY = ch * 0.76;
      for (let gz = -100; gz <= 100; gz += 20) {
        ctx.beginPath();
        ctx.moveTo(30, groundY + gz * 0.6);
        ctx.lineTo(cw - 30, groundY + gz * 0.6);
        ctx.stroke();
      }

      // Camera 3D Projection math
      const rad = (rotationAngle * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      const cx = cw / 2;
      const cy = ch * 0.44;
      const scale = 2.45;

      const project3D = (pt) => {
        const [x, y, z] = pt;
        // Yaw rotation around Y axis
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const ry = y;

        // Subtle perspective depth factor
        const fov = 420;
        const depth = fov / (fov + rz);

        const screenX = cx + rx * scale * depth;
        const screenY = cy + ry * scale * depth;

        return { x: screenX, y: screenY, depth, z: rz };
      };

      const pts = currentData.keypoints;
      const projected = {};
      Object.keys(pts).forEach(k => {
        projected[k] = project3D(pts[k]);
      });

      // 1. Draw Ground Shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, groundY + 12, 110, 36, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Torso & Hip Orientation Planes (if enabled)
      if (showPlanes) {
        // Pelvic Plane (Triangle: left_hip, pelvis, right_hip)
        const pL = projected.left_hip;
        const pC = projected.pelvis;
        const pR = projected.right_hip;

        ctx.fillStyle = 'rgba(89, 9, 7, 0.28)';
        ctx.strokeStyle = '#590907';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Thorax Plane (Triangle: left_shoulder, sternum, right_shoulder)
        const sL = projected.left_shoulder;
        const sC = projected.sternum;
        const sR = projected.right_shoulder;

        ctx.fillStyle = 'rgba(232, 210, 181, 0.22)';
        ctx.strokeStyle = '#E8D2B5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sL.x, sL.y);
        ctx.lineTo(sC.x, sC.y);
        ctx.lineTo(sR.x, sR.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 3. Draw Kinetic Strike Vector Cone (at Impact or Follow-through)
      if (showVectors && (activePhase === 'impact' || activePhase === 'drive')) {
        const toe = projected.strike_toe;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toe.x, toe.y);
        ctx.lineTo(toe.x + 85 * cosA, toe.y - 45);
        ctx.strokeStyle = '#E63946';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.stroke();

        // Target Ball Impact Point
        if (activePhase === 'impact') {
          ctx.beginPath();
          ctx.arc(toe.x + 18, toe.y - 8, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#E8D2B5';
          ctx.fill();
          ctx.strokeStyle = '#590907';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Ball text
          ctx.fillStyle = '#430504';
          ctx.font = '800 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('STRIKE', toe.x + 18, toe.y - 5);
        }
        ctx.restore();
      }

      // 4. Draw Skeletal Bones
      bones.forEach(([k1, k2]) => {
        const p1 = projected[k1];
        const p2 = projected[k2];
        if (!p1 || !p2) return;

        const isStrikingLeg = (k1.includes('right') && (k1.includes('hip') || k1.includes('knee') || k1.includes('ankle')));
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isStrikingLeg ? '#E63946' : 'rgba(232, 210, 181, 0.85)';
        ctx.lineWidth = isStrikingLeg ? 3.5 : 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // 5. Draw 3D Joint Spheres & Angles
      Object.keys(projected).forEach(k => {
        const pt = projected[k];
        const isSelected = k === selectedJoint;
        const isStrikingNode = k.includes('right_knee') || k.includes('right_ankle') || k.includes('strike_toe');

        ctx.save();
        ctx.beginPath();
        const nodeRadius = isSelected ? 7 : (isStrikingNode ? 5.5 : 4);
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);

        ctx.fillStyle = isSelected ? '#FFF6EB' : (isStrikingNode ? '#E63946' : '#590907');
        ctx.fill();
        ctx.strokeStyle = '#E8D2B5';
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.stroke();

        // Selection Pulse Ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(232, 210, 181, 0.8)';
          ctx.setLineDash([3, 2]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Joint Label for Selected
        if (isSelected || (showAngles && (k === 'right_knee' || k === 'sternum'))) {
          ctx.fillStyle = '#FAF6F0';
          ctx.strokeStyle = '#590907';
          ctx.lineWidth = 1;
          const text = k === 'right_knee' ? `Knee: ${currentData.kneeAngle}` : k.replace('_', ' ').toUpperCase();
          ctx.font = '700 9px monospace';
          const tw = ctx.measureText(text).width + 10;
          ctx.fillRect(pt.x + 8, pt.y - 12, tw, 16);
          ctx.strokeRect(pt.x + 8, pt.y - 12, tw, 16);
          ctx.fillStyle = '#430504';
          ctx.textAlign = 'left';
          ctx.fillText(text, pt.x + 13, pt.y - 1);
        }

        ctx.restore();
      });

      // Auto rotation loop
      if (isAutoRotating) {
        setRotationAngle(prev => (prev + 0.6) % 360);
      }
    };

    render();
  }, [activePhase, rotationAngle, isAutoRotating, selectedJoint, showPlanes, showAngles, showVectors, currentData]);

  return (
    <section id="biomechanics-engine" style={{
      width: '100%',
      position: 'relative',
      backgroundColor: 'var(--bg-sage)',
      padding: '100px 48px 120px',
      borderTop: '1.5px solid rgba(89, 9, 7, 0.15)',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
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
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              <Activity size={13} color="var(--cream-light)" />
              DEEP LEARNING MODULE 07 // 3D BIOMECHANICAL SKELETAL RECONSTRUCTION
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
              fontWeight: 900,
              color: 'var(--burgundy-deep)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 10px 0'
            }}>
              3D Biomechanical Pose &amp; Strike Mechanics
            </h2>
            <p style={{
              color: '#380504',
              fontSize: '1rem',
              maxWidth: '780px',
              margin: 0,
              opacity: 0.88,
              lineHeight: 1.55
            }}>
              High-density 17-keypoint skeletal landmark tracking with multi-view epipolar geometry, pelvic-thoracic rotational separation, and millisecond kicking foot impact calculus.
            </p>
          </div>

          {/* Quick Technical Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#FAF6F0',
              border: '1.5px solid rgba(89, 9, 7, 0.15)',
              borderRadius: '10px',
              padding: '10px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>SKELETAL NODES</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>17 3D Joints</div>
            </div>
            <div style={{
              backgroundColor: '#FAF6F0',
              border: '1.5px solid rgba(89, 9, 7, 0.15)',
              borderRadius: '10px',
              padding: '10px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>SAMPLING RATE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>240 Hz</div>
            </div>
          </div>
        </div>

        {/* 4-Phase Kinetic Chain Selector Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {Object.keys(strikePhases).map((phaseKey) => {
            const p = strikePhases[phaseKey];
            const isActive = activePhase === phaseKey;

            return (
              <button
                key={phaseKey}
                onClick={() => setActivePhase(phaseKey)}
                style={{
                  backgroundColor: isActive ? 'var(--burgundy-deep)' : '#FAF6F0',
                  color: isActive ? 'var(--cream-bg)' : 'var(--burgundy-deep)',
                  border: `2px solid ${isActive ? 'var(--burgundy-deep)' : 'rgba(89, 9, 7, 0.15)'}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 8px 20px rgba(89, 9, 7, 0.2)' : '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  opacity: isActive ? 0.85 : 0.6,
                  marginBottom: '4px'
                }}>
                  {p.timing}
                </div>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 900,
                  marginBottom: '6px'
                }}>
                  {p.title.split(':')[1] || p.title}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  <span style={{ opacity: isActive ? 0.9 : 0.7 }}>Cleat Speed:</span>
                  <span style={{
                    color: isActive ? '#E8D2B5' : '#E63946',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem'
                  }}>
                    {p.cleatSpeed}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Workbench Layout: 3D Skeleton Canvas (Left) + Biomechanical Telemetry Studio (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: Interactive 3D Skeleton Canvas */}
          <div style={{
            backgroundColor: '#181E19',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(89, 9, 7, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 3D Canvas Top Bar */}
            <div style={{
              padding: '14px 20px',
              backgroundColor: '#111512',
              borderBottom: '1px solid rgba(232, 210, 181, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={14} color="#E8D2B5" />
                <span style={{
                  color: 'var(--cream-bg)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em'
                }}>
                  3D SKELETAL RECONSTRUCTION (YAW: {Math.round(rotationAngle)}&deg;)
                </span>
              </div>

              {/* Layer toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowPlanes(!showPlanes)}
                  style={{
                    backgroundColor: showPlanes ? 'rgba(232, 210, 181, 0.2)' : 'transparent',
                    color: showPlanes ? '#FFF6EB' : 'rgba(232, 210, 181, 0.4)',
                    border: '1px solid rgba(232, 210, 181, 0.2)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Torso Planes
                </button>

                <button
                  onClick={() => setShowAngles(!showAngles)}
                  style={{
                    backgroundColor: showAngles ? 'rgba(232, 210, 181, 0.2)' : 'transparent',
                    color: showAngles ? '#FFF6EB' : 'rgba(232, 210, 181, 0.4)',
                    border: '1px solid rgba(232, 210, 181, 0.2)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Joint Badges
                </button>

                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  style={{
                    backgroundColor: isAutoRotating ? 'var(--cream-bg)' : 'rgba(232, 210, 181, 0.12)',
                    color: isAutoRotating ? 'var(--burgundy-deep)' : 'var(--cream-bg)',
                    border: '1px solid rgba(232, 210, 181, 0.25)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCw size={11} />
                  {isAutoRotating ? 'Rotating' : 'Auto Rotate'}
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10' }}>
              <canvas
                ref={canvasRef}
                width={760}
                height={475}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              />

              {/* Floating Striking Foot Speed Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(67, 5, 4, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(232, 210, 181, 0.3)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: 'var(--cream-bg)'
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#E8D2B5', letterSpacing: '0.06em' }}>STRIKING CLEAT VELOCITY</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF6EB', fontFamily: 'monospace' }}>
                  {currentData.cleatSpeed}
                </div>
              </div>

              {/* Rotational Yaw Scrubber */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(232, 210, 181, 0.15)'
              }}>
                <span style={{ color: 'var(--cream-light)', fontSize: '0.72rem', fontWeight: 800, minWidth: '70px' }}>
                  Yaw Angle:
                </span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={(e) => {
                    setIsAutoRotating(false);
                    setRotationAngle(parseFloat(e.target.value));
                  }}
                  style={{ flex: 1, accentColor: 'var(--cream-bg)', cursor: 'pointer' }}
                />
                <span style={{ color: '#E8D2B5', fontFamily: 'monospace', fontSize: '0.76rem', minWidth: '40px', textAlign: 'right' }}>
                  {Math.round(rotationAngle)}&deg;
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Biomechanical Telemetry Studio */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Phase Context Card */}
            <div style={{
              backgroundColor: '#FAF6F0',
              borderRadius: '16px',
              border: '2px solid rgba(89, 9, 7, 0.15)',
              padding: '24px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(89, 9, 7, 0.1)',
                color: 'var(--burgundy-deep)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                KINETIC PHASE BREAKDOWN
              </div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--burgundy-deep)'
              }}>
                {currentData.title}
              </h3>
              <p style={{
                margin: '0 0 16px 0',
                color: '#380504',
                fontSize: '0.86rem',
                lineHeight: 1.55,
                opacity: 0.88
              }}>
                {currentData.description}
              </p>

              {/* 4 Core Biomechanical Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(89, 9, 7, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>KNEE FLEXION</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#E63946', fontFamily: 'monospace' }}>
                    {currentData.kneeAngle}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '2px' }}>Angular extension</div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(89, 9, 7, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>TORSO SEPARATION</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--burgundy-deep)', fontFamily: 'monospace' }}>
                    {currentData.torsoSeparation}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '2px' }}>Hip-shoulder twist</div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(89, 9, 7, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>KINETIC POWER</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1B4965', fontFamily: 'monospace' }}>
                    {currentData.kineticPower}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '2px' }}>Segmental output</div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(89, 9, 7, 0.12)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--burgundy-deep)', opacity: 0.7 }}>GROUND REACTION</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2A9D8F', fontFamily: 'monospace' }}>
                    2.4x BW
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#666', marginTop: '2px' }}>Plant leg anchor</div>
                </div>
              </div>
            </div>

            {/* Interactive Skeletal Landmark Inspector */}
            <div style={{
              backgroundColor: 'var(--burgundy-deep)',
              borderRadius: '16px',
              padding: '20px 24px',
              color: 'var(--cream-bg)',
              border: '2px solid rgba(232, 210, 181, 0.2)'
            }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--cream-light)',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}>
                SELECT 3D KEYPOINT LANDMARK
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {[
                  { id: 'right_knee', label: 'Striking Knee' },
                  { id: 'right_ankle', label: 'Striking Cleat' },
                  { id: 'left_ankle', label: 'Plant Foot' },
                  { id: 'pelvis', label: 'Pelvic Girdle' },
                  { id: 'sternum', label: 'Thorax / Chest' },
                  { id: 'head', label: 'Head Centroid' }
                ].map(joint => {
                  const isSel = selectedJoint === joint.id;
                  return (
                    <button
                      key={joint.id}
                      onClick={() => setSelectedJoint(joint.id)}
                      style={{
                        backgroundColor: isSel ? 'var(--cream-bg)' : 'rgba(232, 210, 181, 0.12)',
                        color: isSel ? 'var(--burgundy-deep)' : 'var(--cream-bg)',
                        border: `1px solid ${isSel ? 'var(--cream-bg)' : 'rgba(232, 210, 181, 0.25)'}`,
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {joint.label}
                    </button>
                  );
                })}
              </div>

              {/* Inspected Keypoint Telemetry */}
              <div style={{
                marginTop: '16px',
                backgroundColor: 'rgba(0,0,0,0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#E8D2B5', fontWeight: 700 }}>COORDINATES (X, Y, Z) cm</div>
                  <div style={{ fontSize: '0.86rem', fontFamily: 'monospace', fontWeight: 900, color: '#FFF6EB', marginTop: '2px' }}>
                    [{currentData.keypoints[selectedJoint]?.join(', ') || '0, 0, 0'}]
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: '#E8D2B5', fontWeight: 700 }}>ESTIMATION CONF</div>
                  <div style={{ fontSize: '0.86rem', fontFamily: 'monospace', fontWeight: 900, color: '#94D2BD', marginTop: '2px' }}>
                    0.978 (ViTPose-H)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
