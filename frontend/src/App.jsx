import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureExplorer from './components/FeatureExplorer';
import Footer from './components/Footer';
import FloatingChatbotButton from './components/FloatingChatbotButton';
import TacticalAiModal from './components/TacticalAiModal';

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleLaunchStudio = () => {
    const el = document.querySelector('#features-explorer');
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
      {/* Header Navigation */}
      <Navbar onLaunchStudio={handleLaunchStudio} />

      {/* Main Content Flow */}
      <main style={{ flex: 1 }}>
        {/* Section 1: Hero Section */}
        <Hero onLaunchStudio={handleLaunchStudio} />

        {/* Section 2: Interactive Feature & Subfeature Matrix with LineSidebar */}
        <FeatureExplorer />
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
