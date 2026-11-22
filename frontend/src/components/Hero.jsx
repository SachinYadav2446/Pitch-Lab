import React from 'react';

export default function Hero({ onLaunchStudio }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '32px 48px 60px',
      minHeight: 'calc(100vh - 65px)',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      {/* 3-Part Layout Container */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px'
      }}>
        {/* Left Side Space (Reserved for the other two parts) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Space reserved for remaining sections */}
        </div>

        {/* Vertical Section: Leaning to the right side with generous width */}
        <div style={{
          width: '500px',
          minWidth: '440px',
          height: '620px',
          borderRadius: '26px',
          background: 'var(--cream-beige)',
          border: '1.5px solid rgba(89, 9, 7, 0.22)',
          boxShadow: '0 16px 45px rgba(89, 9, 7, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Clean Top Bar of the Vertical Box */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(89, 9, 7, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(232, 210, 181, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--burgundy-deep)'
              }} />
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.80rem',
                fontWeight: 800,
                color: 'var(--burgundy-deep)',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                Vertical Section
              </span>
            </div>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--burgundy-deep)',
              opacity: 0.6
            }}>
              500px × 620px
            </span>
          </div>

          {/* Internal Canvas Area */}
          <div style={{
            flex: 1,
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Ready for content */}
          </div>
        </div>
      </div>
    </section>
  );
}
