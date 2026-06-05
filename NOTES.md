NOTE: Please make sure to CLONE this repo and create a new repo in your Github. DO NOT submit a PR in this repo.

If you spent more than 2 hours — or didn't finish everything — that's totally fine. This test is meant to see how you think and approach real-world tasks.

We'd love for you to take a moment to reflect and share your process.

---

### ✍️ My Approach

**What I focused on first, and why:**
- Started with infrastructure: connecting Payload CMS to Postgres (Neon) via the `DATABASE_URI`. Without a working DB, nothing else matters.
- Set up the two collections (`Questions`, `QuizResults`) early — they define the data shape everything else depends on.
- Implemented the encryption hooks next since they're the trickiest part and failing silently would be hard to debug later.
- Built the frontend components last, working from data → logic → UI.

**What I intentionally skipped or postponed:**
- Full auth on the quiz results endpoint. Results are publicly readable by design (email lookup requires knowing the email). In production I'd add rate limiting or a lookup token.
- Pagination on the history view — the spec only asks for the most recent result, so I limited to 1 doc.
- A more robust cipher. The Caesar cipher is exactly what the README spec asked for. In production I'd use AES-256 or Node's `crypto.createCipheriv`.

**Any challenges or confusing parts:**
- The project template defaults to MongoDB in `docker-compose.yml` and `.env.example`, but the task requires Postgres. Switching was straightforward but easy to miss.
- `payloadCloudPlugin` in the starter config causes silent issues locally — I removed it from the config (kept the package dependency in case it's needed later).
- Tailwind v4 has no `tailwind.config.js` — it uses `@import 'tailwindcss'` in CSS. The starter already had this right, but it's an easy trip-up if you're used to v3.

**What I'd improve with more time:**
- Proper AES encryption for the notes field instead of Caesar cipher.
- A shareable result link (`/results/[id]`) so users can share their cosmic animal.
- Admin-editable score ranges (currently hardcoded in `scoring.ts`).
- Better error UX — toast notifications instead of inline text.
- Add the quiz title as a CMS-editable global instead of hardcoding it.

**Architectural choices:**
- SSG for the quiz page (`force-static`): questions don't change often, so serving a static page is faster and cheaper.
- Server Actions over API routes: Next.js 15's idiomatic way to handle mutations, less boilerplate, better DX.
- Client-side option shuffle via seeded Fisher-Yates in `useMemo`: prevents SSR hydration mismatch while giving a fresh random order each quiz session.
- Singleton Payload client in `src/lib/payload.ts`: prevents multiple Payload instances during Next.js hot reload in dev.

---

## 🤖 AI Tool Usage

I used Claude (Anthropic) to help scaffold and implement this. Here's roughly what I asked for:

1. **Architecture planning** — "Given this Next.js + Payload CMS starter and these requirements, design a clean folder structure and data flow."
2. **Collection schemas** — "Write a Payload CMS collection for quiz questions with 4 options each and a QuizResults collection with encrypted notes field via hooks."
3. **Server Actions** — "Write a saveQuizResult and getResultByEmail server action using the Payload local API."
4. **CSS** — "Write a cosmic dark-theme CSS with glassmorphism cards, purple/blue gradient accents, and mobile-first layout."

I reviewed and adjusted all generated code for correctness, style consistency, and task requirements alignment.
