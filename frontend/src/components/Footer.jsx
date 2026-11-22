import React from 'react';
import { ArrowUp, Terminal, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      width: '100%',
      backgroundColor: '#2A0303',
      borderTop: '2px solid rgba(232, 210, 181, 0.25)',
      color: 'var(--cream-beige)',
      padding: '70px 32px 48px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '36px'
        }}>
          {/* Brand Column */}
          <div style={{ maxWidth: '420px' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#FFF6EB',
              letterSpacing: '-0.04em',
              marginBottom: '12px'
            }}>
              pitchvision<span style={{ opacity: 0.6 }}>.ai</span>
            </h3>
            <p style={{
              fontSize: '0.94rem',
              lineHeight: 1.6,
              color: 'var(--cream-beige)',
              opacity: 0.85,
              marginBottom: '20px'
            }}>
              Autonomous spatial intelligence and deep learning vision for elite football.
              Transforms standard broadcast television feeds into calibrated 2D pitch coordinates, multi-object trajectories, and real-time physical performance telemetry in &lt;16 ms.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              background: 'rgba(0,0,0,0.4)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(232, 210, 181, 0.2)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }} />
              <span>CORE VISION PIPELINE ACTIVE // 64.9 FPS</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.90rem',
              fontWeight: 800,
              color: '#FFF6EB',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              SPATIAL ML CAPABILITIES
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '01. Planar Homography Engine', href: '#homography' },
                { label: '02. Dynamic Space Control (Voronoi)', href: '#space-control' },
                { label: '03. YOLOv8 + ByteTrack Tracker', href: '#tracking-engine' },
                { label: '04. K-Means Jersey Pigment Clustering', href: '#clustering-engine' },
                { label: '05. Kinematic Sprint Telemetry', href: '#kinematics-engine' },
                { label: '06. Production Architecture Pipeline', href: '#pipeline' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(item.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      color: 'var(--cream-beige)',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      opacity: 0.8,
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '1')}
                    onMouseLeave={(e) => (e.target.style.opacity = '0.8')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Deep Learning Tech Stack Column */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.90rem',
              fontWeight: 800,
              color: '#FFF6EB',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              DEEP LEARNING FOUNDATION
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'PyTorch 2.4',
                'YOLOv8x / CSPDarknet',
                'ByteTrack',
                'Kalman 8D State Filter',
                'Planar Homography (RANSAC)',
                'K-Means++ (HSV)',
                'Savitzky-Golay',
                'TensorRT FP16'
              ].map((pill, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(232, 210, 181, 0.12)',
                    border: '1px solid rgba(232, 210, 181, 0.25)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.74rem',
                    fontFamily: 'monospace',
                    color: 'var(--cream-beige)'
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Scroll-to-Top */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          borderTop: '1px solid rgba(232, 210, 181, 0.15)',
          paddingTop: '24px',
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          opacity: 0.75
        }}>
          <div>
            &copy; {new Date().getFullYear()} pitchvision.ai — Autonomous Spatial Vision for Elite Football.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(232, 210, 181, 0.12)',
              border: '1px solid rgba(232, 210, 181, 0.3)',
              color: 'var(--cream-beige)',
              borderRadius: '12px',
              padding: '6px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.74rem'
            }}
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
