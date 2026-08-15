import { useMemo } from "react";

function AshokaChakra({ className = "", speed = 9 }: { className?: string; speed?: number }) {
  const spokes = Array.from({ length: 24 });
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ animation: `chakra-spin ${speed}s linear infinite` }}
      aria-hidden="true"
    >
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
  return (
    <div className="fixed top-0 left-0 right-0 z-[99] h-1.5 overflow-hidden">
      <div className="tricolor-bar indep-shine absolute inset-0" />
    </div>
  );
}

/** Paper-cut kite silhouette with a string tail. */
function Kite({
  className,
  color,
  delay,
  duration,
  size,
}: {
  className: string;
  color: string;
  delay: string;
  duration: string;
  size: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ animation: `kite-drift ${duration} ease-in-out ${delay} infinite` }}
      aria-hidden="true"
    >
      <svg width={size} height={size * 1.7} viewBox="0 0 60 102">
        <path d="M30 2 L56 32 L30 66 L4 32 Z" fill={color} opacity="0.9" />
        <path d="M30 2 L30 66 M4 32 L56 32" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        <path
          d="M30 66 Q40 78 26 86 Q14 94 30 100"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

/** Floating tricolor particles + confetti behind the content. */
function TricolorParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: `${(i * 3.9 + (i % 3) * 6) % 98}%`,
        delay: `${(i % 11) * 0.7}s`,
        duration: `${6.5 + (i % 6) * 1.4}s`,
        size: 5 + (i % 4) * 4,
        color: ["#ff9933", "#ffffff", "#138808"][i % 3],
      })),
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: `${(i * 4.6 + (i % 5) * 3) % 99}%`,
        delay: `${(i % 8) * 0.65}s`,
        duration: `${4.5 + (i % 5) * 1.1}s`,
        w: 4 + (i % 3) * 2,
        h: 9 + (i % 4) * 4,
        color: ["#ff9933", "#ffffff", "#138808", "#0a3d91"][i % 4],
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* breathing tricolor glow blobs */}
      <div
        className="absolute -left-16 top-4 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "rgba(255,153,51,0.35)", animation: "indep-breathe 7s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-16 bottom-0 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "rgba(19,136,8,0.32)", animation: "indep-breathe 8.5s ease-in-out 1.2s infinite" }}
      />

      {confetti.map((c) => (
        <span
          key={`c-${c.id}`}
          className="absolute top-0 rounded-[1px]"
          style={{
            left: c.left,
            width: c.w,
            height: c.h,
            background: c.color,
            opacity: 0,
            animation: `confetti-fall ${c.duration} linear ${c.delay} infinite`,
          }}
        />
      ))}

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

      <Kite className="left-[6%] top-[18%] hidden md:block" color="#ff9933" delay="0s" duration="7s" size={44} />
      <Kite className="right-[8%] top-[12%] hidden md:block" color="#138808" delay="1.4s" duration="8.6s" size={38} />
      <Kite className="left-[22%] bottom-[10%] hidden lg:block" color="#0a3d91" delay="2.2s" duration="9.4s" size={30} />
      <Kite className="right-[24%] bottom-[16%] hidden lg:block" color="#ff9933" delay="0.8s" duration="8s" size={26} />
    </div>
  );
}

