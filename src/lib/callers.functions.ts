import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_PIN = "125809";
export const CALLERS = ["Akshara Ravidas", "Kamakshi Gaur"] as const;
const monthRe = /^\d{4}-\d{2}$/;

function checkPin(pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Unauthorized");
}

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

export const listCallerMeetings = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), month: z.string().regex(monthRe) }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const db = await admin();
    const { data: rows, error } = await db
      .from("caller_meetings")
      .select("*")
      .eq("month", data.month)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const addCallerMeeting = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      pin: z.string(),
      month: z.string().regex(monthRe),
      caller: z.enum(CALLERS),
      student_name: z.string().trim().min(1).max(120),
      student_phone: z.string().trim().min(6).max(20),
    }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const db = await admin();
    const { error } = await db.from("caller_meetings").insert({
      month: data.month,
      caller: data.caller,
      student_name: data.student_name,
      student_phone: data.student_phone,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const verifyCallerMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), id: z.string().uuid(), code: z.string() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    if (data.code.trim() !== "1258") throw new Error("Wrong code");
    const db = await admin();
    const { error } = await db.from("caller_meetings").update({ verified: true }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCallerMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const db = await admin();
    const { error } = await db.from("caller_meetings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
