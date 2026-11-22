import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import TacticalFootballerArt from './TacticalFootballerArt';

export default function Hero({ onLaunchStudio }) {
  const brandTarget = 'pitchvision.ai';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (!isDeleting) {
      if (displayText.length < brandTarget.length) {
        // Typing letter by letter
        timer = setTimeout(() => {
          setDisplayText(brandTarget.slice(0, displayText.length + 1));
        }, 120);
      } else {
        // Pause at full word before backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayText.length > 0) {
        // Deleting letter by letter
        timer = setTimeout(() => {
          setDisplayText(brandTarget.slice(0, displayText.length - 1));
        }, 60);
      } else {
        // Pause when empty before typing loop repeats
        timer = setTimeout(() => {
          setIsDeleting(false);
        }, 450);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  // Formatter to render .ai with subtle differentiation when reached
  const renderTypedBrand = () => {
    if (displayText.includes('.')) {
      const dotIndex = displayText.indexOf('.');
      const main = displayText.slice(0, dotIndex);
      const ext = displayText.slice(dotIndex);
      return (
        <>
          {main}
          <span style={{ opacity: 0.6 }}>{ext}</span>
        </>
      );
    }
    return displayText;
  };

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
            Brand Name (Typewriter loop) + Single Subheading + Button
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
          {/* 1. Main Project / Brand Name with Typewriter Loop */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(3.2rem, 5.6vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: 'var(--burgundy-deep)',
            marginBottom: '18px',
            minHeight: '1.15em',
            display: 'inline-flex',
            alignItems: 'baseline'
          }}>
            <span>{renderTypedBrand()}</span>
            <span className="typewriter-cursor" aria-hidden="true" />
          </h1>

          {/* 2. Single Subheading Below Name */}
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.15rem, 1.9vw, 1.45rem)',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
            color: 'var(--burgundy-deep)',
            maxWidth: '520px',
            marginBottom: '34px'
          }}>
            Autonomous Spatial Intelligence for Elite Football.
          </p>

          {/* 3. Action Button */}
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
            borderRight: '1px solid rgba(232, 210, 181, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Subtle high-tech diagonal accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '20px',
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, rgba(232, 210, 181, 0.15), transparent)',
              zIndex: 1
            }} />

            {/* Content counter-skewed and expanded to cover the entire vertical section with zero gaps */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '-20%',
              right: '-20%',
              width: '140%',
              height: '100%',
              transform: 'skewX(11deg)',
              transformOrigin: 'center center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <TacticalFootballerArt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
