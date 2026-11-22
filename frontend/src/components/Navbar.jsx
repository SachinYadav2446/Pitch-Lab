import React, { useState } from 'react';
import { Activity, Cpu, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Vision Engine', href: '#vision-engine' },
    { label: 'Pitch Radar', href: '#homography' },
    { label: 'Tactical Metrics', href: '#metrics' },
    { label: 'Architecture', href: '#architecture' },
  ];

  return (
    <nav className="glass-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '18px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      borderBottom: 'none',
      boxShadow: 'none',
      transition: 'all 0.3s ease'
    }}>
      {/* Sleek Minimalist Emblem (Name & text removed for clean UX) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a
          href="#"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFF0DC 0%, #E8D5BC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35), 0 0 16px rgba(255, 240, 220, 0.2)',
            border: 'none',
            textDecoration: 'none',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Home"
        >
          <Activity size={22} color="#48060B" strokeWidth={2.6} />
        </a>
      </div>

      {/* Desktop Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '36px'
      }} className="hidden-mobile">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              textDecoration: 'none',
              color: 'var(--cream-secondary)',
              fontSize: '0.92rem',
              fontWeight: 600,
              letterSpacing: '0.2px',
              opacity: 0.85,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#FFFFFF';
              e.target.style.opacity = '1';
              e.target.style.textShadow = '0 0 10px rgba(255,240,220,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--cream-secondary)';
              e.target.style.opacity = '0.85';
              e.target.style.textShadow = 'none';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Action Controls & Hardware Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* RTX Hardware Status Badge (Clean, borderless pill) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 16px',
          borderRadius: '30px',
          background: 'rgba(255, 240, 220, 0.06)',
          border: 'none',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--cream-primary)'
        }} className="hidden-mobile">
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#FFF0DC',
            boxShadow: '0 0 8px #FFF0DC',
            display: 'inline-block'
          }} />
          <Cpu size={14} color="#FFF0DC" />
          <span>RTX 4050 Active</span>
        </div>

        {/* Primary CTA Pill Button (Clean, rounded, borderless) */}
        <button
          onClick={onLaunchStudio}
          className="btn-cream-primary"
          style={{
            border: 'none',
            borderRadius: '30px',
            padding: '10px 24px',
            fontSize: '0.88rem'
          }}
        >
          <span>Launch Studio</span>
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
