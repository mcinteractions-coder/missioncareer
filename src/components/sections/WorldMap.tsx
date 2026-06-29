import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}
import { GraduationCap, DollarSign, Briefcase, Sparkles, Plane, Globe2, Search, MapPin } from "lucide-react";
import { TOP_UNIVERSITIES, type TopUni } from "@/lib/top-universities";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const INDIA: [number, number] = [78.96, 20.59];

type CountryInfo = {
  name: string;
  flag: string;
  coords: [number, number];
  unis: string;
  tuition: string;
  popular: string;
  highlight: string;
  tagline: string;
  accent: string; // hex for marker glow
};

const COUNTRIES: Record<string, CountryInfo> = {
  "United States of America": {
    name: "USA", flag: "🇺🇸", coords: [-98, 39],
    unis: "200+ Universities", tuition: "$25K – $55K / yr",
    popular: "CS · Business · Engineering", highlight: "3-yr STEM OPT",
    tagline: "Ivy League dreams & Silicon Valley vibes", accent: "#60a5fa",
  },
  "United Kingdom": {
    name: "UK", flag: "🇬🇧", coords: [-2, 54],
    unis: "150+ Universities", tuition: "£15K – £35K / yr",
    popular: "MBA · Law · Data Science", highlight: "2-yr Graduate Route",
    tagline: "1-year masters, world-class heritage", accent: "#f472b6",
  },
  "Canada": {
    name: "Canada", flag: "🇨🇦", coords: [-106, 56],
    unis: "100+ Universities", tuition: "CAD 20K – 40K / yr",
    popular: "Health · IT · Engineering", highlight: "3-yr PGWP + PR",
    tagline: "Friendliest PR-friendly destination", accent: "#fb7185",
  },
  "Australia": {
    name: "Australia", flag: "🇦🇺", coords: [134, -25],
    unis: "80+ Universities", tuition: "AUD 25K – 45K / yr",
    popular: "Nursing · IT · Hospitality", highlight: "4-yr post-study visa",
    tagline: "Sun, surf & global rankings", accent: "#fbbf24",
  },
  "Germany": {
    name: "Germany", flag: "🇩🇪", coords: [10, 51],
    unis: "90+ Universities", tuition: "€0 – €3K / yr (public)",
    popular: "Mech · Auto · Data Science", highlight: "Tuition-free public unis",
    tagline: "Engineering powerhouse, near-zero fees", accent: "#a78bfa",
  },
  "Ireland": {
    name: "Ireland", flag: "🇮🇪", coords: [-8, 53],
    unis: "40+ Universities", tuition: "€10K – €25K / yr",
    popular: "Pharma · IT · Finance", highlight: "2-yr stay-back",
    tagline: "EU's tech & pharma hub", accent: "#34d399",
  },
  "New Zealand": {
    name: "New Zealand", flag: "🇳🇿", coords: [172, -41],
    unis: "30+ Universities", tuition: "NZD 22K – 35K / yr",
    popular: "Agri · IT · Hospitality", highlight: "3-yr post-study",
    tagline: "Scenic studies, calm lifestyle", accent: "#22d3ee",
  },
};

