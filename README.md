# Sprout 🌱

**Early child development screening for Autism (ASD), ADHD, and Dyslexia — powered by AI.**

Sprout helps parents identify early signs of neurodevelopmental conditions in children using clinically validated questionnaires and AI-generated insights. Results are delivered in under 10 minutes with a downloadable PDF report.

> ⚠️ Sprout is a screening tool only. It does not provide a medical diagnosis. Always consult a qualified healthcare professional.

---

## Features

- **3 validated screenings** — M-CHAT-R/F (Autism), Vanderbilt Scale (ADHD), BDA Checklist (Dyslexia)
- **AI-generated reports** — personalised summaries powered by Groq (Llama 3.1), with Gemini and OpenRouter as fallbacks
- **Downloadable PDF reports** — full domain breakdown, risk score, observations, next steps
- **Secure by default** — Firebase Auth, server-side token verification, Firestore security rules, rate limiting
- **Email verification** — required before saving screenings
- **Session-cached dashboard** — instant load with background refresh
- **Delete with confirmation** — permanent deletion with privacy notice

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Firebase (Auth, Firestore) |
| AI | Groq → Gemini → OpenRouter (fallback chain) |
| PDF | jsPDF |
| Deployment | Vercel + Firebase |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/sprout.git
cd sprout/autiscan
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the `autiscan` directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Admin (server-side token verification)
# Get from Firebase Console → Project Settings → Service Accounts → Generate new private key
# Paste the entire JSON minified on one line
FIREBASE_SERVICE_ACCOUNT_KEY=

# AI providers
GROQ_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
```

### 3. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore Database** (start in test mode)
4. Deploy security rules:

```bash
npx firebase login
npx firebase deploy --only firestore:rules --project your-project-id
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

```bash
npx vercel --prod
```

Add all `.env.local` variables to your Vercel project's environment variables. Update `NEXT_PUBLIC_APP_URL` to your production domain.

---

## Screening Tools Used

| Condition | Tool | Age Range | Questions |
|---|---|---|---|
| Autism (ASD) | M-CHAT-R/F | 16–48 months | 20 |
| ADHD | Vanderbilt Assessment Scale | 4–12 years | 18 |
| Dyslexia | BDA Checklist | 5–12 years | 15 |

---

## Security

- Firebase ID token verified server-side on every API call
- Firestore rules enforce schema validation, field whitelisting, and email verification
- Rate limiting: 60 req/min per IP, 20 req/min per user
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- API keys never exposed to the browser

---

## Disclaimer

Sprout is intended for informational and screening purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the guidance of a qualified healthcare provider with any questions you may have regarding your child's development.

---

Built by [Raunak Singh](https://github.com/raunaksingh2005)
