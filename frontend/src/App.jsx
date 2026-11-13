import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBanner from './components/TrustBanner';
import HorizontalTicker from './components/HorizontalTicker';
import Services from './components/Services';
import PlatformPillars from './components/PlatformPillars';
import ComparisonSlider from './components/ComparisonSlider';
import TacticalReel from './components/TacticalReel';
import LiveStudio from './components/LiveStudio';
import Integrations from './components/Integrations';
import Testimonials from './components/Testimonials';
import Insights from './components/Insights';
import Footer from './components/Footer';

export default function App() {
  const scrollToStudio = () => {
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* 1. Header Navigation Bar */}
      <Navbar onLaunchStudio={scrollToStudio} />

      <main style={{ flex: 1 }}>
        {/* 2. Hero Section: Explore. Improve. Win. */}
        <Hero onLaunchStudio={scrollToStudio} />

        {/* 3. Global Clubs & Federations Trust Banner */}
        <TrustBanner />

        {/* 4. Live Real-Time Telemetry Marquee Ticker */}
        <HorizontalTicker />

        {/* 5. Products & Services (Digital Systems, Algorithm Design, Training & Education) */}
        <Services />

        {/* 6. SportAnalytics Platform Pillars (Opposition Analysis, Monitoring, Scouting, Pre/Post) */}
        <PlatformPillars />

        {/* 7. Interactive Before/After Split Comparison Slider */}
        <ComparisonSlider />

        {/* 8. Horizontal Tactical Reel Carousel */}
        <TacticalReel />

        {/* 9. Interactive Live Studio & 2D Tactical Pitch Radar */}
        <LiveStudio />

        {/* 10. Integrated Data Providers & Optical Standards */}
        <Integrations />

        {/* 11. Client Testimonials from Heads of Performance & Analysts */}
        <Testimonials />

        {/* 12. Research & Thought Leadership: From PhD to the Pitch */}
        <Insights />
      </main>

      {/* 13. High-Converting Closing CTA & Footer */}
      <Footer onLaunchStudio={scrollToStudio} />
    </div>
  );
}
