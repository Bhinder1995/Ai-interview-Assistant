import React, { useRef, useEffect } from 'react';
import { StatusPill } from '../ui/StatusPill';
import { Settings, Clock, FileText, Mic, Square, Copy } from 'lucide-react';

export function MainScreen({ 
  logic, 
  context, 
  settings, 
  onNavigate 
}) {
  const { 
    status, transcript, detectedQ, answer, isListening, 
    startListening, stopListening, clearScreen 
  } = logic;

  const [showToast, setShowToast] = React.useState(false);

  const transcriptBoxRef = useRef(null);

  const fontSizeMap = { small: 15, medium: 18, large: 22 };
  const answerFontMap = { small: 17, medium: 21, large: 25 };

  const hasContext = context.resumeText || context.jobDesc || context.instructions;

  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="screen">
      {/* ── Header ── */}
      <div className="header glass-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" width="32" height="32" alt="Logo" style={{ borderRadius: '6px' }} />
          <div>
            <div className="app-title" style={{ marginBottom: 0 }}>AI Interview Assistant</div>
            <div className={`status-pill status-${status}`}>
              <span className="status-dot" />
              {status}
            </div>
          </div>
        </div>
        <div className="nav-actions">
          <button 
            className={`icon-button ${hasContext ? 'context-active' : ''}`}
            onClick={() => onNavigate("context")} 
            title="Interview Context"
          >
            <FileText size={18} />
          </button>
          <button className="icon-button" onClick={() => onNavigate("history")} title="History">
            <Clock size={18} />
          </button>
          <button className="icon-button" onClick={() => onNavigate("settings")} title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Context badges */}
      <ContextBadges ctx={context} />

      {/* No context nudge */}
      {!hasContext && (
        <div className="nudge-banner glass-panel" onClick={() => onNavigate("context")}>
          <span className="nudge-icon">⚡</span>
          <span className="nudge-text">Add your resume & job description for personalized answers</span>
          <span className="nudge-arrow">→</span>
        </div>
      )}

      {/* ── Transcript ── */}
      <div className="section-label">LIVE TRANSCRIPT</div>
      <div ref={transcriptBoxRef} className="transcript-box glass-panel">
        {transcript ? (
          <span style={{ fontSize: fontSizeMap[settings.fontSize] - 2 }} className="transcript-text">
            {transcript}
          </span>
        ) : (
          <span className="empty-text">
            {isListening ? "Waiting for speech…" : "Tap Start Listening to begin"}
          </span>
        )}
      </div>

      {/* ── Detected Question ── */}
      {detectedQ && (
        <div className="question-box glass-panel glass-highlight">
          <span className="q-tag">Q</span>
          <span className="q-text" style={{ fontSize: fontSizeMap[settings.fontSize] - 1 }}>
            {detectedQ}
          </span>
        </div>
      )}

      {/* ── Answer ── */}
      <div className="section-label">AI ANSWER</div>
      <div className="answer-box glass-panel">
        {answer && status !== "processing" && (
          <button 
            className="copy-button" 
            onClick={() => {
              navigator.clipboard.writeText(answer);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            title="Copy Answer"
          >
            <Copy size={16} />
          </button>
        )}
        {status === "processing" ? (
          <div className="processing-indicator">
            <span className="processing-text">Generating</span>
            {[0, 0.25, 0.5].map((d, i) => (
              <span key={i} className="dot-blink" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ) : answer ? (
          <div 
            className="answer-text fade-in" 
            style={{ fontSize: answerFontMap[settings.fontSize] }}
          >
            {answer}
          </div>
        ) : (
          <div className="empty-answer">Answer will appear here</div>
        )}
      </div>

      {showToast && <div className="toast fade-in">Copied to clipboard!</div>}

      {/* ── Controls ── */}
      <div className="controls-container">
        {!isListening ? (
          <button className="control-btn btn-primary" onClick={startListening}>
            <Mic size={18} className="mr-2" /> Start Listening
          </button>
        ) : (
          <button className="control-btn btn-danger" onClick={stopListening}>
            <Square size={16} fill="currentColor" className="mr-2" /> Stop
          </button>
        )}
        <button className="control-btn btn-secondary" onClick={clearScreen}>Clear</button>
      </div>
    </div>
  );
}

function ContextBadges({ ctx }) {
  const badges = [];
  if (ctx.resumeText) badges.push({ label: "Resume", type: "primary" });
  if (ctx.jobDesc) badges.push({ label: "JD", type: "info" });
  if (ctx.instructions) badges.push({ label: "Instructions", type: "warning" });
  
  if (!badges.length) return null;
  
  return (
    <div className="badges-container">
      {badges.map((b, i) => (
        <span key={i} className={`badge badge-${b.type}`}>
          ✓ {b.label}
        </span>
      ))}
    </div>
  );
}