export function WorldMap() {
  const [mapReady, setMapReady] = useState(false);
  const [active, setActive] = useState<CountryInfo>(COUNTRIES["United States of America"]);
  const [hover, setHover] = useState<string | null>(null);
  const [hoverUni, setHoverUni] = useState<TopUni | null>(null);
  const [selectedUni, setSelectedUni] = useState<TopUni | null>(null);
  const [query, setQuery] = useState("");
  const isDark = useIsDark();

  useEffect(() => setMapReady(true), []);

  const filteredUnis = TOP_UNIVERSITIES.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );
  });

  // theme-aware palette
  const t = isDark
    ? {
        bg: "#070b1f",
        ocean: ["#1e293b", "#0b1224"] as const,
        land: ["#1e2a4a", "#172041"] as const,
        landIdle: "#3b4a7a",
        stroke: "#0b1224",
        star: "rgba(255,255,255,0.7)",
        grid: "rgba(255,255,255,0.6)",
        radial:
          "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.4), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 45%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.25), transparent 50%)",
      }
    : {
        bg: "#f1f5fb",
        ocean: ["#e0e7ff", "#dbeafe"] as const,
        land: ["#e2e8f0", "#cbd5e1"] as const,
        landIdle: "#a5b4fc",
        stroke: "#ffffff",
        star: "rgba(99,102,241,0.55)",
        grid: "rgba(99,102,241,0.35)",
        radial:
          "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.18), transparent 45%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.18), transparent 50%)",
      };


  return (
    <section id="world-map" className="relative py-16 md:py-28 overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 -z-10" style={{ background: t.bg }}>
        <div className="absolute inset-0 opacity-[0.55]" style={{ backgroundImage: t.radial }} />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* tiny stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => {
            const top = (i * 53) % 100;
            const left = (i * 37) % 100;
            const delay = (i * 0.17) % 3;
            return (
              <span
                key={i}
                className="absolute h-[2px] w-[2px] rounded-full animate-pulse"
                style={{ top: `${top}%`, left: `${left}%`, background: t.star, animationDelay: `${delay}s`, animationDuration: "2.4s" }}
              />
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-foreground/5 dark:bg-white/10 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-semibold text-foreground border border-foreground/10 dark:border-white/20 mb-3">
            <Globe2 className="h-3.5 w-3.5" /> Hover · tap · explore
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Your <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-cyan-300 dark:via-indigo-300 dark:to-pink-300 bg-clip-text text-transparent">Global Classroom</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            7 flagship destinations · one tap from your dream university.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Map */}
          <div className="lg:col-span-3 relative rounded-3xl border border-foreground/10 dark:border-white/10 bg-card/70 dark:bg-white/[0.04] backdrop-blur-xl p-3 md:p-5 shadow-card">
            {/* glow ring */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20 dark:from-indigo-500/30 dark:to-pink-500/30 opacity-60 blur-xl -z-10" />

            {mapReady ? (
            <ComposableMap
              projectionConfig={{ scale: 150 }}
              style={{ width: "100%", height: "auto" }}
            >
              <defs>
                <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0b1224" />
                </radialGradient>
                <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={t.land[0]} />
                  <stop offset="100%" stopColor={t.land[1]} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="hoverGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="countryGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name as string;
                    const info = COUNTRIES[name];
                    const isActive = info && active.name === info.name;
                    const isHover = hover === name && info;
                    const fill = isActive
                      ? "url(#activeGrad)"
                      : isHover
                        ? "url(#hoverGrad)"
                        : info
                          ? t.landIdle
                          : "url(#landGrad)";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          setHover(name);
                          if (info) setActive(info);
                        }}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => { if (info) setActive(info); }}
                        filter={isActive || isHover ? "url(#countryGlow)" : undefined}
                        style={{
                          default: {
                            fill,
                            stroke: t.stroke,
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "fill 0.4s ease, transform 0.4s ease",
                            cursor: info ? "pointer" : "default",
                          },
                          hover: { fill, outline: "none" },
                          pressed: { fill: "url(#activeGrad)", outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Flight arc from India to active country */}
              <Line
                from={INDIA}
                to={active.coords}
                stroke={active.accent}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="4 4"
                fill="none"
                style={{ filter: `drop-shadow(0 0 4px ${active.accent})` }}
              />

              {/* India origin marker */}
              <Marker coordinates={INDIA}>
                <circle r={3} fill="#f59e0b" stroke={isDark ? "#fff" : "#1e293b"} strokeWidth={1.2} />
                <circle r={3} fill="none" stroke="#f59e0b" strokeWidth={1}>
                  <animate attributeName="r" values="3;9;3" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <text textAnchor="middle" y={-8} fontSize={8} fill="#f59e0b" fontWeight="700" style={{ paintOrder: "stroke", stroke: t.bg, strokeWidth: 2 }}>
                  India
                </text>
              </Marker>

              {/* Plane along arc — animate on active country */}
              <Marker key={`plane-${active.name}`} coordinates={active.coords}>
                <g style={{ transform: "translate(-6px,-6px)" }}>
                  <foreignObject width={14} height={14}>
                    <div style={{ width: 14, height: 14, color: active.accent, filter: `drop-shadow(0 0 6px ${active.accent})` }}>
                      <Plane size={14} />
                    </div>
                  </foreignObject>
                </g>
              </Marker>

              {/* Destination pulse markers */}
              {Object.values(COUNTRIES).map((c) => {
                const isActive = active.name === c.name;
                return (
                  <Marker
                    key={c.name}
                    coordinates={c.coords}
                  >
                    <g
                      onMouseEnter={() => setActive(c)}
                      onClick={() => setActive(c)}
                      style={{ cursor: "pointer" }}
                    >
                      {isActive && (
                        <>
                          <circle r={14} fill={c.accent} opacity={0.25}>
                            <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <circle r={9} fill={c.accent} opacity={0.4}>
                            <animate attributeName="r" values="7;14;7" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                      <circle
                        r={isActive ? 5 : 3.5}
                        fill={c.accent}
                        stroke="#fff"
                        strokeWidth={1.2}
                        style={{ transition: "all 0.3s ease", filter: `drop-shadow(0 0 4px ${c.accent})` }}
                      />
                    </g>
                  </Marker>
                );
            })}

            {/* Top 100 University pins */}
            {TOP_UNIVERSITIES.map((u) => {
              const isSel = selectedUni?.rank === u.rank || hoverUni?.rank === u.rank;
              return (
                <Marker key={u.rank} coordinates={u.coords}>
                  <g
                    onMouseEnter={() => setHoverUni(u)}
                    onMouseLeave={() => setHoverUni(null)}
                    onClick={() => setSelectedUni(u)}
                    style={{ cursor: "pointer" }}
                  >
                    {isSel && (
                      <circle r={6} fill="#facc15" opacity={0.35}>
                        <animate attributeName="r" values="4;10;4" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      r={isSel ? 2.6 : 1.6}
                      fill={isSel ? "#facc15" : "#fde68a"}
                      stroke={isDark ? "#0b1224" : "#1e293b"}
                      strokeWidth={0.5}
                      style={{ filter: isSel ? "drop-shadow(0 0 4px #facc15)" : undefined, transition: "all .25s ease" }}
                    />
                    {isSel && (
                      <g style={{ pointerEvents: "none" }}>
                        <rect x={6} y={-10} rx={3} ry={3} width={Math.max(60, u.name.length * 3.4)} height={14} fill={isDark ? "#0b1224" : "#ffffff"} stroke="#facc15" strokeWidth={0.5} opacity={0.95} />
                        <text x={9} y={0} fontSize={5.5} fontWeight={700} fill={isDark ? "#fde68a" : "#1e293b"}>
                          #{u.rank} {u.name}
                        </text>
                      </g>
                    )}
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl bg-foreground/[0.03] dark:bg-white/[0.03]" />
            )}

          {/* Country pill row */}
          <div className="flex flex-wrap gap-1.5 mt-3 px-1">

              {Object.values(COUNTRIES).map((c) => {
                const isActive = active.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActive(c)}
                    onMouseEnter={() => setActive(c)}
                    className={`text-xs rounded-full px-3 py-1.5 font-semibold transition-all border ${
                      isActive
                        ? "text-white border-transparent shadow-lg scale-105"
                        : "bg-foreground/5 dark:bg-white/5 text-foreground/80 dark:text-white/80 border-foreground/10 dark:border-white/10 hover:bg-foreground/10 dark:hover:bg-white/10 hover:border-foreground/30 dark:hover:border-white/30"
                    }`}
                    style={isActive ? { background: `linear-gradient(135deg, ${c.accent}, #6366f1)`, boxShadow: `0 8px 24px -8px ${c.accent}` } : undefined}
                  >
                    {c.flag} {c.name}
                  </button>
                );
              })}
            </div>

            {/* Top 100 universities — search + scrollable list */}
            <div className="mt-4 rounded-2xl border border-foreground/10 dark:border-white/10 bg-foreground/[0.02] dark:bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  Top 100 Universities · pinned on the map
                </div>
                <div className="relative w-44 md:w-56">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search university or city"
                    className="w-full text-xs rounded-full bg-background/60 border border-foreground/10 dark:border-white/10 pl-7 pr-3 py-1.5 outline-none focus:border-amber-400/60 text-foreground"
                  />
                </div>
              </div>
              <div className="max-h-44 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredUnis.map((u) => {
                  const isSel = selectedUni?.rank === u.rank;
                  return (
                    <button
                      key={u.rank}
                      onMouseEnter={() => setHoverUni(u)}
                      onMouseLeave={() => setHoverUni(null)}
                      onClick={() => setSelectedUni(u)}
                      className={`flex items-center gap-2 text-left rounded-lg px-2 py-1.5 border transition-all ${
                        isSel
                          ? "bg-amber-400/15 border-amber-400/50"
                          : "bg-foreground/[0.03] dark:bg-white/[0.03] border-foreground/10 dark:border-white/10 hover:border-amber-400/40"
                      }`}
                    >
                      <span className="text-[10px] font-extrabold w-7 text-amber-500">#{u.rank}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-foreground truncate">{u.name}</span>
                        <span className="block text-[10px] text-muted-foreground truncate">{u.city} · {u.country}</span>
                      </span>
                    </button>
                  );
                })}
                {filteredUnis.length === 0 && (
                  <div className="col-span-full text-center text-xs text-muted-foreground py-4">No universities match "{query}"</div>
                )}
              </div>
            </div>
          </div>


          {/* Info card */}
          <div
            key={active.name}
            className="lg:col-span-2 relative rounded-3xl border border-foreground/10 dark:border-white/10 bg-card/80 dark:bg-white/[0.04] backdrop-blur-xl p-6 md:p-7 overflow-hidden animate-fade-in"
            style={{ boxShadow: `0 30px 80px -30px ${active.accent}80` }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-40 transition-all duration-700"
              style={{ background: active.accent }}
            />

            <div className="relative">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-6xl leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">{active.flag}</span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1" style={{ color: active.accent }}>
                    <Plane className="h-3 w-3" /> Destination
                  </div>
                  <p className="text-2xl md:text-3xl font-extrabold text-foreground">{active.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-5">"{active.tagline}"</p>

              <div className="space-y-2.5">
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Universities" value={active.unis} accent={active.accent} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Tuition" value={active.tuition} accent={active.accent} />
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Popular courses" value={active.popular} accent={active.accent} />
                <InfoRow icon={<Sparkles className="h-4 w-4" />} label="Highlight" value={active.highlight} accent={active.accent} highlight />
              </div>

              <a
                href="#booking"
                className="mt-6 inline-flex items-center justify-center w-full gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg hover:scale-[1.02] transition-all"
                style={{ background: `linear-gradient(135deg, ${active.accent}, #6366f1)`, boxShadow: `0 12px 32px -8px ${active.accent}` }}
              >
                <Plane className="h-4 w-4" /> Free counseling for {active.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value, accent, highlight = false }: { icon: React.ReactNode; label: string; value: string; accent: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
        highlight ? "bg-foreground/[0.06] dark:bg-white/[0.06] border-foreground/20 dark:border-white/20" : "bg-foreground/[0.03] dark:bg-white/[0.03] border-foreground/10 dark:border-white/10"
      }`}
    >
      <div
        className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center shadow-md"
        style={{ background: highlight ? `linear-gradient(135deg, ${accent}, #6366f1)` : "hsl(var(--muted))", color: highlight ? "#fff" : accent }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className="text-sm font-bold text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
