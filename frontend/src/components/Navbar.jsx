import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
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
      padding: '10px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      borderBottom: 'none',
      boxShadow: 'none'
    }}>
      {/* Left-Centered Navigation Group */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Three Lines Menu Icon (Click disabled for now) */}
        <div
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--burgundy-deep)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
          }}
          aria-hidden="true"
        >
          <Menu size={18} color="var(--burgundy-deep)" strokeWidth={2.4} />
        </div>

        {/* Left-Centered Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px'
        }} className="hidden-mobile">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--burgundy-deep)',
                fontSize: '0.80rem',
                fontWeight: 700,
                letterSpacing: '0.2px',
                opacity: 0.88,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.color = '#380504';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.88';
                e.target.style.color = 'var(--burgundy-deep)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Right Action: Compact CTA Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={onLaunchStudio}
          className="btn-burgundy-primary"
          style={{
            borderRadius: '20px',
            padding: '7px 18px',
            fontSize: '0.78rem',
            border: 'none'
          }}
        >
          <span>Tactical Console</span>
          <ArrowRight size={13} color="var(--cream-beige)" />
        </button>
      </div>
    </nav>
  );
}
