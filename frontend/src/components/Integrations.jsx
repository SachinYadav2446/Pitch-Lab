import React from 'react';
import { Database, Cpu, Activity, Layers, Link2 } from 'lucide-react';

export default function Integrations() {
  const providers = [
    { name: "StatsBomb", type: "Event & 360 Data", desc: "Granular freeze-frame pressure events" },
    { name: "Opta / StatsPerform", type: "Live Feeds", desc: "Standardized league tracking and events" },
    { name: "Second Spectrum", type: "Optical Tracking", desc: "Multi-camera sub-millimeter positional feeds" },
    { name: "Gradient", type: "Performance Evaluation", desc: "Advanced player grading & tracking layers" },
    { name: "YOLOv8 + ByteTrack", type: "Deep Learning Engine", desc: "Edge optical object re-identification" },
    { name: "Catapult & GPS", type: "Wearable Biometrics", desc: "Physical metabolic load & fatigue streams" }
  ];

  return (
    <section style={{
      maxWidth: '1360px',
      margin: '60px auto 100px auto',
      padding: '0 40px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <span className="badge-amber">Seamless Interoperability</span>
        <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginTop: '10px', marginBottom: '12px' }}>
          Integrated Data Providers & Standards
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Directly ingestion-ready with global optical, event, and GPS wearable tracking standards.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {providers.map((p, idx) => (
          <div key={idx} className="card-luxury" style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--amber-subtle)',
              border: '1px solid rgba(255, 126, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Database size={20} color="var(--electric-amber)" />
            </div>

            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--pitch-green)', fontWeight: 600 }}>
                {p.type}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {p.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
