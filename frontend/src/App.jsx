import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  const handleLaunchStudio = () => {
    alert("Tactical Studio demo will open here once approved!");
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-burgundy-root)',
      color: 'var(--text-primary)'
    }}>
      {/* Section 1: Header Navigation */}
      <Navbar onLaunchStudio={handleLaunchStudio} />

      {/* Section 2: Hero Section */}
      <main style={{ flex: 1 }}>
        <Hero onLaunchStudio={handleLaunchStudio} />
      </main>
    </div>
  );
}
