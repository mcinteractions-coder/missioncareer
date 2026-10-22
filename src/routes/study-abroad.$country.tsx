import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, GraduationCap, Briefcase, Wallet, Home, CheckCircle2, Award, MessageCircle, Sparkles, Plane, HelpCircle, ChevronDown, Globe } from "lucide-react";
import type React from "react";
import { getCountryGuide, COUNTRY_GUIDES } from "@/data/country-guides";
import { CountryLeadForm } from "@/components/CountryLeadForm";

const SITE = "https://www.missioncareer.net";

export const Route = createFileRoute("/study-abroad/$country")({
  loader: ({ params }) => {
    const guide = getCountryGuide(params.country);
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Country guide — Mission Career" } as never, { name: "robots", content: "noindex" }] };
    const name = loaderData.name.replace(/^the /, "the ");
    const title = `Study in ${name} from India — Fees, Universities & Visa | Mission Career`;
    const desc = `Plan your study in ${name}: tuition fees, top universities, ${loaderData.visaName} steps and scholarships. Free counselling from Mission Career, Mumbai.`;
    const url = `${SITE}/study-abroad/${params.country}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
              { "@type": "ListItem", position: 2, name: `Study in ${name}`, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CountryPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Country guide not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Go home</Link>
      </div>
    </div>
  ),
});

function SectionTitle({ icon: Icon, kicker, title }: { icon: React.ElementType; kicker: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{kicker}</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{title}</h2>
      </div>
    </div>
  );
}

function CountryPage() {
  const g = Route.useLoaderData();
  const facts = [
    { icon: Wallet, label: "Tuition", value: g.tuition },
    { icon: Home, label: "Living costs", value: g.living },
    { icon: Calendar, label: "Intakes", value: g.intakes },
    { icon: Briefcase, label: "Work rights", value: g.workRights },
  ];
  const cap = g.name.replace(/^the /, "The ");
  const short = cap.replace(/^The /, "");
  const card = "bg-card rounded-2xl p-5 shadow-card border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:border-primary/40";
  return (
    <main className="min-h-screen bg-background">
      <header className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <img src={`https://flagcdn.com/w1280/${g.code}.png`} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08] blur-sm scale-110" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-4 py-2 text-sm font-semibold text-foreground shadow-card hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Mission Career
          </Link>
          <a href="#enquire" className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">Free Counselling</a>
        </div>
        <div className="relative container mx-auto px-4 md:px-8 pt-8 pb-14 md:pt-14 md:pb-20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl" />
            <img src={`https://flagcdn.com/w320/${g.code}.png`} alt={`${cap} flag`} className="relative w-36 md:w-44 rounded-2xl shadow-soft ring-4 ring-card -rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-3 py-1 text-xs font-semibold text-primary shadow-card">
              <Sparkles className="h-3.5 w-3.5" /> 2026–27 Country Guide
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-foreground">Study in <span className="text-gradient">{g.name}</span><br className="hidden md:block" /> from India</h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">{g.intro}</p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <a href="#enquire" className="rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:opacity-90">Get free guidance</a>
              <a href={`https://wa.me/919870003748?text=${encodeURIComponent(`Hi Mission Career! I'm exploring studying in ${short}. Can you guide me?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90">
                <MessageCircle className="h-5 w-5" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-4 md:px-8 -mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {facts.map((f) => (
          <div key={f.label} className="bg-card/95 backdrop-blur rounded-2xl p-4 md:p-5 shadow-soft border border-border/60">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.label}</p>
            </div>
            <p className="mt-3 text-sm md:text-base font-semibold text-foreground">{f.value}</p>
          </div>
        ))}
      </div>
      <p className="container mx-auto px-4 md:px-8 mt-3 text-xs text-muted-foreground">Figures are approximate and vary by course and university. Ask us for exact costs.</p>

      <div className="container mx-auto px-4 md:px-8 py-10 md:py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-14">
          <section>
            <SectionTitle icon={GraduationCap} kicker="Where to apply" title={`Top universities in ${g.name}`} />
            <ul className="grid sm:grid-cols-2 gap-3">
              {g.universities.map((u, i) => (
                <li key={u} className={`${card} flex items-center gap-4 p-4`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium text-foreground">{u}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle icon={Plane} kicker="Visa process" title={`${g.visaName}: step by step`} />
            <ol className="relative space-y-4 pl-2">
              <span className="absolute left-[1.45rem] top-4 bottom-4 w-0.5 bg-gradient-primary opacity-40" aria-hidden />
              {g.visaSteps.map((s, i) => (
                <li key={s} className="relative flex gap-4">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow ring-4 ring-background">{i + 1}</span>
                  <span className={`${card} flex-1 p-4 text-foreground`}>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionTitle icon={Award} kicker="Funding" title="Scholarships for Indian students" />
            <div className="grid sm:grid-cols-3 gap-4">
              {g.scholarships.map((s) => (
                <div key={s.name} className={`${card} relative overflow-hidden`}>
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/10" />
                  <Award className="relative h-7 w-7 text-primary" />
                  <p className="relative mt-3 font-bold text-foreground">{s.name}</p>
                  <p className="relative mt-1 text-sm text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 md:p-8 text-primary-foreground shadow-soft">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary-foreground/10" />
            <h2 className="relative text-2xl md:text-3xl font-extrabold">How Mission Career helps</h2>
            <ul className="relative mt-5 grid sm:grid-cols-2 gap-3">
              {["Free profile evaluation and university shortlisting", "Application and SOP support", "Visa documentation and mock interviews", "Scholarship and education loan guidance", "Pre-departure and accommodation help"].map((t) => (
                <li key={t} className="flex gap-2 rounded-xl bg-primary-foreground/10 p-3 backdrop-blur"><CheckCircle2 className="h-5 w-5 shrink-0" /> {t}</li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle icon={Sparkles} kicker="More from us" title="Explore Mission Career" />
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Our Services", desc: "Everything we help with", hash: "services", icon: GraduationCap },
                { label: "Book a Free Session", desc: "1-on-1 counselling in Mumbai", hash: "booking", icon: Calendar },
                { label: "Free Profile Evaluation", desc: "Know your admission chances", hash: "evaluation", icon: CheckCircle2 },
                { label: "Check Your Documents", desc: "AI document grading tool", hash: "grader", icon: Award },
                { label: "Student Success Stories", desc: "Reviews from our students", hash: "success", icon: Briefcase },
                { label: "Read Our Blog", desc: "Study abroad tips & updates", hash: "blog", icon: Wallet },
              ].map((b) => (
                <Link key={b.label} to="/" hash={b.hash} className={`${card} group flex items-center gap-3 p-4 text-foreground`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors"><b.icon className="h-5 w-5" /></span>
                  <span className="flex-1">
                    <span className="block font-semibold group-hover:text-primary">{b.label}</span>
                    <span className="block text-xs text-muted-foreground">{b.desc}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-transform" />
                </Link>
              ))}
              <a
                href={`https://wa.me/919870003748?text=${encodeURIComponent(`Hi Mission Career! I'm exploring studying in ${short}. Can you guide me?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-4 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                <MessageCircle className="h-5 w-5" /> Talk to us on WhatsApp
              </a>
            </div>
          </section>

          <section>
            <SectionTitle icon={HelpCircle} kicker="FAQs" title="Common questions" />
            <div className="space-y-3">
              {g.faqs.map((f) => (
                <details key={f.q} className="group bg-card rounded-2xl p-5 shadow-card border border-border/60 open:border-primary/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle icon={Globe} kicker="Compare" title="Other country guides" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COUNTRY_GUIDES.filter((c) => c.slug !== g.slug).map((c) => (
                <Link key={c.slug} to="/study-abroad/$country" params={{ country: c.slug }} className={`${card} group flex flex-col items-center gap-2 p-4 text-center`}>
                  <img src={`https://flagcdn.com/w80/${c.code}.png`} alt={`${c.name.replace(/^the /, "")} flag`} className="h-9 w-14 rounded-md object-cover shadow-card group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">Study in {c.name.replace(/^the /, "")}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside id="enquire" className="lg:sticky lg:top-6 h-fit scroll-mt-6 overflow-hidden rounded-3xl bg-card shadow-soft border border-border/60">
          <div className="bg-gradient-primary p-6 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90">Free · No obligation</p>
            <p className="mt-1 text-xl font-extrabold">Planning to study in {g.name}?</p>
            <p className="mt-1 text-sm opacity-90">Book a free counselling call with our experts in Mumbai.</p>
          </div>
          <div className="p-6">
            <CountryLeadForm country={short} />
          </div>
        </aside>
      </div>
    </main>
  );
}
