import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, GraduationCap, Briefcase, Wallet, Home, CheckCircle2, Award } from "lucide-react";
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
    if (!loaderData) return { meta: [{ title: "Country guide — Mission Career" }, { name: "robots", content: "noindex" }] };
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

function CountryPage() {
  const g = Route.useLoaderData();
  const facts = [
    { icon: Wallet, label: "Tuition", value: g.tuition },
    { icon: Home, label: "Living costs", value: g.living },
    { icon: Calendar, label: "Intakes", value: g.intakes },
    { icon: Briefcase, label: "Work rights", value: g.workRights },
  ];
  const cap = g.name.replace(/^the /, "The ");
  return (
    <main className="min-h-screen bg-background">
      <header className="bg-gradient-hero border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Mission Career
          </Link>
          <a href="#enquire" className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Free Counselling</a>
        </div>
        <div className="container mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-6">
          <img src={`https://flagcdn.com/w160/${g.code}.png`} alt={`${cap} flag`} className="w-24 rounded-lg shadow-card" />
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">Study in <span className="text-gradient">{g.name}</span> from India</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{g.intro}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-10 md:py-14 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Fees, intakes & work rights</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {facts.map((f) => (
                <div key={f.label} className="bg-card rounded-2xl p-5 shadow-card">
                  <f.icon className="h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">{f.label}</p>
                  <p className="text-foreground font-medium">{f.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Figures are approximate and vary by course and university. Ask us for exact costs.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Top universities in {g.name}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {g.universities.map((u) => (
                <li key={u} className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-card text-foreground">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0" /> {u}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">{g.visaName}: step by step</h2>
            <ol className="space-y-3">
              {g.visaSteps.map((s, i) => (
                <li key={s} className="flex gap-4 bg-card rounded-xl p-4 shadow-card">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <span className="text-foreground pt-1">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Scholarships for Indian students</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {g.scholarships.map((s) => (
                <div key={s.name} className="bg-card rounded-2xl p-5 shadow-card">
                  <Award className="h-6 w-6 text-primary" />
                  <p className="mt-2 font-bold text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How Mission Career helps</h2>
            <ul className="space-y-2">
              {["Free profile evaluation and university shortlisting", "Application and SOP support", "Visa documentation and mock interviews", "Scholarship and education loan guidance", "Pre-departure and accommodation help"].map((t) => (
                <li key={t} className="flex gap-2 text-foreground"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> {t}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Common questions</h2>
            <div className="space-y-3">
              {g.faqs.map((f) => (
                <details key={f.q} className="bg-card rounded-xl p-4 shadow-card">
                  <summary className="font-semibold text-foreground cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Other country guides</h2>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_GUIDES.filter((c) => c.slug !== g.slug).map((c) => (
                <Link key={c.slug} to="/study-abroad/$country" params={{ country: c.slug }} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:text-primary">
                  Study in {c.name.replace(/^the /, "")}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside id="enquire" className="lg:sticky lg:top-6 h-fit bg-card rounded-3xl shadow-card p-6 scroll-mt-6">
          <p className="text-xl font-bold text-foreground">Planning to study in {g.name}?</p>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">Book a free counselling call with our experts in Mumbai.</p>
          <CountryLeadForm country={cap.replace(/^The /, "")} />
        </aside>
      </div>
    </main>
  );
}
