# AI Interview Assistant

A silent, real-time AI-powered interview helper that listens passively and instantly shows short readable answers on your phone screen.

## Quick Setup

See the included `SETUP-GUIDE.pdf` for full step-by-step instructions with screenshots.

## Requirements

- Node.js 18+ installed on your computer
- Anthropic API key (get from console.anthropic.com)
- Chrome browser on Android (for speech recognition)

## Install & Run

```bash
npm install
npm start
```

Then open on your phone: `http://YOUR_COMPUTER_IP:3000`

## Add Your API Key

Open `src/App.jsx` — find this line and replace with your key:

```
"x-anthropic-api-key": "YOUR_API_KEY_HERE"
```

## Features

- Continuous microphone listening
- Auto-detects interview questions
- Resume upload (PDF or image)
- Job description context (paste or upload)
- Special instructions for personalized answers
- Answer history
- Settings: font size, answer length, sensitivity
- No audio output — 100% silent text display
"# Ai-interview-Assistant" 
