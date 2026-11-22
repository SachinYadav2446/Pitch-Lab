import React, { useState } from 'react';
import { ArrowRight, Menu, X, Radio } from 'lucide-react';

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
      padding: '18px 44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'none',
      borderBottom: '1px solid rgba(89, 9, 7, 0.08)',
      boxShadow: 'none'
    }}>
      {/* ========================================================
          LEFT-CENTERED NAVIGATION GROUP
          Three Lines Menu Icon + 3 Live Badge + Left-Centered Links
          ======================================================== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Three Lines (Hamburger Menu Icon) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'rgba(89, 9, 7, 0.08)',
            border: '1px solid rgba(89, 9, 7, 0.15)',
            borderRadius: '10px',
            color: 'var(--burgundy-deep)',
            cursor: 'pointer',
            padding: '7px 9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(89, 9, 7, 0.16)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(89, 9, 7, 0.08)'}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X size={20} color="var(--burgundy-deep)" strokeWidth={2.5} />
          ) : (
            <Menu size={20} color="var(--burgundy-deep)" strokeWidth={2.5} />
          )}
        </button>

        {/* 3 LIVE Indicator Badge on Left Side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '20px',
          background: 'rgba(89, 9, 7, 0.12)',
          border: '1px solid rgba(89, 9, 7, 0.22)',
          fontSize: '0.74rem',
          fontWeight: 800,
          color: 'var(--burgundy-deep)',
          letterSpacing: '0.6px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#590907',
            boxShadow: '0 0 8px rgba(89, 9, 7, 0.6)',
            display: 'inline-block'
          }} />
          <Radio size={12} color="var(--burgundy-deep)" />
          <span>3 LIVE</span>
        </div>

        {/* Left-Centered Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginLeft: '8px'
        }} className="hidden-mobile">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--burgundy-deep)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.2px',
                opacity: 0.88,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.color = '#380504';
                e.target.style.textShadow = '0 0 10px rgba(89, 9, 7, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.88';
                e.target.style.color = 'var(--burgundy-deep)';
                e.target.style.textShadow = 'none';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ========================================================
          RIGHT SIDE: Tactical Console CTA Button
          ======================================================== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onLaunchStudio}
          className="btn-burgundy-primary"
          style={{
            borderRadius: '24px',
            padding: '9px 24px',
            fontSize: '0.86rem'
          }}
        >
          <span>Tactical Console</span>
          <ArrowRight size={14} color="var(--cream-beige)" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(165, 167, 155, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          borderBottom: '1px solid rgba(89, 9, 7, 0.15)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--burgundy-deep)',
                fontSize: '1.05rem',
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
              borderRadius: '24px',
              padding: '12px 24px',
              fontSize: '0.92rem',
              justifyContent: 'center'
            }}
          >
            <span>Tactical Console</span>
            <ArrowRight size={14} color="var(--cream-beige)" />
          </button>
        </div>
      )}
    </nav>
  );
}
