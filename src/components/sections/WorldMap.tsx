import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { GraduationCap, DollarSign, Briefcase, Sparkles, MapPin } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type CountryInfo = {
  name: string;
  flag: string;
  coords: [number, number];
  unis: string;
  tuition: string;
  popular: string;
  highlight: string;
  tagline: string;
};

const COUNTRIES: Record<string, CountryInfo> = {
  "United States of America": {
    name: "USA", flag: "🇺🇸", coords: [-98, 39],
    unis: "200+ Universities", tuition: "$25K – $55K / yr",
    popular: "CS, Business, Engineering", highlight: "OPT up to 3 yrs (STEM)",
    tagline: "Ivy League dreams & Silicon Valley vibes",
  },
  "United Kingdom": {
    name: "UK", flag: "🇬🇧", coords: [-2, 54],
    unis: "150+ Universities", tuition: "£15K – £35K / yr",
    popular: "MBA, Law, Data Science", highlight: "2-yr Graduate Route Visa",
    tagline: "1-year masters, world-class heritage",
  },
  "Canada": {
    name: "Canada", flag: "🇨🇦", coords: [-106, 56],
    unis: "100+ Universities", tuition: "CAD 20K – 40K / yr",
    popular: "Health, IT, Engineering", highlight: "3-yr PGWP + PR pathway",
    tagline: "Friendliest PR-friendly destination",
  },
  "Australia": {
    name: "Australia", flag: "🇦🇺", coords: [134, -25],
    unis: "80+ Universities", tuition: "AUD 25K – 45K / yr",
    popular: "Nursing, IT, Hospitality", highlight: "4-yr post-study work visa",
    tagline: "Sun, surf & global rankings",
  },
  "Germany": {
    name: "Germany", flag: "🇩🇪", coords: [10, 51],
    unis: "90+ Universities", tuition: "€0 – €3K / yr (public)",
    popular: "Mech, Auto, Data Science", highlight: "Tuition-free public unis",
    tagline: "Engineering powerhouse, near-zero fees",
  },
  "Ireland": {
    name: "Ireland", flag: "🇮🇪", coords: [-8, 53],
    unis: "40+ Universities", tuition: "€10K – €25K / yr",
    popular: "Pharma, IT, Finance", highlight: "2-yr stay-back permit",
    tagline: "EU's tech & pharma hub",
  },
  "New Zealand": {
    name: "New Zealand", flag: "🇳🇿", coords: [172, -41],
    unis: "30+ Universities", tuition: "NZD 22K – 35K / yr",
    popular: "Agri, IT, Hospitality", highlight: "3-yr post-study work",
    tagline: "Scenic studies, calm lifestyle",
  },
};

export function WorldMap() {
  const [active, setActive] = useState<CountryInfo>(COUNTRIES["United States of America"]);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section id="world-map" className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-b from-background via-primary-soft/30 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Hover or tap countries
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Your <span className="text-gradient">Global Classroom</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            Explore our 7 flagship study destinations on the world map.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Map */}
          <div className="lg:col-span-3 bg-card rounded-3xl shadow-card border border-border p-3 md:p-5 overflow-hidden relative">
            <ComposableMap
              projectionConfig={{ scale: 145 }}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name as string;
                    const info = COUNTRIES[name];
                    const isActive = info && active.name === info.name;
                    const isHover = hover === name;
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
                        style={{
                          default: {
                            fill: info ? "hsl(var(--primary) / 0.55)" : "hsl(var(--muted))",
                            stroke: "hsl(var(--background))",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 0.25s ease",
                            cursor: info ? "pointer" : "default",
                          },
                          hover: {
                            fill: info ? "hsl(var(--primary))" : "hsl(var(--muted))",
                            outline: "none",
                            transform: info ? "scale(1.01)" : undefined,
                          },
                          pressed: { fill: "hsl(var(--primary))", outline: "none" },
                        }}
                        className={isActive || isHover ? "drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" : ""}
                      />
                    );
                  })
                }
              </Geographies>

              {Object.values(COUNTRIES).map((c) => {
                const isActive = active.name === c.name;
                return (
                  <Marker key={c.name} coordinates={c.coords}>
                    <g
                      onMouseEnter={() => setActive(c)}
                      onClick={() => setActive(c)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        r={isActive ? 7 : 4}
                        fill="hsl(var(--accent))"
                        stroke="hsl(var(--background))"
                        strokeWidth={1.5}
                        style={{ transition: "all 0.3s ease" }}
                      >
                        {isActive && (
                          <animate attributeName="r" values="7;11;7" dur="1.6s" repeatCount="indefinite" />
                        )}
                      </circle>
                      {isActive && (
                        <circle r={12} fill="hsl(var(--accent) / 0.25)">
                          <animate attributeName="r" values="8;18;8" dur="1.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>

            <div className="flex flex-wrap gap-1.5 mt-3 px-1">
              {Object.values(COUNTRIES).map((c) => (
                <button
                  key={c.name}
                  onClick={() => setActive(c)}
                  className={`text-xs rounded-full px-2.5 py-1 font-semibold transition border ${
                    active.name === c.name
                      ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                      : "bg-secondary text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div
            key={active.name}
            className="lg:col-span-2 bg-gradient-to-br from-card to-primary-soft/40 rounded-3xl shadow-card border border-border p-6 md:p-7 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-5xl leading-none">{active.flag}</span>
              <div>
                <div className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Study in
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold">{active.name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mb-5">"{active.tagline}"</p>

            <div className="space-y-3">
              <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Universities" value={active.unis} />
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Tuition" value={active.tuition} />
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Popular courses" value={active.popular} />
              <InfoRow icon={<Sparkles className="h-4 w-4" />} label="Highlight" value={active.highlight} accent />
            </div>

            <a
              href="#booking"
              className="mt-6 inline-flex items-center justify-center w-full gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-all"
            >
              Get free counseling for {active.name}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl p-3 ${accent ? "bg-primary/10 border border-primary/20" : "bg-background/60"}`}>
      <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${accent ? "bg-gradient-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
        <div className="text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}
