> NOTE: Please make sure to CLONE(NOT FORK) this repo and create a new repo in your Github. DO NOT submit a PR in this repo.


# Full Stack Developer Quiz App Test — Cosmic Animal Personality Quiz

A minimal but functional quiz app built with Next.js 15, Payload CMS (Postgres), and Tailwind CSS v4.

## Tech Stack

- **Next.js 15** — App Router, SSG page + Server Actions
- **Payload CMS 3.x** — headless CMS with Postgres adapter
- **PostgreSQL** — via Neon (cloud) or Docker locally
- **Tailwind CSS v4** — cosmic dark theme, no config file needed

---

## Quick Start

### 1. Clone the repo and install dependencies

```bash
git clone <your-repo-url>
cd test-full-stack-web-cms
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Then edit `.env` with your actual Postgres credentials:

```env
# For Neon (cloud):
DATABASE_URI=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require

# For local Postgres or Docker:
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/cosmic_quiz

PAYLOAD_SECRET=some-secret-at-least-32-chars-long
ENCRYPTION_SHIFT=3
```

### 3. (Optional) Start Postgres with Docker

If you don't have a local Postgres, use the included Docker setup:

```bash
docker compose up -d postgres
```

### 4. Run the dev server

```bash
npm run dev
```

App is at `http://localhost:3000`
Payload admin is at `http://localhost:3000/admin`

### 5. Seed the quiz questions

On first run, seed the 10 questions into the database:

```bash
# Windows PowerShell:
$env:NODE_ENV='production'; npx payload run src/scripts/seed-questions.ts

# Mac/Linux:
NODE_ENV=production npx payload run src/scripts/seed-questions.ts
```

> **Why `NODE_ENV=production`?** Neon Postgres doesn't allow dropping NOT NULL constraints on primary key columns. Payload's dev mode tries to do this via `pushDevSchema`. Setting production mode skips that and uses the already-migrated schema.

This is idempotent — safe to run multiple times, skips if questions already exist.

---

## How to Access Payload Admin

1. Open `http://localhost:3000/admin`
2. On first visit, Payload will prompt you to create an admin user (email + password)
3. Once logged in, you'll see **Questions** and **Quiz Results** in the sidebar
4. You can add/edit/delete questions from the admin UI — changes reflect immediately in the app

The `DATABASE_URI` in your `.env` determines which Postgres database Payload uses.

---

## Test Data

The quiz uses 10 questions about cosmic personality. Run the seed script (step 5 above) to populate them, or add them manually through the Payload admin.

<details>
<summary>📦 Sample Quiz JSON (already in seed script)</summary>

See `src/scripts/seed-questions.ts` for the full question data.

</details>

---

## User Journey

1. **Take the quiz** — 10 questions, options shuffled randomly each time
2. **See your result** — cosmic animal label + score breakdown table
3. **Save (optional)** — enter email + notes; notes are encrypted in the DB
4. **Retrieve past results** — enter email to look up any saved result

---

## Scoring Logic

| Score Range | Result |
|-------------|--------|
| 0–6  | 🌙 Mooncat — Mysterious, calm, and observant. |
| 7–14 | 🦊 Solar Fox — Clever, curious, and adaptable. |
| 15–22 | 🐻 Cosmic Bear — Grounded, strong, and thoughtful. |
| 23–30 | 🐉 Galactic Dragon — Wild, bold, and unstoppable. |

> Easter egg: score exactly **13** → special message 🎉

---

## Architecture Notes

### Why SSG for the quiz page?
Questions rarely change. Fetching them at build time via `export const dynamic = 'force-static'` means the page serves instantly. In dev mode, Next.js re-fetches on each request so changes show up immediately.

### Why Server Actions instead of API routes?
Server Actions are the idiomatic Next.js 15 way to handle form mutations. They keep the backend logic close to the UI, avoid boilerplate, and work seamlessly with `useTransition` for non-blocking saves.

### How does the notes encryption work?
Payload CMS supports field-level hooks. The `notes` field on `QuizResults` runs:
- `beforeChange` hook → `encrypt(notes)` → encrypted string saved to DB
- `afterRead` hook → `decrypt(notes)` → plain text returned to app/admin

The cipher is a Caesar shift (charCode + 3) as specified in the task README.

### Why is the option shuffling client-side?
Options are shuffled in a `useMemo` with a seeded Fisher-Yates algorithm. The seed is generated once on mount (`useState(() => Math.random())`), so:
- Each quiz session has a unique shuffle
- The order is stable across re-renders (no SSR mismatch)
- Taking the quiz again generates a fresh seed (via `handleRestart`)

---

## Running Tests

```bash
# Unit tests — scoring logic + encryption (no DB needed)
npm run test:int

# E2E tests — requires dev server running on :3000
npm run test:e2e
```

---

## Notes (2-hour constraint)

If the implementation took longer than 2 hours, see `NOTES.md` for a reflection on what was prioritized, what was skipped, and what I'd improve.
