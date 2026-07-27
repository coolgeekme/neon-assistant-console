# Neon Assistant Console

A neon-styled **personal assistant dashboard** PWA — built for Vercel.

Repurposes the "ops console" aesthetic for your real life: calendar preview,
email/assistant vitals, anomaly alerts, cron-job pulse, and a command log.
Ships with **mock data** so it runs immediately; swap `src/mockData.ts` for
live API calls (Hermes tools, Google Calendar, etc.) to make commands real.

## Stack
- Vite + React + TypeScript
- Tailwind CSS (neon dark theme)
- PWA: `manifest.webmanifest` + service worker (`public/sw.js`) for installable, offline-capable app

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build
```bash
npm run build      # outputs to dist/
npm run typecheck  # optional tsc --noEmit
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** this repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output dir `dist`. No env vars needed.
4. Deploy. The app is installable (Add to Home Screen) and works offline.

## Make it real (next steps)
- Replace `liveActivity()` / `sampleAnomalies` / `calendarPreview` in `src/mockData.ts`
  with fetches to your assistant's API.
- Wire the command input (`App.tsx` → `send()`) to actually dispatch to your agent.
