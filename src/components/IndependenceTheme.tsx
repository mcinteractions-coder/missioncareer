import { useEffect, useMemo, useState } from "react";

function AshokaChakra({ className = "" }: { className?: string }) {
  const spin = { animation: "chakra-spin 9s linear infinite" } as const;
  const spokes = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 100 100" className={className} style={spin} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      {spokes.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          transform={`rotate(${(360 / 24) * i} 50 50)`}
        />
      ))}
    </svg>
  );
}

/** Thin tricolor ribbon pinned to the very top of the page. */
export function IndependenceRibbon() {
  return <div className="tricolor-bar fixed top-0 left-0 right-0 z-[99] h-1.5" />;
}

/** Floating tricolor particles rising subtly behind the content. */
function TricolorParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 5.4 + (i % 3) * 7) % 98}%`,
        delay: `${(i % 9) * 0.9}s`,
        duration: `${7 + (i % 5) * 1.6}s`,
        size: 6 + (i % 4) * 4,
        color: ["#ff9933", "#ffffff", "#138808"][i % 3],
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0,
            filter: "blur(0.5px)",
            animation: `indep-float ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Celebratory Independence Day banner shown above the hero. */
export function IndependenceBanner() {
  const [years, setYears] = useState(0);

  useEffect(() => {
    setYears(new Date().getFullYear() - 1947);
  }, []);

  return (
    <section
      aria-label="Independence Day celebration"
      className="relative overflow-hidden border-b border-border/60 pt-8 pb-7 md:pt-10 md:pb-9"
      style={{
        background:
          "radial-gradient(120% 140% at 50% -20%, rgba(255,153,51,0.16) 0%, transparent 55%), radial-gradient(120% 140% at 50% 120%, rgba(19,136,8,0.16) 0%, transparent 55%)",
      }}
    >
      <TricolorParticles />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="tricolor-glow mb-4 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 backdrop-blur">
            <span
              className="inline-block h-4 w-6 rounded-[2px]"
              style={{
                background:
                  "linear-gradient(180deg,#ff9933 0 33.33%,#ffffff 33.33% 66.66%,#138808 66.66% 100%)",
                animation: "flag-wave 2.6s ease-in-out infinite",
                transformOrigin: "left center",
              }}
            />
            <span className="text-xs font-semibold tracking-wide text-foreground md:text-sm">
              15 August · Happy Independence Day
            </span>
            <AshokaChakra
              className="h-4 w-4 text-tricolor-chakra dark:text-primary"
            />
          </div>

          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
            <span className="tricolor-text">Freedom to Dream Big</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {years > 0 ? `Celebrating ${years} years of independence` : "Celebrating independence"} —
            and helping Indian students take that dream across the world. 🇮🇳
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="#contact"
              className="tricolor-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 md:text-base"
              style={{ background: "linear-gradient(135deg,#ff9933 0%,#e8730f 45%,#138808 100%)" }}
            >
              Free Counseling this Independence Week
            </a>
            <a
              href="https://wa.me/919870003748?text=Happy%20Independence%20Day!%20I'd%20like%20free%20study%20abroad%20counseling."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary-soft md:text-base"
              style={{ borderColor: "rgba(19,136,8,0.45)" }}
            >
              Talk to us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="tricolor-bar absolute bottom-0 left-0 right-0 h-1" />
    </section>
  );
}