/** Radiating tricolor burst lines behind the headline. */
function BurstLines() {
  const lines = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-50" aria-hidden="true">
      {lines.map((_, i) => (
        <span
          key={i}
          className="absolute h-24 w-[2px] origin-bottom md:h-32"
          style={{
            background: `linear-gradient(to top, transparent, ${["#ff9933", "#ffffff", "#138808"][i % 3]})`,
            transform: `rotate(${(360 / lines.length) * i}deg) translateY(-58px)`,
            opacity: 0,
            animation: `burst-line 4.5s ease-out ${(i % 7) * 0.35}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Waving tricolor flag cut-out. */
function WavingFlag({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 80" className="h-full w-full drop-shadow-lg">
        <defs>
          <clipPath id="flagWaveClip">
            <path d="M0 6 Q30 0 60 6 T120 6 L120 74 Q90 80 60 74 T0 74 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#flagWaveClip)">
          <rect x="0" y="0" width="120" height="27" fill="#ff9933" />
          <rect x="0" y="27" width="120" height="26" fill="#ffffff" />
          <rect x="0" y="53" width="120" height="27" fill="#138808" />
        </g>
        <circle cx="60" cy="40" r="11" fill="none" stroke="#0a3d91" strokeWidth="1.6" />
        <circle cx="60" cy="40" r="2" fill="#0a3d91" />
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1="60"
            y1="40"
            x2="60"
            y2="29.5"
            stroke="#0a3d91"
            strokeWidth="0.8"
            transform={`rotate(${(360 / 16) * i} 60 40)`}
          />
        ))}
      </svg>
    </div>
  );
}

const PROMISES = ["98% Visa Success", "5000+ Students Abroad", "20+ Countries", "Free Counseling"];

/** Celebratory Independence Day banner shown above the hero. */
export function IndependenceBanner() {
  const years = new Date().getFullYear() - 1947;

  return (
    <section
      aria-label="Independence Day celebration"
      className="relative overflow-hidden border-b border-border/60 pt-24 pb-9 md:pt-28 md:pb-12"
      style={{
        background:
          "radial-gradient(120% 140% at 50% -20%, rgba(255,153,51,0.20) 0%, transparent 58%), radial-gradient(120% 140% at 50% 120%, rgba(19,136,8,0.20) 0%, transparent 58%)",
      }}
    >
      <TricolorParticles />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
          style={{ animation: "indep-pop 0.9s cubic-bezier(0.2,0.8,0.2,1) both" }}
        >
          <div className="relative isolate mb-5">
            <div className="tricolor-glow indep-ring relative inline-flex items-center gap-2.5 rounded-full bg-card/85 px-5 py-2 backdrop-blur">
              <WavingFlag className="h-5 w-8" />
              <span className="text-xs font-bold tracking-wide text-foreground md:text-sm">
                15 August · Happy Independence Day
              </span>
              <AshokaChakra className="h-4 w-4 text-tricolor-chakra dark:text-primary" speed={6} />
            </div>
          </div>

          <div className="relative isolate">
            <BurstLines />
            <h2 className="relative text-4xl font-extrabold leading-[1.05] md:text-6xl">
              <span className="tricolor-text">Freedom to Dream Big</span>
            </h2>
          </div>

          <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            {years > 0 ? `Celebrating ${years} years of independence` : "Celebrating independence"} —
            and helping Indian students take that dream across the world. 🇮🇳
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {PROMISES.map((p, i) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur md:text-sm"
                style={{ animation: `indep-pop 0.7s ease-out ${0.35 + i * 0.12}s both` }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ["#ff9933", "#138808", "#0a3d91", "#ff9933"][i % 4] }}
                />
                {p}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="tricolor-glow indep-shine relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] md:text-base"
              style={{ background: "linear-gradient(135deg,#ff9933 0%,#e8730f 45%,#138808 100%)" }}
            >
              Free Counseling this Independence Week
            </a>
            <a
              href="https://wa.me/919870003748?text=Happy%20Independence%20Day!%20I'd%20like%20free%20study%20abroad%20counseling."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary-soft md:text-base"
              style={{ borderColor: "rgba(19,136,8,0.45)" }}
            >
              Talk to us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="tricolor-bar indep-shine absolute bottom-0 left-0 right-0 h-1.5" />
    </section>
  );
}

/** Site-wide festive ambience: drifting kites + confetti behind every section. */
export function IndependenceAmbience() {
  const kites = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        top: `${8 + i * 12}%`,
        side: i % 2 === 0 ? "left" : "right",
        offset: `${3 + (i % 3) * 5}%`,
        size: 22 + (i % 4) * 8,
        color: ["#ff9933", "#138808", "#0a3d91"][i % 3],
        delay: `${i * 1.1}s`,
        duration: `${7.5 + (i % 4) * 1.5}s`,
      })),
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 5.7 + (i % 4) * 4) % 99}%`,
        delay: `${(i % 9) * 1.1}s`,
        duration: `${7 + (i % 6) * 1.6}s`,
        w: 4 + (i % 3) * 2,
        h: 9 + (i % 4) * 4,
        color: ["#ff9933", "#ffffff", "#138808", "#0a3d91"][i % 4],
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {confetti.map((c) => (
        <span
          key={`ac-${c.id}`}
          className="absolute top-0 rounded-[1px] opacity-60"
          style={{
            left: c.left,
            width: c.w,
            height: c.h,
            background: c.color,
            animation: `confetti-fall ${c.duration} linear ${c.delay} infinite`,
          }}
        />
      ))}
      {kites.map((k) => (
        <Kite
          key={`ak-${k.id}`}
          className={`hidden opacity-40 md:block ${k.side === "left" ? "" : ""}`}
          color={k.color}
          delay={k.delay}
          duration={k.duration}
          size={k.size}
          style={{ top: k.top, [k.side]: k.offset } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/** Tricolor divider with a spinning chakra, placed between sections. */
export function TricolorDivider() {
  return (
    <div className="relative my-2 flex items-center justify-center" aria-hidden="true">
      <div className="h-[2px] flex-1" style={{ background: "linear-gradient(90deg,transparent,#ff9933)" }} />
      <div className="tricolor-glow mx-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/85 backdrop-blur">
        <AshokaChakra className="h-5 w-5 text-tricolor-chakra dark:text-primary" speed={7} />
      </div>
      <div className="h-[2px] flex-1" style={{ background: "linear-gradient(90deg,#138808,transparent)" }} />
    </div>
  );
}

/** Wraps a section with a festive tricolor edge + corner flag accent. */
export function FestiveSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px] opacity-70"
        style={{ background: "linear-gradient(180deg,#ff9933,#ffffff,#138808)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[3px] opacity-70"
        style={{ background: "linear-gradient(180deg,#138808,#ffffff,#ff9933)" }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
