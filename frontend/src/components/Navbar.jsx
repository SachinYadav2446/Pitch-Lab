import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  const navLinks = [
    { label: 'Feature Matrix', href: '#features-explorer' },
    { label: 'Spatial Homography', href: '#features-explorer' },
    { label: 'Space Control', href: '#features-explorer' },
    { label: 'Deep Tracking', href: '#features-explorer' },
    { label: '3D Biomechanics', href: '#features-explorer' },
    { label: 'Pipeline Architecture', href: '#features-explorer' }
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
          gap: '24px'
        }} className="hidden-mobile">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                textDecoration: 'none',
                color: 'var(--burgundy-deep)',
                fontSize: '0.80rem',
                fontWeight: 700,
                letterSpacing: '0.2px',
                opacity: 0.88,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
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
    </nav>
  );
}
