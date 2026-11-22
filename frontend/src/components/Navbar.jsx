import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
      padding: '20px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      borderBottom: 'none',
      boxShadow: 'none',
      transition: 'all 0.3s ease'
    }}>
      {/* Left spacer for perfect centering balance */}
      <div style={{ flex: 1 }} className="hidden-mobile" />

      {/* Clean Centered Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '42px',
        justifyContent: 'center'
      }} className="hidden-mobile">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              textDecoration: 'none',
              color: 'var(--cream-secondary)',
              fontSize: '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.3px',
              opacity: 0.85,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#FFFFFF';
              e.target.style.opacity = '1';
              e.target.style.textShadow = '0 0 12px rgba(255,240,220,0.6)';
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

      {/* Right Side Action CTA (Clean pill, no borders, no RTX text) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '16px'
      }}>
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(52, 4, 7, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--cream-primary)',
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLaunchStudio();
            }}
            className="btn-cream-primary"
            style={{
              border: 'none',
              borderRadius: '30px',
              padding: '12px 24px',
              fontSize: '0.95rem',
              justifyContent: 'center'
            }}
          >
            <span>Launch Studio</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}
