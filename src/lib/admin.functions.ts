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
    const { error } = await supabaseAdmin
      .from("posts")
      .update(clean as never)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSwapOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), a: z.string().uuid(), b: z.string().uuid() }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { data: rows, error: e1 } = await supabaseAdmin
      .from("posts")
      .select("id, sort_order")
      .in("id", [data.a, data.b]);
    if (e1) throw new Error(e1.message);
    const ra = rows?.find((r) => r.id === data.a);
    const rb = rows?.find((r) => r.id === data.b);
    if (!ra || !rb) throw new Error("Not found");
    const { error: ea } = await supabaseAdmin
      .from("posts")
      .update({ sort_order: rb.sort_order })
      .eq("id", ra.id);
    if (ea) throw new Error(ea.message);
    const { error: eb } = await supabaseAdmin
      .from("posts")
      .update({ sort_order: ra.sort_order })
      .eq("id", rb.id);
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
  .inputValidator(
    z.object({ pin: z.string(), hours: z.number().int().min(1).max(720).default(24) }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const sinceIso = new Date(Date.now() - data.hours * 3600 * 1000).toISOString();
    const liveSince = new Date(Date.now() - 3 * 60 * 1000).toISOString();

    const [eventsRes, liveRes, bookingsRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select(
          "id, session_id, path, referrer, country, region, city, device, timezone, event_type, user_agent, created_at",
        )
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
          try {
            ref = new URL(e.referrer).hostname || "Direct";
          } catch {
            /* keep */
          }
        }
        byReferrer[ref] = (byReferrer[ref] || 0) + 1;
        const hourKey = new Date(e.created_at).toISOString().slice(0, 13); // YYYY-MM-DDTHH
        byHour[hourKey] = (byHour[hourKey] || 0) + 1;
      }
    }
    const liveSessions = new Set(live.map((l) => l.session_id));

    const visitors = sessions.size;
    const totalLeads = leads.length;
    const totalBookings = bookings.length;

    return {
      totals: {
        pageviews: events.filter((e) => e.event_type !== "heartbeat").length,
        uniqueSessions: visitors,
        liveVisitors: liveSessions.size,
        bookings: totalBookings,
        leads: totalLeads,
      },
      funnel: {
        visitors,
        leads: totalLeads,
        bookings: totalBookings,
        leadRate: visitors > 0 ? totalLeads / visitors : 0,
        bookingRate: visitors > 0 ? totalBookings / visitors : 0,
        bookingFromLeadRate: totalLeads > 0 ? totalBookings / totalLeads : 0,
      },
      byCountry: sortMap(byCountry),
      byCity: sortMap(byCity),
      byPath: sortMap(byPath),
      byDevice: sortMap(byDevice),
      byReferrer: sortMap(byReferrer),
      byHour: Object.entries(byHour)
        .map(([k, v]) => ({ k, v }))
        .sort((a, b) => a.k.localeCompare(b.k)),
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

// ============ Visitor session drill-down ============

export const adminListSessions = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ pin: z.string(), hours: z.number().int().min(1).max(720).default(24) }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const sinceIso = new Date(Date.now() - data.hours * 3600 * 1000).toISOString();

    const [eventsRes, bookingsRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select(
          "session_id, path, referrer, country, region, city, device, event_type, user_agent, created_at",
        )
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabaseAdmin
        .from("bookings")
        .select(
          "id, full_name, phone, email, country, slot_date, slot_time, mode, notes, created_at, session_id",
        )
        .not("session_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("leads")
        .select(
          "id, full_name, phone, email, country, study_level, message, created_at, session_id",
        )
        .not("session_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(1000),
    ]);
    if (eventsRes.error) throw new Error(eventsRes.error.message);

    const events = eventsRes.data ?? [];
    const bookingsBySid = new Map<
      string,
      typeof bookingsRes.data extends (infer T)[] | null ? T : never
    >();
    for (const b of bookingsRes.data ?? []) if (b.session_id) bookingsBySid.set(b.session_id, b);
    const leadsBySid = new Map<
      string,
      typeof leadsRes.data extends (infer T)[] | null ? T : never
    >();
    for (const l of leadsRes.data ?? []) if (l.session_id) leadsBySid.set(l.session_id, l);

    const bySid = new Map<string, typeof events>();
    for (const e of events) {
      const arr = bySid.get(e.session_id) ?? [];
      arr.push(e);
      bySid.set(e.session_id, arr);
    }

    const sessions = Array.from(bySid.entries()).map(([sid, evts]) => {
      const sorted = [...evts].sort((a, b) => a.created_at.localeCompare(b.created_at));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const pv = sorted.filter((e) => e.event_type !== "heartbeat");
      const uniquePaths = new Set(pv.map((e) => e.path));
      const durationSec = Math.max(
        0,
        Math.round(
          (new Date(last.created_at).getTime() - new Date(first.created_at).getTime()) / 1000,
        ),
      );
      const booking = bookingsBySid.get(sid);
      const lead = leadsBySid.get(sid);
      const identity = booking
        ? {
            type: "booking" as const,
            name: booking.full_name,
            phone: booking.phone,
            email: booking.email,
            extra: `${booking.slot_date} · ${booking.slot_time} (${booking.mode})`,
          }
        : lead
          ? {
              type: "lead" as const,
              name: lead.full_name,
              phone: lead.phone,
              email: lead.email,
              extra: lead.study_level || "",
            }
          : null;
      let ref = "Direct";
      if (first.referrer) {
        try {
          ref = new URL(first.referrer).hostname || "Direct";
        } catch {
          /* keep */
        }
      }
      return {
        session_id: sid,
        first_seen: first.created_at,
        last_seen: last.created_at,
        duration_sec: durationSec,
        pageviews: pv.length,
        unique_pages: uniquePaths.size,
        country: first.country,
        city: first.city,
        region: first.region,
        device: first.device,
        referrer: ref,
        entry_path: sorted.find((e) => e.event_type !== "heartbeat")?.path ?? first.path,
        identity,
        converted: !!identity,
      };
    });

    // sort: converted first, then newest last_seen
    sessions.sort((a, b) => {
      if (a.converted !== b.converted) return a.converted ? -1 : 1;
      return b.last_seen.localeCompare(a.last_seen);
    });

    return { sessions: sessions.slice(0, 300) };
  });

