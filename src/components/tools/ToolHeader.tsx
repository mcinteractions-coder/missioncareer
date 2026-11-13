import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function ToolHeader({ kicker, title, intro, children }: { kicker: string; title: ReactNode; intro: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden bg-gradient-hero border-b border-border">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-4 py-2 text-sm font-semibold text-foreground shadow-card hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Mission Career
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/compare-countries" className="rounded-full px-3 py-2 text-foreground hover:text-primary" activeProps={{ className: "rounded-full px-3 py-2 bg-card/80 text-primary shadow-card" }}>Compare</Link>
          <Link to="/budget-calculator" className="rounded-full px-3 py-2 text-foreground hover:text-primary" activeProps={{ className: "rounded-full px-3 py-2 bg-card/80 text-primary shadow-card" }}>Budget</Link>
        </nav>
      </div>
      <div className="relative container mx-auto px-4 md:px-8 pt-6 pb-12 md:pt-10 md:pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-3 py-1 text-xs font-semibold text-primary shadow-card">
          <Sparkles className="h-3.5 w-3.5" /> {kicker}
        </span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-foreground">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">{intro}</p>
        {children}
      </div>
    </header>
  );
}

export function CountrySelect({ value, onChange, options, label, id }: { value: string; onChange: (v: string) => void; options: { slug: string; name: string }[]; label: string; id: string }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>{o.name}</option>
        ))}
      </select>
    </label>
  );
}
