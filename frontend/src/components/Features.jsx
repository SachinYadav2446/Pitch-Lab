import React from 'react';
import { Target, Compass, Palette, Gauge, Layers, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: Target,
      tag: "Object Detection & Re-ID",
      title: "YOLOv8 + ByteTrack Identity Engine",
      description: "Detects players, referees, and the soccer ball with sub-millisecond latency. ByteTrack preserves persistent tracking IDs across multi-player occlusions, slide tackles, and camera pans.",
      accent: "var(--forest-green)"
    },
    {
      icon: Compass,
      tag: "Spatial Calibration",
      title: "Projective Homography Transformation",
      description: "Broadcast camera angles inherently warp spatial depth. Our 3x3 homography matrix transforms camera pixel coordinates (u, v) into true Euclidean pitch coordinates (0-105m, 0-68m).",
      accent: "var(--terracotta)"
    },
    {
      icon: Palette,
      tag: "Computer Vision",
      title: "Unsupervised Jersey Color Clustering",
      description: "Applies HSV grass filtration to eliminate pitch green interference from player crops, followed by K-Means clustering to automatically classify Team Alpha, Team Beta, and Goalkeepers.",
      accent: "var(--forest-green)"
    },
    {
      icon: Gauge,
      tag: "Physical Telemetry",
      title: "Kinematic Velocity & Work-Rate Engine",
      description: "Computes instantaneous speed (km/h) with rolling-window exponential smoothing to eliminate camera shake artifacts, tracking high-intensity sprints, fatigue, and stamina expenditure.",
      accent: "var(--amber-gold)"
    }
  ];

  return (
    <section id="features" style={{
      maxWidth: '1280px',
      margin: '60px auto',
      padding: '0 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge-green">Platform Capabilities</span>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', marginTop: '8px', marginBottom: '14px' }}>
          Engineered for Elite Football Analytics
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-brown)', maxWidth: '640px', margin: '0 auto' }}>
          Moving beyond primitive bounding boxes into an enterprise spatial intelligence pipeline.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              className="card-luxury"
              style={{ padding: '32px' }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--forest-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Icon size={24} color={f.accent} />
              </div>

              <div style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: f.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '6px'
              }}>
                {f.tag}
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-espresso)', marginBottom: '12px' }}>
                {f.title}
              </h3>

              <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-brown)' }}>
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
