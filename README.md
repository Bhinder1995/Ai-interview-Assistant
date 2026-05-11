# AI Interview Assistant (Gemini Edition)

A silent, real-time AI-powered interview helper that listens passively and instantly shows short readable answers on your screen. Optimized for Gemini 1.5 Flash.

## Quick Setup

1.  **Get a Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/) and get a free API key.
2.  **Chrome on Android**: Use Chrome on Android or Desktop for the best speech recognition experience.

## Install & Run

```bash
npm install
npm run dev
```

Then open on your device: `http://YOUR_COMPUTER_IP:3000`

## Configuration

1.  Open **Settings** in the app.
2.  Paste your **Gemini API Key**.
3.  Go to **Interview Context** to upload your Resume and JD.

## Features

- **Multimodal Extraction**: Upload PDF/Image resumes and Gemini extracts the text automatically.
- **Continuous Listening**: Passive microphone monitoring with auto-question detection.
- **Hinglish Support**: Specifically tuned to detect questions in mixed Hindi/English.
- **Adjustable Sensitivity**: Control how aggressively the AI detects questions.
- **Stealth Design**: Minimalistic, high-contrast UI for quick reading.
- **Copy to Clipboard**: Quick copy button for sharing or saving answers.

## Tech Stack

- **Frontend**: Vite + React
- **Styling**: Vanilla CSS (Glassmorphism 2.0)
- **AI**: Google Gemini 1.5 Flash
- **PWA**: Installable as a standalone app on mobile.
