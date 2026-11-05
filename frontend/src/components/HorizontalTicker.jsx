import React from 'react';
import { Zap, Activity, Compass, ShieldCheck, Target, TrendingUp, Gauge } from 'lucide-react';

export default function HorizontalTicker() {
  const items = [
    { icon: Zap, label: "PEAK SPRINT", val: "K. Mbappé · 34.8 km/h", color: "#D64933" },
    { icon: Compass, label: "HOMOGRAPHY CALIBRATION", val: "105m × 68m · Error < 0.04m", color: "#245235" },
    { icon: Target, label: "YOLOv8 + BYTETRACK", val: "22/22 Players Locked · 99.4% ID Persistence", color: "#245235" },
    { icon: Activity, label: "SPACE CONTROL", val: "Alpha Dominance · 56.4% Territory", color: "#A65A42" },
    { icon: Gauge, label: "INFERENCE VELOCITY", val: "RTX 4050 · 118.5 FPS (8.4ms)", color: "#245235" },
    { icon: TrendingUp, label: "DYNAMIC POSSESSION", val: "Alpha 53% — 47% Beta", color: "#3B7A50" },
    { icon: ShieldCheck, label: "OFFSIDE TELEMETRY", val: "Defensive Line: 38.2m Depth", color: "#D64933" }
  ];

  // Duplicate for continuous seamless marquee loop
  const marqueeItems = [...items, ...items];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: '#F3ECE1',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 0',
      position: 'relative'
    }}>
      {/* Left and Right Fade Gradients */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80px',
        height: '100%',
        background: 'linear-gradient(to right, #F3ECE1, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '100%',
        background: 'linear-gradient(to left, #F3ECE1, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Sliding Track */}
      <div className="ticker-track">
        {marqueeItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 20px',
              marginRight: '14px',
              background: '#FAF7F2',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(40, 30, 20, 0.03)'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--forest-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={13} color={item.color} />
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--text-espresso)',
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
