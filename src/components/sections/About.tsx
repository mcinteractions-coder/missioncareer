import { Search, MapPin, GraduationCap, DollarSign, Award, X, ExternalLink, Building2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchUniversities, type FinderFilters, type University, BUDGET_BANDS, FINDER_COUNTRIES, FINDER_COURSES, UNIVERSITIES } from "@/lib/universities";
import { ApplyDialog } from "@/components/finder/ApplyDialog";
import { Counter } from "@/components/Counter";
import { fetchPosts, type Post } from "@/lib/content-store";


type FieldKey = Exclude<keyof FinderFilters, "query">;
const FIELDS: { key: FieldKey; label: string; options: string[] }[] = [
  { key: "country", label: "Country", options: FINDER_COUNTRIES },
  { key: "course", label: "Course", options: FINDER_COURSES },
  { key: "level", label: "Level", options: ["Bachelors","Masters","MBA","Diploma"] },
  { key: "intake", label: "Intake", options: ["Fall","Spring","Summer"] },
  { key: "ielts", label: "IELTS", options: ["Not Required","5.5","6","6.5","7","7.5","8"] },
  { key: "gre", label: "GRE", options: ["Not Required","300","310","320","330"] },
  { key: "gmat", label: "GMAT", options: ["Not Required","550","600","650","700","730"] },
  { key: "budget", label: "Budget", options: Object.keys(BUDGET_BANDS) },
  { key: "type", label: "University type", options: ["Public","Private"] },
];

const PAGE = 20;
const TOTAL_UNIS = UNIVERSITIES.length;
const TOTAL_COUNTRIES = FINDER_COUNTRIES.length;

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
  const [shown, setShown] = useState(PAGE);
  const [applyTo, setApplyTo] = useState<University | null>(null);
  const [admits, setAdmits] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts("admit").then(setAdmits);
  }, []);


  const results = useMemo(() => (submitted ? searchUniversities(filters) : []), [filters, submitted]);

  const setField = (key: keyof FinderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setShown(PAGE);
  };

  const runSearch = () => {
    setShown(PAGE);
    setSubmitted(true);
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
              Your Journey <br />
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
              <p className="sm:col-span-2 text-sm font-semibold text-foreground">
                University Finder <span className="font-normal text-muted-foreground">· {TOTAL_UNIS}+ universities in {TOTAL_COUNTRIES} countries</span>
              </p>
              <div className="sm:col-span-2 relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  aria-label="Search by university or city"
                  placeholder="Search by university or city"
                  className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.query ?? ""}
                  onChange={(e) => setField("query", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                />
              </div>
              {FIELDS.map((f) => (
                <select
                  key={f.key}
                  aria-label={f.label}
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                >
                  <option value="">{f.label}</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}{f.key === "budget" && BUDGET_BANDS[o] ? ` ($${BUDGET_BANDS[o][0]/1000}k–$${BUDGET_BANDS[o][1]/1000}k / yr)` : ""}</option>)}
                </select>
              ))}
              <button
                onClick={runSearch}
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
                  <p className="font-bold text-foreground">
                    {results.length} {results.length === 1 ? "Match" : "Matches"} Found
                  </p>
                  {results.length > 0 && <span className="text-xs text-muted-foreground">Sorted by QS 2026 rank</span>}
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No universities match all your criteria.</p>
                    <p className="text-xs text-muted-foreground mt-1">Try relaxing IELTS/GRE/GMAT or budget filters.</p>
                    <a href="#contact" className="mt-4 inline-block rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Talk to a Counselor</a>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
                    {results.slice(0, shown).map((u) => (
                      <div key={u.id} className="rounded-2xl border border-border bg-secondary/60 p-4 hover:shadow-soft transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {u.city}, {u.country}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary whitespace-nowrap">
                            <Award className="h-3 w-3" /> {u.ranking ? `QS #${u.ranking}` : "Not QS-ranked"}
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                            <DollarSign className="h-3 w-3 shrink-0" /> <span className="truncate">{u.tuitionUSD > 0 ? `~$${u.tuitionUSD.toLocaleString()}/yr tuition` : "No tuition fee"}</span>
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
                        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground"><Building2 className="h-3 w-3" /> {u.type}</span>
                          <a href={u.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                            Official website <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <button type="button" onClick={() => setApplyTo(u)} className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
                          Apply now
                        </button>
                      </div>
                    ))}
                    {results.length > shown && (
                      <button
                        onClick={() => setShown((n) => n + PAGE)}
                        className="w-full rounded-xl border-2 border-primary/30 bg-card py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft transition-colors"
                      >
                        Show {Math.min(PAGE, results.length - shown)} more of {results.length - shown} remaining
                      </button>
                    )}
                  </div>
                )}
                <ApplyDialog uni={applyTo} onClose={() => setApplyTo(null)} />
                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                  Ranks are from the QS World University Rankings 2026. Fees and test scores are typical figures for international students and change every year, so please check the university website or ask our counsellors before applying.
                </p>
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
              <p className="font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Recent Admits
              </p>
              <div className="space-y-3">
                {admits.map((a, i) => (
                  <div key={a.id} className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-secondary to-secondary/40 p-3 hover:shadow-soft hover:-translate-y-0.5 transition-all">
                    {a.image ? (
                      <img src={a.image} alt={a.title} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/30" />
                    ) : (
                      <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white font-bold flex items-center justify-center ring-2 ring-white shadow-soft`}>
                        {a.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{a.title}</div>
                      {a.university && <div className="text-xs text-muted-foreground truncate">🎓 {a.university}</div>}
                    </div>
                  </div>
                ))}
                {admits.length === 0 && <p className="text-xs text-muted-foreground">No recent admits yet.</p>}
              </div>
            </div>

            <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-5 md:p-6 overflow-hidden">
              <p className="font-bold text-foreground mb-4">Top Destinations</p>
              <div className="relative overflow-hidden">
                <div className="flex gap-3 animate-marquee whitespace-nowrap">
                  {[...DESTS, ...DESTS].map((d, i) => (
                    <div key={i} className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">{d}</div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
