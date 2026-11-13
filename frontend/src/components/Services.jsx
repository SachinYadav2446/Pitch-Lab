import React from 'react';
import { Cpu, Binary, GraduationCap, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services() {
  const services = [
    {
      num: "01",
      icon: Cpu,
      title: "DIGITAL SYSTEMS",
      subtitle: "Automated Data-Driven Platforms for Clubs & Leagues",
      description: "Our data analysis solutions turn numbers into insights that help athletes and the organizations they play for get better results. This provides clubs, leagues, and federations with automated data-driven insights that allow them to make fact-based decisions quickly and effectively."
    },
    {
      num: "02",
      icon: Binary,
      title: "ALGORITHM DESIGN",
      subtitle: "Proprietary Machine Learning & Predictive KPIs",
      description: "Let our experts help you craft KPIs to measure, enhance, and refine your players’ performance, prevent injuries, and pinpoint the players that fit your team’s strategy. With cutting-edge ML & AI techniques, we take tracking data to the next level."
    },
    {
      num: "03",
      icon: GraduationCap,
      title: "TRAINING & EDUCATION",
      subtitle: "Bridging Academic Research to Matchday Reality",
      description: "Experience our transformative training in sports data analytics and machine learning methodologies. Participate in dedicated sessions to unveil football data analysis insights and make the most of tutorials that guide you in tool usage and metric interpretation."
    }
  ];

  return (
    <section id="services" style={{
      maxWidth: '1360px',
      margin: '90px auto',
      padding: '0 48px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span className="badge-orange">Products & Services</span>
        <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '16px', letterSpacing: '-1px' }}>
          Intelligent Football Solutions
        </h2>
        <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          End-to-end tactical infrastructure built to solve real football challenges on Monday mornings.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px'
      }}>
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              className="card-luxury"
              style={{
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {/* Top Accent line in signature orange */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'var(--orange-primary)'
              }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--orange-subtle)',
                    border: '1px solid var(--orange-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} color="var(--orange-primary)" />
                  </div>
                  <span style={{
                    fontFamily: 'Space Grotesk',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'rgba(255, 126, 0, 0.2)'
                  }}>
                    {s.num}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--orange-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  {s.title}
                </div>

                <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                  {s.subtitle}
                </h3>

                <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  {s.description}
                </p>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--orange-primary)',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                <span>Learn More About {s.title}</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
