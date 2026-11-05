import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-card-subtle)',
      padding: '48px 24px 36px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--forest-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={18} color="#FAF7F2" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.15rem' }}>
            PITCH<span style={{ color: 'var(--forest-green)' }}>LAB</span>
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
            Next-Gen Sports Vision & Spatial Intelligence
          </span>
        </div>

        {/* System specs badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-brown)'
        }}>
          <span>NVIDIA RTX 4050 GPU</span>
          <span>•</span>
          <span>PyTorch 2.6 CUDA</span>
          <span>•</span>
          <span>YOLOv8 + ByteTrack</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '24px auto 0 auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span>© 2026 PITCHLAB Technologies. Engineered for Deep Learning & Computer Vision.</span>
        <span>Built with React, Vite & PyTorch</span>
      </div>
    </footer>
  );
}
