## Problem

The chatbot is hallucinating:
- Calls the company "MC Interactions" (wrong) instead of **Mission Career**.
- Invents an incorrect office address.

Root cause: the `SYSTEM_PROMPT` in `src/routes/api/chat.ts` hardcodes "MC Interactions" and gives the model no verified facts about the business, so it makes things up.

## Fix

Replace the system prompt with an accurate, fact-rich brief built from the actual website content. No DB/schema changes, no UI changes — only `src/routes/api/chat.ts`.

### Step 1 — Pull the source of truth from the site

Fetch the live site (https://ditto-craft-clone.lovable.app) and also read in-repo content sources so the facts match what visitors see:
- `src/components/sections/Footer.tsx` (address, phone, email already present: Kandivali East Mumbai, +91 9870003748, mcinteractions@gmail.com)
- `src/components/sections/Hero.tsx`, `About.tsx`, `Services.tsx`, `Destinations.tsx`, `Process.tsx`, `Contact.tsx`, `Success.tsx`, `Blog.tsx`
- `src/lib/default-stories.ts`, `src/lib/universities.ts`

Extract: official brand name (**Mission Career** / "Mission Career Education"), tagline, full office address, phone, email, list of services, supported destinations, process steps, hours (if listed), social links.

### Step 2 — Rewrite the system prompt in `src/routes/api/chat.ts`

New prompt will:
1. Set identity: "You are the Mission Career Assistant" — never say "MC Interactions".
2. Embed a **VERIFIED FACTS** block (name, address, phone, email, services, destinations, process) pulled verbatim from the site/footer.
3. Add a hard rule: *Never invent addresses, fees, deadlines, university stats, or contact details. If a fact is not in the VERIFIED FACTS block, say you'll connect them with a counselor.*
4. Keep the existing tone (warm, Hinglish-friendly, markdown, ~150 words) and the nudge to the free counseling form / +91 9870003748.

### Step 3 — Verify

- Open the chatbot, ask "What's your office address?" → should return the exact footer address.
- Ask "What's the company name?" → "Mission Career".
- Ask something not in the facts (e.g. "What's the fee for MS in USA at MIT?") → should decline and offer counseling instead of inventing.

## Files changed

- `src/routes/api/chat.ts` — only the `SYSTEM_PROMPT` constant.

## Out of scope

- No new tables, no RAG/embeddings, no scraping at runtime. Facts are baked into the prompt (simpler, instant, zero cost). If the site content changes substantially later, we update the prompt — happy to wire up a small admin-editable "bot facts" record in a follow-up if you want that.