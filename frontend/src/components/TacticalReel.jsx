import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Activity, Zap, Compass, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TacticalReel() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scrollContainerRef = useRef(null);

  const tacticalMoments = [
    {
      id: "moment-1",
      phase: "PHASE 01 · 00:14",
      title: "High Press & Defensive Trap",
      type: "Pressing Telemetry",
      stat: "Pressing Intensity: 4.8 PPDA",
      metricName: "Defensive Line Height",
      metricVal: "48.2m",
      description: "Team triggers an aggressive 3-player pressing trap on the touchline, cutting off the inside passing lane and forcing an immediate turnover.",
      badge: "Turnover Created",
      accent: "var(--pitch-green)"
    },
    {
      id: "moment-2",
      phase: "PHASE 02 · 00:38",
      title: "Lightning Breakaway Transition",
      type: "Sprint Acceleration",
      stat: "Peak Sprint: 34.8 km/h",
      metricName: "Transition Velocity",
      metricVal: "8.4 m/s",
      description: "Instant vertical progression. Player accelerates into space with a 45-meter sprint, completely outrunning the opponent's recovery line.",
      badge: "High-Intensity Sprint",
      accent: "var(--electric-amber)"
    },
    {
      id: "moment-3",
      phase: "PHASE 03 · 01:12",
      title: "Tactical Half-Space Overload",
      type: "Spatial Dominance",
      stat: "Space Controlled: 64.2%",
      metricName: "Pass Triangle Width",
      metricVal: "18.4m",
      description: "Midfield overload creating a numerical superiority (+1) in the left half-space to penetrate the opponent's structured low defensive block.",
      badge: "Numerical Superiority",
      accent: "var(--azure-blue)"
    },
    {
      id: "moment-4",
      phase: "PHASE 04 · 01:45",
      title: "Compact Low-Block Shield",
      type: "Team Compactness",
      stat: "Team Length: 24.1m",
      metricName: "Line Separation",
      metricVal: "9.2m",
      description: "Defending deep inside the final third. Synchronized movement between midfield and defensive lines denies pocket passes between the lines.",
      badge: "Low-Block Structure",
      accent: "#EF4444"
    }
  ];

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      maxWidth: '1360px',
      margin: '90px auto',
      padding: '0 40px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge-amber">Match Phase Telemetry Reel</span>
          <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '8px', letterSpacing: '-1px' }}>
            Tactical Scenarios & Spatial Shifts
          </h2>
          <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', margin: 0 }}>
            Slide horizontally across match phases to inspect team shape, line separation, and kinematic load.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => handleScroll('left')}
            className="btn-secondary"
            style={{ width: '46px', height: '46px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Previous Phase"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="btn-primary"
            style={{ width: '46px', height: '46px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Next Phase"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="horizontal-reel"
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tacticalMoments.map((m, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <motion.div
              key={m.id}
              onClick={() => setSelectedIdx(idx)}
              whileHover={{ y: -6 }}
              style={{
                flex: '0 0 400px',
                scrollSnapAlign: 'start',
                background: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: isSelected ? `2px solid ${m.accent}` : '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '32px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 12px 40px rgba(0, 0, 0, 0.6)' : '0 4px 16px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: m.accent, letterSpacing: '1px' }}>
                    {m.phase}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF'
                  }}>
                    {m.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', marginBottom: '10px', letterSpacing: '-0.3px' }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {m.description}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {m.metricName}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.accent, fontFamily: 'Space Grotesk' }}>
                    {m.metricVal}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: m.accent,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Inspect Telemetry <ArrowRight size={15} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
