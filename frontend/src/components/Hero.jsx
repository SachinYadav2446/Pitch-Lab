import React from 'react';

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
        {/* Left Side Space (Reserved for Part 1 & Part 2) */}
        <div style={{
          flex: 1,
          zIndex: 10,
          padding: '90px 48px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Content reserved for remaining sections */}
        </div>

        {/* Leaned Deep Burgundy Vertical Section
            - Shifted left to marginRight: 260px so it does NOT overlap with the button
            - Width: 440px
            - Extends from Top of Screen (including Navbar) to Bottom
        */}
        <div style={{
          position: 'relative',
          width: '440px',
          minWidth: '380px',
          height: '100%',
          marginRight: '260px', // Shifted to left: completely clears the Tactical Console button
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
            padding: '90px 32px 48px',
            color: 'var(--cream-beige)'
          }}>
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
