import React, { useState } from 'react';
import { Video, Cpu, RefreshCw, Palette, Compass, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ArchitecturePipeline() {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    {
      id: 0,
      title: 'Broadcast Ingestion',
      module: 'OpenCV / Decord Frame Demuxer',
      latency: '1.8 ms',
      icon: Video,
      desc: 'Ingests high-bitrate broadcast feeds (1080p / 4K) into contiguous GPU memory buffers with zero CPU-GPU copy bottlenecks.',
      tensorShape: 'Batch: 1 × 3 × 1080 × 1920 (FP32)',
      throughput: '60.0 FPS'
    },
    {
      id: 1,
      title: 'YOLOv8 Deep Detection',
      module: 'CSPDarknet FP16 TensorRT',
      latency: '8.2 ms',
      icon: Cpu,
      desc: 'Multi-scale anchor-free object detection regressing 2D player bounding boxes and ball centroid coordinates with confidence scores.',
      tensorShape: 'Tensors: P3, P4, P5 Feature Heads',
      throughput: '122 FPS (Raw Model)'
    },
    {
      id: 2,
      title: 'ByteTrack Association',
      module: 'Kalman Filter + Hungarian Matching',
      latency: '2.1 ms',
      icon: RefreshCw,
      desc: 'Continuous track association matching high and low score detection tiers. Maintains persistent player identities through occlusions.',
      tensorShape: 'Track State: 8D Kinematic Vector',
      throughput: '476 FPS'
    },
    {
      id: 3,
      title: 'K-Means Color Clustering',
      module: 'HSV Grass Mask + K-Means (K=3)',
      latency: '1.4 ms',
      icon: Palette,
      desc: 'Crops player upper-torso regions, isolates pigments from pitch grass, and assigns players to Team Alpha, Team Beta, or Referees.',
      tensorShape: 'Clusters: Alpha, Beta, Officials',
      throughput: '710 FPS'
    },
    {
      id: 4,
      title: 'Planar Homography Warp',
      module: '3x3 Projective Matrix + RANSAC',
      latency: '1.1 ms',
      icon: Compass,
      desc: 'Solves perspective transformation over 29 canonical pitch keypoints to map player cleat coordinates onto FIFA 105m × 68m pitch space.',
      tensorShape: 'Matrix: H [3 × 3] Float64',
      throughput: '910 FPS'
    },
    {
      id: 5,
      title: 'Kinematics & 2D Minimap',
      module: 'Savitzky-Golay + Voronoi Engine',
      latency: '0.8 ms',
      icon: Activity,
      desc: 'Differentiates ground displacement over time, computes instant velocity (km/h), sprint zones, and renders real-time 2D radar output.',
      tensorShape: 'Telemetry: 22 Vectors + Spatial Radar',
      throughput: '1250 FPS'
    }
  ];

  const current = stages[activeStage];

  return (
    <section id="pipeline" style={{
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
        {/* Header */}
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
                ARCHITECTURE // DEEP LEARNING PIPELINE
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
              End-to-End Sports Vision Pipeline
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-burgundy-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              How broadcast video frames are transformed into tactical intelligence in &lt;16 ms.
              A multi-stage deep learning pipeline optimized for live 60 FPS streaming on modern GPUs.
            </p>
          </div>

          {/* Total Latency Badge */}
          <div style={{
            background: 'var(--burgundy-deep)',
            color: 'var(--cream-beige)',
            borderRadius: '18px',
            padding: '14px 24px',
            border: '1.5px solid rgba(232, 210, 181, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', opacity: 0.75 }}>TOTAL PIPELINE LATENCY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF6EB', fontFamily: 'monospace' }}>15.4 ms</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(232, 210, 181, 0.25)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', opacity: 0.75 }}>REAL-TIME THROUGHPUT</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ADE80', fontFamily: 'monospace' }}>64.9 FPS</div>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Pills Navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isSelected = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStage(stg.id)}
                style={{
                  background: isSelected ? 'var(--burgundy-deep)' : 'rgba(89, 9, 7, 0.06)',
                  color: isSelected ? 'var(--cream-beige)' : 'var(--burgundy-deep)',
                  border: isSelected ? '1.5px solid var(--cream-beige)' : '1px solid rgba(89, 9, 7, 0.15)',
                  borderRadius: '16px',
                  padding: '16px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon size={18} color={isSelected ? 'var(--cream-beige)' : 'var(--burgundy-deep)'} />
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    opacity: isSelected ? 1 : 0.75
                  }}>
                    {stg.latency}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {stg.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <div style={{
          background: 'linear-gradient(165deg, #590907 0%, #3D0504 100%)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 16px 40px rgba(89, 9, 7, 0.28), 0 0 25px rgba(0, 0, 0, 0.2)',
          border: '1.5px solid rgba(232, 210, 181, 0.25)',
          color: 'var(--cream-beige)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              color: 'var(--cream-beige)',
              opacity: 0.8,
              marginBottom: '10px'
            }}>
              <span>STAGE {current.id + 1} OF 6</span> • <span>{current.module}</span>
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#FFF6EB',
              marginBottom: '14px',
              letterSpacing: '-0.02em'
            }}>
              {current.title}
            </h3>
            <p style={{
              fontSize: '0.98rem',
              lineHeight: 1.6,
              color: 'var(--cream-beige)',
              opacity: 0.9,
              marginBottom: '20px'
            }}>
              {current.desc}
            </p>
            <div style={{ display: 'flex', gap: '20px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
              <div>
                <span style={{ opacity: 0.65 }}>LATENCY: </span>
                <strong style={{ color: '#FFF6EB' }}>{current.latency}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.65 }}>MODULE RATE: </span>
                <strong style={{ color: '#4ADE80' }}>{current.throughput}</strong>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(232, 210, 181, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'monospace'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--cream-beige)', opacity: 0.7 }}>
              GPU TENSOR STATE &amp; SPECIFICATION
            </div>
            <div style={{ fontSize: '0.90rem', color: '#FFF6EB', fontWeight: 700 }}>
              {current.tensorShape}
            </div>
            <div style={{ width: '100%', height: '1px', background: 'rgba(232, 210, 181, 0.15)', margin: '4px 0' }} />
            <div style={{ fontSize: '0.76rem', color: 'var(--cream-beige)', opacity: 0.85, lineHeight: 1.5 }}>
              Hardware Target: NVIDIA TensorRT FP16 / ONNX Runtime Execution Provider. CUDA Cores + Tensor Cores accelerated.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
