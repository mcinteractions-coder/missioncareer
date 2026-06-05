import { UNIVERSITIES } from "@/lib/universities";
import { Building2 } from "lucide-react";

const FLAG: Record<string, string> = {
  USA: "🇺🇸",
  UK: "🇬🇧",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  Ireland: "🇮🇪",
  "New Zealand": "🇳🇿",
  Italy: "🇮🇹",
  France: "🇫🇷",
  Spain: "🇪🇸",
};

// Pick top recognizable universities for the strip
const SHOWCASE = [
  "MIT", "Stanford", "Oxford", "Cambridge", "Imperial College London",
  "UCL", "University of Toronto", "UBC", "University of Melbourne",
  "University of Sydney", "TU Munich", "Trinity College Dublin",
  "HEC Paris", "New York University", "Carnegie Mellon",
  "McGill University", "University of Auckland", "RWTH Aachen",
  "Politecnico di Milano", "IE University",
];

const showcaseUnis = SHOWCASE.map((name) => {
  const u = UNIVERSITIES.find((x) => x.name === name || x.id === name.toLowerCase().replace(/\s/g, ""));
  return u;
}).filter(Boolean);

function UniBadge({ uni }: { uni: (typeof UNIVERSITIES)[number] }) {
  const abbr = uni.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card/60 border border-border/50 shadow-card whitespace-nowrap hover-lift cursor-default select-none">
      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-[11px] font-extrabold text-primary-foreground leading-none">
        {abbr}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-foreground">{uni.name}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          {FLAG[uni.country] ?? "🌐"} {uni.country}
        </span>
      </div>
    </div>
  );
}

export function UniversityMarquee() {
  const list = showcaseUnis;
  // Duplicate for seamless infinite scroll
  const doubled = [...list, ...list];

  return (
    <section className="relative py-8 overflow-hidden bg-gradient-hero border-y border-border/30">
      {/* top label */}
      <div className="container mx-auto px-4 md:px-8 mb-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
            Partner Universities &middot; {UNIVERSITIES.length}+ Institutions Worldwide
          </span>
        </div>
      </div>

      {/* marquee track */}
      <div className="relative">
        {/* left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
        {/* right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex gap-4 animate-marquee w-max hover:[animation-play-state:paused]">
          {doubled.map((uni, i) => (
            <UniBadge key={`${uni.id}-${i}`} uni={uni} />
          ))}
        </div>
      </div>
    </section>
  );
}
