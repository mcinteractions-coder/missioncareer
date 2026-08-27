import type { ReactNode } from "react";

/* =========================================================
   Premium rakhi artwork — 6 distinct hand-crafted variants
   ========================================================= */

type RakhiProps = { size?: number; delay?: number; spin?: boolean };

function Shell({ size = 48, delay = 0, spin = true, children }: RakhiProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      data-keep-color
      style={
        spin
          ? { animation: "rakhi-spin 22s linear infinite", animationDelay: `${delay}s`, overflow: "visible" }
          : { overflow: "visible" }
      }
    >
      {children}
    </svg>
  );
}

/** Kundan stone rakhi — gold filigree with a ruby centre */
function RakhiKundan(p: RakhiProps) {
  const id = "k" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="55%" stopColor="#f2b933" />
          <stop offset="100%" stopColor="#a9720c" />
        </radialGradient>
        <radialGradient id={`${id}r`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ff8fae" />
          <stop offset="60%" stopColor="#e0245e" />
          <stop offset="100%" stopColor="#7c1030" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={i} cx="60" cy="22" rx="5" ry="14" fill={`url(#${id}g)`} opacity={i % 2 ? 0.75 : 1} transform={`rotate(${i * 22.5} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="26" fill={`url(#${id}g)`} />
      <circle cx="60" cy="60" r="26" fill="none" stroke="#7c4a04" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx="60" cy="41" r="4" fill="#fff8e1" opacity="0.95" transform={`rotate(${i * 45} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="13" fill={`url(#${id}r)`} />
      <circle cx="55" cy="55" r="3.5" fill="#fff" opacity="0.7" />
    </Shell>
  );
}

/** Pearl-ring rakhi — ivory pearls around a gold dome */
function RakhiPearl(p: RakhiProps) {
  const id = "p" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}pe`} cx="32%" cy="28%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f0e6d2" />
          <stop offset="100%" stopColor="#bda98a" />
        </radialGradient>
        <radialGradient id={`${id}gd`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff0bd" />
          <stop offset="60%" stopColor="#e9a916" />
          <stop offset="100%" stopColor="#8f5d05" />
        </radialGradient>
      </defs>
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx="60" cy="20" r="7.5" fill={`url(#${id}pe)`} transform={`rotate(${i * 25.7} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="24" fill={`url(#${id}gd)`} />
      <circle cx="60" cy="60" r="24" fill="none" stroke="#fff5d0" strokeWidth="1.2" opacity="0.6" />
      <circle cx="60" cy="60" r="10" fill="#8b1d3f" />
      <circle cx="60" cy="60" r="4" fill="#f7d774" />
    </Shell>
  );
}

/** Silk-thread tassel rakhi — layered rose petals */
function RakhiSilk(p: RakhiProps) {
  const id = "s" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}a`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ff9cb6" />
          <stop offset="55%" stopColor="#e0245e" />
          <stop offset="100%" stopColor="#8b1d3f" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffe6a0" />
          <stop offset="100%" stopColor="#d99a10" />
        </radialGradient>
      </defs>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d="M60 60 C 48 34, 72 34, 60 60" fill={`url(#${id}a)`} transform={`rotate(${i * 30} 60 60)`} opacity="0.95" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={`i${i}`} d="M60 60 C 52 44, 68 44, 60 60" fill={`url(#${id}b)`} transform={`rotate(${i * 30 + 15} 60 60)`} opacity="0.9" />
      ))}
      <circle cx="60" cy="60" r="12" fill={`url(#${id}b)`} />
      <circle cx="60" cy="60" r="5.5" fill="#8b1d3f" />
    </Shell>
  );
}

/** Evil-eye / nazar rakhi — deep blue with gold ring */
function RakhiNazar(p: RakhiProps) {
  const id = "n" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="60%" stopColor="#e9a916" />
          <stop offset="100%" stopColor="#8f5d05" />
        </radialGradient>
      </defs>
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x="58.5" y="16" width="3" height="13" rx="1.5" fill={`url(#${id}g)`} transform={`rotate(${i * 18} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="27" fill={`url(#${id}g)`} />
      <circle cx="60" cy="60" r="21" fill="#f7fbff" />
      <circle cx="60" cy="60" r="15" fill="#1b4f9c" />
      <circle cx="60" cy="60" r="8" fill="#f7fbff" />
      <circle cx="60" cy="60" r="4" fill="#0a1d3c" />
      <circle cx="56" cy="55" r="2" fill="#fff" opacity="0.85" />
    </Shell>
  );
}

/** Zari floral rakhi — marigold layers with maroon core */
function RakhiFloral(p: RakhiProps) {
  const id = "f" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}m`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffe07a" />
          <stop offset="55%" stopColor="#f59f0b" />
          <stop offset="100%" stopColor="#a35a02" />
        </radialGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <ellipse key={i} cx="60" cy="26" rx="7" ry="16" fill={`url(#${id}m)`} opacity={i % 2 ? 0.7 : 1} transform={`rotate(${i * 20} 60 60)`} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={`c${i}`} cx="60" cy="44" rx="5" ry="10" fill="#e0245e" opacity="0.85" transform={`rotate(${i * 36} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="11" fill="#8b1d3f" />
      <circle cx="60" cy="60" r="4.5" fill="#f7d774" />
    </Shell>
  );
}

