import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onLaunchStudio }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      height: '100vh',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-sage)',
      boxSizing: 'border-box'
    }}>
      {/* 3-Part Grid Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        {/* ========================================================
            LEFT SIDE CONTENT AREA (To the left of the vertical section)
            Brand Name + Subheading + Description + Button
            ======================================================== */}
        <div style={{
          flex: 1,
          zIndex: 10,
          padding: '90px 48px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '640px'
        }}>
          {/* 1. Main Project / Brand Name */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(3.2rem, 5.6vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            color: 'var(--burgundy-deep)',
            marginBottom: '14px'
          }}>
            pitchvision<span style={{ opacity: 0.6 }}>.ai</span>
          </h1>

          {/* 2. Subheading Below Name */}
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: 'var(--burgundy-deep)',
            marginBottom: '18px'
          }}>
            Autonomous Spatial Intelligence for Elite Football.
          </p>

          {/* 3. Subtitle / Descriptive Paragraph */}
          <p style={{
            fontSize: '1.02rem',
            lineHeight: 1.65,
            color: 'var(--text-burgundy-muted)',
            fontWeight: 500,
            maxWidth: '520px',
            marginBottom: '32px'
          }}>
            Transform standard broadcast match footage into continuous sub-pixel player tracking, 
            planar pitch homography, and real-time physical performance telemetry in &lt;16 ms.
          </p>

          {/* 4. Action Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <button
              onClick={onLaunchStudio}
              className="btn-burgundy-primary"
              style={{
                borderRadius: '24px',
                padding: '12px 28px',
                fontSize: '0.90rem'
              }}
            >
              <span>Explore Vision Studio</span>
              <ArrowRight size={14} color="var(--cream-beige)" />
            </button>
          </div>
        </div>

        {/* ========================================================
            LEANED DEEP BURGUNDY VERTICAL SECTION (UNTOUCHED)
            ======================================================== */}
        <div style={{
          position: 'relative',
          width: '440px',
          minWidth: '380px',
          height: '100%',
          marginRight: '190px',
          zIndex: 5
        }}>
          {/* Angled Deep Burgundy Slab (#590907) Slicing from Top to Bottom */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            bottom: '-40px',
            left: 0,
            right: 0,
            background: 'linear-gradient(175deg, #590907 0%, #430504 100%)',
            transform: 'skewX(-11deg)',
            transformOrigin: 'top center',
            boxShadow: '-14px 0 35px rgba(0, 0, 0, 0.22), 0 0 25px rgba(89, 9, 7, 0.2)',
            borderLeft: '1.5px solid rgba(232, 210, 181, 0.3)',
            borderRight: '1px solid rgba(232, 210, 181, 0.15)'
          }}>
            {/* Subtle high-tech diagonal accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '20px',
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, rgba(232, 210, 181, 0.15), transparent)'
            }} />
          </div>

          {/* Interior of Burgundy Slab: Clean and empty */}
          <div style={{
            position: 'relative',
            zIndex: 6,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Clean interior ready for next element */}
          </div>
        </div>
      </div>
    </section>
  );
}
