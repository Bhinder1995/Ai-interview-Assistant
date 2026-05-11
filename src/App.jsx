import React, { useState, useCallback } from "react";
import { SplashScreen } from "./components/screens/SplashScreen";
import { ContextScreen } from "./components/screens/ContextScreen";
import { SettingsScreen } from "./components/screens/SettingsScreen";
import { HistoryScreen } from "./components/screens/HistoryScreen";
import { MainScreen } from "./components/screens/MainScreen";
import { useInterviewLogic } from "./hooks/useInterviewLogic";

export default function App() {
  const [screen, setScreen] = useState("splash");
  
  const [context, setContext] = useState({
    resumeFile: null, resumeText: "",
    jdFile: null, jdFileText: "", jdPaste: "", jobDesc: "",
    instructions: "",
  });
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("interview_settings");
    const initial = saved ? JSON.parse(saved) : {};
    return {
      fontSize: "medium",
      answerLength: "medium",
      autoClear: true,
      sensitivity: "medium",
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
      language: "en-US",
      model: "gemini-1.5-flash",
      ...initial
    };
  });

  const updateSetting = useCallback((k, v) => {
    setSettings(p => {
      const next = { ...p, [k]: v };
      localStorage.setItem("interview_settings", JSON.stringify(next));
      return next;
    });
  }, []);

  const logic = useInterviewLogic(context, settings);

  if (screen === "splash") {
    return <SplashScreen onDone={() => setScreen("main")} />;
  }
  if (screen === "context") {
    return <ContextScreen ctx={context} settings={settings} onSave={ctx => { setContext(ctx); setScreen("main"); }} onBack={() => setScreen("main")} />;
  }
  if (screen === "settings") {
    return <SettingsScreen settings={settings} onChange={updateSetting} onBack={() => setScreen("main")} />;
  }
  if (screen === "history") {
    return <HistoryScreen history={logic.history} onClear={() => logic.setHistory([])} onBack={() => setScreen("main")} />;
  }

  return (
    <div className="app-container">
      <MainScreen 
        logic={logic}
        context={context}
        settings={settings}
        onNavigate={setScreen}
      />
    </div>
  );
}
