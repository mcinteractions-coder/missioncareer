import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Scale } from "lucide-react";

const TOOLS = [
  {
    to: "/compare-countries" as const,
    icon: Scale,
    title: "Compare countries",
    desc: "Germany vs Canada vs UK? See fees, yearly cost in rupees, work rights and visas side by side.",
    cta: "Compare now",
  },
  {
    to: "/budget-calculator" as const,
    icon: Calculator,
    title: "Budget calculator",
    desc: "Find out roughly how much your whole degree abroad will cost — tuition, living, visa and flights.",
    cta: "Calculate my budget",
  },
];

export function PlanningTools() {
  return (
    <section id="planning-tools" className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Free planning tools</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-foreground">Plan your study abroad <span className="text-gradient">in 2 minutes</span></h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="group relative overflow-hidden rounded-3xl bg-card p-6 md:p-8 shadow-card border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:border-primary/40">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-125" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                <t.icon className="h-7 w-7" />
              </span>
              <h3 className="relative mt-5 text-2xl font-extrabold text-foreground">{t.title}</h3>
              <p className="relative mt-2 text-muted-foreground">{t.desc}</p>
              <span className="relative mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                {t.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
