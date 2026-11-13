import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowRight, Award, Briefcase, Calculator, Calendar, GraduationCap, Home, MessageCircle, Plane, Plus, Trophy, Wallet, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CountrySelect, ToolHeader } from "@/components/tools/ToolHeader";
import { getCountryGuide, type CountryGuide } from "@/data/country-guides";
import { BUDGET_COUNTRIES, COUNTRY_COSTS, formatInr, plainName, yearlyCostInr } from "@/lib/study-budget";

const SITE = "https://www.missioncareer.net";
const TITLE = "Compare Study Abroad Countries Side by Side | Mission Career";
const DESC = "Compare Germany, Canada, the UK, USA, Australia and 25 more countries: fees, living costs in INR, intakes, work rights, visas and scholarships for Indian students.";
const DEFAULT = ["germany", "canada", "uk"];

export const Route = createFileRoute("/compare-countries")({
  validateSearch: (s: Record<string, unknown>): { c?: string } => ({
    c: typeof s.c === "string" ? s.c : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/compare-countries` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare-countries` }],
  }),
  component: ComparePage,
});

const OPTIONS = BUDGET_COUNTRIES.map((g) => ({ slug: g.slug, name: plainName(g) }));

function initialSlugs(c?: string) {
  const picked = (c ?? "").split(",").filter((s) => COUNTRY_COSTS[s]);
  const unique = [...new Set(picked)].slice(0, 3);
  for (const d of DEFAULT) if (unique.length < 2 && !unique.includes(d)) unique.push(d);
  if (!c) return DEFAULT;
  return unique;
}

type Row = { icon: LucideIcon; label: string; render: (g: CountryGuide) => ReactNode };

const ROWS: Row[] = [
  { icon: Wallet, label: "Tuition", render: (g) => g.tuition },
  { icon: Home, label: "Living costs", render: (g) => g.living },
  { icon: Calendar, label: "Intakes", render: (g) => g.intakes },
  { icon: Briefcase, label: "Work rights", render: (g) => g.workRights },
  { icon: Plane, label: "Visa", render: (g) => g.visaName },
  {
    icon: GraduationCap,
    label: "Top universities",
    render: (g) => (
      <ul className="space-y-1">
        {g.universities.slice(0, 4).map((u) => <li key={u}>• {u}</li>)}
      </ul>
    ),
  },
  {
    icon: Award,
    label: "Scholarships",
    render: (g) => (
      <ul className="space-y-1">
        {g.scholarships.slice(0, 2).map((s) => <li key={s.name}>• {s.name}</li>)}
      </ul>
    ),
  },
];

function ComparePage() {
  const search = Route.useSearch();
  const [slugs, setSlugs] = useState<string[]>(() => initialSlugs(search.c));
  const guides = slugs.map((s) => getCountryGuide(s)!);
  const costs = slugs.map(yearlyCostInr);
  const max = Math.max(...costs);
  const min = Math.min(...costs);

  const setAt = (i: number, v: string) => setSlugs((p) => p.map((s, j) => (j === i ? v : s)));
  const remove = (i: number) => setSlugs((p) => p.filter((_, j) => j !== i));
  const add = () => setSlugs((p) => [...p, OPTIONS.find((o) => !p.includes(o.slug))!.slug]);

  const names = guides.map(plainName);
  const waText = `Hi Mission Career! I'm comparing ${names.join(" vs ")} for my studies. Can you help me choose?`;
  const cols = slugs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <main className="min-h-screen bg-background">
      <ToolHeader
        kicker="Country comparison"
        title={<>Which country is <span className="text-gradient">right for you?</span></>}
        intro="Pick up to three countries and see fees, yearly cost in rupees, intakes, work rights, visas and scholarships side by side."
      />

      <div className="container mx-auto px-4 md:px-8 -mt-8 pb-16 space-y-8">
        <section aria-label="Choose countries" className={`grid gap-4 ${cols}`}>
          {guides.map((g, i) => {
            const isCheapest = slugs.length > 1 && costs[i] === min;
            return (
              <div key={`${i}-${g.slug}`} className="relative rounded-3xl bg-card p-5 shadow-soft border border-border/60">
                {isCheapest && (
                  <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-whatsapp px-3 py-1 text-xs font-bold text-whatsapp-foreground shadow-card">
                    <Trophy className="h-3.5 w-3.5" /> Most affordable
                  </span>
                )}
                {slugs.length > 2 && (
                  <button type="button" onClick={() => remove(i)} aria-label={`Remove ${plainName(g)}`} className="absolute top-3 right-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-center gap-4">
                  <img src={`https://flagcdn.com/w160/${g.code}.png`} alt={`${plainName(g)} flag`} className="h-12 w-[4.5rem] rounded-lg object-cover shadow-card" />
                  <div className="flex-1 pr-6">
                    <CountrySelect id={`country-${i}`} label={`Country ${i + 1}`} value={g.slug} onChange={(v) => setAt(i, v)} options={OPTIONS.filter((o) => o.slug === g.slug || !slugs.includes(o.slug))} />
                  </div>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Approx. cost per year</p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">{formatInr(costs[i])}</p>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${(costs[i] / max) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Average fees + standard living + insurance</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link to="/study-abroad/$country" params={{ country: g.slug }} className="flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                    Full guide <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/budget-calculator" search={{ country: g.slug }} className="flex items-center justify-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-gradient-primary hover:text-primary-foreground">
                    <Calculator className="h-4 w-4" /> Budget
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {slugs.length < 3 && (
          <div className="text-center">
            <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/50 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4" /> Add a third country
            </button>
          </div>
        )}

        <section aria-label="Side by side comparison" className="overflow-hidden rounded-3xl bg-card shadow-soft border border-border/60">
          {ROWS.map((r, ri) => (
            <div key={r.label} className={`grid gap-3 p-4 md:p-5 md:grid-cols-[180px_1fr] ${ri % 2 ? "bg-muted/40" : ""}`}>
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><r.icon className="h-4 w-4" /></span>
                {r.label}
              </p>
              <div className={`grid gap-3 ${slugs.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                {guides.map((g, i) => (
                  <div key={`${i}-${g.slug}`} className="min-w-0 text-sm text-foreground">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary md:hidden">{plainName(g)}</p>
                    {r.render(g)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <p className="text-center text-xs text-muted-foreground">Figures are approximate and vary by course, city and university. Rupee amounts use approximate exchange rates.</p>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 md:p-10 text-center text-primary-foreground shadow-soft">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary-foreground/10" />
          <h2 className="relative text-2xl md:text-3xl font-extrabold">Still confused between {names.length > 2 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join(" and ")}?</h2>
          <p className="relative mx-auto mt-2 max-w-xl opacity-90">Our counsellors look at your marks, budget and career goals and tell you honestly which country fits you best — for free.</p>
          <a
            href={`https://wa.me/919870003748?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" /> Help me choose on WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
