import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Novelties', href: '#vision-engine' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Observatory', href: '#homography' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Dataset', href: '#dataset' },
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
      boxShadow: 'none'
    }}>
      {/* Left spacer for perfect center balance (Zero logo, Zero pitchLAB text) */}
      <div style={{ flex: 1 }} className="hidden-mobile" />

      {/* Center Nav Links: Pure floating text without cylindrical pill container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        justifyContent: 'center'
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
              letterSpacing: '0.3px',
              opacity: 0.85,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#FFFFFF';
              e.target.style.opacity = '1';
              e.target.style.textShadow = '0 0 12px rgba(255, 240, 220, 0.6)';
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

      {/* Right Action: Clean Tactical Console Pill Button */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={onLaunchStudio}
          className="btn-cream-primary"
          style={{
            border: 'none',
            borderRadius: '24px',
            padding: '9px 24px',
            fontSize: '0.86rem'
          }}
        >
          <span>Tactical Console</span>
          <ArrowRight size={14} color="#340407" />
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
          {mobileMenuOpen ? <X size={24} color="#FFF0DC" /> : <Menu size={24} color="#FFF0DC" />}
        </button>
      </div>

      {/* Mobile Drawer */}
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
                fontSize: '1.05rem',
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
              borderRadius: '24px',
              padding: '12px 24px',
              fontSize: '0.92rem',
              justifyContent: 'center'
            }}
          >
            <span>Tactical Console</span>
            <ArrowRight size={14} color="#340407" />
          </button>
        </div>
      )}
    </nav>
  );
}
