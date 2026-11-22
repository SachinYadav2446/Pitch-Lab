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
        {/* Three Lines Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--burgundy-deep)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X size={18} color="var(--burgundy-deep)" strokeWidth={2.4} />
          ) : (
            <Menu size={18} color="var(--burgundy-deep)" strokeWidth={2.4} />
          )}
        </button>

        {/* Left-Centered Nav Links (Reduced Size: 0.80rem) */}
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

      {/* Right Action: Reduced Compact CTA Button (0.78rem) */}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(165, 167, 155, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: 'none',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--burgundy-deep)',
                fontSize: '0.95rem',
                fontWeight: 700
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
            className="btn-burgundy-primary"
            style={{
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              justifyContent: 'center',
              border: 'none'
            }}
          >
            <span>Tactical Console</span>
            <ArrowRight size={13} color="var(--cream-beige)" />
          </button>
        </div>
      )}
    </nav>
  );
}
