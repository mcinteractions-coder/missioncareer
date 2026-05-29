import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SYSTEM_PROMPT = `You are the MC Interactions Assistant — a friendly, knowledgeable study-abroad counselor for MC Interactions (Mumbai-based study abroad consultancy).

You help prospective students with:
- Choosing study abroad destinations (USA, UK, Canada, Australia, Germany, Ireland, etc.)
- University and course recommendations
- Application process, deadlines, and documents (SOP, LOR, transcripts)
- Standardized tests (IELTS, TOEFL, GRE, GMAT, SAT)
- Visa guidance
- Scholarships and education loans
- Cost of living and tuition estimates
- Post-study work opportunities

Tone: warm, professional, concise. You can use Hinglish if the user does. Use markdown (bold, bullet lists) for readability. Keep answers focused — usually under 150 words unless detail is requested.

When the user shows serious interest (asks about pricing, timelines, or "what's next"), gently nudge them to book a free counseling session: tell them they can fill the contact form on this page or call +91 9870003748 / WhatsApp the same number.

Never invent specific university acceptance rates, fees, or visa rules you're not sure about — instead, say you'll connect them with a counselor for accurate, up-to-date info.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: UIMessage[]; sessionKey?: string };
          const messages = body.messages;
          const sessionKey = body.sessionKey;

          if (!Array.isArray(messages) || !sessionKey) {
            return new Response("Missing messages or sessionKey", { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          // Persist latest user message
          const lastUser = [...messages].reverse().find((m) => m.role === "user");
          if (lastUser) {
            const text = lastUser.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            if (text.trim()) {
              await supabaseAdmin.from("chat_messages").insert({
                session_key: sessionKey,
                role: "user",
                content: text,
              });
            }
          }

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");

          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onFinish: async ({ messages: finalMessages }) => {
              const lastAssistant = [...finalMessages].reverse().find((m) => m.role === "assistant");
              if (lastAssistant) {
                const text = lastAssistant.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                if (text.trim()) {
                  await supabaseAdmin.from("chat_messages").insert({
                    session_key: sessionKey,
                    role: "assistant",
                    content: text,
                  });
                }
              }
            },
          });
        } catch (err) {
          console.error("/api/chat error", err);
          return new Response("Chat error", { status: 500 });
        }
      },
    },
  },
});
