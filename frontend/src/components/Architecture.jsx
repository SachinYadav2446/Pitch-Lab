import React from 'react';
import { Video, Cpu, Palette, Compass, BarChart3, ChevronRight } from 'lucide-react';

export default function Architecture() {
  const steps = [
    {
      step: "01",
      title: "Broadcast Ingestion",
      desc: "Raw 1080p / 4K match video stream or file reading via OpenCV",
      icon: Video
    },
    {
      step: "02",
      title: "Deep Detection",
      desc: "YOLOv8 + ByteTrack detects players and ball with persistent IDs",
      icon: Cpu
    },
    {
      step: "03",
      title: "Team Assignment",
      desc: "K-Means clusters jersey pigments while filtering green field grass",
      icon: Palette
    },
    {
      step: "04",
      title: "Pitch Homography",
      desc: "3x3 Projective Transform maps feet to standard 2D pitch coordinates",
      icon: Compass
    },
    {
      step: "05",
      title: "Tactical Telemetry",
      desc: "Computes velocities, distance, possession, and 2D radar output",
      icon: BarChart3
    }
  ];

  return (
    <section id="architecture" style={{
      maxWidth: '1280px',
      margin: '80px auto',
      padding: '0 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge-green">Pipeline Architecture</span>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', marginTop: '8px', marginBottom: '14px' }}>
          End-to-End Vision Pipeline
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-brown)', maxWidth: '580px', margin: '0 auto' }}>
          How 30 FPS video frames are transformed into analytical spatial intelligence.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="card-luxury" style={{
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontFamily: 'Space Grotesk',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: 'var(--forest-green)'
                }}>
                  {s.step}
                </span>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--forest-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color="var(--forest-green)" />
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-espresso)', marginBottom: '8px' }}>
                {s.title}
              </h4>

              <p style={{ fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text-brown)', flexGrow: 1 }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
