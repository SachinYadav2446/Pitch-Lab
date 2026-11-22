import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Play, Pause, Compass, Activity, Shield } from 'lucide-react';

export default function Hero({ onLaunchStudio }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section style={{
      position: 'relative',
      maxWidth: '1420px',
      margin: '0 auto',
      padding: '36px 32px 60px',
      width: '100%'
    }}>
      {/* SVG Clip Path Definition (Normalized Object Bounding Box) */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id="vortex-hero-cutout" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.46 0.06
              A 0.04 0.06 0 0 1 0.50 0.00
              L 0.96 0.00
              A 0.04 0.06 0 0 1 1.00 0.06
              L 1.00 0.94
              A 0.04 0.06 0 0 1 0.96 1.00
              L 0.04 1.00
              A 0.04 0.06 0 0 1 0.00 0.94
              L 0.00 0.70
              A 0.04 0.06 0 0 1 0.04 0.64
              L 0.42 0.64
              A 0.04 0.06 0 0 0 0.46 0.58
              L 0.46 0.06
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Main Unified Canvas Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '660px',
        display: 'flex'
      }}>

        {/* ========================================================
            LEFT SECTION: Text Block (Upper-Left Quadrant)
            ======================================================== */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '45%',
          minWidth: '380px',
          paddingRight: '36px',
          paddingTop: '8px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Main Headline (VortexAI Typography) */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 4.2vw, 4.1rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: 'var(--cream-primary)',
            marginBottom: '26px'
          }}>
            Autonomous Sub-Pixel<br />
            <span style={{
              color: '#E03542',
              textDecoration: 'underline',
              textUnderlineOffset: '10px',
              textDecorationThickness: '3.5px'
            }}>
              Player Tracking
            </span> & Deep<br />
            Homography.
          </h1>

          {/* Middle Row: Preview Card + Description */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '32px'
          }}>
            {/* Mini Radar / Preview Thumbnail Box (Matches cyclone box in screenshot) */}
            <div style={{
              width: '82px',
              height: '82px',
              minWidth: '82px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(224, 53, 66, 0.25) 0%, rgba(15, 2, 4, 0.9) 100%)',
              border: '1px solid rgba(224, 53, 66, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Pitch Radar rings */}
              <div style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px dashed rgba(255, 240, 220, 0.3)',
                animation: 'spin 20s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1.5px solid rgba(224, 53, 66, 0.7)'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#E03542',
                boxShadow: '0 0 8px #E03542'
              }} />
              <span style={{
                position: 'absolute',
                bottom: '4px',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: 'var(--cream-primary)',
                letterSpacing: '0.4px'
              }}>
                60 FPS Fix
              </span>
            </div>

            {/* Description Text */}
            <p style={{
              fontSize: '0.94rem',
              lineHeight: 1.6,
              color: 'var(--cream-secondary)',
              fontWeight: 450
            }}>
              Unified multi-camera deep learning pipeline for professional football: continuous sub-pixel player tracking coupled with physical velocity regression in &lt;16 ms.
            </p>
          </div>

          {/* Action Button Row (Matches GIS Mission Control & Interactive Demo in screenshot) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={togglePlay}
              className="btn-vortex-secondary"
            >
              <Zap size={15} color="#E03542" />
              <span>Interactive Demo</span>
            </button>

            <button
              onClick={onLaunchStudio}
              className="btn-vortex-primary"
            >
              <span>Tactical Console</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT & BOTTOM: Custom Notched Video Cutout
            ======================================================== */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          {/* Glowing Stroke Contour Line matching the exact silhouette */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 7,
              pointerEvents: 'none'
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 46 6
                A 4 6 0 0 1 50 0
                L 96 0
                A 4 6 0 0 1 100 6
                L 100 94
                A 4 6 0 0 1 96 100
                L 4 100
                A 4 6 0 0 1 0 94
                L 0 70
                A 4 6 0 0 1 4 64
                L 42 64
                A 4 6 0 0 0 46 58
                L 46 6
                Z
              "
              fill="none"
              stroke="rgba(224, 53, 66, 0.75)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 6px rgba(224, 53, 66, 0.4))' }}
            />
          </svg>

          {/* The Video Element clipped to the Custom Notch Shape */}
          <div style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'url(#vortex-hero-cutout)',
            WebkitClipPath: 'url(#vortex-hero-cutout)',
            background: '#150204',
            overflow: 'hidden'
          }}>
            <video
              ref={videoRef}
              src="/kicking_hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Subtle cinematic gradient so overlays pop */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 75% 40%, transparent 30%, rgba(15, 2, 4, 0.55) 100%)',
              mixBlendMode: 'multiply'
            }} />
          </div>

          {/* ========================================================
              HUD OVERLAYS (Positioned precisely over the video silhouette)
              ======================================================== */}
          
          {/* 1. Top-Right Satellite / Broadcast Chip (Matches INSAT-3D pill in screenshot) */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            zIndex: 8,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: '20px',
            background: 'rgba(15, 2, 4, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(224, 53, 66, 0.4)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--cream-primary)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#E03542',
              boxShadow: '0 0 8px #E03542'
            }} />
            <span>OPTICAL TRACKER 74° ORBIT • 4K BROADCAST</span>
          </div>

          {/* 2. Bottom-Left Extended Shelf Chips (Under the text block, matches EYE FIX chips) */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '28px',
            zIndex: 8,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'rgba(15, 2, 4, 0.85)',
              border: '1px solid rgba(255, 240, 220, 0.15)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--cream-secondary)'
            }}>
              <span style={{ color: 'var(--cream-muted)' }}>TRACK FIX:</span>
              <span style={{ color: '#E03542', fontWeight: 800 }}>0.8% MAE</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'rgba(15, 2, 4, 0.85)',
              border: '1px solid rgba(255, 240, 220, 0.15)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--cream-secondary)'
            }}>
              <span style={{ color: 'var(--cream-muted)' }}>SPRINT:</span>
              <span style={{ color: '#E03542', fontWeight: 800 }}>34.2 km/h</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: 'rgba(15, 2, 4, 0.85)',
              border: '1px solid rgba(255, 240, 220, 0.15)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--cream-secondary)'
            }}>
              <span style={{ color: 'var(--cream-muted)' }}>GPU:</span>
              <span style={{ color: '#E03542', fontWeight: 800 }}>&lt; 16 ms</span>
            </div>
          </div>

          {/* 3. Bottom-Right Telemetry Card (Matches the cylinder card in screenshot) */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '28px',
            zIndex: 8,
            padding: '14px 20px',
            borderRadius: '16px',
            background: 'rgba(15, 2, 4, 0.82)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(224, 53, 66, 0.45)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Wireframe Cylinder / Tactical Marker Icon */}
            <div style={{
              width: '36px',
              height: '42px',
              border: '1.5px dashed #E03542',
              borderRadius: '18px / 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(224, 53, 66, 0.4)'
            }}>
              <div style={{ width: '100%', height: '1px', background: '#E03542', margin: '4px 0' }} />
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#E03542',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E03542' }} />
                <span>BOB-SYS-01 • MATCH BROADCAST</span>
              </div>

              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--cream-primary)',
                marginTop: '3px'
              }}>
                114.8 km/h <span style={{ opacity: 0.4, margin: '0 4px' }}>|</span> 540 RPM
              </div>

              <div style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--cream-muted)',
                marginTop: '2px'
              }}>
                Fix: 105m × 68m FIFA Standard Pitch
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
