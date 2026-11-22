import React from 'react';
import footballerArt from '../assets/footballer_art_cream.png';

/**
 * TacticalFootballerArt:
 * Displays the user's bespoke footballer artwork in Warm Cream Beige (#E8D2B5),
 * cleanly extracted and integrated directly on top of the Deep Burgundy (#590907) vertical slab.
 * Enhanced with subtle computer vision tracking brackets and telemetry tags.
 */
export default function TacticalFootballerArt() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '430px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    }}>
      {/* Artwork Frame with CV HUD Accents */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* The Clean Warm Cream Beige Footballer Artwork */}
        <img
          src={footballerArt}
          alt="PitchVision Footballer Art"
          style={{
            width: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 14px 30px rgba(0, 0, 0, 0.4))'
          }}
        />

        {/* Tactical Corner Brackets */}
        <div style={{
          position: 'absolute',
          top: '3%',
          left: '3%',
          width: '20px',
          height: '20px',
          borderTop: '2px solid var(--cream-beige)',
          borderLeft: '2px solid var(--cream-beige)',
          opacity: 0.7
        }} />

        <div style={{
          position: 'absolute',
          top: '3%',
          right: '3%',
          width: '20px',
          height: '20px',
          borderTop: '2px solid var(--cream-beige)',
          borderRight: '2px solid var(--cream-beige)',
          opacity: 0.7
        }} />

        <div style={{
          position: 'absolute',
          bottom: '3%',
          left: '3%',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid var(--cream-beige)',
          borderLeft: '2px solid var(--cream-beige)',
          opacity: 0.7
        }} />

        <div style={{
          position: 'absolute',
          bottom: '3%',
          right: '3%',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid var(--cream-beige)',
          borderRight: '2px solid var(--cream-beige)',
          opacity: 0.7
        }} />

        {/* Top Tracking Badge */}
        <div style={{
          position: 'absolute',
          top: '1%',
          left: '8%',
          background: 'rgba(61, 6, 5, 0.88)',
          border: '1px solid rgba(232, 210, 181, 0.45)',
          borderRadius: '4px',
          padding: '3px 9px',
          fontFamily: 'monospace',
          fontSize: '0.68rem',
          color: 'var(--cream-beige)',
          letterSpacing: '0.4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#FFF6EB',
            boxShadow: '0 0 6px #FFF6EB'
          }} />
          <span>STRIKER #10 • 99.4% CONF</span>
        </div>

        {/* Bottom Telemetry Badge */}
        <div style={{
          position: 'absolute',
          bottom: '1%',
          right: '6%',
          background: 'rgba(61, 6, 5, 0.88)',
          border: '1px solid rgba(232, 210, 181, 0.45)',
          borderRadius: '4px',
          padding: '3px 9px',
          fontFamily: 'monospace',
          fontSize: '0.68rem',
          color: 'var(--cream-beige)',
          letterSpacing: '0.4px'
        }}>
          STRIKE VEL: 104.2 KM/H • xG: 0.44
        </div>
      </div>
    </div>
  );
}
