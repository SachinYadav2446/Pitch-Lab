import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare, Shield, Compass, Zap } from 'lucide-react';

export default function TacticalAiModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to PitchVision Tactical Copilot. I analyze real-time spatial telemetry from the match vision models (YOLOv8 + ByteTrack + Homography). How can I assist your tactical analysis?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const samplePrompts = [
    'Analyze Team Alpha half-space overload',
    'Who reached peak sprint velocity under pressure?',
    'What was the defensive block compactness in m²?',
    'Show line-breaking pass opportunities'
  ];

  const handleSend = (text) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    let aiResponse = '';

    if (query.toLowerCase().includes('overload') || query.toLowerCase().includes('space')) {
      aiResponse = 'Tactical Analysis [Phase: Half-Space Overload]: Team Alpha created a 3v2 numerical superiority in the right half-space at coordinates (38.4m, 14.2m). Striker #10 dragged Centerback #04 out of the defensive block by 4.2 meters, generating 18.4 m² of uncontested space for Winger #09 to exploit.';
    } else if (query.toLowerCase().includes('sprint') || query.toLowerCase().includes('velocity')) {
      aiResponse = 'Kinematic Telemetry [Top Speed]: Striker #10 recorded the match-high sprint velocity of 33.8 km/h at timestamp 24:18 during a direct vertical transition, sustaining >25.0 km/h for 4.8 seconds with an explosive acceleration of 4.2 m/s².';
    } else if (query.toLowerCase().includes('compactness') || query.toLowerCase().includes('block')) {
      aiResponse = 'Spatial Geometry [Defensive Block]: Team Beta maintained a convex hull compactness area of 320 m² during the high press phase. The vertical distance between the defensive backline and midfield pivot was restricted to 14.8 meters, forcing Team Alpha to circulate possession wide.';
    } else {
      aiResponse = `Telemetry Query [${query}]: Processed over 22 tracked player vectors and planar homography coordinates. Pitch dominance stands at 62.4% for Team Alpha, with an average time-to-intercept in the attacking third of 1.24 seconds.`;
    }

    setMessages((prev) => [...prev, userMsg, { sender: 'ai', text: aiResponse }]);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '82vh',
        backgroundColor: '#380504',
        border: '1.5px solid rgba(232, 210, 181, 0.4)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px rgba(89, 9, 7, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #590907 0%, #430504 100%)',
          borderBottom: '1px solid rgba(232, 210, 181, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(232, 210, 181, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} color="var(--cream-beige)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#FFF6EB'
              }}>
                PitchVision Tactical AI Copilot
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.70rem',
                color: 'var(--cream-beige)',
                opacity: 0.8
              }}>
                ML TELEMETRY REASONING ENGINE // 60 FPS INFERENCE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cream-beige)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user'
                  ? 'var(--cream-beige)'
                  : 'rgba(0, 0, 0, 0.35)',
                color: m.sender === 'user' ? 'var(--burgundy-deep)' : '#FFF6EB',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(232, 210, 181, 0.2)',
                borderRadius: '16px',
                padding: '14px 18px',
                fontSize: '0.90rem',
                lineHeight: 1.55,
                fontWeight: m.sender === 'user' ? 700 : 500,
                fontFamily: m.sender === 'user' ? 'Space Grotesk, sans-serif' : 'Plus Jakarta Sans, sans-serif'
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Sample Prompt Chips */}
        <div style={{
          padding: '8px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          borderTop: '1px solid rgba(232, 210, 181, 0.15)'
        }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              style={{
                background: 'rgba(232, 210, 181, 0.08)',
                border: '1px solid rgba(232, 210, 181, 0.2)',
                color: 'var(--cream-beige)',
                borderRadius: '14px',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(232, 210, 181, 0.2)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask tactical question (e.g., Which passing lane had highest xG?)..."
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(232, 210, 181, 0.3)',
              borderRadius: '18px',
              padding: '12px 18px',
              color: '#FFF6EB',
              fontSize: '0.88rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => handleSend()}
            style={{
              background: 'var(--cream-beige)',
              color: 'var(--burgundy-deep)',
              border: 'none',
              borderRadius: '18px',
              padding: '0 20px',
              cursor: 'pointer',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
