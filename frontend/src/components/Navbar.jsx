import React, { useState } from 'react';
import { Activity, Bell, ArrowUpRight, Menu, X } from 'lucide-react';

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
      padding: '16px 44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 240, 220, 0.06)'
    }}>
      {/* Left Brand Identity: VortexAI style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="#" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--cream-primary)'
          }}>
            pitch<span style={{ color: '#E03542' }}>LAB</span>
          </span>
        </a>
      </div>

      {/* Center Nav Links Pill (VortexAI style) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        background: 'rgba(255, 240, 220, 0.04)',
        border: '1px solid rgba(255, 240, 220, 0.1)',
        padding: '8px 24px',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)'
      }} className="hidden-mobile">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              textDecoration: 'none',
              color: 'var(--cream-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.2px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#FFFFFF';
              e.target.style.textShadow = '0 0 10px rgba(224, 53, 66, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--cream-secondary)';
              e.target.style.textShadow = 'none';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right Action: Glowing Coral/Crimson Button + Notification Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onLaunchStudio}
          className="btn-vortex-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          <Activity size={14} />
          <span>Tactical Console</span>
        </button>

        <button
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 240, 220, 0.05)',
            border: '1px solid rgba(255, 240, 220, 0.15)',
            color: 'var(--cream-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          aria-label="Notifications"
        >
          <Bell size={15} />
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
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
