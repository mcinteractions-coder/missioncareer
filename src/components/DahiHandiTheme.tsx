/**
 * Dahi Handi (Janmashtami) festive theme — decorative only.
 * Purely presentational: banners, hanging handis, floating matkis,
 * a govinda human-pyramid animation and festive dividers.
 */
import krishnaBaby from "@/assets/krishna.png";
import krishnaFlute from "@/assets/krishna-flute.png";



function MatkiSVG({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 72" className={className} style={style} aria-hidden="true">
      {/* rope */}
      <path d="M32 0 V10" stroke="hsl(35 60% 45%)" strokeWidth="2" />
      {/* garland ring */}
      <ellipse cx="32" cy="14" rx="14" ry="4" fill="hsl(45 90% 55%)" opacity="0.9" />
      {/* pot body */}
      <path
        d="M18 18 C8 28 6 44 16 56 C22 64 42 64 48 56 C58 44 56 28 46 18 Z"
        fill="url(#matkiBody)"
      />
      {/* pot rim */}
      <ellipse cx="32" cy="18" rx="15" ry="5" fill="hsl(20 55% 32%)" />
      <ellipse cx="32" cy="17" rx="11" ry="3.4" fill="hsl(0 0% 100%)" opacity="0.85" />
      {/* decorative bands */}
      <path d="M11 36 C24 42 40 42 53 36" stroke="hsl(45 92% 58%)" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M13 46 C24 51 40 51 51 46" stroke="hsl(0 72% 52%)" strokeWidth="2.5" fill="none" opacity="0.85" />
      {/* dripping curd */}
      <path d="M22 21 c0 6 -3 8 -1 12 c1.6 3 4 1 3.6 -3 c-.3 -3 -1.6 -5 -2.6 -9 Z" fill="hsl(0 0% 100%)" opacity="0.9" />
      <defs>
        <linearGradient id="matkiBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(22 62% 48%)" />
          <stop offset="55%" stopColor="hsl(18 55% 36%)" />
          <stop offset="100%" stopColor="hsl(14 50% 26%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FlutePeacock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} aria-hidden="true">
      <path d="M4 26 L70 14" stroke="hsl(35 55% 38%)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="23" r="1.6" fill="hsl(30 30% 18%)" />
      <circle cx="30" cy="21" r="1.6" fill="hsl(30 30% 18%)" />
      <circle cx="40" cy="19" r="1.6" fill="hsl(30 30% 18%)" />
      <circle cx="50" cy="17" r="1.6" fill="hsl(30 30% 18%)" />
      <path d="M70 14 c6 -8 12 -6 10 0 c-2 6 -8 6 -10 0 Z" fill="hsl(180 70% 40%)" />
      <circle cx="76" cy="12" r="2" fill="hsl(45 92% 58%)" />
    </svg>
  );
}

/** Fixed, non-interactive festive ambience behind the whole page. */
export function DahiHandiAmbience() {
  const matkis = [
    { left: "6%", size: 46, delay: "0s", dur: "7s" },
    { left: "22%", size: 34, delay: "1.4s", dur: "8.5s" },
    { left: "44%", size: 40, delay: "0.7s", dur: "7.8s" },
    { left: "63%", size: 30, delay: "2.1s", dur: "9.2s" },
    { left: "81%", size: 44, delay: "1s", dur: "8s" },
    { left: "93%", size: 32, delay: "2.6s", dur: "7.4s" },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* warm festive wash */}
      <div className="dahi-wash absolute inset-0" />

      {/* bunting strings top */}
      <div className="absolute inset-x-0 top-0 flex justify-between px-2">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="dahi-flag"
            style={{
              animationDelay: `${(i % 7) * 0.22}s`,
              background:
                i % 3 === 0
                  ? "hsl(45 92% 55%)"
                  : i % 3 === 1
                    ? "hsl(0 72% 52%)"
                    : "hsl(180 65% 42%)",
            }}
          />
        ))}
      </div>

      {/* hanging swinging matkis */}
      {matkis.map((m, i) => (
        <div
          key={i}
          className="dahi-hang absolute top-0"
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.dur }}
        >
          <div className="dahi-rope" />
          <MatkiSVG style={{ width: m.size, height: m.size * 1.12 }} />
        </div>
      ))}

      {/* drifting butter / curd drops */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={`d-${i}`}
          className="dahi-drop"
          style={{
            left: `${(i * 7.3 + 4) % 100}%`,
            animationDelay: `${(i % 9) * 1.1}s`,
            animationDuration: `${9 + (i % 5) * 2}s`,
          }}
        />
      ))}

      {/* Lord Krishna presence — corner murals */}
      <img
        src={krishnaFlute}
        alt="Lord Krishna playing the flute"
        loading="lazy"
        width={1024}
        height={1024}
        className="dahi-bob absolute bottom-0 left-2 h-56 w-auto opacity-25 md:h-80"
      />
      <img
        src={krishnaBaby}
        alt="Bal Gopal Krishna with a pot of butter"
        loading="lazy"
        width={1024}
        height={1024}
        className="dahi-bob absolute bottom-0 right-2 h-48 w-auto opacity-25 md:h-72"
        style={{ animationDelay: "1.2s" }}
      />
      <img
        src={krishnaBaby}
        alt="Bal Gopal Krishna celebrating Janmashtami"
        loading="lazy"
        width={1024}
        height={1024}
        className="dahi-bob absolute left-1/2 top-1/3 h-32 w-auto -translate-x-1/2 opacity-15 md:h-44"
        style={{ animationDelay: "0.6s" }}
      />
    </div>

  );
}

