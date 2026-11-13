import React from 'react';
import { Activity, Play, Calendar } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  return (
    <nav className="glass-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo matching SportAnalytics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #FF7E00 0%, #D45D00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(255, 126, 0, 0.35)',
        }}>
          <Activity size={22} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: '#FFFFFF'
          }}>
            Sport<span style={{ color: 'var(--orange-primary)' }}>Analytics</span>
          </span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            marginLeft: '6px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'var(--orange-subtle)',
            color: 'var(--orange-primary)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            border: '1px solid var(--orange-border)'
          }}>PRO</span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <a href="#services" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Services
        </a>
        <a href="#platform" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Platform
        </a>
        <a href="#studio" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Tactical Studio
        </a>
        <a href="#testimonials" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Testimonials
        </a>
        <a href="#insights" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Research
        </a>
      </div>

      {/* Status Pill & CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FF7E00',
            boxShadow: '0 0 10px #FF7E00'
          }}></span>
          <span>RTX 4050 ACCELERATED</span>
        </div>

        <button 
          onClick={onLaunchStudio}
          className="btn-primary"
          style={{ fontSize: '0.88rem', padding: '10px 22px' }}
        >
          <Play size={15} fill="#FFFFFF" />
          Live Studio
        </button>
      </div>
    </nav>
  );
}
