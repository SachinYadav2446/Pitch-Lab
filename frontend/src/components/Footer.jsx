import React from 'react';
import { Activity, Mail, Globe } from 'lucide-react';

export default function Footer({ onLaunchStudio }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-dark-secondary)',
      padding: '80px 48px 40px 48px',
      position: 'relative'
    }}>
      {/* High-Converting Pre-Footer CTA */}
      <div className="card-luxury" style={{
        maxWidth: '1280px',
        margin: '0 auto 80px auto',
        padding: '60px 48px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #131A26 0%, #0B1018 100%)',
        border: '1px solid var(--orange-border)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle orange glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(255, 126, 0, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <span className="badge-orange" style={{ marginBottom: '16px', display: 'inline-block' }}>
          ENTERPRISE MATCHDAY READINESS
        </span>

        <h2 style={{
          fontSize: '3.4rem',
          color: '#FFFFFF',
          marginBottom: '16px',
          fontFamily: 'Space Grotesk',
          letterSpacing: '-1px'
        }}>
          Ready to Elevate Your Club's <span className="gradient-text-orange">Tactical Edge?</span>
        </h2>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          Schedule a tailored consultation with our sports data scientists to see how SportAnalytics can revolutionize your opposition scouting and performance workflows.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={onLaunchStudio}
            className="btn-primary" 
            style={{ fontSize: '1.05rem', padding: '14px 34px' }}
          >
            Launch Interactive Tactical Studio
          </button>
          <button 
            className="btn-secondary"
            style={{ fontSize: '1.05rem', padding: '14px 30px' }}
          >
            Request Private Club Demo
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: '40px',
        paddingBottom: '48px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #FF7E00 0%, #D45D00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={18} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.3rem', color: '#FFFFFF' }}>
              Sport<span style={{ color: 'var(--orange-primary)' }}>Analytics</span>
            </span>
          </div>

          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px', marginBottom: '20px' }}>
            Transforming football data and optical broadcast footage into actionable tactical intelligence for professional clubs, federations, and leagues worldwide.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Globe size={14} />
            <span>Serving Clubs in Portugal, Brazil, USA, France & UK</span>
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Solutions
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#services" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Digital Systems</a></li>
            <li><a href="#services" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Algorithm Design</a></li>
            <li><a href="#services" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Training & Education</a></li>
            <li><a href="#platform" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Opposition Analysis</a></li>
            <li><a href="#platform" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Player Monitoring</a></li>
          </ul>
        </div>

        {/* Technology Column */}
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Technology
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#studio" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>2D Tactical Pitch Radar</a></li>
            <li><a href="#studio" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>YOLOv8 + ByteTrack Re-ID</a></li>
            <li><a href="#studio" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Projective Homography (105x68m)</a></li>
            <li><a href="#insights" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Whitepapers & Research</a></li>
            <li><span style={{ color: 'var(--orange-primary)', fontSize: '0.88rem', fontWeight: 600 }}>NVIDIA RTX 4050 GPU Acceleration</span></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
            Enterprise Access
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
            Inquire directly for custom league or club deployments:
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.88rem',
            color: '#FFFFFF',
            fontWeight: 600
          }}>
            <Mail size={16} color="var(--orange-primary)" />
            <span>info@sportanalyticspro.com</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '24px auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.84rem',
        color: 'var(--text-muted)'
      }}>
        <span>© 2026 SportAnalytics Pro · All Rights Reserved.</span>
        <span>Engineered with PyTorch, YOLOv8, React, and Vite</span>
      </div>
    </footer>
  );
}