export const adminSessionDetail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ pin: z.string(), session_id: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const [evtsRes, bookingRes, leadRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select("*")
        .eq("session_id", data.session_id)
        .order("created_at", { ascending: true })
        .limit(2000),
      supabaseAdmin.from("bookings").select("*").eq("session_id", data.session_id).maybeSingle(),
      supabaseAdmin.from("leads").select("*").eq("session_id", data.session_id).maybeSingle(),
    ]);
    if (evtsRes.error) throw new Error(evtsRes.error.message);

    const events = evtsRes.data ?? [];
    const booking = bookingRes.data ?? null;
    const lead = leadRes.data ?? null;

    // Build AI-friendly journey timeline (pageviews only)
    const pv = events.filter(
      (e) => e.event_type !== "heartbeat" && e.event_type !== "engagement_batch",
    );
    const journey = pv.map((e) => {
      const t = new Date(e.created_at).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `${t} → ${e.path}`;
    });
    const first = events[0];
    const last = events[events.length - 1];
    const durationMin =
      first && last
        ? Math.round(
            (new Date(last.created_at).getTime() - new Date(first.created_at).getTime()) / 60000,
          )
        : 0;

    // ---------- Section engagement + clicks + exits (from meta) ----------
    type MetaObj = Record<string, unknown>;
    const sectionMs: Record<string, number> = {};
    const clicks: {
      at: string;
      text: string;
      section: string | null;
      href: string | null;
    }[] = [];
    let maxDepthPct = 0;
    let exitReason: string | null = null;
    let exitAt: string | null = null;
    let totalActiveMs = 0;

    for (const e of events) {
      const raw = (e as { meta?: unknown }).meta;
      if (!raw) continue;
      const items: MetaObj[] = Array.isArray(raw) ? (raw as MetaObj[]) : [raw as MetaObj];
      for (const m of items) {
        const type = (m.event_type as string | undefined) || e.event_type;
        if (
          type === "section_view" &&
          typeof m.section === "string" &&
          typeof m.duration_ms === "number"
        ) {
          sectionMs[m.section] = (sectionMs[m.section] || 0) + m.duration_ms;
        } else if (type === "click") {
          clicks.push({
            at: e.created_at,
            text: String(m.text || "").slice(0, 120),
            section: (m.section as string) || null,
            href: (m.href as string) || null,
          });
        } else if (type === "page_exit") {
          if (typeof m.max_depth_pct === "number" && m.max_depth_pct > maxDepthPct)
            maxDepthPct = m.max_depth_pct;
          exitReason = (m.reason as string) || exitReason;
          exitAt = e.created_at;
          if (typeof m.total_ms === "number")
            totalActiveMs = Math.max(totalActiveMs, m.total_ms);
          const totals = m.section_totals_ms as Record<string, number> | undefined;
          if (totals) {
            for (const [k, v] of Object.entries(totals)) {
              if (typeof v === "number" && v > (sectionMs[k] || 0)) sectionMs[k] = v;
            }
          }
        }
      }
    }

    const sectionEngagement = Object.entries(sectionMs)
      .map(([section, ms]) => ({ section, seconds: Math.round(ms / 1000) }))
      .filter((r) => r.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds);
    const clickList = clicks.slice(-40);

    // ---------- Unlock Your Special Offer popup activity ----------
    const DISCOUNT_LABEL: Record<string, string> = {
      discount_shown: "Popup shown to visitor",
      discount_reveal_click: "Clicked 'Reveal My Discount' (submitted name + phone)",
      discount_submitted: "Lead saved successfully",
      discount_awesome_click: "Clicked 'Awesome, thanks!' after seeing FREE session reveal",
      discount_backdrop_click: "Tried to close by clicking outside (blocked — mandatory)",
      discount_closed: "Popup closed",
    };
    const discountEvents = events
      .filter((e) => e.event_type && e.event_type.startsWith("discount_"))
      .map((e) => {
        const t = new Date(e.created_at).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return `- ${t} → ${DISCOUNT_LABEL[e.event_type] || e.event_type}`;
      });
    const discountOutcome = discountEvents.length
      ? events.some((e) => e.event_type === "discount_submitted")
        ? "OUTCOME: Visitor SUBMITTED the offer form (phone captured)."
        : events.some((e) => e.event_type === "discount_backdrop_click")
          ? "OUTCOME: Visitor tried to dismiss the offer without submitting."
          : "OUTCOME: Visitor saw the offer but did not submit."
      : "OUTCOME: Offer popup was not shown for this visitor.";


    let aiSummary = "";
    const key = process.env.LOVABLE_API_KEY;
    if (key && (journey.length > 0 || sectionEngagement.length > 0)) {
      try {
        const identityLine = booking
          ? `IDENTITY: ${booking.full_name} (booked counseling for ${booking.slot_date} at ${booking.slot_time}, mode=${booking.mode}, phone=${booking.phone}${booking.email ? ", email=" + booking.email : ""}${booking.country ? ", country=" + booking.country : ""})${booking.notes ? ", notes: " + booking.notes : ""}`
          : lead
            ? `IDENTITY: ${lead.full_name} (submitted contact lead, phone=${lead.phone || "-"}, email=${lead.email || "-"}${lead.country ? ", country=" + lead.country : ""}${lead.study_level ? ", study level=" + lead.study_level : ""})${lead.message ? ", message: " + lead.message : ""}`
            : "IDENTITY: Anonymous visitor (did not submit any form)";
        const geo =
          [first?.city, first?.region, first?.country].filter(Boolean).join(", ") ||
          "Unknown location";
        const ua = first?.user_agent || "";
        const ref = first?.referrer || "Direct";

        const sectionLines =
          sectionEngagement.map((s) => `- ${s.section}: ${s.seconds}s`).join("\n") ||
          "- (no section engagement captured)";
        const clickLines =
          clickList
            .map(
              (c) =>
                `- "${c.text}"${c.section ? ` (in ${c.section})` : ""}${c.href ? ` → ${c.href}` : ""}`,
            )
            .join("\n") || "- (no clicks captured)";
        const exitLine = exitAt
          ? `EXIT: ${new Date(exitAt).toLocaleTimeString("en-IN")} (${exitReason || "unknown"}), max scroll depth ${maxDepthPct}%, ~${Math.round(totalActiveMs / 1000)}s on page`
          : "EXIT: (still active or exit not captured)";

        const prompt = `You are analysing website visitor behaviour for the admin of Mission Career (a study-abroad consultancy in Kandivali East, Mumbai).

${identityLine}
Location: ${geo}
Device: ${first?.device || "unknown"}
Referrer: ${ref}
Session duration: ~${durationMin} minute(s)
Total pageviews: ${pv.length}, unique pages: ${new Set(pv.map((e) => e.path)).size}
User agent: ${ua.slice(0, 120)}

PAGE-BY-PAGE JOURNEY (chronological):
${journey.slice(0, 30).join("\n")}${journey.length > 30 ? `\n… (+${journey.length - 30} more)` : ""}

SECTION-BY-SECTION TIME (how long each on-page section stayed in view):
${sectionLines}

CLICKS (chronological, last 40):
${clickLines}

UNLOCK YOUR SPECIAL OFFER POPUP — exact activity:
${discountEvents.length ? discountEvents.join("\n") : "- (no popup activity recorded)"}
${discountOutcome}

${exitLine}

Write a rich (6-9 sentence) plain-English narrative FOR THE ADMIN describing this specific visitor's journey: which sections they scrolled to and lingered on the longest, which they skipped, exactly what they clicked, how deep they scrolled, whether they filled a form, and when/how they left. IMPORTANT — include one clear sentence about EXACTLY what they did with the "Unlock Your Special Offer" popup (was it shown, did they type name/phone and click Reveal My Discount, did they try to close by clicking outside, did they click "Awesome, thanks!" after the FREE session reveal, or did they ignore it). Sound like a story ("This visitor first landed on…, then spent 42 seconds reading Success Stories, tapped WhatsApp, saw the Unlock Your Special Offer popup and submitted their phone, then scrolled to Booking…"). No markdown, no bullets, just a paragraph.`;



        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (resp.ok) {
          const j = (await resp.json()) as { choices?: { message?: { content?: string } }[] };
          aiSummary = j.choices?.[0]?.message?.content?.trim() || "";
        } else {
          aiSummary = `(AI summary unavailable — gateway responded ${resp.status})`;
        }
      } catch (e) {
        aiSummary = `(AI summary failed: ${(e as Error).message})`;
      }
    }

    return {
      events,
      booking,
      lead,
      summary: {
        first_seen: first?.created_at ?? null,
        last_seen: last?.created_at ?? null,
        duration_min: durationMin,
        pageviews: pv.length,
        unique_pages: new Set(pv.map((e) => e.path)).size,
        country: first?.country ?? null,
        city: first?.city ?? null,
        region: first?.region ?? null,
        device: first?.device ?? null,
        referrer: first?.referrer ?? null,
        user_agent: first?.user_agent ?? null,
        max_depth_pct: maxDepthPct,
        active_seconds: Math.round(totalActiveMs / 1000),
        exit_reason: exitReason,
        exit_at: exitAt,
      },
      section_engagement: sectionEngagement,
      clicks: clickList,
      ai_summary: aiSummary,
    };
  });

