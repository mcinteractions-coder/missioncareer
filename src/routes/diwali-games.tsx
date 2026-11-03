import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Sparkles, Trophy } from "lucide-react";
import { DiwaliGames } from "@/components/festival/games/DiwaliGames";
import { Footer } from "@/components/sections/Footer";

const SITE = "https://www.missioncareer.net";
const WA_NUMBER = "919870003748";
const WA_TEXT = encodeURIComponent(
  "Hi Mission Career! I played the Diwali games on your website and I'd like to claim my Diwali offer.",
);

export const Route = createFileRoute("/diwali-games")({
  head: () => {
    const title = "Diwali Games — Play, Win & Claim Your Study Abroad Offer | Mission Career";
    const desc =
      "Play three Diwali games — Light the Diyas, Rangoli Builder and Catch the Sweets — then claim your Diwali offer: 100% off consultancy for USA, UK, Canada, Australia, Ireland & New Zealand, or ₹5,000 off for European countries.";
    const url = `${SITE}/diwali-games`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
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
              { "@type": "ListItem", position: 2, name: "Diwali Games", item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Game",
            name: "Mission Career Diwali Games",
            description: desc,
            url,
            genre: "Casual",
            playMode: "SinglePlayer",
            publisher: { "@type": "Organization", name: "Mission Career", url: SITE },
          }),
        },
      ],
    };
  },
  component: DiwaliGamesPage,
});

function DiwaliGamesPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative container mx-auto px-4 md:px-8 pb-12 pt-6 md:pb-20 md:pt-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-card backdrop-blur hover:border-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft hover:shadow-glow"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Talk to us
            </a>
          </div>

          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-primary shadow-card backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Festival fun · free to play
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            Diwali <span className="text-gradient">games</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Three quick rounds — light the diyas, rebuild the rangoli from memory, and catch the
            falling sweets. Beat any round and your Diwali offer is unlocked:{" "}
            <b className="text-foreground">100% off consultancy</b> for USA, UK, Canada, Australia,
            Ireland &amp; New Zealand, or <b className="text-foreground">₹5,000 off</b> for European
            countries. Valid till 15 November 2026.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 md:px-8 md:py-14">
        <DiwaliGames />

        <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-5 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="text-base font-extrabold text-foreground">Won a round?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Message us on WhatsApp with your score and we will apply the Diwali offer to your
                counselling file — no paperwork, no waiting.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
          >
            <MessageCircle className="h-4 w-4" /> Claim on WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