/** Om / spiritual rakhi — sandalwood + gold beads */
function RakhiOm(p: RakhiProps) {
  const id = "o" + (p.delay ?? 0);
  return (
    <Shell {...p}>
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff2c8" />
          <stop offset="60%" stopColor="#e0a219" />
          <stop offset="100%" stopColor="#8a5605" />
        </radialGradient>
      </defs>
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx="60" cy="21" r="6" fill="#8b1d3f" transform={`rotate(${i * 30} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="25" fill={`url(#${id}g)`} />
      <circle cx="60" cy="60" r="19" fill="#fdf6e3" />
      <text x="60" y="72" textAnchor="middle" fontSize="30" fontWeight="700" fill="#8b1d3f" style={{ WebkitTextFillColor: "#8b1d3f" }}>
        ॐ
      </text>
    </Shell>
  );
}

const VARIANTS = [RakhiKundan, RakhiPearl, RakhiSilk, RakhiNazar, RakhiFloral, RakhiOm];

export function Rakhi({ variant = 0, ...rest }: RakhiProps & { variant?: number }) {
  const Comp = VARIANTS[variant % VARIANTS.length]!;
  return <Comp {...rest} />;
}

/* =========================================================
   Bhai–Behen tying scene
   ========================================================= */

export function BhaiBehenScene({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto w-full ${compact ? "max-w-md" : "max-w-2xl"}`} aria-hidden>
      <svg viewBox="0 0 520 300" className="w-full" data-keep-color style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="bb-sari" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e0245e" />
            <stop offset="100%" stopColor="#8b1d3f" />
          </linearGradient>
          <linearGradient id="bb-kurta" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2b933" />
            <stop offset="100%" stopColor="#c47d05" />
          </linearGradient>
          <radialGradient id="bb-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(242,185,51,0.55)" />
            <stop offset="100%" stopColor="rgba(242,185,51,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="260" cy="255" rx="200" ry="26" fill="url(#bb-glow)" style={{ animation: "rakhi-glow 5s ease-in-out infinite" }} />

        {/* Sister (left) */}
        <g style={{ animation: "bb-sway 6s ease-in-out infinite", transformOrigin: "150px 250px" }}>
          <path d="M120 250 C 118 195, 128 165, 152 158 C 178 152, 192 178, 190 250 Z" fill="url(#bb-sari)" />
          <path d="M152 158 C 168 168, 176 200, 172 250" stroke="#f2b933" strokeWidth="3" fill="none" opacity="0.8" />
          <circle cx="152" cy="132" r="24" fill="#e8b98f" />
          <path d="M128 130 C 126 106, 178 104, 176 132 C 176 150, 170 158, 168 150 C 166 126, 138 126, 136 152 C 134 160, 128 148, 128 130 Z" fill="#2b1a17" />
          <path d="M126 138 C 118 176, 122 206, 132 226" stroke="#2b1a17" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="152" cy="112" r="3" fill="#e0245e" />
          {/* tying arm */}
          <path
            d="M186 180 C 214 172, 246 168, 268 168"
            stroke="#e8b98f"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
            style={{ animation: "bb-arm 5s ease-in-out infinite", transformOrigin: "186px 180px" }}
          />
        </g>

        {/* Brother (right) */}
        <g style={{ animation: "bb-sway 6s ease-in-out infinite reverse", transformOrigin: "370px 250px" }}>
          <path d="M336 250 C 332 194, 346 164, 372 158 C 400 152, 414 180, 410 250 Z" fill="url(#bb-kurta)" />
          <path d="M372 158 L 372 250" stroke="#8b1d3f" strokeWidth="3" opacity="0.6" />
          <circle cx="372" cy="130" r="25" fill="#dda072" />
          <path d="M347 124 C 348 100, 398 100, 397 126 C 392 116, 352 114, 347 124 Z" fill="#241512" />
          {/* extended wrist */}
          <path d="M340 178 C 316 172, 296 170, 280 170" stroke="#dda072" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* rakhi tied on wrist */}
          <g style={{ animation: "bb-tie 5s ease-in-out infinite", transformOrigin: "282px 170px" }}>
            <g transform="translate(258 146) scale(0.42)">
              <RakhiKundan size={120} spin />
            </g>
          </g>
          {/* thread trailing */}
          <path d="M268 176 C 258 190, 276 196, 264 210" stroke="#e0245e" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: "thread-sway 4s ease-in-out infinite" }} />
        </g>

        {/* thali of sweets */}
        <g transform="translate(230 232)">
          <ellipse cx="30" cy="12" rx="46" ry="12" fill="#e9a916" />
          <ellipse cx="30" cy="9" rx="46" ry="11" fill="#f7d774" />
          <circle cx="14" cy="7" r="6" fill="#e0245e" />
          <circle cx="30" cy="5" r="6" fill="#fff3c4" />
          <circle cx="46" cy="7" r="6" fill="#f59f0b" />
        </g>

        {/* falling blessings */}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={i}
            cx={150 + i * 36}
            cy="40"
            r={2.5 + (i % 3)}
            fill={i % 2 ? "#f2b933" : "#e0245e"}
            style={{ animation: `bb-bless ${4 + (i % 4)}s linear infinite`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* =========================================================
   Section decoration
   ========================================================= */

/** Thread of premium rakhis hanging across the top of a section */
export function RakhiThreadLine() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[5] overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1200 44" preserveAspectRatio="none" className="h-10 w-full" data-keep-color>
        <path d="M0 6 Q 300 42 600 6 T 1200 6" fill="none" stroke="#e0245e" strokeWidth="2.5" opacity="0.6" />
        <path d="M0 12 Q 300 48 600 12 T 1200 12" fill="none" stroke="#f2b933" strokeWidth="1.5" opacity="0.5" />
      </svg>
      <div className="absolute left-0 right-0 top-1 flex justify-around px-3">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              animation: `thread-sway ${3 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              transformOrigin: "top center",
              marginTop: i % 2 ? 12 : 2,
            }}
          >
            <Rakhi variant={i} size={i % 3 === 0 ? 34 : 26} delay={i * 0.4} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Corner rakhis + gold thread accents inside every section */
function RakhiCorners() {
  const corners = [
    { cls: "-left-5 top-6", size: 58, v: 0 },
    { cls: "-right-5 top-20", size: 46, v: 1 },
    { cls: "-left-4 bottom-16", size: 40, v: 2 },
    { cls: "-right-3 bottom-4", size: 52, v: 3 },
    { cls: "left-1/4 -top-3", size: 30, v: 4 },
    { cls: "right-1/3 bottom-1", size: 32, v: 5 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      {corners.map((c, i) => (
        <div key={i} className={`absolute ${c.cls} opacity-70`} style={{ animation: "rakhi-glow 7s ease-in-out infinite", animationDelay: `${i * 0.7}s` }}>
          <Rakhi variant={c.v} size={c.size} delay={i * 0.6} />
        </div>
      ))}
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

/** Full-page ambience: petals, drifting premium rakhis, warm glow */
export function RakhiAmbience() {
  const petals = Array.from({ length: 22 });
  const floats = Array.from({ length: 22 });
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
            left: `${(i * 4.6 + 2) % 100}%`,
            width: 7 + (i % 4) * 3,
            height: 5 + (i % 3) * 3,
            background: i % 3 === 0 ? "#f2b933" : i % 3 === 1 ? "#e0245e" : "#f2757f",
            animation: `petal-fall ${11 + (i % 6) * 2}s linear infinite`,
            animationDelay: `${i * 0.7}s`,
            filter: "blur(0.3px)",
          }}
        />
      ))}
      {floats.map((_, i) => (
        <div
          key={`f${i}`}
          className="absolute"
          style={{
            left: `${(i * 9 + 3) % 96}%`,
            bottom: `${(i * 13) % 80}%`,
            animation: `rakhi-float ${14 + (i % 6) * 3}s ease-in-out infinite`,
            animationDelay: `${i * 0.9}s`,
          }}
        >
          <Rakhi variant={i} size={26 + (i % 4) * 12} delay={i * 0.5} />
        </div>
      ))}
    </div>
  );
}

