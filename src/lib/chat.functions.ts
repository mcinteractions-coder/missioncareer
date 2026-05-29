import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const loadChatHistory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ sessionKey: z.string().min(1).max(128) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_key", data.sessionKey)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) {
      console.error("loadChatHistory error", error);
      return { messages: [] };
    }
    return { messages: rows ?? [] };
  });

export const clearChatHistory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ sessionKey: z.string().min(1).max(128) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("chat_messages")
      .delete()
      .eq("session_key", data.sessionKey);
    if (error) {
      console.error("clearChatHistory error", error);
      return { ok: false };
    }
    return { ok: true };
  });
