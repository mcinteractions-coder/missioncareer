## Add a floating AI chatbot to the website

A ChatGPT-style assistant that helps visitors with study-abroad queries (universities, courses, visa, costs, scholarships, MC Interactions services). Single ongoing conversation per user, persisted in Lovable Cloud, accessible from a floating bubble on every page.

### What the user will see

- A green WhatsApp-style floating chat bubble (bottom-right, above the existing FestivalPopup z-index) on every page.
- Click → opens a chat panel (Sheet/drawer) with a header "MC Interactions Assistant", message transcript, and a composer at the bottom.
- Assistant messages render with markdown (bold, lists, links).
- A streaming "Thinking…" shimmer while the model responds, then tokens stream in live.
- "New conversation" button in the header to clear and start fresh.
- Works without login (anonymous visitors get a browser-scoped session id stored in localStorage; signed-in admins get their user_id).

### Tech approach

- **AI**: Lovable AI Gateway via AI SDK (`ai`, `@ai-sdk/openai-compatible`). Default model `google/gemini-3-flash-preview`. `LOVABLE_API_KEY` already exists in secrets.
- **Backend**: TanStack server route at `src/routes/api/chat.ts` for streaming chat (uses `streamText` + `toUIMessageStreamResponse`). A `createServerFn` (`saveChatMessage`) persists messages after streaming finishes via `onFinish`.
- **DB**: New `chat_sessions` and `chat_messages` tables in Lovable Cloud, scoped by `session_key` (uuid stored in localStorage for anon users). Public insert/select policies scoped to `session_key` passed in queries (no PII; visitors can only see their own session because the key is the lookup).
- **UI**: AI Elements (`Conversation`, `Message`, `MessageResponse`, `PromptInput`, `Shimmer`) installed via `bun x ai-elements@latest add`. Uses `useChat` from `@ai-sdk/react` with `DefaultChatTransport` pointing to `/api/chat`.
- **System prompt**: Tuned for MC Interactions — study-abroad counseling, polite Hinglish-friendly tone, recommends booking a free counseling call (scrolls to #contact) when relevant.

### Files to add / change

- **New**: `supabase/migrations/<ts>_chat_tables.sql` — `chat_sessions`, `chat_messages` tables with grants + RLS.
- **New**: `src/lib/ai-gateway.server.ts` — Lovable AI Gateway provider helper.
- **New**: `src/routes/api/chat.ts` — streaming POST route, loads prior messages by `session_key`, calls `streamText`, saves on finish.
- **New**: `src/lib/chat.functions.ts` — `loadChatHistory`, `clearChatHistory` server functions.
- **New**: `src/components/ChatBot.tsx` — floating bubble + Sheet panel + `useChat` integration + markdown rendering.
- **New**: `src/components/ai-elements/*` — installed AI Elements primitives.
- **Edit**: `src/routes/__root.tsx` — mount `<ChatBot />` globally so it appears on every page.
- **Edit**: `package.json` (via `bun add`) — `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `zod` (if missing), `react-markdown`.

### Open question (optional)

You skipped the "purpose" question. I'll tune the system prompt for **MC Interactions study-abroad counseling** (universities, courses, visa, scholarships, costs, and nudging users to the free counseling form). Tell me if you want a different focus.