export const adminAiInsights = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ pin: z.string(), hours: z.number().int().min(1).max(720).default(24) }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const sinceIso = new Date(Date.now() - data.hours * 3600 * 1000).toISOString();

    const [eventsRes, bookingsRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select("session_id, path, country, city, device, referrer, event_type, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(2000),
      supabaseAdmin
        .from("bookings")
        .select("id, full_name, phone, email, country, slot_date, slot_time, mode, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("leads")
        .select("id, full_name, phone, email, country, study_level, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (eventsRes.error) throw new Error(eventsRes.error.message);

    const events = eventsRes.data ?? [];
    const bookings = bookingsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    const sessions = new Set<string>();
    const byPath: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    for (const e of events) {
      if (e.event_type !== "heartbeat") {
        sessions.add(e.session_id);
        byPath[e.path] = (byPath[e.path] || 0) + 1;
        byCountry[e.country || "Unknown"] = (byCountry[e.country || "Unknown"] || 0) + 1;
        byDevice[e.device || "unknown"] = (byDevice[e.device || "unknown"] || 0) + 1;
        let ref = "Direct";
        if (e.referrer) {
          try {
            ref = new URL(e.referrer).hostname || "Direct";
          } catch {
            /* keep */
          }
        }
        byReferrer[ref] = (byReferrer[ref] || 0) + 1;
      }
    }

    const topPages = sortMap(byPath).slice(0, 5);
    const topCountries = sortMap(byCountry).slice(0, 5);
    const topDevices = sortMap(byDevice).slice(0, 3);
    const topReferrers = sortMap(byReferrer).slice(0, 5);

    const visitors = sessions.size;
    const leadRate =
      visitors > 0 ? (((leads.length + bookings.length) / visitors) * 100).toFixed(1) : "0.0";
    const bookingRate = visitors > 0 ? ((bookings.length / visitors) * 100).toFixed(1) : "0.0";

    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { insights: "AI insights require LOVABLE_API_KEY to be configured." };

    const prompt = `You are the analytics assistant for Mission Career (study-abroad consultancy in Kandivali East, Mumbai). Analyze the following website performance data for the last ${data.hours} hours and write 3-4 concise, actionable insights for the admin. Be direct, no fluff, no markdown bullets. Each insight should be 1-2 sentences. Suggest one concrete action if relevant.

Key metrics:
- Visitors: ${visitors}
- Bookings: ${bookings.length}
- Leads: ${leads.length}
- Conversion rate (visitor to any form): ${leadRate}%
- Booking conversion rate: ${bookingRate}%

Top pages: ${topPages.map((x) => `${x.k} (${x.v})`).join(", ")}
Top countries: ${topCountries.map((x) => `${x.k} (${x.v})`).join(", ")}
Top devices: ${topDevices.map((x) => `${x.k} (${x.v})`).join(", ")}
Top sources: ${topReferrers.map((x) => `${x.k} (${x.v})`).join(", ")}`;

    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!resp.ok)
        return { insights: `AI insights temporarily unavailable (gateway ${resp.status}).` };
      const j = (await resp.json()) as { choices?: { message?: { content?: string } }[] };
      const insights = j.choices?.[0]?.message?.content?.trim() || "";
      return { insights: insights || "No insights generated." };
    } catch (e) {
      return { insights: `AI insights failed: ${(e as Error).message}` };
    }
  });

