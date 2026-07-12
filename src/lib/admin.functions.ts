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
      rating: z.number().int().min(1).max(5).nullable().optional(),
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

export const adminListBookings = createServerFn({ method: "POST" })
  .inputValidator(pinSchema)
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminDeleteBooking = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error } = await supabaseAdmin.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminAnalytics = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), hours: z.number().int().min(1).max(720).default(24) }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const sinceIso = new Date(Date.now() - data.hours * 3600 * 1000).toISOString();
    const liveSince = new Date(Date.now() - 3 * 60 * 1000).toISOString();

    const [eventsRes, liveRes, bookingsRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select("id, session_id, path, referrer, country, region, city, device, timezone, event_type, user_agent, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(2000),
      supabaseAdmin
        .from("visitor_events")
        .select("session_id, path, country, city, device, created_at")
        .gte("created_at", liveSince)
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("bookings")
        .select("id, full_name, phone, email, country, slot_date, slot_time, mode, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("leads")
        .select("id, full_name, phone, email, country, study_level, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (eventsRes.error) throw new Error(eventsRes.error.message);

    const events = eventsRes.data ?? [];
    const live = liveRes.data ?? [];
    const bookings = bookingsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    // aggregations
    const sessions = new Set<string>();
    const byCountry: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    const byPath: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    const byHour: Record<string, number> = {};
    for (const e of events) {
      if (e.event_type !== "heartbeat") {
        sessions.add(e.session_id);
        const c = e.country || "Unknown";
        byCountry[c] = (byCountry[c] || 0) + 1;
        const city = e.city || "Unknown";
        byCity[city] = (byCity[city] || 0) + 1;
        byPath[e.path] = (byPath[e.path] || 0) + 1;
        const d = e.device || "unknown";
        byDevice[d] = (byDevice[d] || 0) + 1;
        let ref = "Direct";
        if (e.referrer) {
          try { ref = new URL(e.referrer).hostname || "Direct"; } catch { /* keep */ }
        }
        byReferrer[ref] = (byReferrer[ref] || 0) + 1;
        const hourKey = new Date(e.created_at).toISOString().slice(0, 13); // YYYY-MM-DDTHH
        byHour[hourKey] = (byHour[hourKey] || 0) + 1;
      }
    }
    const liveSessions = new Set(live.map((l) => l.session_id));

    return {
      totals: {
        pageviews: events.filter((e) => e.event_type !== "heartbeat").length,
        uniqueSessions: sessions.size,
        liveVisitors: liveSessions.size,
        bookings: bookings.length,
        leads: leads.length,
      },
      byCountry: sortMap(byCountry),
      byCity: sortMap(byCity),
      byPath: sortMap(byPath),
      byDevice: sortMap(byDevice),
      byReferrer: sortMap(byReferrer),
      byHour: Object.entries(byHour).map(([k, v]) => ({ k, v })).sort((a, b) => a.k.localeCompare(b.k)),
      liveSessions: Array.from(liveSessions).map((sid) => {
        const rows = live.filter((l) => l.session_id === sid);
        const latest = rows[0]!;
        return {
          session_id: sid,
          path: latest.path,
          country: latest.country,
          city: latest.city,
          device: latest.device,
          last_seen: latest.created_at,
          pages: rows.length,
        };
      }),
      recentEvents: events.slice(0, 100),
      recentBookings: bookings,
      recentLeads: leads,
    };
  });

function sortMap(m: Record<string, number>) {
  return Object.entries(m)
    .map(([k, v]) => ({ k, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 20);
}

