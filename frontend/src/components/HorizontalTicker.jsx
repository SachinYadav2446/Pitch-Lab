import React from 'react';
import { Zap, Activity, Compass, ShieldCheck, Target, TrendingUp, Gauge } from 'lucide-react';

export default function HorizontalTicker() {
  const items = [
    { icon: Zap, label: "PEAK SPRINT", val: "K. Mbappé · 34.8 km/h" },
    { icon: Compass, label: "HOMOGRAPHY CALIBRATION", val: "105m × 68m · Error < 0.04m" },
    { icon: Target, label: "YOLOv8 + BYTETRACK", val: "22/22 Players Locked · 99.4% Persistence" },
    { icon: Activity, label: "SPACE CONTROL", val: "Territory Dominance: 58.4%" },
    { icon: Gauge, label: "INFERENCE VELOCITY", val: "RTX 4050 · 120 FPS (8.2ms)" },
    { icon: TrendingUp, label: "FIELD TILT", val: "Final Third Possession: 64.2%" },
    { icon: ShieldCheck, label: "TEAM COMPACTNESS", val: "Line Depth Separation: 24.2m" }
  ];

  const marqueeItems = [...items, ...items];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: 'var(--bg-dark-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 0',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100px',
        height: '100%',
        background: 'linear-gradient(to right, var(--bg-dark-secondary), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100%',
        background: 'linear-gradient(to left, var(--bg-dark-secondary), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      <div className="ticker-track">
        {marqueeItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 20px',
              marginRight: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--orange-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={13} color="var(--orange-primary)" />
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'Space Grotesk'
              }}>
                {item.val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
