import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function SettingsScreen({ settings, onChange, onBack }) {
  return (
    <div className="screen scrollable">
      <div className="screen-header glass-header">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <span className="screen-title">Settings</span>
      </div>
      <div className="settings-body">
        <SettingRow label="Gemini API Key">
          <input 
            type="password" 
            className="custom-textarea" 
            style={{ height: "auto", padding: "12px" }}
            placeholder="AIzaSy... (or set in .env)" 
            value={settings.apiKey} 
            onChange={e => onChange("apiKey", e.target.value)} 
          />
        </SettingRow>
        <SettingRow label="AI Model (Gemini)">
          <Segmented 
            options={["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"]} 
            labels={["1.5 Flash", "1.5 Pro", "2.0 Flash"]}
            value={settings.model} 
            onChange={v => onChange("model", v)} 
          />
        </SettingRow>
        <SettingRow label="Interview Language">
          <Segmented options={["en-US", "hi-IN"]} labels={["English", "Hindi"]} value={settings.language} onChange={v => onChange("language", v)} />
        </SettingRow>
        <SettingRow label="Font Size">
          <Segmented options={["small","medium","large"]} value={settings.fontSize} onChange={v=>onChange("fontSize",v)}/>
        </SettingRow>
        <SettingRow label="Answer Length">
          <Segmented options={["short","medium","long"]} value={settings.answerLength} onChange={v=>onChange("answerLength",v)}/>
        </SettingRow>
        <SettingRow label="Auto-clear old answers">
          <Toggle value={settings.autoClear} onChange={v=>onChange("autoClear",v)}/>
        </SettingRow>
        <SettingRow label="Sensitivity">
          <Segmented options={["low","medium","high"]} value={settings.sensitivity} onChange={v=>onChange("sensitivity",v)}/>
        </SettingRow>
      </div>
      <div className="settings-footer">
        Changes apply immediately.
      </div>
    </div>
  );
}

function Segmented({ options, labels, value, onChange }) {
  return (
    <div className="segmented-control">
      {options.map((o, i) => (
        <button 
          key={o}
          className={`segment-btn ${value === o ? 'active' : ''}`}
          onClick={() => onChange(o)}
        >
          {labels ? labels[i] : o.charAt(0).toUpperCase() + o.slice(1)}
        </button>
      ))}
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="setting-row">
      <div className="setting-label">{label.toUpperCase()}</div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div 
      className={`toggle-switch ${value ? 'on' : 'off'}`}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-knob" />
    </div>
  );
}
