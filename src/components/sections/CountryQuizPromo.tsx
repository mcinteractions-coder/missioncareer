import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

const SAMPLE = [
  { code: "de", name: "Germany", pct: 92 },
  { code: "ca", name: "Canada", pct: 87 },
  { code: "ie", name: "Ireland", pct: 84 },
];

export function CountryQuizPromo() {
  return (
    <section id="country-quiz" className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-6 md:p-12 text-primary-foreground shadow-soft">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-primary-foreground/10" />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> 1-minute quiz
              </span>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">Which country suits you?</h2>
              <p className="mt-3 max-w-md text-base md:text-lg opacity-90">Answer 8 quick questions about your course, marks, budget and plans. Get your top 3 countries out of 30 — with a match score you can share.</p>
              <Link to="/country-quiz" className="mt-7 inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-lg font-bold text-primary shadow-card transition-transform hover:-translate-y-0.5">
                Take the quiz <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider opacity-80">Example result</p>
              <div className="space-y-3">
                {SAMPLE.map((s, i) => (
                  <div key={s.code} className={`flex items-center gap-3 rounded-2xl bg-card/95 p-4 text-foreground shadow-card ${i === 0 ? "md:-ml-6" : i === 2 ? "md:ml-6" : ""}`}>
                    <img src={`https://flagcdn.com/w80/${s.code}.png`} alt="" className="h-9 w-12 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="font-extrabold">{s.name}</p>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-primary/10">
                        <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xl font-extrabold text-primary">{s.pct}%</span>
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