/** Divider between sections: thread + rakhi knots of mixed variants */
export function RakhiDivider() {
  return (
    <div className="relative h-20 overflow-hidden" aria-hidden>
      <div
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
        style={{ background: "linear-gradient(90deg,transparent,#e0245e,#f2b933,#e0245e,transparent)", backgroundSize: "250% 100%", animation: "rakhi-sweep 10s linear infinite" }}
      />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${8 + i * 14}%`, animation: "rakhi-glow 6s ease-in-out infinite", animationDelay: `${i * 0.4}s` }}
        >
          <Rakhi variant={i} size={i === 3 ? 54 : 30} delay={i * 0.5} />
        </div>
      ))}
    </div>
  );
}

/** Celebration banner with the bhai–behen scene */
export function RakhiBanner() {
  return (
    <div className="rakhi-section relative overflow-hidden">
      <div
        className="relative px-4 py-6 md:py-8"
        style={{ background: "linear-gradient(100deg,#6d1230,#a81a45 40%,#e0245e 65%,#f2b933)", backgroundSize: "220% 100%", animation: "rakhi-sweep 14s linear infinite" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Rakhi variant={0} size={44} />
            <div className="text-center md:text-left">
              <p className="text-base font-extrabold tracking-wide text-white md:text-xl" style={{ WebkitTextFillColor: "#fff" }}>
                Happy Raksha Bandhan
              </p>
              <p className="text-xs text-white/85 md:text-sm" style={{ WebkitTextFillColor: "rgba(255,255,255,0.85)" }}>
                Ek dhaaga bharose ka — aur ek waada aapke future abroad ka
              </p>
            </div>
            <Rakhi variant={2} size={44} delay={1.5} />
          </div>
          <BhaiBehenScene compact />
        </div>
      </div>
    </div>
  );
}
