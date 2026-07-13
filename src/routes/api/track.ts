import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            session_id?: string;
            path?: string;
            referrer?: string;
            timezone?: string;
            event_type?: string;
            meta?: Record<string, unknown> | Record<string, unknown>[];
          };
          if (!body?.session_id || !body?.path) {
            return new Response("Bad request", { status: 400 });
          }

          const h = request.headers;
          const country = h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || null;
          const region = h.get("cf-region") || h.get("x-vercel-ip-country-region") || null;
          const city = h.get("cf-ipcity") || h.get("x-vercel-ip-city") || null;
          const ua = h.get("user-agent") || "";
          const ip =
            (h.get("cf-connecting-ip") || h.get("x-forwarded-for") || "").split(",")[0].trim();
          const ipHash = ip
            ? createHash("sha256").update(ip + "mc-salt").digest("hex").slice(0, 24)
            : null;

          const device = /Mobi|Android|iPhone|iPad/i.test(ua)
            ? "mobile"
            : /Tablet/i.test(ua)
              ? "tablet"
              : "desktop";

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Support batched events via meta being an array
          const metaArr: (Record<string, unknown> | null)[] = Array.isArray(body.meta)
            ? body.meta
            : [body.meta ?? null];
          const rows = metaArr.map((m) => ({
            session_id: body.session_id!.slice(0, 64),
            path: body.path!.slice(0, 500),
            referrer: (body.referrer || "").slice(0, 500) || null,
            country,
            region,
            city: city ? decodeURIComponent(city) : null,
            ip_hash: ipHash,
            user_agent: ua.slice(0, 500),
            device,
            timezone: (body.timezone || "").slice(0, 64) || null,
            event_type: (body.event_type || "pageview").slice(0, 32),
            meta: (m ?? null) as never,
          }));
          await supabaseAdmin.from("visitor_events").insert(rows);



          return new Response("ok", {
            headers: { "cache-control": "no-store" },
          });
        } catch (e) {
          return new Response("err", { status: 200 });
        }
      },
    },
  },
});
