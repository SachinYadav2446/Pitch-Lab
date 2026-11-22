import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function Hero() {
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
      height: 'calc(100vh - 76px)',
      minHeight: '600px',
      overflow: 'hidden',
      background: 'var(--bg-burgundy-root)'
    }}>
      {/* Pure Borderless Video Running Directly Under Navbar */}
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
          display: 'block',
          border: 'none',
          outline: 'none'
        }}
      />

      {/* Subtle bottom fade to blend with page base */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to bottom, transparent, var(--bg-burgundy-root))',
        pointerEvents: 'none'
      }} />

      {/* Minimal corner control */}
      <div style={{
        position: 'absolute',
        bottom: '28px',
        right: '36px',
        zIndex: 10
      }}>
        <button
          onClick={togglePlay}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(52, 4, 7, 0.65)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            color: '#FFF0DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </section>
  );
}
