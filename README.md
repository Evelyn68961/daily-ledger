# Daily Ledger

### a tiny garden for your money · 為你的金錢種一座花園

A gentle companion for daily bookkeeping. Every expense is a seed; day by
day, they grow into a financial garden of your own.

**Live:** https://daily-ledger.vercel.app

---

## What it is

A bilingual personal-finance tracker with three pages:

- **Tracker** — log income and expenses, browse recent entries, watch the
  monthly garden grow.
- **Analyze** — category doughnut with center total, category ranking,
  daily spending trend, top expenses, summary stats, and
  period-over-period comparison — all filtered by date range.
- **About** — the philosophy behind the product, a three-step guide,
  feature highlights, and a privacy note.

## The garden

The headline piece. Each expense in the viewed month plants something on
the ground line of the Tracker page:

| Category | Chinese | Plant |
| --- | --- | --- |
| Food | 飲食 | Leafy vegetable |
| Transport | 交通 | Cypress |
| Shopping | 購物 | Tulip |
| Leisure | 娛樂 | Daisy |
| Housing | 居住 | Oak |
| Medical | 醫療 | Mushroom |
| Other | 其他 | Clover shrub |

Plant size scales with the amount — a quick lunch is a sprig, rent is a
full-grown tree. Taller silhouettes render behind smaller ones, so the
garden reads as a scene rather than a chart. Tap any plant to see the
entry behind it. Use the ‹ › arrows above the garden to browse past
months.

## Stack

- **Frontend** — React 19 + Vite, CSS Modules, TanStack Query for data,
  React Router for pages, Chart.js for analyze. Deployed on **Vercel**.
- **Backend** — Express 5 + better-sqlite3 (ESM Node). Deployed on
  **Railway** with a mounted volume so the SQLite file survives
  redeploys.
- **Routing in production** — Vercel rewrites `/api/*` to the Railway
  backend so the browser always uses same-origin URLs (no CORS).

```
Browser
  ↓ https://daily-ledger.vercel.app
Vercel — serves React, rewrites /api/* to Railway
  ↓
Railway — Express server + /app/data/data.db (SQLite on volume)
```

## Project structure

```
daily-ledger/
├── app/                 React+Vite frontend
│   ├── src/
│   │   ├── components/  one .jsx + .module.css per UI block
│   │   ├── pages/       TrackerPage, AnalyzePage, AboutPage
│   │   ├── plants/      one component per garden plant
│   │   ├── hooks/       TanStack Query hooks
│   │   ├── storage.js   the only file that knows about the backend
│   │   ├── i18n.js      bilingual copy + catIndexFor
│   │   └── ...
│   └── public/          favicons
├── server/              Express + SQLite backend
│   └── src/
│       ├── index.js     CRUD routes
│       └── db.js        SQLite connection + schema
└── vercel.json          build command + /api proxy rewrite
```

The `static-original` git branch preserves the original pre-React static
HTML version of the project.

## Develop locally

You'll need Node 22+.

**Backend:**
```bash
cd server
npm install
npm run dev          # listens on http://localhost:3001
```

**Frontend** (in a separate terminal):
```bash
cd app
npm install
npm run dev          # opens http://localhost:5173 (or next free port)
```

Vite proxies `/api/*` to the local Express server, so `storage.js` makes
same-origin requests in both dev and production.

The local backend writes to `server/data.db` by default. Set the
`DB_PATH` env var to override.

## Deploy

**Frontend (Vercel):**
- Connect the GitHub repo
- Vercel reads `vercel.json` automatically; no extra config needed
- The rewrite in `vercel.json` points at the Railway backend URL — update
  it if you redeploy to a different host

**Backend (Railway):**
- New project from GitHub repo
- Settings → Source → **Root Directory:** `server`
- Variables → `DB_PATH=/app/data/data.db`
- Volumes → mount path `/app/data` (essential — SQLite data lives here)
- Settings → Networking → Generate Domain (port `8080`)

See [`SPEC.md`](SPEC.md) for the full data model, API contract, and key
design decisions.

---

Designed & built with care.
