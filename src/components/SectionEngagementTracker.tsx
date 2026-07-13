import { useEffect } from "react";

function getSessionId() {
  try {
    let id = sessionStorage.getItem("mc_visitor_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("mc_visitor_sid", id);
    }
    return id;
  } catch {
    return "anon-" + Math.random().toString(36).slice(2);
  }
}

type PendingEvent = {
  event_type: string;
  meta: Record<string, unknown>;
  at: number;
};

/**
 * Tracks per-section time, clicks, max scroll depth and page exits.
 * Sends batched events to /api/track. Skipped on /admin.
 */
export function SectionEngagementTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;

    const sid = getSessionId();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const pageEnteredAt = Date.now();
    const pathAtLoad = window.location.pathname;

    // section timing
    const sectionEntered: Map<string, number> = new Map();
    const sectionTotalMs: Map<string, number> = new Map();
    let maxDepthPct = 0;

    const queue: PendingEvent[] = [];
    let flushTimer: ReturnType<typeof setTimeout> | null = null;

    const flush = (useBeacon = false) => {
      if (queue.length === 0) return;
      const batch = queue.splice(0, queue.length);
      const payload = JSON.stringify({
        session_id: sid,
        path: pathAtLoad,
        referrer: document.referrer || "",
        timezone: tz,
        event_type: "engagement_batch",
        meta: batch,
      });
      try {
        if (useBeacon && navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/track",
            new Blob([payload], { type: "application/json" }),
          );
          return;
        }
        fetch("/api/track", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    };

    const enqueue = (event_type: string, meta: Record<string, unknown>) => {
      queue.push({ event_type, meta, at: Date.now() });
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(() => flush(false), 4000);
      if (queue.length >= 20) flush(false);
    };

    // ---------- Section visibility ----------
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            if (!sectionEntered.has(id)) {
              sectionEntered.set(id, Date.now());
              enqueue("section_enter", { section: id });
            }
          } else {
            const enteredAt = sectionEntered.get(id);
            if (enteredAt) {
              const dur = Date.now() - enteredAt;
              sectionEntered.delete(id);
              sectionTotalMs.set(id, (sectionTotalMs.get(id) || 0) + dur);
              enqueue("section_view", {
                section: id,
                duration_ms: dur,
              });
            }
          }
        }
      },
      { threshold: [0, 0.35, 0.75] },
    );
    sections.forEach((s) => io.observe(s));

    // ---------- Scroll depth ----------
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const pct = Math.min(100, Math.round(((scrollY + viewport) / docH) * 100));
      if (pct > maxDepthPct) maxDepthPct = pct;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---------- Clicks ----------
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest(
        "button, a, [role=button], [data-track-click]",
      ) as HTMLElement | null;
      if (!el) return;
      const text = (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 120);
      const href = (el as HTMLAnchorElement).href || null;
      const section = el.closest("section[id]")?.id || null;
      const id = el.id || el.getAttribute("data-track-click") || null;
      enqueue("click", {
        text,
        href,
        section,
        target_id: id,
        tag: el.tagName.toLowerCase(),
      });
    };
    document.addEventListener("click", onClick, true);

    // ---------- Exit ----------
    const flushExit = (reason: string) => {
      // Close any still-open sections
      const now = Date.now();
      for (const [id, enteredAt] of sectionEntered.entries()) {
        const dur = now - enteredAt;
        sectionTotalMs.set(id, (sectionTotalMs.get(id) || 0) + dur);
        enqueue("section_view", { section: id, duration_ms: dur });
      }
      sectionEntered.clear();

      const totals = Object.fromEntries(sectionTotalMs.entries());
      enqueue("page_exit", {
        reason,
        total_ms: now - pageEnteredAt,
        max_depth_pct: maxDepthPct,
        section_totals_ms: totals,
      });
      flush(true);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushExit("hidden");
    };
    const onPageHide = () => flushExit("pagehide");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      if (flushTimer) clearTimeout(flushTimer);
      flushExit("unmount");
    };
  }, []);

  return null;
}
