import { useEffect, useState } from "react";
import { ArrowRight, GraduationCap, MapPin, BookOpen, School, Building2, BookMarked } from "lucide-react";
import { fetchPosts, type Post } from "@/lib/content-store";
import { DEFAULT_STORIES } from "@/lib/default-stories";

interface StoryCard {
  key: string;
  name: string;
  flag_code: string;
  gender: "male" | "female";
  prev_course: string;
  prev_college: string;
  uni: string;
  course: string;
  destination: string;
  image?: string | null;
}

const INITIAL_COUNT = 6;

// Country to flag fallback
function flagFromCountry(country: string): string {
  const map: Record<string, string> = {
    Germany: "de", USA: "us", "United States": "us", UK: "gb",
    "United Kingdom": "gb", Canada: "ca", Australia: "au", Ireland: "ie",
    "New Zealand": "nz", France: "fr", Italy: "it", Spain: "es",
    Netherlands: "nl", Sweden: "se", Singapore: "sg",
  };
  return map[country] || "un";
}

function avatarFor(gender: "male" | "female", name: string) {
  // Use UI Avatars with initials – clean, no broken icons
  const bg = gender === "female" ? "fbcfe8" : "bfdbfe";
  const fg = gender === "female" ? "9d174d" : "1e3a8a";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${fg}&bold=true&size=128`;
}

export function Success() {
  const [admin, setAdmin] = useState<Post[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPosts("success").then(setAdmin);
  }, []);

  const adminCards: StoryCard[] = admin.map((p) => {
    const gender = (p.gender === "female" ? "female" : "male") as "male" | "female";
    return {
      key: p.id,
      name: p.title,
      flag_code: p.flag_code || flagFromCountry(p.destination || ""),
      gender,
      prev_course: p.prev_course || "",
      prev_college: p.prev_college || "",
      uni: p.university || "",
      course: p.course || "",
      destination: p.destination || "",
      image: p.image,
    };
  });

  const defaultCards: StoryCard[] = DEFAULT_STORIES.map((s) => ({
    key: s.name + s.uni,
    name: s.name,
    flag_code: s.flag_code,
    gender: (s.gender === "female" ? "female" : "male") as "male" | "female",
    prev_course: s.prev_course,
    prev_college: s.prev_college,
    uni: s.uni,
    course: s.course,
    destination: s.destination,
  }));

  const all = [...adminCards, ...defaultCards];
  const visible = showAll ? all : all.slice(0, INITIAL_COUNT);

  return (
    <section id="success" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">
            Our Pride
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Student <span className="text-gradient">Success Stories</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            Real students placed at top universities around the world.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {visible.map((s) => (
            <StoryCardView key={s.key} s={s} />
          ))}
        </div>

        {all.length > INITIAL_COUNT && (
          <div className="mt-8 md:mt-10 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
            >
              {showAll ? "Show Less" : `View All Success Stories (${all.length})`}
              <ArrowRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCardView({ s }: { s: StoryCard }) {
  return (
    <div className="relative bg-card rounded-2xl shadow-card hover:shadow-soft transition-all hover:-translate-y-1 overflow-hidden border border-border/50">
      {/* Header strip with flag */}
      <div className="relative h-16 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-end px-4">
        <img
          src={`https://flagcdn.com/w80/${s.flag_code}.png`}
          srcSet={`https://flagcdn.com/w160/${s.flag_code}.png 2x`}
          alt={s.destination}
          className="h-7 w-auto rounded-sm shadow-md ring-1 ring-black/10"
          loading="lazy"
        />
      </div>

      {/* Avatar */}
      <div className="relative px-5 -mt-10">
        <img
          src={s.image || avatarFor(s.gender, s.name)}
          alt={s.name}
          className="h-20 w-20 rounded-full object-cover ring-4 ring-card shadow-md bg-secondary"
          loading="lazy"
        />
      </div>

      <div className="px-5 pb-5 pt-3">
        <h3 className="font-bold text-foreground text-base md:text-lg leading-tight">{s.name}</h3>
        {(s.prev_course || s.prev_college) && (
          <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
            {s.prev_course && <p className="truncate">{s.prev_course}</p>}
            {s.prev_college && <p className="truncate">{s.prev_college}</p>}
          </div>
        )}

        <div className="mt-3 border-t border-border/50 pt-3 space-y-2 text-sm">
          {s.uni && (
            <Row icon={<School className="h-3.5 w-3.5" />} label="University">
              {s.uni}
            </Row>
          )}
          {s.course && (
            <Row icon={<BookOpen className="h-3.5 w-3.5" />} label="Course">
              {s.course}
            </Row>
          )}
          {s.destination && (
            <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Destination">
              {s.destination}
            </Row>
          )}
        </div>

        <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-soft rounded-full px-2.5 py-1">
          <GraduationCap className="h-3 w-3" /> Placed Abroad
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
        {icon} {label}
      </div>
      <p className="text-sm text-foreground font-medium leading-snug">{children}</p>
    </div>
  );
}
