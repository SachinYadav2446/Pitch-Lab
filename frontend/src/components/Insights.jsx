import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Insights() {
  const articles = [
    {
      id: 1,
      tag: "Tactical Implementation",
      date: "Editorial Research",
      readTime: "6 min read",
      title: "The Demo Looks Great. But Will It Survive Monday Morning?",
      excerpt: "The soccer analytics space is full of impressive AI-built prototypes: clean dashboards, elegant interfaces, and automated reports. But what happens when the head coach needs real answers at 8:00 AM on Monday? Here is how to engineer robust, field-tested systems."
    },
    {
      id: 2,
      tag: "Academic to Pitch",
      date: "Sports Science",
      readTime: "8 min read",
      title: "From PhD to the Pitch: When Research Becomes Real Soccer",
      excerpt: "An inside look at how industrial research at SportAnalytics bridges academic deep learning algorithms and real-world soccer analytics, turning theory into decisive matchday decisions on the sidelines."
    },
    {
      id: 3,
      tag: "Tracking Technology",
      date: "Technology Brief",
      readTime: "5 min read",
      title: "Deep Vision: Integrating Event & Optical Tracking Data",
      excerpt: "SportAnalytics integrates optical broadcast tracking with deep event logs to deliver unprecedented depth in individual player grading, spatial control, and transitional press evaluations."
    }
  ];

  return (
    <section id="insights" style={{
      maxWidth: '1360px',
      margin: '100px auto',
      padding: '0 48px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span className="badge-orange">Research & Thought Leadership</span>
        <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '16px', letterSpacing: '-1px' }}>
          From the Lab to the Pitch
        </h2>
        <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Practical insights, research whitepapers, and engineering paradigms from our sports data scientists.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px'
      }}>
        {articles.map((art) => (
          <motion.div
            key={art.id}
            className="card-luxury"
            style={{
              padding: '38px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--orange-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  {art.tag}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {art.readTime}
                </span>
              </div>

              <h3 style={{
                fontSize: '1.45rem',
                color: '#FFFFFF',
                marginBottom: '14px',
                lineHeight: 1.35,
                letterSpacing: '-0.3px'
              }}>
                {art.title}
              </h3>

              <p style={{
                fontSize: '0.96rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '24px'
              }}>
                {art.excerpt}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--orange-primary)'
            }}>
              <span>Read Full Article</span>
              <ArrowUpRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
