import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "SportAnalytics provides a system that helps to centralize all tactical and physical information in order to simplify and make the work of all coaching staff more effective. We get clear answers to complex football questions with actionable insights and synchronized visualizations.",
      author: "Alwin Lawrence",
      role: "Head of Performance",
      club: "Professional Football Club",
      rating: 5
    },
    {
      quote: "SportsAnalytics builds great solutions that save hours of work each week in opponent analysis, because we can prioritize much better the topics to deepen. They give the technical staff a much better way to evaluate both individual and collective outputs, as well as compare our team's playing style to the rest of the league.",
      author: "Prashant Tiwari",
      role: "Tactical Analyst",
      club: "Elite League Analyst",
      rating: 5
    },
    {
      quote: "SportAnalytics provides a perfect solution in our game preparation process to combine visual feedback with data-driven insights. This system provides our analysis team direction to focus on the right topics and spend our time wisely. It is critical to verify our perceptions with empirical tracking data.",
      author: "Dumitru Uzunea",
      role: "Assistant Coach & Tactical Strategist",
      club: "Top Tier European League",
      rating: 5
    },
    {
      quote: "We are thrilled to rely on the services of SportAnalytics. This collaboration reinforces our innovative approach to utilizing data analytics by our Performance Analysts and Sport Data Scientists for informed decision-making in match and opponent analysis.",
      author: "Nuno Maurício",
      role: "Head of Performance Analysis",
      club: "Sport Lisboa e Benfica",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrentIndex((currentIndex + 1) % testimonials.length);

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" style={{
      maxWidth: '1360px',
      margin: '100px auto',
      padding: '0 48px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge-orange">Client Testimonials</span>
          <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginTop: '12px', marginBottom: '8px', letterSpacing: '-1px' }}>
            What Our Clients Say
          </h2>
          <p style={{ fontSize: '1.14rem', color: 'var(--text-secondary)', margin: 0 }}>
            Hear directly from Heads of Performance, Tactical Analysts, and First-Team Coaches.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={prev}
            className="btn-secondary"
            style={{ width: '46px', height: '46px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            className="btn-primary"
            style={{ width: '46px', height: '46px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
            aria-label="Next Testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="card-luxury"
          style={{
            padding: '50px 60px',
            background: 'linear-gradient(135deg, #131A26 0%, #0F141E 100%)',
            border: '1px solid var(--border-medium)',
            position: 'relative'
          }}
        >
          <Quote size={48} color="var(--orange-primary)" style={{ opacity: 0.4, marginBottom: '24px' }} />

          <p style={{
            fontSize: '1.35rem',
            lineHeight: 1.65,
            color: '#FFFFFF',
            fontFamily: 'Space Grotesk',
            fontWeight: 500,
            marginBottom: '32px'
          }}>
            "{current.quote}"
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px'
          }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk' }}>
                {current.author}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--orange-primary)', fontWeight: 600 }}>
                {current.role} · <span style={{ color: 'var(--text-muted)' }}>{current.club}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={18} fill="var(--orange-primary)" color="var(--orange-primary)" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
