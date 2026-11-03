// Browser-safe helpers for Diwali game activity: visitor analytics + local best scores.

type Meta = Record<string, unknown>;

export function logGameEvent(eventType: string, meta: Meta = {}) {
  try {
    const payload = JSON.stringify({
      session_id: sessionStorage.getItem("mc_visitor_sid") || "anon",
      path: window.location.pathname,
      event_type: eventType,
      meta,
    });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
      if (ok) return;
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
}

const bestKey = (game: string) => `mc_diwali_best_${game}`;

export function readBest(game: string): number {
  try {
    return Number(localStorage.getItem(bestKey(game))) || 0;
  } catch {
    return 0;
  }
}

export function writeBest(game: string, score: number): number {
  const best = Math.max(readBest(game), score);
  try {
    localStorage.setItem(bestKey(game), String(best));
  } catch {
    /* ignore */
  }
  return best;
}
