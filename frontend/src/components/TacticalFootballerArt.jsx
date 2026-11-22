import React from 'react';
import footballerArt from '../assets/footballer_art_cream.png';

/**
 * TacticalFootballerArt:
 * Displays the user's bespoke footballer artwork in Warm Cream Beige (#E8D2B5),
 * perfectly fitted and confined strictly within the Deep Burgundy (#590907) vertical slab.
 */
export default function TacticalFootballerArt() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '350px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    }}>
      <img
        src={footballerArt}
        alt="PitchVision Footballer Art"
        style={{
          width: '100%',
          maxHeight: '74vh',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 10px 28px rgba(0, 0, 0, 0.45))'
        }}
      />
    </div>
  );
}
