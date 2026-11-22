import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

/**
 * FloatingChatbotButton:
 * Floating AI chatbot button positioned on the right side.
 * Adheres strictly to the PitchVision brand palette:
 * Deep Burgundy (#590907) base with Warm Cream Beige (#E8D2B5) accents and glow.
 */
export default function FloatingChatbotButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '36px',
        right: '36px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {/* Optional Hover Tooltip Label */}
      <div
        style={{
          background: 'rgba(61, 6, 5, 0.92)',
          color: 'var(--cream-beige)',
          border: '1px solid rgba(232, 210, 181, 0.35)',
          borderRadius: '16px',
          padding: '7px 14px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '0.80rem',
          fontWeight: 700,
          letterSpacing: '0.3px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        PitchVision Tactical AI
      </div>

      {/* Floating Action Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => alert("PitchVision AI Copilot interface will open here!")}
        aria-label="Open AI Chatbot"
        style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #590907 0%, #3D0504 100%)',
          border: '1.5px solid rgba(232, 210, 181, 0.4)',
          boxShadow: isHovered
            ? '0 12px 32px rgba(89, 9, 7, 0.55), 0 0 20px rgba(232, 210, 181, 0.3)'
            : '0 8px 25px rgba(89, 9, 7, 0.4), 0 0 12px rgba(89, 9, 7, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: isHovered ? 'translateY(-3px) scale(1.06)' : 'translateY(0) scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Pulsing AI Live Status Indicator Dot */}
        <span
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#4ADE80',
            border: '2px solid #590907',
            boxShadow: '0 0 6px #4ADE80'
          }}
        />

        {/* Bot Icon */}
        <Bot size={24} color="var(--cream-beige)" strokeWidth={2.2} />
      </button>
    </div>
  );
}
