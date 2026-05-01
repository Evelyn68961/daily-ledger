# Daily Ledger — Technical Spec

The contract between the React frontend, the Express backend, and the
SQLite database. Use this as the source of truth when adding features
or refactoring.

---

## Data model

### `entries` table

The single table that holds all user data.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY` | UUID, generated server-side |
| `type` | `TEXT NOT NULL` | `'expense'` or `'income'` (CHECK constraint) |
| `amount` | `REAL NOT NULL` | always positive; sign comes from `type` |
| `date` | `TEXT NOT NULL` | `YYYY-MM-DD`, the day the entry happened |
| `category` | `TEXT NOT NULL` | a label from the active language at entry time |
| `note` | `TEXT NOT NULL DEFAULT ''` | optional free text |
| `created_at` | `INTEGER NOT NULL` | Unix seconds, when the row was inserted |

Indexed on `date` for the date-range filters used in tracker and analyze.

### Categories

Stored as plain strings — whatever the user had selected in their UI
language at the time of entry. Both languages are valid and coexist.

| Index | Expense (zh) | Expense (en) | Income (zh) | Income (en) |
| --- | --- | --- | --- | --- |
| 0 | 飲食 | Food | 薪資 | Salary |
| 1 | 交通 | Transport | 獎金 | Bonus |
| 2 | 購物 | Shopping | 投資 | Investment |
| 3 | 娛樂 | Leisure | 副業 | Side gig |
| 4 | 居住 | Housing | 其他 | Other |
| 5 | 醫療 | Medical | — | — |
| 6 | 其他 | Other | — | — |

`app/src/i18n.js#catIndexFor(type, category)` resolves either language
back to a stable index. That index is what the UI uses to look up icons,
plant SVGs, and chart colors — so a row created in zh with `飲食` and a
row created in en with `Food` are visually identical.

---

## API contract

Base URL is `/api`. In production the browser hits Vercel, which
rewrites `/api/*` to the Railway-hosted Express server. In dev Vite
proxies the same prefix to `localhost:3001`.

All requests and responses are JSON. Errors return non-2xx status with a
`{ "error": "<message>" }` body.

### `GET /api/entries`

List all entries, newest first.

```
HTTP/1.1 200 OK
[
  { "id": "0d9...", "type": "expense", "amount": 850, "date": "2026-05-12", "category": "飲食", "note": "lunch" },
  ...
]
```

### `POST /api/entries`

Create a new entry. Server generates the `id`.

**Request:**
```json
{ "type": "expense", "amount": 850, "date": "2026-05-12", "category": "飲食", "note": "lunch" }
```

**Response:** `201 Created` with the saved entry (including its new `id`).

**Validation:**
- `type` must be `'expense'` or `'income'`
- `amount` must be a number
- `date` must match `^\d{4}-\d{2}-\d{2}$`
- `category` must be a non-empty string

### `PATCH /api/entries/:id`

Update specific fields on an entry.

**Request:** any subset of `{ type, amount, date, category, note }`.

**Response:** `200 OK` with the full updated entry, or `404` if `id`
doesn't exist.

### `DELETE /api/entries/:id`

Delete an entry.

**Response:** `204 No Content`, or `404` if `id` doesn't exist.

---

## Architecture

```
Browser
  ↓ https://daily-ledger.vercel.app/...
Vercel
  ├── serves React build (app/dist/...)
  ├── /api/(.*)       → forwarded server-side to Railway
  └── /(non-file)     → /index.html  (SPA routing)
                            ↓
                      Railway
                        ├── Node + Express (server/src/index.js)
                        ├── PORT provided by Railway (server reads it)
                        └── /app/data/data.db (SQLite on persistent volume)
```

### Why this shape

- **Same-origin in the browser.** Vercel proxies `/api/*` rather than
  the frontend hitting Railway directly. That sidesteps CORS entirely
  and matches the dev setup (Vite proxy), so the same `storage.js` code
  works in both environments without env-specific URLs.
- **SQLite on a volume, not Postgres.** This is a personal-scale,
  single-writer app. SQLite + a Railway volume is plenty, and avoids
  managing a separate database service. If multi-region or high
  concurrency ever matters, swap the body of `server/src/db.js` to
  `pg` — the API stays identical.
