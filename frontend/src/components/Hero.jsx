import React from 'react';

export default function Hero({ onLaunchStudio }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: 'calc(100vh - 54px)', // Spans top to bottom directly under navbar
      height: 'calc(100vh - 54px)',
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
        {/* Left Side Space (Reserved for the remaining 2 parts) */}
        <div style={{
          flex: 1,
          zIndex: 10,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Space reserved for Part 1 & Part 2 */}
        </div>

        {/* Leaned Deep Burgundy Vertical Section (Spans Top to Bottom, angled) */}
        <div style={{
          position: 'relative',
          width: '520px',
          minWidth: '460px',
          height: '100%',
          marginRight: '60px', // Leaning towards the right side of screen
          zIndex: 5
        }}>
          {/* Angled Deep Burgundy Slab (#590907) */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            bottom: '-20px',
            left: 0,
            right: 0,
            background: 'linear-gradient(175deg, #590907 0%, #430504 100%)',
            transform: 'skewX(-11deg)', // Dynamic slant/lean
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

          {/* Content Container inside the Burgundy section (Un-skewed) */}
          <div style={{
            position: 'relative',
            zIndex: 6,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px 36px',
            color: 'var(--cream-beige)'
          }}>
            {/* Content area ready for Part 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(232, 210, 181, 0.12)',
              border: '1px solid rgba(232, 210, 181, 0.25)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--cream-beige)'
              }} />
              <span>Burgundy Vertical Section</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
