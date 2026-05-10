import React from 'react';

export function StatusPill({ status }) {
  const cfg = {
    idle:       { label: "Idle",         color: "var(--color-idle)" },
    listening:  { label: "Listening",    color: "var(--color-primary)" },
    processing: { label: "Processing",   color: "var(--color-warning)" },
    ready:      { label: "Answer Ready", color: "var(--color-info)" },
    error:      { label: "Error",        color: "var(--color-danger)" },
    nosupport:  { label: "Not Supported",color: "var(--color-danger)" },
  };
  const c = cfg[status] || cfg.idle;
  
  return (
    <div className="status-pill" style={{ color: c.color }}>
      <span 
        className={`status-dot ${status === 'listening' ? 'pulse' : ''}`}
        style={{ 
          background: c.color,
          boxShadow: status === "listening" ? `0 0 8px ${c.color}` : "none"
        }}
      />
      {c.label}
    </div>
  );
}
