# SecondPath

**Your Second Chance Starts Here.**

SecondPath is an AI-powered expungement guidance platform that helps people navigate the record-clearing process without needing a lawyer. Built for the Black Tech Community at Blackathon 2026.

🔗 **Live Demo:** [secondpath-beta.vercel.app](https://secondpath-beta.vercel.app)

<img width="675" height="704" alt="image" src="https://github.com/user-attachments/assets/cd0860f0-a895-4ce9-8409-ed4eaf87400a" />
<img width="675" height="704" alt="image" src="https://github.com/user-attachments/assets/4838f95a-0171-48bb-929d-f7a527642284" />
<img width="675" height="704" alt="image" src="https://github.com/user-attachments/assets/cf0dc840-c518-4d9c-a733-c58374d68fa7" />
<img width="675" height="704" alt="image" src="https://github.com/user-attachments/assets/52638910-615f-418e-8e9d-a8e8093f19ee" />

---

## The Problem

70 million Americans have a criminal record. 60% of those eligible to clear it never file — because the process is expensive, complex, and inaccessible. The average expungement attorney costs $3,000+.

SecondPath removes that barrier entirely.

---

## Features

- **AI Eligibility Check** — Claude determines whether you may qualify based on your state's laws, using plain-language intake questions
- **Auto-Fill Court Forms** — Official expungement documents pre-populated with your information, ready to print and file
- **Step-by-Step Filing Guide** — Personalized checklist including courthouse address, filing fees, and deadlines
- **Fair-Chance Job Board** — Connects cleared individuals with employers who actively hire people with records

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| AI Engine | Claude API (`@anthropic-ai/sdk`) |
| Document Generation | `pdf-lib` + `jspdf` |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/secondpath.git
cd secondpath

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Start the dev server
npm run dev
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## How It Works

1. **Select your state** — SecondPath knows the expungement laws for your jurisdiction
2. **Answer questions** — Plain-language AI intake conversation
3. **Get your verdict** — Eligible, not yet eligible, or borderline — always with an explanation
4. **Generate forms** — Official court documents auto-filled and ready to download
5. **File & track** — Personalized checklist to guide you through the rest

> ⚠️ SecondPath never says "you qualify" — only "you may be eligible." Every result includes a disclaimer and an optional referral to a Legal Aid attorney.

---

## Project Structure

```
secondpath/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Route pages
│   ├── lib/            # Claude API integration, form logic
│   └── assets/         # Static assets
├── public/
├── .env.example
└── vite.config.ts
```

---

## Judging Track

**Technology Solutions** — A technology-based solution to a real-world problem.

---

## Built At

Blackathon 2026 — Powered by BlackWPT

---

## Disclaimer

SecondPath provides general guidance only and is not a substitute for legal advice. Always verify eligibility with a licensed attorney before filing.
