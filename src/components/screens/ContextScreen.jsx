import React, { useState } from 'react';
import { extractTextFromFile } from '../../lib/api';
import { UploadZone } from '../ui/UploadZone';
import { ArrowLeft, User, Building, Zap, CheckCircle2 } from 'lucide-react';

export function ContextScreen({ ctx, settings, onSave, onBack }) {
  const { apiKey, model } = settings;
  const [resumeFile, setResumeFile] = useState(ctx.resumeFile || null);
  const [resumeText, setResumeText] = useState(ctx.resumeText || "");
  const [resumeLoading, setResumeLoading] = useState(false);
  
  const [jdFile, setJdFile] = useState(ctx.jdFile || null);
  const [jdFileText, setJdFileText] = useState(ctx.jdFileText || "");
  const [jdFileLoading, setJdFileLoading] = useState(false);
  const [jdPaste, setJdPaste] = useState(ctx.jdPaste || "");
  
  const [instructions, setInstructions] = useState(ctx.instructions || "");
  const [activeJdTab, setActiveJdTab] = useState(ctx.jdFile ? "file" : "paste");

  async function handleResumeFile(file) {
    if (!apiKey) { alert("Please set your Gemini API Key in Settings first."); return; }
    setResumeFile(file);
    setResumeLoading(true);
    try { 
      const t = await extractTextFromFile(file, apiKey, model); 
      setResumeText(t); 
    } catch (e) { 
      alert("Extraction failed: " + e.message);
      setResumeText(""); 
    }
    setResumeLoading(false);
  }

  async function handleJdFile(file) {
    if (!apiKey) { alert("Please set your Gemini API Key in Settings first."); return; }
    setJdFile(file);
    setJdFileLoading(true);
    try { 
      const t = await extractTextFromFile(file, apiKey, model); 
      setJdFileText(t); 
    } catch (e) { 
      alert("Extraction failed: " + e.message);
      setJdFileText(""); 
    }
    setJdFileLoading(false);
  }

  function save() {
    onSave({
      resumeFile, 
      resumeText,
      jdFile, 
      jdFileText, 
      jdPaste,
      instructions,
      jobDesc: activeJdTab === "file" ? jdFileText : jdPaste,
    });
  }

  const hasContext = resumeText || jdPaste || jdFileText || instructions;

  return (
    <div className="screen scrollable">
      <div className="screen-header glass-header">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <span className="screen-title">Interview Context</span>
        <button 
          className="save-button small" 
          style={{ opacity: hasContext ? 1 : 0.4 }} 
          onClick={save}
        >
          Save
        </button>
      </div>

      <div className="ctx-body">
        <Section title="Your Resume" icon={<User size={20}/>} subtitle="Upload PDF/image or paste your resume text">
          <UploadZone
            label="Upload Resume (PDF or screenshot)"
            accept=".pdf,image/*"
            file={resumeFile}
            loading={resumeLoading}
            onFile={handleResumeFile}
            onClear={() => { setResumeFile(null); setResumeText(""); }}
          />
          {resumeText && (
            <div className="extracted-badge glass-panel">
              <CheckCircle2 size={14} className="text-primary" /> Resume extracted ({resumeText.length} chars)
            </div>
          )}
          <div className="or-divider">— or paste text —</div>
          <textarea
            className="custom-textarea"
            placeholder="Paste your resume or key skills here…"
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={5}
          />
        </Section>

        <Section title="Job Description" icon={<Building size={20}/>} subtitle="Help AI understand the role and company">
          <div className="tab-row">
            <button 
              className={`tab ${activeJdTab === "paste" ? "active" : ""}`}
              onClick={() => setActiveJdTab("paste")}
            >
              Paste Text
            </button>
            <button 
              className={`tab ${activeJdTab === "file" ? "active" : ""}`}
              onClick={() => setActiveJdTab("file")}
            >
              Upload File
            </button>
          </div>
          {activeJdTab === "paste" ? (
            <textarea
              className="custom-textarea"
              placeholder="Paste job description here — include company name, role, requirements, culture…"
              value={jdPaste}
              onChange={e => setJdPaste(e.target.value)}
              rows={7}
            />
          ) : (
            <>
              <UploadZone
                label="Upload JD (PDF or screenshot)"
                accept=".pdf,image/*"
                file={jdFile}
                loading={jdFileLoading}
                onFile={handleJdFile}
                onClear={() => { setJdFile(null); setJdFileText(""); }}
              />
              {jdFileText && (
                <div className="extracted-badge glass-panel">
                  <CheckCircle2 size={14} className="text-primary" /> JD extracted ({jdFileText.length} chars)
                </div>
              )}
            </>
          )}
        </Section>

        <Section title="Special Instructions" icon={<Zap size={20}/>} subtitle="Tell the AI how to answer for you specifically">
          <textarea
            className="custom-textarea"
            placeholder={`Examples:\n• Always mention my 3 years of React experience\n• Avoid mentioning salary expectations\n• I'm applying for a senior role, sound confident\n• Answers should be in first person`}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            rows={5}
          />
        </Section>

        <button className="save-button big-save" onClick={save}>
          <CheckCircle2 size={18} /> Save & Start Interview
        </button>
        <div style={{ height:30 }} />
      </div>
    </div>
  );
}

function Section({ title, icon, subtitle, children }) {
  return (
    <div className="ctx-section">
      <div className="section-head">
        <div className="section-icon">{icon}</div>
        <div>
          <div className="section-title">{title}</div>
          {subtitle && <div className="section-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="section-body fade-in">{children}</div>
    </div>
  );
}
