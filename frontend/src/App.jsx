import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureExplorer from './components/FeatureExplorer';
import StudioPage from './components/StudioPage';
import Footer from './components/Footer';
import FloatingChatbotButton from './components/FloatingChatbotButton';
import TacticalAiModal from './components/TacticalAiModal';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#studio' ? 'studio' : 'home';
    }
    return 'home';
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  // Sync hash changes with currentView
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(window.location.hash === '#studio' ? 'studio' : 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToStudio = () => {
    setCurrentView('studio');
    window.location.hash = 'studio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSelectFeature = (index) => {
    if (index === 6) {
      // Jump directly to dedicated Match Analytics Studio
      navigateToStudio();
      return;
    }
    setSelectedFeatureIndex(index);
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
      {currentView === 'studio' ? (
        /* ========================================================
           DEDICATED FULL-PAGE ANALYTICS STUDIO WORKBENCH
           ======================================================== */
        <StudioPage onBackToHome={navigateToHome} />
      ) : (
        /* ========================================================
           CLEAN EDITORIAL HOME / PRODUCT LANDING PAGE
           ======================================================== */
        <>
          {/* Header Navigation */}
          <Navbar 
            onSelectFeature={handleNavSelectFeature} 
            onOpenStudio={navigateToStudio}
          />

          {/* Main Content Flow */}
          <main style={{ flex: 1 }}>
            {/* Section 1: Hero Section */}
            <Hero onLaunchStudio={navigateToStudio} />

            {/* Section 2: Interactive Feature & Subfeature Matrix with LineSidebar */}
            <FeatureExplorer
              externalFeatureIndex={selectedFeatureIndex}
              onFeatureChange={setSelectedFeatureIndex}
              onOpenStudio={navigateToStudio}
            />
          </main>

          {/* Single-Row Clean Footer */}
          <Footer />
        </>
      )}

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
