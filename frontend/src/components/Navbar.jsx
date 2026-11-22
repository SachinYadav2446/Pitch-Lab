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
      borderBottom: '1px solid rgba(89, 9, 7, 0.08)',
      boxShadow: 'none'
    }}>
      {/* Left spacer for perfect center balance */}
      <div style={{ flex: 1 }} className="hidden-mobile" />

      {/* Center Nav Links: Deep Burgundy on Muted Sage Grey */}
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
              color: 'var(--burgundy-deep)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.3px',
              opacity: 0.88,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1';
              e.target.style.color = '#380504';
              e.target.style.textShadow = '0 0 10px rgba(89, 9, 7, 0.2)';
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

      {/* Right Action: Deep Burgundy Button with Warm Cream Beige Text */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--burgundy-deep)',
            cursor: 'pointer',
            padding: '6px',
            display: 'none'
          }}
          className="show-mobile"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} color="#590907" /> : <Menu size={24} color="#590907" />}
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
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderBottom: '1px solid rgba(89, 9, 7, 0.15)'
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
