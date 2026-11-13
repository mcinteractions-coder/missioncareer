import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator, GraduationCap, Home, Plane, ShieldCheck, Stamp, Gift, MessageCircle, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CountrySelect, ToolHeader } from "@/components/tools/ToolHeader";
import { getCountryGuide } from "@/data/country-guides";
import { BUDGET_COUNTRIES, COUNTRY_COSTS, LIFESTYLES, estimateBudget, formatInr, formatLocal, plainName, type Lifestyle } from "@/lib/study-budget";

const SITE = "https://www.missioncareer.net";
const TITLE = "Study Abroad Budget Calculator in INR (2026) | Mission Career";
const DESC = "Estimate the total cost of studying abroad in rupees — tuition, living, insurance, visa and flights for 30 countries. Free tool by Mission Career, Mumbai.";

export const Route = createFileRoute("/budget-calculator")({
  validateSearch: (s: Record<string, unknown>): { country?: string } => ({
    country: typeof s.country === "string" && COUNTRY_COSTS[s.country] ? s.country : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/budget-calculator` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE}/budget-calculator` }],
  }),
  component: BudgetCalculatorPage,
});

const YEARS = [1, 1.5, 2, 3, 4];
const OPTIONS = BUDGET_COUNTRIES.map((g) => ({ slug: g.slug, name: plainName(g) }));

function BudgetCalculatorPage() {
  const search = Route.useSearch();
  const [slug, setSlug] = useState(search.country ?? "germany");
  const [years, setYears] = useState(COUNTRY_COSTS[search.country ?? "germany"].defaultYears);
  const [level, setLevel] = useState(50);
  const [lifestyle, setLifestyle] = useState<Lifestyle>("standard");
  const [scholarship, setScholarship] = useState("");
  const [flights, setFlights] = useState(true);

  const guide = getCountryGuide(slug)!;
  const cost = COUNTRY_COSTS[slug];
  const name = plainName(guide);
  const result = useMemo(
    () => estimateBudget({ slug, years, tuitionLevel: level / 100, lifestyle, scholarshipInr: Number(scholarship) || 0, includeFlights: flights })!,
    [slug, years, level, lifestyle, scholarship, flights],
  );
  const tuitionLocal = cost.tuitionMin + ((cost.tuitionMax - cost.tuitionMin) * level) / 100;

  const changeCountry = (s: string) => {
    setSlug(s);
    setYears(COUNTRY_COSTS[s].defaultYears);
  };

  const rows: { icon: LucideIcon; label: string; value: number }[] = [
    { icon: GraduationCap, label: "Tuition fees", value: result.tuition },
    { icon: Home, label: "Living costs", value: result.living },
    { icon: ShieldCheck, label: "Health insurance", value: result.insurance },
    { icon: Stamp, label: "Visa fee", value: result.visa },
    { icon: Plane, label: "Flights (to & back)", value: result.flights },
  ];
  const gross = rows.reduce((a, r) => a + r.value, 0) || 1;
  const yearsLabel = `${years} ${years === 1 ? "year" : "years"}`;
  const waText = `Hi Mission Career! I used your budget calculator: studying in ${name} for ${yearsLabel} comes to about ${formatInr(result.total)}. Please help me plan my budget and loans.`;

  return (
    <main className="min-h-screen bg-background">
      <ToolHeader
        kicker="Free planning tool"
        title={<>Study abroad <span className="text-gradient">budget calculator</span></>}
        intro="See roughly how much your degree abroad will cost in rupees — tuition, rent and food, insurance, visa and flights — and how much a scholarship saves you."
      />

      <div className="container mx-auto px-4 md:px-8 -mt-8 pb-16 grid lg:grid-cols-5 gap-6 lg:gap-8">
        <section aria-label="Your plan" className="lg:col-span-3 rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60 space-y-8">
          <div className="flex items-end gap-4">
            <img src={`https://flagcdn.com/w160/${guide.code}.png`} alt={`${name} flag`} className="h-12 w-[4.5rem] rounded-lg object-cover shadow-card" />
            <div className="flex-1">
              <CountrySelect id="budget-country" label="Country" value={slug} onChange={changeCountry} options={OPTIONS} />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course length</p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  aria-pressed={years === y}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${years === y ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "border-border bg-background text-foreground hover:border-primary/50"}`}
                >
                  {y} {y === 1 ? "yr" : "yrs"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tuition per year</p>
              <p className="text-sm font-bold text-foreground">
                {formatLocal(slug, tuitionLocal)} <span className="text-muted-foreground font-medium">≈ {formatInr(tuitionLocal * cost.inrRate)}</span>
              </p>
            </div>
            <Slider className="mt-4" value={[level]} min={0} max={100} step={5} onValueChange={(v) => setLevel(v[0])} aria-label="Tuition level" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Lower fees · {formatLocal(slug, cost.tuitionMin)}</span>
              <span>Top universities · {formatLocal(slug, cost.tuitionMax)}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lifestyle</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(LIFESTYLES) as Lifestyle[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setLifestyle(k)}
                  aria-pressed={lifestyle === k}
                  className={`rounded-2xl border p-3 text-left transition-all ${lifestyle === k ? "border-primary bg-primary/10 shadow-card" : "border-border bg-background hover:border-primary/50"}`}
                >
                  <span className={`block text-sm font-bold ${lifestyle === k ? "text-primary" : "text-foreground"}`}>{LIFESTYLES[k].label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{LIFESTYLES[k].note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <label htmlFor="scholarship" className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Scholarship (total, ₹)</span>
              <input
                id="scholarship"
                inputMode="numeric"
                placeholder="e.g. 200000"
                value={scholarship}
                onChange={(e) => setScholarship(e.target.value.replace(/\D/g, "").slice(0, 9))}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label htmlFor="flights" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 sm:mt-6">
              <span className="text-sm font-semibold text-foreground">Include flights from India</span>
              <Switch id="flights" checked={flights} onCheckedChange={setFlights} />
            </label>
          </div>
        </section>

        <aside aria-live="polite" className="lg:col-span-2 lg:sticky lg:top-6 h-fit overflow-hidden rounded-3xl bg-card shadow-soft border border-border/60">
          <div className="relative overflow-hidden bg-gradient-primary p-6 text-primary-foreground">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
            <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-90"><Calculator className="h-4 w-4" /> Estimated total</p>
            <p className="relative mt-2 text-4xl md:text-5xl font-extrabold">{formatInr(result.total)}</p>
            <p className="relative mt-1 text-sm opacity-90">for {yearsLabel} in {name} · about {formatInr(result.perYear)} per year</p>
          </div>
          <div className="p-6 space-y-4">
            {rows.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground"><r.icon className="h-4 w-4 text-primary" /> {r.label}</span>
                  <span className="font-bold text-foreground">{formatInr(r.value)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${(r.value / gross) * 100}%` }} />
                </div>
              </div>
            ))}
            {result.scholarship > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-whatsapp/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground"><Gift className="h-4 w-4 text-whatsapp" /> Scholarship saving</span>
                <span className="font-bold text-whatsapp">− {formatInr(result.scholarship)}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Rough estimate using approximate fees and exchange rates. Real costs depend on your course, city and university.</p>
            <a
              href={`https://wa.me/919870003748?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Plan my budget with an expert
            </a>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/study-abroad/$country" params={{ country: slug }} className="flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                {name} guide <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/compare-countries" search={{ c: slug }} className="flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                <Scale className="h-4 w-4" /> Compare
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
