import React, { useState } from 'react';
import { Activity, Cpu, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '16px 44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FFF0DC 0%, #E8D5BC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4), 0 0 16px rgba(255, 240, 220, 0.25)',
          border: '1px solid rgba(255, 240, 220, 0.5)'
        }}>
          <Activity size={22} color="#48060B" strokeWidth={2.6} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--cream-primary)'
          }}>
            SportAnalytics
          </span>
          <span className="badge-solid-cream">
            PRO
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '34px'
      }} className="hidden-mobile">
        <a href="#vision-engine" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.target.style.color = '#FFF0DC'; e.target.style.textShadow = '0 0 8px rgba(255,240,220,0.4)'; }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.textShadow = 'none'; }}>
          Vision Engine
        </a>

        <a href="#homography" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.target.style.color = '#FFF0DC'; e.target.style.textShadow = '0 0 8px rgba(255,240,220,0.4)'; }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.textShadow = 'none'; }}>
          Pitch Radar
        </a>

        <a href="#metrics" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.target.style.color = '#FFF0DC'; e.target.style.textShadow = '0 0 8px rgba(255,240,220,0.4)'; }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.textShadow = 'none'; }}>
          Tactical Metrics
        </a>

        <a href="#architecture" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.target.style.color = '#FFF0DC'; e.target.style.textShadow = '0 0 8px rgba(255,240,220,0.4)'; }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.textShadow = 'none'; }}>
          Pipeline Architecture
        </a>
      </div>

      {/* Action Controls & Hardware Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* RTX Hardware Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '30px',
          background: 'rgba(255, 240, 220, 0.08)',
          border: '1px solid var(--cream-border)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--cream-primary)'
        }} className="hidden-mobile">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FFF0DC',
            boxShadow: '0 0 10px #FFF0DC',
            display: 'inline-block'
          }} />
          <Cpu size={14} color="#FFF0DC" />
          <span>RTX 4050 GPU Ready</span>
        </div>

        {/* Primary CTA Button (Warm Ivory Cream with Deep Crimson text) */}
        <button
          onClick={onLaunchStudio}
          className="btn-cream-primary"
          style={{ padding: '10px 22px', fontSize: '0.88rem' }}
        >
          <span>Launch Tactical Studio</span>
          <ArrowUpRight size={16} />
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cream-primary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none'
          }}
          className="show-mobile"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
}
