import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureExplorer from './components/FeatureExplorer';
import Footer from './components/Footer';
import FloatingChatbotButton from './components/FloatingChatbotButton';
import TacticalAiModal from './components/TacticalAiModal';
import NeuralStudioModal from './components/NeuralStudioModal';

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNeuralModalOpen, setIsNeuralModalOpen] = useState(false);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  const handleNavSelectFeature = (index) => {
    if (index === 6) {
      // Launch Neural Studio Workbench directly
      setIsNeuralModalOpen(true);
      return;
    }
    setSelectedFeatureIndex(index);
    const el = document.querySelector('#features-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchStudio = () => {
    setIsNeuralModalOpen(true);
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
      <Navbar 
        onSelectFeature={handleNavSelectFeature} 
        onOpenStudio={() => setIsNeuralModalOpen(true)}
      />

      {/* Main Content Flow */}
      <main style={{ flex: 1 }}>
        {/* Section 1: Hero Section */}
        <Hero onLaunchStudio={handleLaunchStudio} />

        {/* Section 2: Interactive Feature & Subfeature Matrix with LineSidebar */}
        <FeatureExplorer
          externalFeatureIndex={selectedFeatureIndex}
          onFeatureChange={setSelectedFeatureIndex}
          onOpenStudio={() => setIsNeuralModalOpen(true)}
        />
      </main>

      {/* Single-Row Clean Footer */}
      <Footer />

      {/* Floating AI Tactical Copilot Button (Right Side) */}
      <FloatingChatbotButton onClick={() => setIsAiModalOpen(true)} />

      {/* GenAI Tactical Copilot Modal */}
      <TacticalAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Neural Vision Studio Modal (FastAPI + YOLOv8 Video Processing) */}
      <NeuralStudioModal
        isOpen={isNeuralModalOpen}
        onClose={() => setIsNeuralModalOpen(false)}
      />
    </div>
  );
}
