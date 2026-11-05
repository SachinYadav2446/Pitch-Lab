import React from 'react';
import Navbar from './components/Navbar';
import HorizontalTicker from './components/HorizontalTicker';
import Hero from './components/Hero';
import ComparisonSlider from './components/ComparisonSlider';
import TacticalReel from './components/TacticalReel';
import LiveStudio from './components/LiveStudio';
import Features from './components/Features';
import Architecture from './components/Architecture';
import Footer from './components/Footer';

export default function App() {
  const scrollToStudio = () => {
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onLaunchStudio={scrollToStudio} />
      
      {/* Horizontal Continuous Sliding Telemetry Marquee */}
      <HorizontalTicker />

      <main style={{ flex: 1 }}>
        {/* Dynamic Hero Section */}
        <Hero onLaunchStudio={scrollToStudio} />

        {/* Interactive Before & After Split Comparison Slider */}
        <ComparisonSlider />

        {/* Horizontal Sliding Match Reel Carousel */}
        <TacticalReel />

        {/* Live Interactive Telemetry Studio */}
        <LiveStudio />

        {/* Core Vision Capabilities */}
        <Features />

        {/* End-to-End Architecture */}
        <Architecture />
      </main>

      <Footer />
    </div>
  );
}
