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
      description: "Team Alpha triggers an aggressive 3-player pressing trap on the touchline, cutting off the passing lane and forcing a turnover.",
      badge: "Turnover Created",
      accent: "#245235"
    },
    {
      id: "moment-2",
      phase: "PHASE 02 · 00:38",
      title: "Lightning Breakaway Transition",
      type: "Sprint Acceleration",
      stat: "Peak Sprint: 34.8 km/h",
      metricName: "Transition Velocity",
      metricVal: "8.2 m/s",
      description: "Instant vertical progression. Player #7 accelerates into open space with a 45-meter sprint, outpacing the defensive recovery.",
      badge: "High-Intensity Sprint",
      accent: "#D64933"
    },
    {
      id: "moment-3",
      phase: "PHASE 03 · 01:12",
      title: "Tactical Half-Space Overload",
      type: "Spatial Dominance",
      stat: "Space Controlled: 64.2%",
      metricName: "Pass Triangle Width",
      metricVal: "18.4m",
      description: "Midfield overload creating a numerical superiority (+1) in the half-space to penetrate the opponent's low defensive block.",
      badge: "Numerical Superiority",
      accent: "#3B7A50"
    },
    {
      id: "moment-4",
      phase: "PHASE 04 · 01:45",
      title: "Compact Low-Block Shield",
      type: "Team Compactness",
      stat: "Team Length: 24.1m",
      metricName: "Line Separation",
      metricVal: "9.2m",
      description: "Defending deep inside the final third. Synchronized movement between midfield and defensive lines denies pocket passes.",
      badge: "Low-Block Structure",
      accent: "#A65A42"
    }
  ];

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '80px auto',
      padding: '0 24px'
    }}>
      {/* Section Header with Left/Right Horizontal Scroll Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span className="badge-green">Horizontal Match Reel</span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', marginTop: '8px', marginBottom: '8px' }}>
            Tactical Match Phases & Spatial Telemetry
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-brown)', margin: 0 }}>
            Slide horizontally across key match phases to inspect spatial dynamics and telemetry shifts.
          </p>
        </div>

        {/* Scroll Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleScroll('left')}
            className="btn-secondary"
            style={{ width: '42px', height: '42px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Previous Tactical Phase"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="btn-primary"
            style={{ width: '42px', height: '42px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Next Tactical Phase"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Sliding Card Reel Container */}
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
              whileHover={{ y: -4 }}
              style={{
                flex: '0 0 380px',
                scrollSnapAlign: 'start',
                background: isSelected ? '#FFFFFF' : 'var(--bg-card-subtle)',
                border: isSelected ? `2px solid ${m.accent}` : '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '28px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 12px 30px rgba(40, 30, 20, 0.08)' : '0 2px 8px rgba(40, 30, 20, 0.02)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: m.accent, letterSpacing: '1px' }}>
                    {m.phase}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'var(--forest-light)',
                    color: 'var(--forest-green)'
                  }}>
                    {m.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-espresso)', marginBottom: '8px' }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-brown)', marginBottom: '20px' }}>
                  {m.description}
                </p>
              </div>

              {/* Metric Highlight Footer */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {m.metricName}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.accent, fontFamily: 'Space Grotesk' }}>
                    {m.metricVal}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--forest-green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Inspect Telemetry <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
