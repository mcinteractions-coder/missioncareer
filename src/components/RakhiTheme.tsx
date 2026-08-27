import { useEffect, useState, type ReactNode } from "react";

/* ---------------- Premium kundan rakhi (single, high-detail) ---------------- */
export function KundanRakhi({ size = 96, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} style={style} aria-hidden="true" data-keep-color>
      <defs>
        <radialGradient id="rbGoldCore" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff4cf" />
          <stop offset="45%" stopColor="#e8c65c" />
          <stop offset="100%" stopColor="#a67c13" />
        </radialGradient>
        <linearGradient id="rbSilk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d1734" />
          <stop offset="55%" stopColor="#5c1026" />
          <stop offset="100%" stopColor="#3d0a19" />
        </linearGradient>
        <linearGradient id="rbThread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c1026" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#5c1026" />
        </linearGradient>
      </defs>

      {/* silk thread arms */}
      <path d="M6 96 C 30 78, 40 70, 48 62" stroke="url(#rbThread)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M114 96 C 90 78, 80 70, 72 62" stroke="url(#rbThread)" strokeWidth="3.2" fill="none" strokeLinecap="round" />

      {/* outer filigree petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="60" cy="20" rx="5.4" ry="12"
          fill="url(#rbGoldCore)"
          opacity="0.95"
          transform={`rotate(${i * 30} 60 60)`}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`p${i}`} cx="60" cy="14" r="2.1" fill="#fdf8ee" opacity="0.9" transform={`rotate(${i * 30 + 15} 60 60)`} />
      ))}

      {/* medallion */}
      <circle cx="60" cy="60" r="27" fill="url(#rbSilk)" stroke="#c9a227" strokeWidth="2" />
      <circle cx="60" cy="60" r="20" fill="none" stroke="#e8c65c" strokeWidth="0.9" strokeDasharray="2 3" />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={`k${i}`} cx="60" cy="45" r="2.6" fill="#f0d78c" transform={`rotate(${i * 45} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="10" fill="url(#rbGoldCore)" stroke="#8a6410" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="4" fill="#7d1734" />
    </svg>
  );
}

/* ---------------- Scroll-progress silk thread ---------------- */
export function RakhiScrollThread() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="rb-scroll-thread" style={{ transform: `scaleX(${p})` }}>
      <span
        className="absolute -top-[5px] rb-glow"
        style={{ left: `${p * 100}%`, transform: "translateX(-50%)" }}
      >
        <KundanRakhi size={14} />
      </span>
    </div>
  );
}

/* ---------------- Faint gold mandala watermark ---------------- */
const MANDALA = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 200 200">
    <g fill="none" stroke="#c9a227" stroke-width="0.7">
      <circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="72"/>
      <circle cx="100" cy="100" r="48"/><circle cx="100" cy="100" r="24"/>
      ${Array.from({ length: 24 }).map((_, i) => `<ellipse cx="100" cy="34" rx="7" ry="26" transform="rotate(${i * 15} 100 100)"/>`).join("")}
    </g>
  </svg>`,
);

export function RakhiMandala({ className = "" }: { className?: string }) {
  return <div className={`rb-mandala ${className}`} style={{ backgroundImage: `url("data:image/svg+xml,${MANDALA}")` }} />;
}

/* ---------------- Section wrapper: hairline thread + corner motif ---------------- */
export function RakhiSection({
  children,
  motif = false,
  label,
  mandala = true,
  corners = true,
  hangs = true,
  tone = 1,
  sparkles = true,
}: {
  children: ReactNode;
  motif?: boolean;
  label?: string;
  mandala?: boolean;
  corners?: boolean;
  hangs?: boolean;
  tone?: number;
  sparkles?: boolean;
}) {
  const t = ((tone - 1) % 6) + 1;
  return (
    <div className={`rb-section rb-tone rb-tone-${t} overflow-hidden ${corners ? "rb-corners" : ""}`}>
      <span className="rb-wash" aria-hidden="true" />
      <span
        className="rb-aura"
        aria-hidden="true"
        style={{
          width: 260,
          height: 260,
          top: t % 2 === 0 ? "auto" : -70,
          bottom: t % 2 === 0 ? -80 : "auto",
          left: t % 3 === 0 ? "8%" : "auto",
          right: t % 3 === 0 ? "auto" : "6%",
          background: t % 2 === 0 ? "var(--rb-gold)" : "var(--rb-maroon)",
          animationDelay: `${t * 1.3}s`,
        }}
      />
      {sparkles &&
        Array.from({ length: 7 }).map((_, i) => (
          <span
            key={`sp${i}`}
            className="rb-spark"
            aria-hidden="true"
            style={{
              left: `${8 + i * 13}%`,
              bottom: `${6 + ((i * 17) % 40)}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      {mandala && <RakhiMandala />}

      {hangs && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="flex flex-col items-center" style={{ opacity: 0.7 }}>
              <span className="rb-hang block w-px" style={{ height: 18 + ((i * 13) % 26) }} />
              <KundanRakhi size={16 + (i % 3) * 4} className="rb-drift" style={{ animationDelay: `${i * 0.7}s` }} />
            </span>
          ))}
        </div>
      )}

      {label && (
        <div className="relative z-[1] flex justify-center pt-8">
          <span className="rb-ribbon inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] md:text-xs">
            <KundanRakhi size={16} />
            {label}
          </span>
        </div>
      )}

      {motif && (
        <>
          <KundanRakhi
            size={64}
            className="rb-drift pointer-events-none absolute right-3 top-10 opacity-25 md:right-8 md:opacity-40"
          />
          <KundanRakhi
            size={48}
            className="rb-drift pointer-events-none absolute left-3 bottom-8 opacity-20 md:left-8 md:opacity-35"
            style={{ animationDelay: "1.4s" }}
          />
        </>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/* ---------------- Divider: silk thread with a knot ---------------- */
export function RakhiDivider() {
  return (
    <div className="relative flex items-center justify-center py-4" aria-hidden="true">
      <span className="h-px w-1/3 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--rb-gold)_70%,transparent)] to-[color-mix(in_oklab,var(--rb-gold)_70%,transparent)]" />
      <KundanRakhi size={34} className="rb-drift mx-3 shrink-0" />
      <span className="h-px w-1/3 bg-gradient-to-l from-transparent via-[color-mix(in_oklab,var(--rb-gold)_70%,transparent)] to-[color-mix(in_oklab,var(--rb-gold)_70%,transparent)]" />
    </div>
  );
}

/* ---------------- Festive offer band ---------------- */
export function RakhiOfferBand() {
  return (
    <div className="rb-zari rb-foil mx-auto mb-8 max-w-3xl rounded-2xl px-5 py-4 text-center"
      style={{ background: "linear-gradient(135deg, #3d0a19 0%, #5c1026 55%, #7d1734 100%)" }}>
      <div className="flex items-center justify-center gap-3">
        <KundanRakhi size={38} className="rb-drift shrink-0" />
        <div className="text-left">
          <p className="text-sm font-extrabold tracking-wide rb-gold-text md:text-base">
            RAKHI SPECIAL — Free counseling + ₹5,000 off application fee
          </p>
          <p className="mt-0.5 text-xs text-[#f0d78c]/80 md:text-sm">
            Ek waada — aapke future ki raksha ka. Limited to this festive week.
          </p>
        </div>
      </div>
    </div>
  );
}
