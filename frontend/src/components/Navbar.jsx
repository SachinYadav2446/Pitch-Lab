import React from 'react';
import { Activity, Cpu, Sparkles, Video, Play, Compass, Database } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  return (
    <nav className="glass-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #225133 0%, #153822 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(34, 81, 51, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Activity size={20} color="#FAF7F2" />
        </div>
        <div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: 'var(--text-espresso)'
          }}>
            PITCH<span style={{ color: 'var(--forest-green)' }}>LAB</span>
          </span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            marginLeft: '6px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'var(--forest-light)',
            color: 'var(--forest-green)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>PRO</span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-brown)', fontSize: '0.92rem', fontWeight: 600 }}>
          Core Capabilities
        </a>
        <a href="#studio" style={{ textDecoration: 'none', color: 'var(--text-brown)', fontSize: '0.92rem', fontWeight: 600 }}>
          Live Studio
        </a>
        <a href="#architecture" style={{ textDecoration: 'none', color: 'var(--text-brown)', fontSize: '0.92rem', fontWeight: 600 }}>
          Vision Architecture
        </a>
      </div>

      {/* GPU Status Pill & CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-espresso)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00C853',
            boxShadow: '0 0 8px #00C853'
          }}></span>
          <span>RTX 4050 GPU READY</span>
        </div>

        <button 
          onClick={onLaunchStudio}
          className="btn-primary"
          style={{ fontSize: '0.9rem', padding: '9px 18px' }}
        >
          <Play size={16} fill="#FAF7F2" />
          Launch Studio
        </button>
      </div>
    </nav>
  );
}
