import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that toggles `.in-view`
 * on every `[data-reveal]` element as it enters the viewport.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Re-scan when content loads later (e.g. async sections)
    const mo = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in-view)").forEach((el) => {
        io.observe(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