// ============ Discount popup analytics ============

export const adminDiscountPopupStats = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ pin: z.string(), hours: z.number().int().min(1).max(720).default(24) }),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const sinceIso = new Date(Date.now() - data.hours * 3600 * 1000).toISOString();

    const [evtsRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("visitor_events")
        .select("session_id, event_type, path, country, city, device, created_at")
        .in("event_type", [
          "discount_shown",
          "discount_submitted",
          "discount_closed",
          "discount_reveal_click",
          "discount_awesome_click",
          "discount_backdrop_click",
        ])
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(3000),
      supabaseAdmin
        .from("leads")
        .select("id, full_name, phone, email, country, session_id, message, created_at")
        .ilike("message", "Discount popup%")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    if (evtsRes.error) throw new Error(evtsRes.error.message);
    if (leadsRes.error) throw new Error(leadsRes.error.message);

    const events = evtsRes.data ?? [];
    const leads = leadsRes.data ?? [];

    const shownSids = new Set<string>();
    const submittedSids = new Set<string>();
    const closedSids = new Set<string>();
    for (const e of events) {
      if (e.event_type === "discount_shown") shownSids.add(e.session_id);
      else if (e.event_type === "discount_submitted") submittedSids.add(e.session_id);
      else if (e.event_type === "discount_closed") closedSids.add(e.session_id);
    }

    const shown = shownSids.size;
    const submitted = submittedSids.size;
    const dismissed = Array.from(closedSids).filter((s) => !submittedSids.has(s)).length;
    const conversionRate = shown > 0 ? submitted / shown : 0;

    // Build per-session actions
    const bySid = new Map<
      string,
      { events: typeof events; first: string; last: string; country?: string | null; city?: string | null; device?: string | null; path?: string }
    >();
    for (const e of events) {
      const cur = bySid.get(e.session_id);
      if (!cur) {
        bySid.set(e.session_id, {
          events: [e],
          first: e.created_at,
          last: e.created_at,
          country: e.country,
          city: e.city,
          device: e.device,
          path: e.path,
        });
      } else {
        cur.events.push(e);
        if (e.created_at < cur.first) cur.first = e.created_at;
        if (e.created_at > cur.last) cur.last = e.created_at;
      }
    }

    const leadBySid = new Map<string, (typeof leads)[number]>();
    for (const l of leads) if (l.session_id) leadBySid.set(l.session_id, l);

    const rows = Array.from(bySid.entries())
      .map(([sid, info]) => {
        const types = new Set(info.events.map((e) => e.event_type));
        const lead = leadBySid.get(sid) || null;
        const status = types.has("discount_submitted")
          ? "submitted"
          : types.has("discount_closed")
            ? "dismissed"
            : "shown_only";

        // Button click labels
        const buttonMap: Record<string, string> = {
          discount_reveal_click: "Reveal My Discount",
          discount_awesome_click: "Awesome, thanks!",
          discount_backdrop_click: "Backdrop (outside)",
        };
        const buttonEvents = info.events
          .filter((e) => buttonMap[e.event_type])
          .sort((a, b) => a.created_at.localeCompare(b.created_at))
          .map((e) => ({
            button: buttonMap[e.event_type],
            at: e.created_at,
          }));
        const buttonCounts: Record<string, number> = {};
        for (const b of buttonEvents) buttonCounts[b.button] = (buttonCounts[b.button] || 0) + 1;
        const lastButton = buttonEvents.length ? buttonEvents[buttonEvents.length - 1] : null;

        return {
          session_id: sid,
          status,
          shown_at: info.first,
          last_action_at: info.last,
          country: info.country,
          city: info.city,
          device: info.device,
          path: info.path,
          name: lead?.full_name || null,
          phone: lead?.phone || null,
          email: lead?.email || null,
          buttons: buttonEvents,
          buttonCounts,
          lastButton,
        };
      })
      .sort((a, b) => b.last_action_at.localeCompare(a.last_action_at));

    // Aggregate button totals across all sessions
    const buttonTotals: Record<string, number> = {
      "Reveal My Discount": 0,
      "Awesome, thanks!": 0,
      "Backdrop (outside)": 0,
    };
    for (const r of rows) {
      for (const [b, c] of Object.entries(r.buttonCounts)) {
        buttonTotals[b] = (buttonTotals[b] || 0) + c;
      }
    }

    return {
      totals: {
        shown,
        submitted,
        dismissed,
        conversionRate,
      },
      buttonTotals,
      rows: rows.slice(0, 300),
      leads,
    };
  });
