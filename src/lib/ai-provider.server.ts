import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Returns an AI provider + model id.
 *
 * Priority:
 *  1. OPENAI_API_KEY  -> OpenAI (gpt-4o-mini by default, override via OPENAI_MODEL)
 *  2. GEMINI_API_KEY  -> Google Gemini via OpenAI-compatible endpoint
 *  3. LOVABLE_API_KEY -> Lovable AI Gateway (default on Lovable platform)
 *
 * This lets the app run on any host. On Lovable, nothing extra is needed.
 * After migrating off Lovable, just set OPENAI_API_KEY (or GEMINI_API_KEY)
 * and remove LOVABLE_API_KEY — no code changes required.
 */
export function getAiProvider() {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const provider = createOpenAICompatible({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      headers: { Authorization: `Bearer ${openaiKey}` },
      supportsStructuredOutputs: true,
    });
    return {
      provider,
      modelId: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const provider = createOpenAICompatible({
      name: "gemini",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      headers: { Authorization: `Bearer ${geminiKey}` },
      supportsStructuredOutputs: true,
    });
    return {
      provider,
      modelId: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    };
  }

  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    const provider = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": lovableKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      supportsStructuredOutputs: true,
    });
    return {
      provider,
      modelId: process.env.LOVABLE_MODEL ?? "google/gemini-3.6-flash",
    };
  }

  return null;
}
