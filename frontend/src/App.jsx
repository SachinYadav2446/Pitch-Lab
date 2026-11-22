import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomographyFeature from './components/HomographyFeature';
import VoronoiFeature from './components/VoronoiFeature';
import TrackingFeature from './components/TrackingFeature';
import JerseyClusteringFeature from './components/JerseyClusteringFeature';
import KinematicsFeature from './components/KinematicsFeature';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import Footer from './components/Footer';
import FloatingChatbotButton from './components/FloatingChatbotButton';
import TacticalAiModal from './components/TacticalAiModal';

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleLaunchStudio = () => {
    const el = document.querySelector('#pipeline');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-sage)',
      color: 'var(--text-burgundy)'
    }}>
      {/* Section 1: Header Navigation */}
      <Navbar onLaunchStudio={handleLaunchStudio} />

      {/* Main Content Flow */}
      <main style={{ flex: 1 }}>
        {/* Section 2: Hero Section */}
        <Hero onLaunchStudio={handleLaunchStudio} />

        {/* Feature 01: Planar Pitch Homography Engine */}
        <HomographyFeature />

        {/* Feature 02: Dynamic Space Control & Voronoi Dominance */}
        <VoronoiFeature />

        {/* Feature 03: Deep Multi-Object Tracking & Re-ID (YOLOv8 + ByteTrack) */}
        <TrackingFeature />

        {/* Feature 04: Automated Jersey Pigment Clustering (K-Means in HSV) */}
        <JerseyClusteringFeature />

        {/* Feature 05: Metric Velocity & Physical Sprint Telemetry */}
        <KinematicsFeature />

        {/* Feature 06: Production End-to-End Pipeline Architecture */}
        <ArchitecturePipeline />
      </main>

      {/* Section 7: Footer */}
      <Footer />

      {/* Floating AI Tactical Copilot Button (Right Side) */}
      <FloatingChatbotButton onClick={() => setIsAiModalOpen(true)} />

      {/* GenAI Tactical Copilot Modal */}
      <TacticalAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
