import React from 'react';
import { ArrowUp, Mail, Code2, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      width: '100%',
      backgroundColor: '#380504',
      backgroundImage: 'linear-gradient(180deg, #430504 0%, #2A0302 100%)',
      borderTop: '1px solid rgba(232, 210, 181, 0.22)',
      color: 'var(--cream-beige)',
      padding: '16px 48px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        minHeight: '44px'
      }}>
        {/* Left: Project Branding & Descriptor */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Name */}
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFF6EB',
            display: 'inline-flex',
            alignItems: 'baseline'
          }}>
            pitchvision<span style={{ opacity: 0.6, fontSize: '0.90rem' }}>.ai</span>
          </span>

          <span style={{
            color: 'rgba(232, 210, 181, 0.35)',
            fontSize: '0.85rem'
          }}>|</span>

          {/* Project Tagline */}
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--cream-beige)',
            opacity: 0.85,
            fontWeight: 500,
            letterSpacing: '0.1px'
          }}>
            Autonomous Spatial Football Vision &amp; 2D Pitch Radar
          </span>

          {/* Core Telemetry Status Dot */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(232, 210, 181, 0.18)',
            borderRadius: '20px',
            padding: '3px 9px',
            fontSize: '0.68rem',
            fontFamily: 'monospace',
            color: '#E8D2B5'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#4ADE80',
              boxShadow: '0 0 6px #4ADE80'
            }} />
            <span>64.9 FPS // YOLOv8</span>
          </div>
        </div>

        {/* Right: Creator Details, Links & Scroll To Top */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Creator Credit */}
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--cream-beige)',
            opacity: 0.9,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>Created by</span>
            <a
              href="https://github.com/SachinYadav2446"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#FFF6EB',
                fontWeight: 800,
                textDecoration: 'none',
                borderBottom: '1px dotted rgba(232, 210, 181, 0.5)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E8D2B5';
                e.currentTarget.style.borderBottomColor = '#E8D2B5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFF6EB';
                e.currentTarget.style.borderBottomColor = 'rgba(232, 210, 181, 0.5)';
              }}
            >
              Sachin Yadav
            </a>
          </div>

          <span style={{
            color: 'rgba(232, 210, 181, 0.3)',
            fontSize: '0.85rem'
          }}>•</span>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/SachinYadav2446/Pitch-Lab"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              color: 'var(--cream-beige)',
              fontSize: '0.76rem',
              fontWeight: 700,
              opacity: 0.85,
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            title="View Pitch-Lab repository on GitHub"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: 'block' }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>

          <span style={{
            color: 'rgba(232, 210, 181, 0.3)',
            fontSize: '0.85rem'
          }}>•</span>

          {/* Email Contact Link */}
          <a
            href="mailto:yadavsachin2446@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              textDecoration: 'none',
              color: 'var(--cream-beige)',
              fontSize: '0.76rem',
              fontWeight: 700,
              opacity: 0.85,
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            title="Send email to Sachin Yadav"
          >
            <Mail size={13} color="var(--cream-beige)" />
            <span>Contact</span>
          </a>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(232, 210, 181, 0.12)',
              border: '1px solid rgba(232, 210, 181, 0.28)',
              color: 'var(--cream-beige)',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              transition: 'all 0.15s ease',
              marginLeft: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.25)';
              e.currentTarget.style.color = '#FFF6EB';
              e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(232, 210, 181, 0.12)';
              e.currentTarget.style.color = 'var(--cream-beige)';
              e.currentTarget.style.borderColor = 'rgba(232, 210, 181, 0.28)';
            }}
            title="Scroll to top of page"
          >
            <span>Top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
