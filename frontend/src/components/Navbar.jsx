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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '16px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      borderBottom: 'none',
      boxShadow: 'none',
      background: 'transparent'
    }}>
      {/* Left-Centered Navigation Group */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Three Lines Menu Icon */}
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
                fontSize: '0.82rem',
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

      {/* Right Action: Warm Cream Beige Button for High Contrast on Burgundy Slab */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        zIndex: 101
      }}>
        <button
          onClick={onLaunchStudio}
          style={{
            background: 'var(--cream-beige)',
            color: 'var(--burgundy-deep)',
            border: '1px solid rgba(89, 9, 7, 0.25)',
            borderRadius: '20px',
            padding: '7px 20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            fontFamily: 'Space Grotesk, sans-serif',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--cream-beige)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>Tactical Console</span>
          <ArrowRight size={13} color="var(--burgundy-deep)" />
        </button>
      </div>
    </nav>
  );
}
