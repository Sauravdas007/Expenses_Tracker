
# Expenses Tracker
# 💰 Expense Tracker App

<div align="center">

<a href="https://expenses-tracker-pi-seven.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/Try%20Demo-Expense%20Tracker-orange?style=for-the-badge&logo=vercel" alt="Expense Tracker Demo"/>
</a>

</div>
<img width="1918" height="1133" alt="Screenshot 2026-04-27 214043" src="https://github.com/user-attachments/assets/dbd1c0a8-836c-4275-8e14-0334efb45224" />

A small, production-upgradable, **Vercel-deployable** full-stack expense tracker built for the "As a user, I can record and review my personal expenses" assignment.

**Stack**: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Prisma · SQLite (dev) · Zod · Vitest

## Features

- ✅ **Add expense** — amount, category, description, date
- ✅ **List + filter by category**
- ✅ **Sort by date** (newest first) — default
- ✅ **Visible total** — sums the currently filtered list (shown in ₹, INR)
- ✅ **Mobile-friendly** — responsive layout, large touch targets
- ✅ **Dark, semi-bold, modern** UI with subtle grain + micro-interactions
- ✅ **Idempotent POST** via `Idempotency-Key` header — safe against double-clicks, retries, and refresh-after-submit
- ✅ **Money stored as integer paise** (minor units) — no floating-point drift
- ✅ **Client + server validation** (zod)
- ✅ **Loading & error states** with retry
- ✅ **Automated unit test** for money handling (Vitest)

## Quick start (local)

```bash
cd frontend
yarn install          # installs deps, runs prisma generate + db push
yarn test             # runs unit tests
yarn dev              # http://localhost:3000
```

The app is a single Next.js project at `/frontend`. SQLite DB lives at `frontend/prisma/dev.db`.

## API

### `POST /api/expenses`

**Body** (JSON):
```json
{
  "amount": "123.45",       // string or number; up to 2 decimals; > 0
  "category": "Food",
  "description": "Dinner",
  "date": "2026-01-15"      // YYYY-MM-DD
}
```

**Headers**: `Idempotency-Key: <client-generated-uuid>` *(optional but recommended)*

Returns the created expense (or the previously-created one on retry with the same key).

### `GET /api/expenses?category=Food&sort=date_desc`

Returns `{ items: ExpenseDTO[] }`. Both query params are optional; default sort is `date_desc`.

**Expense shape**:
```ts
{
  id: string;
  amount: "123.45";    // decimal string
  amountMinor: 12345;  // integer paise
  currency: "INR";
  category: string;
  description: string;
  date: "YYYY-MM-DD";
  createdAt: ISOString;
}
```

### `GET /api/health` → `{ ok: true }`

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel — framework auto-detected as Next.js.
3. **Set `DATABASE_URL`** environment variable (see next section).
4. Deploy.

### Production database (important)

SQLite is used in dev for zero-config ergonomics. **Vercel's serverless file system is ephemeral** — any writes to `dev.db` are lost between invocations. For production:

1. Create a Postgres DB (free: [Neon](https://neon.tech), [Vercel Postgres](https://vercel.com/storage/postgres), or Turso for SQLite-flavored).
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` on Vercel to the Postgres connection string.
4. Run `yarn prisma migrate deploy` once (or rely on `prisma db push` in build).

No app code changes needed — Prisma abstracts it.

## Key design decisions

- **Money as integer paise.** Floats are a well-known source of bugs in finance apps. All storage + math is in integer minor units; conversion happens at system boundaries (input parse, output format).
- **Idempotency key on POST.** The assignment explicitly calls out retries, refresh-after-submit, slow networks. The client generates one UUID per form attempt; the server stores a `(key → expenseId)` map. Duplicate requests get the original expense back with `200`, not a second row. Key rotates after success so the *next* expense is a new row.
- **Client-side optimistic insert** on create, but still refetches on filter/sort change. Keeps the UI snappy without risking stale totals.
- **Validation in two places** — the server's zod+Prisma is the source of truth, the client mirrors it only for UX.
- **Single-repo Next.js** chosen for simplest Vercel deploy, one hostname, no CORS. API routes co-located with UI.
- **Prisma + SQLite** chosen for dev-ergonomics; one env var swap migrates to Postgres for prod.
- **Stored `date` as `YYYY-MM-DD` string** instead of `DateTime` to avoid timezone-shift surprises — expenses are calendar-day events, not timestamps.
- **No auth / multi-user** — out of scope per spec; schema is ready to add a `userId` FK.

## Trade-offs (because of timebox)

- Only **one** automated test (money helpers). The idempotency logic, validation, and GET filter/sort would all benefit from integration tests in a real project.
- **No edit/delete** endpoints — not in acceptance criteria.
- **No pagination** — fine at N ≈ hundreds; would add `cursor` + `limit` at thousands.
- **No category taxonomy table** — categories are free-form strings. A real app would normalize them.
- **No rate limiting / auth** on the API.
- Using `prisma db push` (not `migrate`) — faster for the exercise; `migrate` is the correct choice for teams.

## Things I intentionally did NOT do

- Auth flows, user accounts, email
- Charts / analytics beyond the required total
- Offline / PWA
- Multi-currency support (schema has `currency` field ready, UI is INR-only)
- Server-side idempotency cleanup (records are tiny; in prod you'd TTL them)

## Project structure

```
frontend/
├── app/
│   ├── api/expenses/route.ts     # POST/GET handlers
│   ├── api/health/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # home
├── components/
│   ├── ExpenseTracker.tsx        # stateful container
│   ├── ExpenseForm.tsx           # idempotent create
│   ├── ExpenseList.tsx
│   ├── FilterBar.tsx
│   ├── SummaryBar.tsx
│   └── types.ts                  # shared client types + helpers
├── lib/
│   ├── prisma.ts                 # singleton client
│   ├── money.ts                  # paise ↔ rupees, INR format
│   ├── validation.ts             # zod schemas
│   └── dto.ts                    # Expense → API response shape
├── prisma/
│   └── schema.prisma
├── tests/
│   └── money.test.ts             # Vitest
└── vercel.json
```


