import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Globe2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Quote,
  School,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { getSuccessStories, type SuccessStory } from "@/lib/success-stories.functions";
import { reviews } from "@/data/reviews";

const SITE = "https://www.missioncareer.net";
const WA_NUMBER = "919870003748";
const WA_STORY = encodeURIComponent(
  "Hi Mission Career, I am already abroad and would like to share my success story.",
);

const successStoriesQueryOptions = queryOptions({
  queryKey: ["success-stories"],
  queryFn: () => getSuccessStories(),
});

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-lime-500 to-green-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-indigo-600",
  "from-red-500 to-orange-600",
];

const FLAG_CODE_BY_COUNTRY: Record<string, string> = {
  Germany: "de",
  Canada: "ca",
  USA: "us",
  UK: "gb",
  Australia: "au",
  Ireland: "ie",
  France: "fr",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function excerpt(text: string, max = 230) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : max)}…`;
}

function countryFlag(destination: string) {
  return FLAG_CODE_BY_COUNTRY[destination] || "un";
}

export const Route = createFileRoute("/success-stories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(successStoriesQueryOptions),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const count = loaderData?.stories?.length ?? 0;
    const universities = new Set(
      (loaderData?.stories ?? []).map((s) => s.university).filter(Boolean),
    ).size;
    const countries = new Set(
      (loaderData?.stories ?? []).map((s) => s.destination).filter(Boolean),
    ).size;
    const topCountry =
      (loaderData?.stories ?? [])
        .map((s) => s.destination)
        .filter(Boolean)
        .sort(
          (a, b) =>
            (loaderData?.stories ?? []).filter((s) => s.destination === b).length -
            (loaderData?.stories ?? []).filter((s) => s.destination === a).length,
        )[0] || "Germany";
    const topFlag = countryFlag(topCountry);
    const image = `https://flagcdn.com/w1200/${topFlag}.png`;
    const title = "Study Abroad Success Stories — Students & Reviews | Mission Career";
    const desc = count
      ? `${count} Mission Career students now studying at ${universities} universities in ${countries} — their universities, courses, Indian colleges and honest reviews. Free counselling in Mumbai.`
      : "Real Mission Career students who got admitted and reached universities abroad — universities, courses, visa journeys and student reviews.";
    const url = `${SITE}/success-stories`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: `Flag of ${topCountry}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Student Success Stories",
                item: url,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Mission Career student success stories",
            numberOfItems: count,
            itemListElement: (loaderData?.stories ?? []).map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Person",
                name: s.name,
                alumniOf: {
                  "@type": "EducationalOrganization",
                  name: s.university,
                },
                description: [s.course, s.destination].filter(Boolean).join(", "),
              },
            })),
          }),
        },
      ],
    };
  },
  component: SuccessStoriesPage,
  errorComponent: ({ error }) => (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          We couldn't load the success stories
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Please refresh the page."}
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  ),
});

function TopBar() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-3">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-4 py-2 text-sm font-semibold text-foreground shadow-card hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Mission Career
      </Link>
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
          "Hi Mission Career, I saw your student success stories and would like free counselling.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground shadow-card hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" /> Free Counselling
      </a>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-card rounded-2xl px-4 py-5 text-center shadow-card border border-border/60">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-2 text-2xl md:text-3xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs md:text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function SectionHead({
  icon: Icon,
  kicker,
  title,
  sub,
}: {
  icon: typeof Users;
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6 md:mb-9 flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{kicker}</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{title}</h2>
        </div>
      </div>
      {sub && <p className="text-sm md:text-base text-muted-foreground max-w-2xl">{sub}</p>}
    </div>
  );
}

function StoryCard({ s, index }: { s: SuccessStory; index: number }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return (
    <article className="group bg-card rounded-2xl border border-border/60 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative h-14 bg-gradient-to-r from-primary/12 via-primary/5 to-transparent flex items-center justify-end px-4">
        <img
          src={`https://flagcdn.com/w160/${s.flagCode}.png`}
          srcSet={`https://flagcdn.com/w320/${s.flagCode}.png 2x`}
          alt={`Flag of ${s.destination || "their study destination"}`}
          className="h-7 w-auto rounded-sm shadow-md ring-1 ring-black/10"
          loading="lazy"
        />
      </div>

      <div className="px-5 -mt-9">
        {s.image ? (
          <img
            src={s.image}
            alt={s.name}
            className="relative h-16 w-16 rounded-full object-cover ring-4 ring-card shadow-md bg-secondary"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden
            className={`relative h-16 w-16 rounded-full ring-4 ring-card shadow-md bg-gradient-to-br ${gradient} flex items-center justify-center text-lg font-extrabold text-white`}
          >
            {initials(s.name)}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-3">
        <h3 className="font-bold text-foreground text-base md:text-lg leading-tight">
          {s.name}
        </h3>

        {s.university && (
          <p className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-primary leading-snug">
            <School className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{s.university}</span>
          </p>
        )}
        {s.course && (
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground leading-snug">
            <BookOpen className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{s.course}</span>
          </p>
        )}
        {(s.prevCollege || s.prevCourse) && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
            <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {s.prevCourse && s.prevCollege
                ? `${s.prevCourse} at ${s.prevCollege}`
                : s.prevCollege || s.prevCourse}
            </span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {s.destination && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
              <MapPin className="h-3 w-3" /> {s.destination}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground/70">
            <BadgeCheck className="h-3 w-3" /> Reached abroad
          </span>
        </div>
      </div>
    </article>
  );
}

function SuccessStoriesPage() {
  const { data } = useSuspenseQuery(successStoriesQueryOptions);
  const stories = data.stories;
  const [country, setCountry] = useState("All");

  const stats = useMemo(() => {
    const universities = new Set(stories.map((s) => s.university).filter(Boolean));
    const destinations = new Set(stories.map((s) => s.destination).filter(Boolean));
    const colleges = new Set(stories.map((s) => s.prevCollege).filter(Boolean));
    return {
      students: stories.length,
      universities: universities.size,
      countries: destinations.size,
      colleges: colleges.size,
    };
  }, [stories]);

  const destinationCounts = useMemo(() => {
    const map = new Map<string, number>();
    stories.forEach((s) => {
      if (!s.destination) return;
      map.set(s.destination, (map.get(s.destination) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [stories]);

  const visible = useMemo(
    () => (country === "All" ? stories : stories.filter((s) => s.destination === country)),
    [stories, country],
  );

  const byCountry = useMemo(
    () =>
      destinationCounts.map(([name, count]) => ({
        name,
        count,
        flag: countryFlag(name),
        universities: [
          ...new Set(
            stories.filter((s) => s.destination === name && s.university).map((s) => s.university),
          ),
        ],
      })),
    [destinationCounts, stories],
  );

  return (
    <main className="min-h-screen bg-background">
      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative">
          <TopBar />
          <div className="container mx-auto px-4 md:px-8 pt-8 pb-14 md:pt-12 md:pb-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-3 py-1 text-xs font-semibold text-primary shadow-card">
              <Sparkles className="h-3.5 w-3.5" /> Our pride · real students
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
              Students who <span className="text-gradient">reached abroad</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
              Every student below was counselled by Mission Career in Kandivali East, Mumbai, and is
              now studying at a university overseas. Their university, course and the Indian college
              they came from are listed exactly as recorded in our admissions log.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                  "Hi Mission Career, I saw your student success stories and would like free counselling for studying abroad.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm md:text-base font-semibold text-whatsapp-foreground shadow-soft hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Talk to us on WhatsApp
              </a>
              <Link
                to="/"
                hash="contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
              >
                Book a free session <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-3xl">
              <StatCard icon={Users} value={stats.students} label="Students placed" />
              <StatCard icon={School} value={stats.universities} label="Universities" />
              <StatCard icon={Globe2} value={stats.countries} label="Countries" />
              <StatCard icon={Building2} value={stats.colleges} label="Indian colleges" />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Story grid ---------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHead
            icon={GraduationCap}
            kicker="The journeys"
            title="Who is studying where"
            sub="Filter by country to see the students from that destination."
          />

          {stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No stories published yet. Add a student in the admin panel and it will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {["All", ...destinationCounts.map(([name]) => name)].map((name) => {
                  const active = country === name;
                  const count =
                    name === "All"
                      ? stories.length
                      : destinationCounts.find(([n]) => n === name)?.[1] ?? 0;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCountry(name)}
                      aria-pressed={active}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        active
                          ? "bg-gradient-primary text-primary-foreground shadow-soft"
                          : "bg-card text-foreground/70 border border-border hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      {name} <span className="opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {visible.map((s, i) => (
                  <StoryCard key={s.id} s={s} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- Universities by country ---------- */}
      {byCountry.length > 0 && (
        <section className="py-12 md:py-20 bg-secondary/40">
          <div className="container mx-auto px-4 md:px-8">
            <SectionHead
              icon={School}
              kicker="Where they landed"
              title="Universities our students are at"
              sub="The universities Mission Career students were admitted to and enrolled in."
            />
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {byCountry.map((c) => (
                <div
                  key={c.name}
                  className="bg-card rounded-2xl p-5 md:p-6 shadow-card border border-border/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w160/${c.flag}.png`}
                      alt={`Flag of ${c.name}`}
                      className="h-7 w-auto rounded-sm ring-1 ring-black/10 shadow-sm"
                      loading="lazy"
                    />
                    <h3 className="font-bold text-lg text-foreground">{c.name}</h3>
                    <span className="ml-auto rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      {c.count} students
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.universities.map((u) => (
                      <li
                        key={u}
                        className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground/80"
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/study-abroad/$country"
                    params={{ country: c.name.toLowerCase().replace(/\s+/g, "-") }}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Read the {c.name} guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Testimonials ---------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHead
            icon={Quote}
            kicker="In their own words"
            title="What students say after landing"
            sub="Reviews written by students who completed their admission and visa with Mission Career."
          />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((r, i) => (
              <figure
                key={`${r.name}-${i}`}
                className="bg-card rounded-2xl p-5 md:p-6 shadow-card border border-border/60 flex flex-col"
              >
                <div className="flex items-center gap-1" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-foreground/90 leading-relaxed flex-1">
                  “{excerpt(r.text)}”
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-xs font-extrabold text-white`}
                  >
                    {r.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-foreground truncate">
                      {r.name}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate">
                      {r.destination || "Mission Career student"}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Want the full, uncut reviews?{" "}
            <a href="/#reviews" className="font-semibold text-primary hover:underline">
              Read every review on our homepage
            </a>
            .
          </p>
        </div>
      </section>

      {/* ---------- Recent admits ---------- */}
      {data.admits.length > 0 && (
        <section className="py-10 md:py-14 bg-secondary/40">
          <div className="container mx-auto px-4 md:px-8">
            <SectionHead
              icon={BadgeCheck}
              kicker="Offer letters"
              title="Latest admissions"
              sub="Students who received their university offer letters through Mission Career."
            />
            <ul className="flex flex-wrap gap-3">
              {data.admits.map((a) => (
                <li
                  key={`${a.name}-${a.university}`}
                  className="bg-card rounded-xl px-4 py-3 shadow-card border border-border/60"
                >
                  <p className="text-sm font-bold text-foreground">{a.name}</p>
                  <p className="text-xs text-primary font-medium">{a.university}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-6 py-10 md:px-12 md:py-14 shadow-soft">
            <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground">
                Your story could be next on this page
              </h2>
              <p className="mt-3 text-sm md:text-base text-primary-foreground/85">
                Free profile evaluation, university shortlisting, applications, visa documentation
                and pre-departure guidance — all under one roof in Kandivali East, Mumbai.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    "Hi Mission Career, I would like free counselling to study abroad.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm md:text-base font-semibold text-whatsapp-foreground hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Talk to us on WhatsApp
                </a>
                <Link
                  to="/"
                  hash="contact"
                  className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-sm md:text-base font-semibold text-foreground shadow-card hover:text-primary"
                >
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-5 py-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="min-w-0">
              <p className="font-bold text-foreground">
                Already abroad and a Mission Career student?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send us your university, course and a few lines about your journey — we will add
                your story to this page.
              </p>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_STORY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="md:ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
            >
              Share my story <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
