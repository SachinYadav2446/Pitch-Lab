import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomographyFeature from './components/HomographyFeature';

export default function App() {
  const handleLaunchStudio = () => {
    alert("Tactical Studio demo will open here once approved!");
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

        {/* Section 3: Feature 1 - Planar Pitch Homography Engine */}
        <HomographyFeature />
      </main>
    </div>
  );
}
