import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Activity, Cpu } from 'lucide-react';

const SYSTEMS_LIST = [
  { index: 0, num: '01', title: 'Planar Pitch Homography', latency: '1.8 ms' },
  { index: 1, num: '02', title: 'Dynamic Space & Voronoi', latency: '3.4 ms' },
  { index: 2, num: '03', title: 'Deep Multi-Object Tracking', latency: '4.2 ms' },
  { index: 3, num: '04', title: 'Jersey Pigment Clustering', latency: '2.1 ms' },
  { index: 4, num: '05', title: 'Kinematic Velocity Calculus', latency: '1.1 ms' },
  { index: 5, num: '06', title: '3D Biomechanical Pose', latency: '8.2 ms' },
  { index: 6, num: '07', title: 'Vision Studio & 2D Radar', latency: '14.8 ms' },
  { index: 7, num: '08', title: 'Autonomous Edge Pipeline', latency: '64.9 FPS' }
];

export default function Navbar({ onSelectFeature }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    }

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const handleLinkClick = (index) => {
    setIsDrawerOpen(false);
    onSelectFeature?.(index);
  };

  const navLinks = [
    { label: 'Matrix', index: 0, priority: 1 },
    { label: 'Homography', index: 0, priority: 1 },
    { label: 'Tracking', index: 2, priority: 1 },
    { label: 'Biomechanics', index: 5, priority: 2 },
    { label: 'Radar Studio', index: 6, priority: 3 },
  ];

  return (
    <nav className="glass-nav" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      border: 'none',
      borderBottom: 'none',
      boxShadow: 'none',
      background: 'transparent',
      pointerEvents: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative'
      }}>
        {/* Left Navigation Group - Strictly constrained to the sage zone */}
        <div 
          ref={dropdownRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            maxWidth: 'min(480px, 44vw)',
            position: 'relative'
          }}
        >
          {/* Interactive Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(prev => !prev)}
            style={{
              background: isDrawerOpen ? 'rgba(89, 9, 7, 0.12)' : 'transparent',
              border: '1px solid',
              borderColor: isDrawerOpen ? 'rgba(89, 9, 7, 0.3)' : 'transparent',
              borderRadius: '8px',
              color: 'var(--burgundy-deep)',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease'
            }}
            aria-label="Toggle Systems Drawer"
            title="Browse all vision modules"
          >
            {isDrawerOpen ? (
              <X size={18} color="var(--burgundy-deep)" strokeWidth={2.4} />
            ) : (
              <Menu size={18} color="var(--burgundy-deep)" strokeWidth={2.4} />
            )}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '0.6px',
              color: 'var(--burgundy-deep)',
              textTransform: 'uppercase'
            }} className="menu-btn-text">
              Modules
            </span>
          </button>

          {/* Left Nav Links - Concise, compact, zero overlap */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'nowrap'
          }} className="navbar-quick-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#features-explorer"
                className={`nav-link-item priority-${link.priority}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.index);
                }}
                style={{
                  textDecoration: 'none',
                  color: 'var(--burgundy-deep)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.15px',
                  opacity: 0.88,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = '#380504';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.color = 'var(--burgundy-deep)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ========================================================
              TACTICAL SYSTEMS QUICK-JUMP DRAWER (DROPDOWN)
              Opens directly beneath the menu button
              ======================================================== */}
          {isDrawerOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              width: '320px',
              backgroundColor: '#430504',
              backgroundImage: 'linear-gradient(165deg, #590907 0%, #350403 100%)',
              border: '1px solid rgba(232, 210, 181, 0.25)',
              borderRadius: '12px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45), 0 0 25px rgba(89, 9, 7, 0.35)',
              padding: '12px',
              zIndex: 250,
              animation: 'drawerFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Drawer Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px 10px',
                borderBottom: '1px solid rgba(232, 210, 181, 0.12)',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={12} color="var(--cream-beige)" />
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '0.8px',
                    color: 'var(--cream-beige)',
                    textTransform: 'uppercase'
                  }}>
                    Vision Modules 01-08
                  </span>
                </div>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  color: 'rgba(232, 210, 181, 0.6)'
                }}>
                  Live Sync
                </span>
              </div>

              {/* Systems List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {SYSTEMS_LIST.map((sys) => (
                  <button
                    key={sys.num}
                    onClick={() => handleLinkClick(sys.index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cream-beige)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.12)';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontFamily: 'Space Grotesk, monospace',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        color: 'rgba(232, 210, 181, 0.65)'
                      }}>
                        {sys.num}
                      </span>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#FFF6EB',
                        letterSpacing: '-0.01em'
                      }}>
                        {sys.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        fontFamily: 'Space Grotesk, monospace',
                        color: 'rgba(232, 210, 181, 0.55)'
                      }}>
                        {sys.latency}
                      </span>
                      <ChevronRight size={12} color="rgba(232, 210, 181, 0.4)" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
