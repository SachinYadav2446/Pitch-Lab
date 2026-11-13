import React from 'react';
import { Shield, Award, CheckCircle2 } from 'lucide-react';

export default function TrustBanner() {
  const clubs = [
    { name: "SL Benfica", league: "Primeira Liga", flag: "🇵🇹" },
    { name: "CR Flamengo", league: "Brasileirão Série A", flag: "🇧🇷" },
    { name: "North Carolina Courage", league: "NWSL USA", flag: "🇺🇸" },
    { name: "Le Havre AC", league: "Ligue 1 France", flag: "🇫🇷" },
    { name: "Premier League Clubs", league: "United Kingdom", flag: "🇬🇧" },
    { name: "Serie A Technical Staff", league: "Italy", flag: "🇮🇹" },
    { name: "UEFA Federations", league: "Europe", flag: "🇪🇺" },
  ];

  const marqueeClubs = [...clubs, ...clubs];

  return (
    <section style={{
      width: '100%',
      padding: '40px 0 24px 0',
      background: 'var(--bg-dark-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--text-muted)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          TRUSTED BY ELITE COACHING & ANALYTICS STAFF ACROSS
        </span>
      </div>

      {/* Fade Edges */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120px',
        height: '100%',
        background: 'linear-gradient(to right, var(--bg-dark-secondary), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '100%',
        background: 'linear-gradient(to left, var(--bg-dark-secondary), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Marquee Track */}
      <div className="ticker-track">
        {marqueeClubs.map((club, idx) => (
          <div key={idx} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            marginRight: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            transition: 'border-color 0.2s ease',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '1.2rem' }}>{club.flag}</span>
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                {club.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {club.league}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
