# N.O.V.A — Neural Operative Virtual Assistant

## Project Structure

Your project folder should look like this:

```
nova-agent/
├── app/
│   ├── layout.jsx       ← copy layout.jsx here
│   ├── page.jsx         ← copy page.jsx here
│   └── nova.jsx         ← copy nova.jsx here
├── package.json         ← copy package.json here
├── next.config.js       ← copy next.config.js here
└── .env.local           ← create this from .env.local.example
```

---

## Setup (one time)

### 1. Create the project folder
```bash
mkdir nova-agent
cd nova-agent
mkdir app
```

### 2. Copy all files into place
- `package.json`       → nova-agent/
- `next.config.js`     → nova-agent/
- `layout.jsx`         → nova-agent/app/
- `page.jsx`           → nova-agent/app/
- `nova.jsx`           → nova-agent/app/

### 3. Create your .env.local
```bash
cp .env.local.example .env.local
```
Fill in your keys in `.env.local`

### 4. Install dependencies
```bash
npm install
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Option B — GitHub (recommended)
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add environment variables in Vercel dashboard:
   - NEXT_PUBLIC_ANTHROPIC_KEY
   - NEXT_PUBLIC_ELEVENLABS_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy

---

## Supabase Setup (for memory)
1. Go to supabase.com → New Project
2. SQL Editor → New Query
3. Paste contents of `nova_supabase_setup.sql` → Run
4. Settings → API → copy Project URL + anon public key
5. Add those to your .env.local and Vercel env vars

---

## API Keys needed
| Service | Where to get it | Used for |
|---|---|---|
| Anthropic | console.anthropic.com | NOVA's brain |
| ElevenLabs | elevenlabs.io → Developers → API Keys | NOVA's voice |
| Supabase | supabase.com → Settings → API | NOVA's memory |
