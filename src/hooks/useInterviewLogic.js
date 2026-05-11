import { useState, useRef, useCallback, useEffect } from "react";
import { isQuestion, getAIAnswer } from "../lib/api";

export function useInterviewLogic(context, settings) {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [detectedQ, setDetectedQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const processingRef = useRef(false);
  const lastQRef = useRef("");
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleQuestion = useCallback(async (question) => {
    if (processingRef.current) return;
    if (question === lastQRef.current) return;
    lastQRef.current = question;
    processingRef.current = true;
    setDetectedQ(question);
    if (settings.autoClear) setAnswer("");
    setStatus("processing");
    try {
      const ans = await getAIAnswer({
        question,
        resumeText: context.resumeText,
        jobDesc: context.jobDesc,
        specialInstructions: context.instructions,
        answerLength: settings.answerLength,
        apiKey: settings.apiKey,
        language: settings.language,
        model: settings.model || "gemini-1.5-flash",
      });
      setAnswer(ans);
      setStatus("ready");
      setHistory(p => [...p, { question, answer: ans, time: new Date().toLocaleTimeString() }]);
    } catch {
      setAnswer("Connection error. Check network.");
      setStatus("error");
    } finally {
      processingRef.current = false;
      setTimeout(() => setStatus(isListeningRef.current ? "listening" : "idle"), 3000);
    }
  }, [context, settings]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("nosupport");
      setAnswer("Speech recognition not supported. Use Chrome on Android or Desktop.");
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = settings.language || "en-US";
    rec.onstart = () => { setStatus("listening"); setIsListening(true); };
    rec.onend = () => { 
      if (isListeningRef.current) {
        setTimeout(() => {
          try { if (isListeningRef.current) rec.start(); } catch(e) {}
        }, 300);
      }
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      console.error("SR Error:", e.error);
      if (isListeningRef.current) {
        setTimeout(() => {
          try { rec.start(); } catch {}
        }, 1000);
      }
    };
    rec.onresult = (event) => {
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        event.results[i].isFinal ? (final += t + " ") : (interim += t);
      }
      const display = (transcriptRef.current + final + interim).slice(-400);
      transcriptRef.current = (transcriptRef.current + final).slice(-800);
      setTranscript(display);
      
      if (final.trim() && isQuestion(final.trim(), settings.sensitivity)) {
        handleQuestion(final.trim().replace(/\s+/g, " "));
      }
    };
    recognitionRef.current = rec;
    rec.start();
  }, [handleQuestion]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setStatus("idle");
  }, []);

  const clearScreen = useCallback(() => {
    setTranscript("");
    setDetectedQ("");
    setAnswer("");
    transcriptRef.current = "";
    lastQRef.current = "";
    setStatus(isListeningRef.current ? "listening" : "idle");
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return {
    status,
    transcript,
    detectedQ,
    answer,
    isListening,
    history,
    setHistory,
    startListening,
    stopListening,
    clearScreen,
  };
}
