import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VisionStudio from './components/VisionStudio';
import FeatureExplorer from './components/FeatureExplorer';
import Footer from './components/Footer';
import FloatingChatbotButton from './components/FloatingChatbotButton';
import TacticalAiModal from './components/TacticalAiModal';

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  const handleNavSelectFeature = (index) => {
    if (index === 6) {
      // Direct jump to Live Vision Studio & Video Upload
      const studioEl = document.querySelector('#vision-studio');
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    setSelectedFeatureIndex(index);
    const el = document.querySelector('#features-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchStudio = () => {
    const studioEl = document.querySelector('#vision-studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedFeatureIndex(6);
      const el = document.querySelector('#features-explorer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
      {/* Header Navigation */}
      <Navbar onSelectFeature={handleNavSelectFeature} />

      {/* Main Content Flow */}
      <main style={{ flex: 1 }}>
        {/* Section 1: Hero Section */}
        <Hero onLaunchStudio={handleLaunchStudio} />

        {/* Section 2: Interactive Vision Studio & Video Upload Workbench */}
        <VisionStudio />

        {/* Section 3: Interactive Feature & Subfeature Matrix with LineSidebar */}
        <FeatureExplorer
          externalFeatureIndex={selectedFeatureIndex}
          onFeatureChange={setSelectedFeatureIndex}
        />
      </main>

      {/* Footer */}
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