- **TanStack Query for data fetching.** Chosen so components were
  written against `{ data, isLoading, error }` from day one, when the
  app still used localStorage. The localStorage→fetch swap touched only
  `storage.js` and changed zero component code.
- **CSS Modules per component.** Trades a few extra files for scoped
  class names that can't collide across pages. See "Specificity gotcha"
  below.

---

## Frontend conventions

### Where data goes

- **Server-backed:** `entries` (the only thing in SQLite). Always
  accessed via `useEntries`, `useAddEntry`, `useUpdateEntry`,
  `useDeleteEntry` in `app/src/hooks/useEntries.js`. Never hit
  `storage.js` directly from a component — go through the hooks.
- **localStorage (UI state, not user data):**
  - `daily_ledger_lang_v1` — `'zh'` or `'en'`
  - `daily_ledger_type_v1` — last-selected type on the entry form
  - `daily_ledger_migrated_v1` — flag set after the one-time
    localStorage→backend migration

### Bilingual handling

`app/src/i18n.js` exports `I18N[lang]` (every UI string) and
`catIndexFor(type, category)`. Components read `t = I18N[lang]` from
`useLang()`. Category names in stored entries can be in either
language — always run them through `catIndexFor` before using them to
look up an icon, plant, or chart color.

### Specificity gotcha (CSS Modules)

A naive pattern like:

```css
.parent button { background: transparent; }    /* 0,1,1 */
.modifier      { background: var(--card); }    /* 0,1,0 — loses */
```

…will silently break active states because the descendant selector wins
on specificity. Always chain modifiers under their container:

```css
.parent button.modifier { background: var(--card); }   /* 0,2,1 — wins */
```

This bit us on the type toggle and lang switch (commit `21fb80a`).

### Mutations and optimistic updates

`useAddEntry` and `useDeleteEntry` apply optimistic updates so the UI
feels instant. **Do not fire mutations in parallel** for the same query
key — the optimistic-update reads of the cache race and intermediate
entries get dropped. For batch operations like Load Sample, await each
mutation sequentially:

```js
for (const s of samples) {
  await addEntry.mutateAsync(s);
}
```

### Sample data dates

`buildSampleDates(count)` in `FootBar.jsx` distributes dates across the
**current calendar month** rather than walking back N days from today.
Going N days back fails badly on day 1 of the month, where every offset
crosses into the previous month and the garden/analyze page show empty.

---

## Backend conventions

### Environment variables

| Name | Purpose | Default |
| --- | --- | --- |
| `PORT` | port to listen on | `3001` (Railway sets this automatically) |
| `DB_PATH` | path to SQLite file | `<server>/data.db` for local dev |
| `CORS_ORIGIN` | comma-separated allowed origins | regex matching `http://localhost:*` |

In production on Railway, `CORS_ORIGIN` doesn't strictly need to be set
because Vercel proxies server-side and the browser never hits Railway
directly. Set it as defense-in-depth if you ever expose the API to a
non-Vercel client.

### Schema migrations

There aren't any yet — the schema in `server/src/db.js` runs `CREATE
TABLE IF NOT EXISTS` on every startup. If the schema changes in a
backwards-incompatible way, add a numbered migration step before the
`CREATE TABLE` (or switch to a migrations library like `umzug`).

### Backups

Currently none. The Railway volume is the only place production entries
exist. Options when this matters:
- Manual: `railway run sqlite3 /app/data/data.db .dump > backup.sql`
- Continuous: [Litestream](https://litestream.io/) replicates the
  SQLite file to S3-compatible storage. Add as a sidecar process or
  switch to a host that supports it.

---

## Non-goals (for now)

- **Auth / multi-user.** The app is single-tenant by design. Anyone with
  the URL sees and edits the same data. If this changes, add an auth
  layer in front of `server/` and scope `entries` rows by user id.
- **Real-time sync.** No WebSockets or SSE. If you open the app in two
  tabs, changes in one don't appear in the other until refresh.
- **Offline mode.** The original PWA worked offline; the React port
  does not. Backend down = app down, by design.
- **Server-side rendering.** Vite produces a static SPA shell. The
  empty `index.html` shipped to the browser is a feature: it loads
  fast and keeps deployment simple.