/** Festive banner that occupies real flow space (no overlap). */
export function DahiHandiBanner() {
  return (
    <div className="relative z-20 w-full overflow-hidden dahi-banner">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-4 text-center md:flex-row md:justify-center md:gap-5 md:py-5">
        <MatkiSVG className="h-12 w-11 shrink-0 dahi-bob" />
        <div>
          <p className="text-sm font-extrabold tracking-wide text-primary-foreground md:text-base">
            Govinda Aala Re! Happy Janmashtami from Mission Career
          </p>
          <p className="text-xs text-primary-foreground/85 md:text-sm">
            Aim high, break the handi — free counseling all festive week
          </p>
        </div>
        <FlutePeacock className="hidden h-9 w-20 shrink-0 dahi-bob md:block" />
      </div>
    </div>
  );
}

/** Slim festive separator between sections. */
export function DahiHandiDivider() {
  return (
    <div className="relative z-10 flex items-center justify-center gap-3 py-5" aria-hidden="true">
      <span className="h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent to-primary/50 md:w-28" />
      <MatkiSVG className="h-8 w-7 dahi-bob" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary/70">Govinda</span>
      <MatkiSVG className="h-8 w-7 dahi-bob" style={{ animationDelay: "0.6s" }} />
      <span className="h-[2px] w-16 rounded-full bg-gradient-to-l from-transparent to-primary/50 md:w-28" />
    </div>
  );
}

function Govinda({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={`dahi-govinda ${className}`} style={{ animationDelay: delay }} aria-hidden="true">
      <circle cx="20" cy="10" r="7" fill="hsl(28 45% 62%)" />
      <path d="M13 7 q7 -6 14 0 q-7 -2 -14 0 Z" fill="hsl(0 72% 48%)" />
      <path d="M20 17 l8 6 v16 h-16 V23 Z" fill="hsl(200 70% 45%)" />
      <path d="M12 24 l-8 -6" stroke="hsl(28 45% 62%)" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 24 l8 -6" stroke="hsl(28 45% 62%)" strokeWidth="4" strokeLinecap="round" />
      <path d="M15 39 v16" stroke="hsl(28 45% 62%)" strokeWidth="5" strokeLinecap="round" />
      <path d="M25 39 v16" stroke="hsl(28 45% 62%)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Human-pyramid (govinda) scene that reaches for the handi. */
export function DahiHandiPyramid() {
  return (
    <section className="relative z-10 overflow-hidden py-10 md:py-14" aria-label="Dahi Handi celebration">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-card/80 p-6 shadow-card backdrop-blur md:p-8">
          <h2 className="text-center text-2xl font-extrabold md:text-3xl">
            Reach Higher — <span className="text-gradient">Break Your Handi</span>
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">
            Just like the govindas, one strong team lifts you to your goal. We are your base — you take the leap.
          </p>

          <div className="relative mx-auto mt-8 h-64 w-full max-w-xl md:h-80">
            {/* hanging handi target */}
            <div className="dahi-target absolute left-1/2 top-0 -translate-x-1/2">
              <div className="mx-auto h-10 w-[2px] bg-[hsl(35_60%_45%)]" />
              <MatkiSVG className="h-16 w-14" />
            </div>

            {/* pyramid tiers */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0">
              <div className="flex justify-center">
                <Govinda className="h-16 w-11" delay="0.9s" />
              </div>
              <div className="flex justify-center -mt-3 gap-1">
                <Govinda className="h-16 w-11" delay="0.6s" />
                <Govinda className="h-16 w-11" delay="0.75s" />
              </div>
              <div className="flex justify-center -mt-3 gap-1">
                <Govinda className="h-16 w-11" delay="0.2s" />
                <Govinda className="h-16 w-11" delay="0.35s" />
                <Govinda className="h-16 w-11" delay="0.5s" />
              </div>
              <div className="h-2 w-2/3 rounded-full bg-primary/20 blur-sm" />
            </div>

            {/* burst on break */}
            <span className="dahi-burst absolute left-1/2 top-10 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
