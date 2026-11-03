import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Grid3x3, Sparkles, Trophy } from "lucide-react";
import { DIWALI_END } from "@/components/festival/DiwaliTheme";

const CHIPS = [
  { icon: Flame, label: "Light the Diyas" },
  { icon: Grid3x3, label: "Rangoli Builder" },
  { icon: Sparkles, label: "Catch the Sweets" },
];

export function DiwaliGamesCard() {
  const [show, setShow] = useState(false);

  // Checked after mount so server and client markup always match.
  useEffect(() => {
    setShow(new Date() <= DIWALI_END);
  }, []);

  if (!show) return null;

  return (
    <section id="diwali-games" className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-6 shadow-card md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-primary shadow-card">
                <Trophy className="h-3.5 w-3.5" /> Play &amp; win
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-foreground md:text-4xl">
                Diwali games — <span className="text-gradient">win your offer</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                Light the diyas in order, rebuild the rangoli from memory, or catch falling sweets.
                Beat any round and unlock the Diwali offer on WhatsApp.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {CHIPS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <span
                      key={c.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-card"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" /> {c.label}
                    </span>
                  );
                })}
              </div>
            </div>
            <Link
              to="/diwali-games"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
            >
              Open Diwali Games <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
