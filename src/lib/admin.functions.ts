import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PIN = "125809";

const pinSchema = z.object({ pin: z.string() });

function checkPin(pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Unauthorized");
}

export const adminAddPost = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      pin: z.string(),
      kind: z.enum(["blog", "success", "festival", "review", "admit"]),
      title: z.string().min(1).max(200),
      text: z.string().max(5000).optional().default(""),
      image: z.string().max(3_500_000).optional(),
      active: z.boolean().optional(),
      university: z.string().max(200).optional(),
      course: z.string().max(200).optional(),
      destination: z.string().max(100).optional(),
      flag_code: z.string().max(8).optional(),
      prev_course: z.string().max(200).optional(),
      prev_college: z.string().max(200).optional(),
      gender: z.enum(["male", "female"]).optional(),
      rating: z.number().int().min(1).max(5).optional(),
    }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error, data: row } = await supabaseAdmin
      .from("posts")
      .insert({
        kind: data.kind,
        title: data.title,
        text: data.text ?? "",
        image: data.image ?? null,
        active: data.active ?? true,
        university: data.university ?? null,
        course: data.course ?? null,
        destination: data.destination ?? null,
        flag_code: data.flag_code ?? null,
        prev_course: data.prev_course ?? null,
        prev_college: data.prev_college ?? null,
        gender: data.gender ?? null,
        rating: data.rating ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });


export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdatePost = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      pin: z.string(),
      id: z.string().uuid(),
      active: z.boolean().optional(),
      title: z.string().min(1).max(200).optional(),
      text: z.string().max(5000).optional(),
      image: z.string().max(3_500_000).nullable().optional(),
      university: z.string().max(200).nullable().optional(),
      course: z.string().max(200).nullable().optional(),
      destination: z.string().max(100).nullable().optional(),
      flag_code: z.string().max(8).nullable().optional(),
      prev_course: z.string().max(200).nullable().optional(),
      prev_college: z.string().max(200).nullable().optional(),
      gender: z.enum(["male", "female"]).nullable().optional(),
      sort_order: z.number().int().optional(),
    }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { pin: _p, id, ...patch } = data;
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(patch)) {
      if (v !== undefined) clean[k] = v;
    }
    if (Object.keys(clean).length === 0) return { ok: true };
    const { error } = await supabaseAdmin.from("posts").update(clean as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSwapOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), a: z.string().uuid(), b: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { data: rows, error: e1 } = await supabaseAdmin
      .from("posts").select("id, sort_order").in("id", [data.a, data.b]);
    if (e1) throw new Error(e1.message);
    const ra = rows?.find((r) => r.id === data.a);
    const rb = rows?.find((r) => r.id === data.b);
    if (!ra || !rb) throw new Error("Not found");
    const { error: ea } = await supabaseAdmin.from("posts").update({ sort_order: rb.sort_order }).eq("id", ra.id);
    if (ea) throw new Error(ea.message);
    const { error: eb } = await supabaseAdmin.from("posts").update({ sort_order: ra.sort_order }).eq("id", rb.id);
    if (eb) throw new Error(eb.message);
    return { ok: true };
  });

export const adminListLeads = createServerFn({ method: "POST" })
  .inputValidator(pinSchema)
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { data: rows, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
