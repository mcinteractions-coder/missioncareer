import { BadgeCheck, ExternalLink, Info } from "lucide-react";
import { getCountryGuide } from "@/data/country-guides";
import { COSTS_CHECKED_ON, COST_DATA, RATE_SOURCES, formatLocal, formatMoney, plainName, type CostSource } from "@/lib/study-budget";

export function tuitionLabel(slug: string) {
  const t = COST_DATA[slug].tuition;
  return t.min === t.max ? `${formatLocal(slug, t.min)} a year` : `${formatLocal(slug, t.min)} – ${formatLocal(slug, t.max)} a year`;
}

export function SourceLink({ source }: { source: CostSource }) {
  if (!source.url) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
        <Info className="h-3.5 w-3.5" /> Mission Career estimate
      </span>
    );
  }
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
      <BadgeCheck className="h-3.5 w-3.5 shrink-0" /> {source.name} <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

/** Lists every cost figure for the chosen countries with the page it came from. */
export function CostSources({ slugs }: { slugs: string[] }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60">
      <h2 id="sources-title" className="text-xl md:text-2xl font-extrabold text-foreground">Where these numbers come from</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fees and visa charges are taken from government, embassy and official study websites, checked on {COSTS_CHECKED_ON}. Rules and fees change — always confirm on the official page before you pay.
      </p>
      <div className={`mt-6 grid gap-5 ${slugs.length > 1 ? "md:grid-cols-2" : ""} ${slugs.length > 2 ? "xl:grid-cols-3" : ""}`}>
        {slugs.map((slug) => {
          const d = COST_DATA[slug];
          const g = getCountryGuide(slug)!;
          const items = [
            { label: "Tuition", value: tuitionLabel(slug), source: d.tuition.source },
            { label: "Living costs", value: `${formatMoney(slug, d.living)} a year`, source: d.living.source },
            { label: "Visa & permit fees", value: formatMoney(slug, d.visa), source: d.visa.source },
            { label: "Health insurance", value: d.insurance.amount === 0 ? "Free" : `${formatMoney(slug, d.insurance)} a year`, source: d.insurance.source },
            { label: "Flight from India", value: `from ₹${d.flight.inr.toLocaleString("en-IN")} one-way`, source: d.flight.source },
          ];
          return (
            <div key={slug} className="rounded-2xl border border-border bg-background p-4">
              <p className="flex items-center gap-2 font-bold text-foreground">
                <img src={`https://flagcdn.com/w40/${g.code}.png`} alt="" className="h-4 w-6 rounded-sm object-cover" />
                {plainName(g)}
              </p>
              <dl className="mt-3 space-y-3">
                {items.map((it) => (
                  <div key={it.label}>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{it.label}</dt>
                    <dd className="text-sm font-semibold text-foreground">{it.value}</dd>
                    <dd className="mt-0.5"><SourceLink source={it.source} /></dd>
                    {it.source.note && <dd className="mt-0.5 text-xs text-muted-foreground">{it.source.note}</dd>}
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <div className="mt-6 space-y-2 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Flights:</strong> airlines have no official price, so we show the lowest advertised one-way economy fare on the linked booking page. Peak-season fares are usually higher.
        </p>
        <p>
          <strong className="text-foreground">Rupee amounts</strong> use official exchange rates:{" "}
          {RATE_SOURCES.map((r, i) => (
            <span key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{r.name}</a>
              {i < RATE_SOURCES.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
        <p>
          <strong className="text-foreground">Mission Career estimate</strong> means no official figure is published — for example, private insurance or universities that set their own fees.
        </p>
      </div>
    </section>
  );
}
