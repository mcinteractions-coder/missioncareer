# Mission Career — Migration Guide (Lovable → Self-Hosted)

This project is built on Lovable but written so it can be moved to any host that supports Node/Edge SSR. Follow the steps below in order.

---

## TL;DR

| Concern        | On Lovable                   | After migration                                |
| -------------- | ---------------------------- | ---------------------------------------------- |
| Hosting        | Lovable (Cloudflare Workers) | Cloudflare Pages / Vercel / Netlify / Node     |
| Database + Auth| Lovable Cloud (managed)      | Your own Supabase project (free tier works)    |
| AI ChatBot     | Lovable AI Gateway           | Your OpenAI **or** Gemini API key              |
| Images / logos | Lovable CDN (`/__l5e/...`)   | Local `public/` folder (or your own CDN/R2)    |
| Domain         | Lovable handles DNS + SSL    | You manage DNS at registrar, host issues SSL   |

The code already supports all of this — no architectural changes needed.

---

## 1. Database & Auth (Supabase)

### 1a. Create your own Supabase project
1. Sign up at https://supabase.com (free tier is fine to start).
2. Create a new project. Note the **Project URL**, **anon/publishable key**, and **service_role key** (Settings → API).

### 1b. Export schema + data from Lovable Cloud
From the Lovable editor, go to **Cloud → Database → Tables**, select each table, and click **Export**. Or use `pg_dump` if you have the connection string from **Cloud → Settings**.

Tables currently in use:
- `chat_messages` (ChatBot history)
- `bookings`, `meetings`, `profiles`, `user_roles`, `stories` (check `src/integrations/supabase/types.ts` for the full list)

### 1c. Import into your Supabase project
```bash
psql "postgresql://postgres:[PASSWORD]@db.YOUR-PROJECT.supabase.co:5432/postgres" < dump.sql
```
Or use Supabase Studio → SQL Editor to paste the schema.

### 1d. Re-enable RLS policies
Lovable Cloud migrations live in `supabase/migrations/` — apply the same files to your new project via the Supabase CLI:
```bash
npx supabase link --project-ref YOUR-PROJECT-REF
npx supabase db push
```

### 1e. Configure Google OAuth (if used)
Authentication → Providers → Google → add your Google Cloud OAuth client ID + secret. Add redirect URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.

---

## 2. AI ChatBot

The chatbot now auto-selects a provider based on which env var is set (see `src/lib/ai-provider.server.ts`). Priority: **OpenAI → Gemini → Lovable**.

### To switch off Lovable AI:
1. Get an API key from one of:
   - OpenAI: https://platform.openai.com/api-keys
   - Google Gemini (free tier available): https://aistudio.google.com/apikey
2. Set the env var on your new host:
   ```
   OPENAI_API_KEY=sk-...
   # or
   GEMINI_API_KEY=...
   ```
3. Remove `LOVABLE_API_KEY` (it only works while on Lovable).

No code changes needed.

---

## 3. Images & Static Assets

Logos are referenced via `.asset.json` pointer files that load from Lovable's CDN (`/__l5e/assets-v1/...`). Those URLs **will keep working** even after migration as long as the assets aren't deleted from Lovable — but for true independence, do this:

### Option A — Move logos to `public/`
1. Download each asset from its CDN URL (open `src/assets/*.asset.json`, copy the `url` field, prepend `https://YOUR-LOVABLE-PROJECT.lovable.app`, and save).
2. Place into `public/` (e.g. `public/logo.png`).
3. Replace imports:
   ```ts
   // Before
   import logoAsset from "@/assets/mission-logo-transparent.png.asset.json";
   <img src={logoAsset.url} />

   // After
   <img src="/logo.png" />
   ```
4. Delete the `.asset.json` pointer files.

Files that currently use Lovable CDN assets:
- `src/components/IntroSplash.tsx`
- `src/components/sections/Navbar.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/Footer.tsx`

### Option B — Use your own CDN (Cloudflare R2, S3, etc.)
Upload the same files, replace URLs in the components above.

Team photos (`gautam-umashankar.png`, `pooja-welling.png`, etc.) are already bundled normal images in `src/assets/` — no migration needed.

---

## 4. Hosting

The app is built with **TanStack Start + Vite + Nitro** targeting Cloudflare Workers. It runs as-is on:

### Cloudflare Pages (recommended — same runtime as Lovable)
```bash
bun run build
npx wrangler pages deploy .output/public
```
Set env vars in Cloudflare dashboard → Pages → Settings → Environment variables.

### Vercel
```bash
npm i -g vercel
vercel
```
Vercel auto-detects TanStack Start. Add env vars in the project dashboard.

### Netlify
```bash
netlify deploy --build
```

### Self-hosted (Node)
Change Nitro preset in `vite.config.ts` to `node-server`, then:
```bash
bun run build
node .output/server/index.mjs
```

---

## 5. Environment Variables

Copy `.env.example` to `.env` and fill in. Required:

**Always:**
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (client)
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server)

**ChatBot (pick one):**
- `OPENAI_API_KEY` **or** `GEMINI_API_KEY` **or** `LOVABLE_API_KEY`

---

## 6. Domain (missioncareer.net)

Currently DNS points to Lovable. After deploying elsewhere:
1. Get the new host's target (e.g. Vercel's CNAME, or Cloudflare Pages domain).
2. At your DNS registrar, update the A/CNAME records.
3. New host will issue SSL automatically (Let's Encrypt / Cloudflare).
4. Allow up to 24h for propagation. Until then, both old and new might serve the site.

---

## 7. Things that WON'T migrate

- **Lovable editor / preview / version history** — that's tied to the platform.
- **Lovable AI Gateway free credits** — replace with your own paid API key.
- **Lovable Cloud free DB tier** — Supabase free tier is roughly equivalent.

---

## 8. Sanity checklist before going live

- [ ] New Supabase project has all tables + RLS policies
- [ ] Google OAuth redirect URL added to Supabase
- [ ] All env vars set on new host
- [ ] ChatBot replies with new AI key
- [ ] Admin login works (`/admin`)
- [ ] Booking form writes to DB
- [ ] Logos render (check Network tab — should be `/logo.png` not `/__l5e/...` if you went with Option A)
- [ ] `https://yourdomain.com` resolves with valid SSL
- [ ] Custom emails (if used) — reconfigure SMTP in Supabase Auth → Email

---

Questions or stuck on a step? Open an issue or ping support before flipping DNS.
