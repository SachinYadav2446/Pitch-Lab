import React, { useState } from 'react';
import { Target, Activity, UserCheck, Video, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlatformPillars() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: "opposition",
      icon: Target,
      tabTitle: "OPPOSITION ANALYSIS",
      title: "Comprehensive Tactical Opposition Scouting",
      badge: "800+ Game Phase Metrics",
      description: "Gain a decisive competitive edge with comprehensive tactical insights into your opponent's strengths and vulnerabilities. Discover style of play, detect recurring patterns, and stay ahead by identifying emerging or declining trends across game phases and set pieces.",
      features: [
        "Style of play decomposition & build-up channels",
        "Set-piece spatial heatmaps & man-marking vulnerabilities",
        "Pressing intensity metrics (PPDA, field tilt, high turnovers)",
        "Over 800 collective and individual game phase indicators"
      ],
      stats: { primary: "800+", label: "Tactical KPIs", secondary: "< 12 hrs", label2: "Turnaround Time" }
    },
    {
      id: "monitoring",
      icon: Activity,
      tabTitle: "PLAYER & TEAM MONITORING",
      title: "Performance Tracking & Anomaly Warnings",
      badge: "Physical & Kinematic Load",
      description: "Discover the power of Team Performance Tracking, featuring trend and anomaly detection, personalized warnings, and performance benchmarking. Stay ahead with insights into increasing or decreasing trends, and monitor your competition rankings.",
      features: [
        "Instantaneous sprint velocities (km/h) & high-speed running meters",
        "Automated soft-tissue strain & deceleration load warnings",
        "Fatigue curve modeling across 90 minutes + stoppage time",
        "Normalized performance rankings against league benchmarks"
      ],
      stats: { primary: "105 × 68m", label: "Homography Precision", secondary: "99.4%", label2: "Tracking Accuracy" }
    },
    {
      id: "scouting",
      icon: UserCheck,
      tabTitle: "SCOUTING & RECRUITMENT",
      title: "Holistic 360° Player Evaluation & Similarity",
      badge: "Multidimensional Profiling",
      description: "A new perspective to evaluate individual performance over time powered by tracking & event data. By considering technical, tactical, physical, and cognitive aspects as a whole, our system enables similarity and comparison analysis.",
      features: [
        "Player similarity matching algorithms across global leagues",
        "Under-the-radar talent identification using contextual radar charts",
        "Space creation, off-ball movement, and line-breaking efficiency",
        "Fact-based recruitment reports ready for Sporting Directors"
      ],
      stats: { primary: "12,000+", label: "Scouted Players", secondary: "50+ Leagues", label2: "Global Coverage" }
    },
    {
      id: "match",
      icon: Video,
      tabTitle: "PRE / POST MATCH ANALYSIS",
      title: "Synchronized Video Tagging & Visual Feedback",
      badge: "Automated Tagging Engine",
      description: "Studying a game in depth has never been easier thanks to an extensive range of collective and individual analyses. Benefit from automated tagging of video clips to expedite video analysis with our advanced querying system.",
      features: [
        "Automated video clipping linked to tactical events",
        "High-dimensional spatial query engine for instant clip retrieval",
        "Synchronized 2D tactical minimap alongside camera footage",
        "Customizable match reports exportable to PDF, CSV, and JSON"
      ],
      stats: { primary: "3x Faster", label: "Video Review Speed", secondary: "100%", label2: "Synchronized Clips" }
    }
  ];

  const current = pillars[activeTab];

  return (
    <section id="platform" style={{
      maxWidth: '1360px',
      margin: '100px auto',
      padding: '0 48px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <span className="badge-orange">SportAnalytics Platform</span>
        <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '16px', letterSpacing: '-1px' }}>
          Unlock Your Team's Full Potential
        </h2>
        <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          Transform on-pitch performance with cutting-edge sports data analytics, automated video tagging, and predictive telemetry.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        background: 'var(--bg-dark-secondary)',
        padding: '8px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '32px'
      }}>
        {pillars.map((p, idx) => {
          const PIcon = p.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '16px 14px',
                borderRadius: '12px',
                background: isActive ? 'var(--orange-primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.86rem',
                fontFamily: 'Space Grotesk',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <PIcon size={18} color={isActive ? '#FFFFFF' : 'var(--text-muted)'} />
              <span>{p.tabTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Card Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="card-luxury"
          style={{
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '48px',
            alignItems: 'center',
            borderColor: 'var(--orange-border)'
          }}
        >
          {/* Left Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge-orange">{current.badge}</span>
            </div>

            <h3 style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: '18px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
              {current.title}
            </h3>

            <p style={{ fontSize: '1.08rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '28px' }}>
              {current.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '32px' }}>
              {current.features.map((feat, fidx) => (
                <div key={fidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--orange-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ padding: '12px 28px' }}>
              Request Full Module Walkthrough
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Right Metrics Display Card */}
          <div style={{
            background: 'rgba(8, 11, 16, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'Space Grotesk' }}>
                  {current.stats.primary}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {current.stats.label}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                  {current.stats.secondary}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {current.stats.label2}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Tactical Intelligence Impact
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                "SportAnalytics allows technical staff to evaluate both collective and individual outputs with zero manual tagging overhead."
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
