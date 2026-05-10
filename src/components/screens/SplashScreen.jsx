import React, { useEffect } from 'react';

export function SplashScreen({ onDone }) {
  useEffect(() => { 
    const t = setTimeout(onDone, 2000); 
    return () => clearTimeout(t); 
  }, [onDone]);
  
  return (
    <div className="splash-screen">
      <div className="splash-glow" />
      <img src="/logo.png" width="120" height="120" className="splash-icon" alt="Logo" style={{ borderRadius: '24px' }} />
      <div className="splash-title">
        AI Interview<br/>Assistant
      </div>
      <div className="splash-subtitle">Silent · Instant · Private</div>
      <div className="splash-dots">
        {[0, 0.3, 0.6].map((d, i) => (
          <span 
            key={i} 
            className="dot-blink"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    </div>
  );
}
