import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Zap, 
  Layers, 
  Activity, 
  ChevronRight, 
  Target, 
  Gauge, 
  Eye, 
  RotateCcw,
  Sparkles,
  Compass
} from 'lucide-react';

export default function Hero({ onLaunchStudio }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeMode, setActiveMode] = useState('striker'); // 'striker' | 'tactical'
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setIsPlaying(true);
  };

  const currentVideoSrc = activeMode === 'striker' 
    ? '/kicking_hero.mp4' 
    : '/sample_match.mp4';

  return (
    <section style={{
      position: 'relative',
      padding: '36px 24px 80px',
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 1. Category Pill */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '20px' }}
      >
        <div className="badge-cream" style={{ padding: '7px 20px', fontSize: '0.78rem' }}>
          <Activity size={14} color="#FFF0DC" />
          <span>COMPUTER VISION & TACTICAL INTELLIGENCE</span>
        </div>
      </motion.div>

      {/* 2. Editorial Headline: Explore. Improve. Win. */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ textAlign: 'center', maxWidth: '980px', marginBottom: '20px' }}
      >
        <h1 style={{
          fontSize: 'clamp(2.6rem, 5.8vw, 4.6rem)',
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: '-0.035em',
          color: 'var(--cream-primary)',
          marginBottom: '16px',
          textShadow: '0 4px 24px rgba(0, 0, 0, 0.45)'
        }}>
          Explore. Improve. Win.
        </h1>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
          fontWeight: 600,
          color: 'var(--cream-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          opacity: 0.95
        }}>
          Turn Raw Match Footage Into Real-Time Ball Physics & 2D Tactical Intelligence.
        </p>
      </motion.div>

      {/* 3. Subtitle Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ textAlign: 'center', maxWidth: '780px', marginBottom: '36px' }}
      >
        <p style={{
          fontSize: '1.08rem',
          lineHeight: 1.68,
          color: 'var(--text-secondary)',
          fontWeight: 450
        }}>
          Engineered for elite clubs, set-piece coaches, and performance analysts.
          Our optical vision engine extracts sub-pixel strike velocity, 3D ball spin vectors, 
          and 22-player planar homography directly from standard broadcast video.
        </p>
      </motion.div>

      {/* 4. Action Buttons */}
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
          marginBottom: '48px'
        }}
      >
        <button
          onClick={onLaunchStudio}
          className="btn-cream-primary"
          style={{ padding: '15px 34px', fontSize: '1rem' }}
        >
          <span>Explore Vision Studio</span>
          <ChevronRight size={18} />
        </button>

        <a
          href="#architecture"
          className="btn-burgundy-glass"
          style={{ padding: '15px 30px', fontSize: '1rem' }}
        >
          <Layers size={18} />
          <span>View Pipeline Architecture</span>
        </a>
      </motion.div>

      {/* 5. Centerpiece: High-Production Match Video Console with Computer Vision Overlays */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '1180px',
          borderRadius: '24px',
          background: 'var(--bg-burgundy-card)',
          border: '1.5px solid var(--cream-border-strong)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 240, 220, 0.06)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Video Console Header Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '14px 24px',
          background: 'rgba(40, 4, 7, 0.92)',
          borderBottom: '1px solid var(--cream-border)',
          gap: '12px'
        }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleModeChange('striker')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'striker' ? 'var(--cream-primary)' : 'rgba(255, 240, 220, 0.08)',
                color: activeMode === 'striker' ? '#340407' : 'var(--cream-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Target size={14} />
              <span>Striker Ball Physics</span>
            </button>

            <button
              onClick={() => handleModeChange('tactical')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'tactical' ? 'var(--cream-primary)' : 'rgba(255, 240, 220, 0.08)',
                color: activeMode === 'tactical' ? '#340407' : 'var(--cream-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={14} />
              <span>22-Player Broadcast Tracking</span>
            </button>
          </div>

          {/* Interactive Visual Overlay Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowTrajectory(!showTrajectory)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-border)',
                background: showTrajectory ? 'rgba(255, 240, 220, 0.2)' : 'transparent',
                color: 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={13} />
              <span>AI Trajectory</span>
            </button>

            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--cream-border)',
                background: showTelemetry ? 'rgba(255, 240, 220, 0.2)' : 'transparent',
                color: 'var(--cream-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Gauge size={13} />
              <span>HUD Telemetry</span>
            </button>

            <button
              onClick={togglePlay}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'var(--cream-primary)',
                color: '#340407',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '560px',
          background: '#120103',
          overflow: 'hidden'
        }}>
          {/* Real Video Element */}
          <video
            ref={videoRef}
            key={currentVideoSrc}
            src={currentVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Cinematic Crimson Vignette Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 50%, rgba(52, 4, 7, 0.1) 0%, rgba(20, 2, 3, 0.55) 100%)',
            mixBlendMode: 'multiply'
          }} />

          {/* AI Computer Vision Trajectory Graphic (When enabled & in striker mode) */}
          {showTrajectory && activeMode === 'striker' && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
              viewBox="0 0 1180 560"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="strikeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF0DC" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#E03542" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF707A" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Trajectory Parabolic Curve */}
              <path
                d="M 380 440 Q 560 210, 840 280 T 1060 260"
                fill="none"
                stroke="url(#strikeGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                filter="url(#glow)"
              />

              {/* Contact Point Reticle */}
              <circle cx="380" cy="440" r="14" fill="rgba(255, 240, 220, 0.2)" stroke="#FFF0DC" strokeWidth="2" />
              <circle cx="380" cy="440" r="4" fill="#FFF0DC" />
              <text x="360" y="475" fill="#FFF0DC" fontSize="11" fontFamily="Space Grotesk" fontWeight="700">
                IMPACT POINT
              </text>

              {/* Apex Trajectory Point */}
              <circle cx="700" cy="245" r="7" fill="none" stroke="#E03542" strokeWidth="2" filter="url(#glow)" />
              <circle cx="700" cy="245" r="3" fill="#FFF0DC" />
              <text x="715" y="240" fill="#FFF0DC" fontSize="11" fontFamily="Space Grotesk" fontWeight="700">
                APEX: 4.8m • 108 km/h
              </text>

              {/* Goal Corner Target Lock */}
              <rect x="1030" y="230" width="60" height="60" fill="none" stroke="#FFF0DC" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="1060" cy="260" r="4" fill="#E03542" />
              <text x="1000" y="310" fill="#FFF0DC" fontSize="11" fontFamily="Space Grotesk" fontWeight="700">
                TARGET xGOT: 0.84
              </text>
            </svg>
          )}

          {/* AI Computer Vision Bounding Boxes (When in Tactical Broadcast mode) */}
          {showTrajectory && activeMode === 'tactical' && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
              viewBox="0 0 1180 560"
              preserveAspectRatio="none"
            >
              {/* Sample Bounding Boxes Tracking Players */}
              <rect x="320" y="240" width="46" height="88" fill="none" stroke="#FFF0DC" strokeWidth="1.8" />
              <rect x="320" y="222" width="68" height="18" fill="#FFF0DC" />
              <text x="325" y="235" fill="#340407" fontSize="10" fontFamily="Space Grotesk" fontWeight="800">#7 29.4 km/h</text>

              <rect x="580" y="280" width="48" height="92" fill="none" stroke="#E03542" strokeWidth="1.8" />
              <rect x="580" y="262" width="68" height="18" fill="#E03542" />
              <text x="585" y="275" fill="#FFF0DC" fontSize="10" fontFamily="Space Grotesk" fontWeight="800">#4 24.1 km/h</text>

              <rect x="740" y="220" width="44" height="84" fill="none" stroke="#FFF0DC" strokeWidth="1.8" />
              <rect x="740" y="202" width="68" height="18" fill="#FFF0DC" />
              <text x="745" y="215" fill="#340407" fontSize="10" fontFamily="Space Grotesk" fontWeight="800">#9 33.8 km/h</text>
            </svg>
          )}

          {/* HUD Telemetry Chips (When enabled) */}
          {showTelemetry && (
            <>
              {/* Top-Left Chip: Strike / Model Status */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(34, 2, 4, 0.88)',
                border: '1px solid var(--cream-border-strong)',
                backdropFilter: 'blur(10px)',
                color: '#FFF0DC',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.8px', color: 'var(--cream-secondary)', textTransform: 'uppercase' }}>
                  {activeMode === 'striker' ? 'STRIKE BALL TELEMETRY' : 'YOLOV8 DEEP TRACKER'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 800, color: '#FFF0DC' }}>
                    {activeMode === 'striker' ? '114.8 km/h' : '22 PLAYERS'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--cream-muted)' }}>
                    {activeMode === 'striker' ? 'Peak Speed' : '60.4 FPS Active'}
                  </span>
                </div>
              </div>

              {/* Top-Right Chip: Biomechanics / GPU Latency */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(34, 2, 4, 0.88)',
                border: '1px solid var(--cream-border-strong)',
                backdropFilter: 'blur(10px)',
                color: '#FFF0DC',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 240, 220, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--cream-border)'
                }}>
                  <Gauge size={18} color="#FFF0DC" />
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--cream-secondary)', textTransform: 'uppercase' }}>
                    {activeMode === 'striker' ? 'SPIN & DIP DYNAMICS' : 'INFERENCE LATENCY'}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 800, color: '#FFF0DC' }}>
                    {activeMode === 'striker' ? '540 RPM' : '16.2 ms'}
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cream-muted)', marginLeft: '6px' }}>
                      {activeMode === 'striker' ? '(-14.2° Vector)' : '(RTX 4050)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom-Left Chip: Impact Accuracy */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(34, 2, 4, 0.88)',
                border: '1px solid var(--cream-border-strong)',
                backdropFilter: 'blur(8px)',
                color: '#FFF0DC',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFF0DC', boxShadow: '0 0 6px #FFF0DC' }} />
                <span>
                  {activeMode === 'striker' ? (
                    <>Goal Target xGOT: <strong>0.84 Expected Goal</strong></>
                  ) : (
                    <>Planar Homography: <strong>Validated (&lt;0.8% error)</strong></>
                  )}
                </span>
              </div>

              {/* Bottom-Right Chip: Video Stamp */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(34, 2, 4, 0.88)',
                border: '1px solid var(--cream-border-strong)',
                backdropFilter: 'blur(8px)',
                color: '#FFF0DC',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Eye size={14} color="#FFF0DC" />
                <span>
                  {activeMode === 'striker' ? 'Floodlight Night Pitch 4K Feed' : 'Broadcast Camera 1080p'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Feature Summary Bar beneath Video */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: 'var(--cream-border)',
          borderTop: '1px solid var(--cream-border)'
        }}>
          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              01 • Optical Tracking
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              Sub-Pixel Trajectory Detect
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Extracts high-speed ball flight curves and player sprint metrics at 60 FPS.
            </div>
          </div>

          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              02 • Perspective Warping
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              Homography Projection
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Projects broadcast video pixels into FIFA-standard 105m × 68m coordinates.
            </div>
          </div>

          <div style={{ padding: '18px 24px', background: 'var(--bg-burgundy-surface)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cream-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              03 • Ball & Strike Telemetry
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              Velocity, Spin & xGOT
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Instant set-piece physics feedback for strikers, goalkeepers, and analysts.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
