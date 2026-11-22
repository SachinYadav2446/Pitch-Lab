import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronRight, Layers, Activity, Gauge, Target, Zap } from 'lucide-react';

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
      width: '100%',
      minHeight: 'calc(100vh - 76px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '40px 24px 60px'
    }}>
      {/* 1. Full-Bleed Borderless Background Video directly under Navbar */}
      <video
        ref={videoRef}
        src="/kicking_hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          border: 'none',
          outline: 'none'
        }}
      />

      {/* 2. Seamless Cinematic Deep Crimson Gradient Overlay (No hard edges, blends into background) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: `
          radial-gradient(circle at 50% 45%, rgba(52, 4, 7, 0.45) 0%, rgba(30, 2, 4, 0.82) 80%),
          linear-gradient(180deg, rgba(52, 4, 7, 0.65) 0%, rgba(52, 4, 7, 0.4) 40%, rgba(52, 4, 7, 0.88) 85%, var(--bg-burgundy-root) 100%)
        `,
        pointerEvents: 'none'
      }} />

      {/* 3. Floating Hero Content Layer */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '1040px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Category Pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '22px' }}
        >
          <div className="badge-cream" style={{
            padding: '7px 22px',
            fontSize: '0.8rem',
            background: 'rgba(52, 4, 7, 0.65)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <Activity size={14} color="#FFF0DC" />
            <span>COMPUTER VISION & TACTICAL INTELLIGENCE</span>
          </div>
        </motion.div>

        {/* Editorial Headline: Explore. Improve. Win. */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '20px' }}
        >
          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.4rem)',
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            color: 'var(--cream-primary)',
            marginBottom: '16px',
            textShadow: '0 4px 35px rgba(0, 0, 0, 0.8), 0 0 50px rgba(52, 4, 7, 0.8)'
          }}>
            Explore. Improve. Win.
          </h1>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.25rem, 2.4vw, 1.8rem)',
            fontWeight: 600,
            color: 'var(--cream-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.7)'
          }}>
            Turn Raw Match Footage Into Real-Time Ball Physics & 2D Tactical Intelligence.
          </p>
        </motion.div>

        {/* Subtitle Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: '780px', marginBottom: '40px' }}
        >
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.68,
            color: 'var(--cream-secondary)',
            fontWeight: 450,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)'
          }}>
            Engineered for elite clubs, set-piece coaches, and performance analysts.
            Our optical vision engine extracts sub-pixel strike velocity, 3D ball spin vectors, 
            and 22-player planar homography directly from standard broadcast video.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '54px'
          }}
        >
          <button
            onClick={onLaunchStudio}
            className="btn-cream-primary"
            style={{
              padding: '16px 36px',
              fontSize: '1.02rem',
              border: 'none',
              borderRadius: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 240, 220, 0.3)'
            }}
          >
            <span>Explore Vision Studio</span>
            <ChevronRight size={18} />
          </button>

          <a
            href="#architecture"
            className="btn-burgundy-glass"
            style={{
              padding: '16px 32px',
              fontSize: '1.02rem',
              border: 'none',
              borderRadius: '30px',
              background: 'rgba(52, 4, 7, 0.65)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Layers size={18} />
            <span>View Pipeline Architecture</span>
          </a>
        </motion.div>

        {/* Floating Live Telemetry Chips directly on the Video (Borderless) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            width: '100%'
          }}
        >
          {/* Chip 1: Ball Velocity */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '24px',
            background: 'rgba(52, 4, 7, 0.72)',
            backdropFilter: 'blur(16px)',
            color: '#FFF0DC',
            border: 'none',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)'
          }}>
            <Zap size={16} color="#FFF0DC" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.75 }}>Strike Velocity</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 800 }}>114.8 km/h</div>
            </div>
          </div>

          {/* Chip 2: Spin Rate */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '24px',
            background: 'rgba(52, 4, 7, 0.72)',
            backdropFilter: 'blur(16px)',
            color: '#FFF0DC',
            border: 'none',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)'
          }}>
            <Gauge size={16} color="#FFF0DC" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.75 }}>Ball Spin Vector</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 800 }}>540 RPM (-14.2°)</div>
            </div>
          </div>

          {/* Chip 3: xGOT Target Quality */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '24px',
            background: 'rgba(52, 4, 7, 0.72)',
            backdropFilter: 'blur(16px)',
            color: '#FFF0DC',
            border: 'none',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)'
          }}>
            <Target size={16} color="#FFF0DC" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.75 }}>Goal Target Quality</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 800 }}>0.84 xGOT</div>
            </div>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '24px',
              background: 'rgba(255, 240, 220, 0.15)',
              backdropFilter: 'blur(16px)',
              color: '#FFF0DC',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 240, 220, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 240, 220, 0.15)'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
