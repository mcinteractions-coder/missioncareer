import { Search, MapPin, GraduationCap, DollarSign, Award, X, Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchUniversities, type FinderFilters, BUDGET_BANDS } from "@/lib/universities";
import { Counter } from "@/components/Counter";
import { fetchPosts, type Post } from "@/lib/content-store";

type FieldKey = keyof FinderFilters;
const FIELDS: { key: FieldKey; label: string; options: string[] }[] = [
  { key: "country", label: "Country", options: ["USA","UK","Canada","Australia","Germany","Ireland","New Zealand","Italy","France","Spain"] },
  { key: "course", label: "Course", options: ["Computer Science","Business","Engineering","Data Science","MBA","Mechanical","IT","AI","AIML","Cyber Security","Finance","Bio Technology"] },
  { key: "level", label: "Level", options: ["Bachelors","Masters","MBA","Diploma"] },
  { key: "intake", label: "Intake", options: ["Fall","Spring","Summer"] },
  { key: "ielts", label: "IELTS", options: ["Not Required","6","6.5","7","7.5","8"] },
  { key: "gre", label: "GRE", options: ["Not Required","300","310","320"] },
  { key: "gmat", label: "GMAT", options: ["Not Required","550","600","650","700"] },
  { key: "budget", label: "Budget", options: ["Low","Medium","High","Very High"] },
];

const DESTS = ["USA","UK","Australia","Canada","Germany","Ireland","New Zealand","Italy","France"];

const GRADIENTS = [
  "from-rose-500 to-orange-500",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-red-500",
  "from-cyan-500 to-blue-500",
];

export function About() {
  const [filters, setFilters] = useState<FinderFilters>({});
  const [submitted, setSubmitted] = useState(false);
  const [admits, setAdmits] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts("admit").then(setAdmits);
    fetchPosts("review").then(setReviews);
  }, []);

  const results = useMemo(() => (submitted ? searchUniversities(filters) : []), [filters, submitted]);

  const setField = (key: FieldKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setSubmitted(false);
  };

  const clearAll = () => {
    setFilters({});
    setSubmitted(false);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;


  return (
    <section id="about" className="py-12 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 rounded-full bg-primary-soft/40 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Study Abroad <br />
              <span className="text-gradient">Made Simple</span>
            </h2>
            <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg max-w-md">
              Discover universities, explore countries and start your international career with expert guidance.
            </p>

            <div className="mt-5 md:mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="rounded-full bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-soft">Free Counseling</a>
              <a href="#finder" className="rounded-full border-2 border-primary/30 bg-card px-5 py-2.5 font-semibold text-primary">Find Universities</a>
            </div>

            <div id="finder" className="mt-6 md:mt-8 grid sm:grid-cols-2 gap-2.5 md:gap-3 bg-card rounded-2xl md:rounded-3xl shadow-soft p-4 md:p-5">
              {FIELDS.map((f) => (
                <select
                  key={f.key}
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                >
                  <option value="">{f.label}</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}{f.key === "budget" && BUDGET_BANDS[o] ? ` ($${BUDGET_BANDS[o][0]/1000}k–$${BUDGET_BANDS[o][1]/1000}k)` : ""}</option>)}
                </select>
              ))}
              <button
                onClick={() => setSubmitted(true)}
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
              >
                <Search className="h-4 w-4" /> Search Universities {activeCount > 0 && <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{activeCount}</span>}
              </button>
              {activeCount > 0 && (
                <button onClick={clearAll} className="sm:col-span-2 -mt-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" /> Clear all filters
                </button>
              )}
            </div>

            {submitted && (
              <div className="mt-6 bg-card rounded-3xl shadow-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">
                    {results.length} {results.length === 1 ? "Match" : "Matches"} Found
                  </h3>
                  {results.length > 0 && <span className="text-xs text-muted-foreground">Sorted by ranking</span>}
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No universities match all your criteria.</p>
                    <p className="text-xs text-muted-foreground mt-1">Try relaxing IELTS/GRE/GMAT or budget filters.</p>
                    <a href="#contact" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Talk to a Counselor</a>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                    {results.map((u) => (
                      <div key={u.id} className="rounded-2xl border border-border bg-secondary/60 p-4 hover:shadow-soft transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-foreground">{u.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {u.city}, {u.country}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary whitespace-nowrap">
                            <Award className="h-3 w-3" /> #{u.ranking}
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                            <DollarSign className="h-3 w-3 shrink-0" /> <span className="truncate">~${u.tuitionUSD.toLocaleString()}/yr</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                            <GraduationCap className="h-3 w-3 shrink-0" /> <span className="truncate">IELTS {u.ieltsMin || "N/R"}
                            {u.greMin > 0 && ` · GRE ${u.greMin}`}
                            {u.gmatMin > 0 && ` · GMAT ${u.gmatMin}`}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {u.levels.map((l) => (
                            <span key={l} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{l}</span>
                          ))}
                          {u.intakes.map((i) => (
                            <span key={i} className="rounded-full bg-accent/40 px-2 py-0.5 text-[10px] font-semibold text-foreground">{i}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-5 md:gap-8">
              <div><Counter value={5000} suffix="+" className="block text-xl md:text-2xl font-extrabold text-gradient" /><span className="text-xs md:text-sm text-muted-foreground">Students</span></div>
              <div><Counter value={98} suffix="%" className="block text-xl md:text-2xl font-extrabold text-gradient" /><span className="text-xs md:text-sm text-muted-foreground">Visa Success</span></div>
              <div><Counter value={120} suffix="+" className="block text-xl md:text-2xl font-extrabold text-gradient" /><span className="text-xs md:text-sm text-muted-foreground">Universities</span></div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6 min-w-0">
            <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-5 md:p-6">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-primary" /> Recent Admits
              </h3>
              <div className="space-y-3">
                {ADMITS.map((a) => (
                  <div key={a.name} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground font-bold flex items-center justify-center">{a.i}</div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.uni}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-5 md:p-6 overflow-hidden">
              <h3 className="font-bold text-foreground mb-4">Top Destinations</h3>
              <div className="relative overflow-hidden">
                <div className="flex gap-3 animate-marquee whitespace-nowrap">
                  {[...DESTS, ...DESTS].map((d, i) => (
                    <div key={i} className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">{d}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-5 md:p-6">
              <h3 className="font-bold text-foreground mb-4">Student Reviews</h3>
              <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                {REVIEWS.map((r) => (
                  <div key={r.n} className="rounded-xl bg-secondary p-3">
                    <div className="text-amber-500 text-sm">★★★★★</div>
                    <p className="mt-1 text-sm text-foreground">{r.t}</p>
                    <p className="mt-1 text-xs text-muted-foreground">– {r.n}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
