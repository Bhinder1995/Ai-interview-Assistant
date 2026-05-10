import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

export function HistoryScreen({ history, onClear, onBack }) {
  return (
    <div className="screen scrollable">
      <div className="screen-header glass-header">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <span className="screen-title">History ({history.length})</span>
        {history.length > 0 &&
          <button className="danger-button small" onClick={onClear}>
            <Trash2 size={14} /> Clear
          </button>
        }
      </div>
      <div className="history-body">
        {history.length === 0 ? (
          <div className="empty-state">No questions yet</div>
        ) : (
          [...history].reverse().map((item, i) => (
            <div key={i} className="history-item glass-panel">
              <div className="history-q">Q: {item.question}</div>
              <div className="history-a">{item.answer}</div>
              <div className="history-time">{item.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
