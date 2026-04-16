# Daily Ledger

### a tiny garden for your money · 為你的金錢種一座花園

A gentle companion for daily bookkeeping. Every expense is a seed; day by
day, they grow into a financial garden of your own. Simple, private,
works offline.

---

## What it is

A three-page personal finance tool, designed and built as a self-contained
web experience. No account, no upload, no analytics — the ledger lives in
your browser and nowhere else.

- **Tracker** — log income and expenses, browse recent entries, watch the
  monthly garden grow.
- **Analyze** — a quiet view of where the money goes, with a category
  breakdown and a date-range filter.
- **About** — the story of the product and its four core ideas.

## Design language

- A warm, earthy palette: cream, sage green, clay. Nothing shouts.
- Typography pairs **Manrope** for Latin with **Noto Sans TC** for
  traditional Chinese — matched in weight and rhythm so bilingual copy
  reads as one voice.
- Small-caps eyebrow labels, italic accents, and hand-drawn SVG
  illustrations tuned to the palette.
- A single shared stylesheet guarantees every page feels the same to the
  pixel.

## The garden

The headline piece. Each expense this month plants something on the
ground line of the Tracker page:

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
entry behind it.

## Features at a glance

- **Bilingual** 中文 / English with a one-tap switch that remembers your
  choice across pages.
- **Twelve categories** (seven expense, five income), each with its own
  glyph that appears both in the entry form and in the history list.
- **Monthly summary** of income, expense, and balance at a glance.
- **Date-range filter** for both recent entries and the analysis chart.
- **CSV export** in one click — BOM-prefixed for clean Excel open, both
  in Traditional Chinese and English headers.
- **Load sample** button for an instant demo with realistic entries.
- **Offline-first.** Open the file, it just works — no install, no sync.

## Under the hood

Three static HTML pages (`index.html`, `analyze.html`, `about.html`)
share a single `styles.css` for the design system. Data lives in the
browser's `localStorage`, scoped per device. The only external dependency
is a CDN chart library used on the Analyze page. No build step, no server,
no framework — it deploys anywhere that serves static files.

## Try it

Open `index.html` in any modern browser. Click **載入範例 / Load sample**
to populate with example entries, or start a new garden with your first
real expense.

---

Case W2248 — designed & built with care.
