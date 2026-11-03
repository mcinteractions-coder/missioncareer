import { MessageCircle, RotateCcw, Trophy } from "lucide-react";
import { prizeLink } from "./prize";
import { logGameEvent } from "@/lib/game-track";

export function PrizeCard({
  game,
  score,
  best,
  onReplay,
}: {
  game: string;
  score: number;
  best: number;
  onReplay: () => void;
}) {
  const claim = () => {
    logGameEvent("diwali_prize_claim", { game, score });
    if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
      (window as unknown as { fbq: (a: string, b: string) => void }).fbq("track", "Lead");
    }
  };

  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-card p-5 text-center text-card-foreground shadow-soft">
      <div className="diwali-confetti pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="diwali-confetti-bit absolute top-0 rounded-sm"
            style={{
              left: `${(i * 3.9) % 100}%`,
              width: 6 + (i % 3) * 3,
              height: 10 + (i % 4) * 3,
              background: ["#f59e0b", "#e11d48", "#2563eb", "#16a34a", "#a855f7"][i % 5],
              animationDelay: `${(i % 7) * 0.12}s`,
            }}
          />
        ))}
      </div>

      <Trophy className="mx-auto h-9 w-9 text-primary" />
      <p className="mt-2 text-2xl font-extrabold text-gradient">You won!</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {game} — score <b className="text-foreground">{score}</b>
        <span className="mx-2">·</span> best <b className="text-foreground">{best}</b>
      </p>
      <p className="mt-3 rounded-xl bg-primary-soft p-3 text-sm">
        Your Diwali prize is waiting: <b>100% off consultancy</b> for USA, UK, Canada, Australia,
        Ireland &amp; New Zealand, or <b>₹5,000 off</b> for European countries.
      </p>
      <a
        href={prizeLink(game, score)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={claim}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
      >
        <MessageCircle className="h-4 w-4" /> Claim prize on WhatsApp
      </a>
      <button
        onClick={onReplay}
        className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" /> Play again
      </button>
    </div>
  );
}
