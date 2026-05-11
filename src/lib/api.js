// ── Constants ─────────────────────────────────────────────────────
const QUESTION_KEYWORDS = [
  "what is","what are","what was","what were","what do","what would","what should",
  "how do","how does","how did","how would","how can","how have",
  "why do","why does","why did","why is","why are","why would",
  "explain","describe","tell me","can you","could you","walk me",
  "difference between","define","give me","have you","do you","would you",
  "when do","when did","when would","where do","who do","which",
  // Hindi/Hinglish
  "kya","kaise","kyu","kyon","batao","samjhao","difference kya hai",
  "can you tell","pucha","bolna","kya hai",
];

export function isQuestion(text, sensitivity = "medium") {
  if (!text || text.trim().length < 5) return false;
  
  const threshold = sensitivity === "low" ? 15 : sensitivity === "high" ? 5 : 8;
  if (text.trim().length < threshold) return false;

  const lower = text.toLowerCase().trim();
  if (lower.endsWith("?")) return true;
  
  return QUESTION_KEYWORDS.some(kw => lower.includes(kw));
}

// ── File → Base64 ─────────────────────────────────────────────────
export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

// ── Extract text from file via Gemini multimodal ─────────────────
export async function extractTextFromFile(file, apiKey) {
  if (!apiKey) throw new Error("API Key missing");
  const base64 = await fileToBase64(file);
  const mediaType = file.type === "application/pdf" ? "application/pdf" : file.type;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Extract and return all text content from this document. Return only the raw text, nothing else." },
          { inlineData: { mimeType: mediaType, data: base64 } }
        ]
      }]
    })
  });
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

// ── AI Answer Generator ───────────────────────────────────────────
export async function getAIAnswer({ question, resumeText, jobDesc, specialInstructions, answerLength, apiKey, language }) {
  if (!apiKey) return "Please set your Gemini API Key in Settings.";
  
  const lengthInstruction = answerLength === "short"
    ? "Answer in 1-2 sentences. Be extremely concise."
    : answerLength === "medium"
    ? "Answer in 2-4 sentences. Clear and complete."
    : "Answer in 4-6 sentences. Thorough but punchy.";

  const langInstruction = language === "hi-IN" 
    ? "The interview might be in Hindi or Hinglish (Hindi + English). Understand Hindi perfectly, but provide your answer in English (unless the question specifically asks for a Hindi response)."
    : "The interview is in English.";

  let systemPrompt = `You are a silent real-time interview assistant helping a candidate answer interview questions live.

${langInstruction}

ANSWER RULES:
- ${lengthInstruction}
- Write naturally like a confident human — NOT like an AI
- No markdown formatting, no bullet points
- No filler phrases like "Great question!" or "Certainly!"
- Technical questions: precise and professional
- HR/behavioral questions: warm, confident, genuine
- Output ONLY the answer text. No preamble.`;

  if (resumeText) {
    systemPrompt += `\n\nCANDIDATE BACKGROUND:\n${resumeText}`;
  }

  if (jobDesc) {
    systemPrompt += `\n\nJOB DESCRIPTION:\n${jobDesc}`;
  }

  if (specialInstructions) {
    systemPrompt += `\n\nSPECIAL INSTRUCTIONS:\n${specialInstructions}`;
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: `Answer this interview question:\n\n"${question}"` }]
      }]
    })
  });

  const data = await response.json();
  if (data.error) return `API Error: ${data.error.message}`;
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Unable to generate answer.";
}
