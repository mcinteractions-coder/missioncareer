import type { ReactNode } from "react";

/* ---------- small building blocks ---------- */

function RakhiMotif({ size = 44, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      data-keep-color
      style={{ animation: `rakhi-spin 14s linear infinite`, animationDelay: `${delay}s` }}
    >
      <circle cx="50" cy="50" r="16" fill="#f2b933" />
      <circle cx="50" cy="50" r="8" fill="#e0245e" />
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="5.5"
          ry="12"
          fill={i % 2 === 0 ? "#e0245e" : "#8b1d3f"}
          opacity="0.9"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
    </svg>
  );
}

/** Thread of rakhis hanging across the top of a section */
export function RakhiThreadLine() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[5] overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-8 w-full" data-keep-color>
        <path d="M0 6 Q 300 40 600 6 T 1200 6" fill="none" stroke="#e0245e" strokeWidth="2.5" opacity="0.65" />
        <path d="M0 12 Q 300 46 600 12 T 1200 12" fill="none" stroke="#f2b933" strokeWidth="1.5" opacity="0.55" />
      </svg>
      <div className="absolute left-0 right-0 top-1 flex justify-around px-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              animation: `thread-sway ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
              transformOrigin: "top center",
              marginTop: i % 2 ? 10 : 2,
            }}
          >
            <RakhiMotif size={i % 3 === 0 ? 30 : 22} delay={i * 0.4} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Corner rakhi + gold thread accents inside every section */
function RakhiCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      <div className="absolute -left-4 -top-2 opacity-70" style={{ animation: "rakhi-glow 6s ease-in-out infinite" }}>
        <RakhiMotif size={54} />
      </div>
      <div className="absolute -right-4 top-10 opacity-60" style={{ animation: "rakhi-glow 7s ease-in-out infinite" }}>
        <RakhiMotif size={40} delay={1.2} />
      </div>
      <div className="absolute -left-3 bottom-6 opacity-50" style={{ animation: "rakhi-glow 8s ease-in-out infinite" }}>
        <RakhiMotif size={34} delay={2} />
      </div>
      <div className="absolute -right-2 bottom-2 opacity-55" style={{ animation: "rakhi-glow 5.5s ease-in-out infinite" }}>
        <RakhiMotif size={46} delay={0.6} />
      </div>
      {/* soft rose/gold wash edges */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: "linear-gradient(90deg,#e0245e,#f2b933,#8b1d3f,#e0245e)", backgroundSize: "300% 100%", animation: "rakhi-sweep 9s linear infinite" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{ background: "linear-gradient(90deg,#f2b933,#e0245e,#f2b933)", backgroundSize: "300% 100%", animation: "rakhi-sweep 11s linear infinite" }}
      />
    </div>
  );
}

/** Wrap any section to give it the full Raksha Bandhan treatment */
export function RakhiSection({ children }: { children: ReactNode }) {
  return (
    <div className="rakhi-section relative isolate">
      <RakhiCorners />
      <RakhiThreadLine />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Full-page floating ambience: petals, threads, drifting rakhis */
export function RakhiAmbience() {
  const petals = Array.from({ length: 18 });
  const floats = Array.from({ length: 10 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 12% 8%, rgba(224,36,94,0.10), transparent 60%), radial-gradient(800px 480px at 88% 78%, rgba(242,185,51,0.12), transparent 62%)",
        }}
      />
      {petals.map((_, i) => (
        <span
          key={`p${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 5.6 + 3) % 100}%`,
            width: 8 + (i % 4) * 3,
            height: 6 + (i % 3) * 3,
            background: i % 3 === 0 ? "#f2b933" : i % 3 === 1 ? "#e0245e" : "#f2757f",
            animation: `petal-fall ${11 + (i % 6) * 2}s linear infinite`,
            animationDelay: `${i * 0.9}s`,
            filter: "blur(0.3px)",
          }}
        />
      ))}
      {floats.map((_, i) => (
        <div
          key={`f${i}`}
          className="absolute"
          style={{
            left: `${(i * 11 + 5) % 96}%`,
            bottom: `${(i * 9) % 70}%`,
            animation: `rakhi-float ${14 + (i % 5) * 3}s ease-in-out infinite`,
            animationDelay: `${i * 1.3}s`,
          }}
        >
          <RakhiMotif size={26 + (i % 3) * 12} delay={i * 0.5} />
        </div>
      ))}
    </div>
  );
}

/** Divider between sections: thread + rakhi knot */
export function RakhiDivider() {
  return (
    <div className="relative h-16 overflow-hidden" aria-hidden>
      <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
        style={{ background: "linear-gradient(90deg,transparent,#e0245e,#f2b933,#e0245e,transparent)", backgroundSize: "250% 100%", animation: "rakhi-sweep 10s linear infinite" }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RakhiMotif size={48} />
      </div>
      <div className="absolute left-[22%] top-1/2 -translate-y-1/2 opacity-70"><RakhiMotif size={26} delay={1} /></div>
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 opacity-70"><RakhiMotif size={26} delay={2} /></div>
    </div>
  );
}

/** Celebration banner */
export function RakhiBanner() {
  return (
    <div className="rakhi-section relative overflow-hidden">
      <div
        className="relative flex flex-wrap items-center justify-center gap-3 px-4 py-3 text-center"
        style={{ background: "linear-gradient(100deg,#8b1d3f,#e0245e 45%,#f2b933)", backgroundSize: "220% 100%", animation: "rakhi-sweep 12s linear infinite" }}
      >
        <RakhiMotif size={28} />
        <span className="text-sm font-bold tracking-wide text-white md:text-base" style={{ WebkitTextFillColor: "#fff" }}>
          Happy Raksha Bandhan — a bond of trust, a promise for your future abroad
        </span>
        <RakhiMotif size={28} delay={1.5} />
      </div>
    </div>
  );
}
