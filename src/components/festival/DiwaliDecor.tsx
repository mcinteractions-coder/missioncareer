function Diya({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <g className="diwali-flame">
        <path d="M32 2 C38 12 38 20 32 24 C26 20 26 12 32 2Z" fill="oklch(0.85 0.17 85)" />
        <path d="M32 9 C35 15 35 19 32 22 C29 19 29 15 32 9Z" fill="oklch(0.7 0.2 45)" />
      </g>
      <path d="M4 26 Q32 30 60 26 Q56 46 32 46 Q8 46 4 26Z" fill="oklch(0.55 0.17 35)" />
      <path d="M10 30 Q32 34 54 30" stroke="oklch(0.82 0.15 80)" strokeWidth="2" fill="none" />
      <circle cx="20" cy="38" r="2" fill="oklch(0.85 0.15 85)" />
      <circle cx="32" cy="40" r="2" fill="oklch(0.85 0.15 85)" />
      <circle cx="44" cy="38" r="2" fill="oklch(0.85 0.15 85)" />
    </svg>
  );
}

function Lantern({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <svg viewBox="0 0 40 110" className={`diwali-lantern ${className}`} style={{ animationDelay: delay }} aria-hidden="true">
      <line x1="20" y1="0" x2="20" y2="34" stroke="oklch(0.65 0.12 70)" strokeWidth="1.5" />
      <path d="M8 34 H32 L36 44 Q20 92 4 44Z" fill="oklch(0.62 0.21 30)" />
      <path d="M12 44 Q20 80 28 44" fill="oklch(0.85 0.16 80 / 0.8)" />
      <rect x="10" y="30" width="20" height="6" rx="2" fill="oklch(0.8 0.15 80)" />
      <line x1="20" y1="80" x2="20" y2="104" stroke="oklch(0.8 0.15 80)" strokeWidth="2" />
      <circle cx="20" cy="106" r="3" fill="oklch(0.8 0.15 80)" />
    </svg>
  );
}

const SPARKS = [
  { top: "14%", left: "6%", d: "0s" }, { top: "28%", left: "93%", d: ".6s" },
  { top: "46%", left: "3%", d: "1.2s" }, { top: "62%", left: "96%", d: "1.8s" },
  { top: "78%", left: "8%", d: ".9s" }, { top: "36%", left: "50%", d: "1.5s" },
];

export function DiwaliDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[35] overflow-hidden" aria-hidden="true">
      <Lantern className="absolute top-16 left-3 h-24 w-9 md:left-8 md:h-32 md:w-12" />
      <Lantern className="absolute top-16 right-3 h-20 w-8 md:right-10 md:h-28 md:w-10" delay="1s" />
      <Lantern className="absolute top-16 hidden h-20 w-8 md:block md:left-[22%]" delay="1.6s" />
      <Lantern className="absolute top-16 hidden h-24 w-9 md:block md:right-[24%]" delay=".5s" />
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="diwali-spark absolute h-2 w-2 rounded-full bg-primary-glow"
          style={{ top: s.top, left: s.left, animationDelay: s.d, boxShadow: "var(--shadow-glow)" }}
        />
      ))}
      <Diya className="absolute bottom-24 right-2 hidden h-10 w-14 opacity-90 md:block" />
      <Diya className="absolute bottom-2 left-1/2 hidden h-10 w-14 -translate-x-1/2 opacity-80 md:block" />
    </div>
  );
}

export { Diya };
