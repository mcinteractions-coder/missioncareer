import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

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

async function send(path: string) {
  try {
    const sid = getSessionId();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const payload = JSON.stringify({
      session_id: sid,
      path,
      referrer: document.referrer || "",
      timezone: tz,
    });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
      if (ok) return;
    }
    await fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

export function VisitorTracker() {
  const router = useRouter();
  useEffect(() => {
    // don't track admin views
    const track = (p: string) => {
      if (p.startsWith("/admin")) return;
      send(p);
    };
    track(window.location.pathname);
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      track(toLocation.pathname);
    });
    // heartbeat every 45s while tab is open
    const hb = setInterval(() => {
      if (document.visibilityState === "visible") {
        const p = window.location.pathname;
        if (!p.startsWith("/admin")) {
          fetch("/api/track", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              session_id: getSessionId(),
              path: p,
              event_type: "heartbeat",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
            }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    }, 45000);
    return () => {
      unsub();
      clearInterval(hb);
    };
  }, [router]);
  return null;
}
