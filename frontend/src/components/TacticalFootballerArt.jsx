import React from 'react';
import footballerArt from '../assets/footballer_art_cream.png';

/**
 * TacticalFootballerArt:
 * Displays the user's bespoke 9:16 vertical stadium & footballer artwork in Warm Cream Beige (#E8D2B5).
 * Full-bleed cover fitting the entire vertical slab edge-to-edge.
 */
export default function TacticalFootballerArt() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
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
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 45%',
          display: 'block'
        }}
      />
    </div>
  );
}
