import { useState } from "react";
import { Building2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UNIVERSITY_LOGOS } from "@/lib/university-logos";

export function UniversityMarquee() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="university-logos" aria-labelledby="university-logos-title" className="border-y border-border bg-background py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Building2 className="h-4 w-4" /> Global education
            </div>
            <h2 id="university-logos-title" className="text-2xl font-bold text-foreground md:text-3xl">100 top universities worldwide</h2>
          </div>
          <a href="https://www.topuniversities.com/world-university-rankings/2026" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline underline-offset-4">
            QS World University Rankings 2026 <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div id="university-logo-grid" tabIndex={expanded ? -1 : 0} aria-label="100 university logos" className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 ${expanded ? "" : "max-h-[420px] overflow-y-auto overscroll-contain pr-2"}`}>
          {UNIVERSITY_LOGOS.map((uni) => (
            <a key={uni.id} href={uni.profile} target="_blank" rel="noopener noreferrer" aria-label={`${uni.name} university profile`} className="group flex min-w-0 flex-col items-center rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <img src={uni.logo} alt={`${uni.name} official logo`} width={90} height={90} loading="lazy" decoding="async" className="mb-3 h-[90px] w-[90px] shrink-0 object-contain" />
              <span className="min-h-10 text-xs font-semibold leading-5 text-foreground">{uni.name}</span>
              <span className="mt-1 text-[11px] leading-4 text-muted-foreground">{uni.location}</span>
            </a>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-center gap-3">
          <Button variant="outline" aria-expanded={expanded} aria-controls="university-logo-grid" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? "Collapse universities" : "Show all 100 universities"}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">University trademarks belong to their respective owners. Inclusion does not imply a partnership.</p>
        </div>
      </div>
    </section>
  );
}
