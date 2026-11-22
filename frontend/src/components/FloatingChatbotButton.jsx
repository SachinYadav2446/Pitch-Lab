import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

/**
 * FloatingChatbotButton:
 * Floating chatbot button positioned on the right side.
 * Adheres strictly to the PitchVision brand palette:
 * Deep Burgundy (#590907) base with Warm Cream Beige (#E8D2B5) accents and glow.
 */
export default function FloatingChatbotButton({ onClick }) {
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
        PitchVision AI Copilot
      </div>

      {/* Floating Action Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        aria-label="Open AI Copilot"
        style={{
          position: 'relative',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #590907 0%, #3D0504 100%)',
          border: '1.5px solid rgba(232, 210, 181, 0.4)',
          boxShadow: isHovered
            ? '0 12px 30px rgba(89, 9, 7, 0.55), 0 0 20px rgba(232, 210, 181, 0.25)'
            : '0 8px 22px rgba(89, 9, 7, 0.38), 0 0 10px rgba(89, 9, 7, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: isHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Sleek Modern Chat Icon */}
        <MessageSquare size={22} color="var(--cream-beige)" strokeWidth={2.2} />
      </button>
    </div>
  );
}
