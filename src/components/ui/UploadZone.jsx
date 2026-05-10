import React, { useRef } from 'react';
import { Upload, Check, X } from 'lucide-react';

export function UploadZone({ label, accept, onFile, file, loading, onClear }) {
  const inputRef = useRef();
  
  return (
    <div className="upload-container">
      <div className="upload-label">{label}</div>
      {file ? (
        <div className="upload-done glass-panel">
          <Check size={16} className="text-primary" />
          <span className="upload-filename">
            {file.name}
          </span>
          {loading && <span className="upload-loading">Extracting…</span>}
          <button className="icon-button small" onClick={onClear}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="upload-zone glass-panel" onClick={() => inputRef.current?.click()}>
          <Upload size={24} className="text-muted" />
          <span className="upload-instruction">Tap to upload PDF or image</span>
          <input 
            ref={inputRef} 
            type="file" 
            accept={accept} 
            style={{ display: "none" }}
            onChange={e => e.target.files[0] && onFile(e.target.files[0])} 
          />
        </div>
      )}
    </div>
  );
}
