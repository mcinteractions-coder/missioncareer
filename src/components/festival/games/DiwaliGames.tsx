import { useEffect, useState } from "react";
import { Flame, Grid3x3, Sparkles } from "lucide-react";
import { LightTheDiyas } from "./LightTheDiyas";
import { RangoliBuilder } from "./RangoliBuilder";
import { CatchTheSweets } from "./CatchTheSweets";
import { readBest } from "@/lib/game-track";

const GAMES = [
  {
    id: "diyas",
    label: "Light the Diyas",
    blurb: "Tap the diyas in the order you saw them",
    icon: Flame,
    key: "diyas",
  },
  {
    id: "rangoli",
    label: "Rangoli Builder",
    blurb: "Fill the pattern from memory",
    icon: Grid3x3,
    key: "rangoli",
  },
  {
    id: "sweets",
    label: "Catch the Sweets",
    blurb: "Catch laddoos & diyas, dodge firecrackers",
    icon: Sparkles,
    key: "sweets",
  },
] as const;

export function DiwaliGames() {
  const [tab, setTab] = useState<(typeof GAMES)[number]["id"]>("diyas");
  const [bests, setBests] = useState<Record<string, number>>({});

  useEffect(() => {
    setBests({
      diyas: readBest("diyas"),
      rangoli: readBest("rangoli"),
      sweets: readBest("sweets"),
    });
  }, []);

  return (
    <div>
      <div role="tablist" aria-label="Diwali games" className="grid gap-3 sm:grid-cols-3">
        {GAMES.map((g) => {
          const Icon = g.icon;
          const active = tab === g.id;
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(g.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-primary bg-primary-soft shadow-glow"
                  : "border-border bg-card hover:border-primary/60 hover:shadow-card"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-extrabold text-foreground">{g.label}</span>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{g.blurb}</span>
              <span className="mt-2 block text-xs font-semibold text-primary">
                Best {bests[g.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card/70 p-4 shadow-card md:p-6">
        {tab === "diyas" && <LightTheDiyas />}
        {tab === "rangoli" && <RangoliBuilder />}
        {tab === "sweets" && <CatchTheSweets />}
      </div>
    </div>
  );
}
