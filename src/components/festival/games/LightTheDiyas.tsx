import { useEffect, useRef, useState } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { logGameEvent, readBest, writeBest } from "@/lib/game-track";
import { PrizeCard } from "./PrizeCard";

const GRID = 9;
const SEQ_LEN = 6;
const TIME = 14;
const GAME = "Light the Diyas";

type Phase = "idle" | "show" | "play" | "won" | "lost";

function makeSeq() {
  const pool = Array.from({ length: GRID }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, SEQ_LEN);
}

function DiyaLamp({ lit, className = "" }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      {lit ? (
        <g className="diwali-flame">
          <path d="M32 2 C38 12 38 20 32 24 C26 20 26 12 32 2Z" fill="oklch(0.85 0.17 85)" />
          <path d="M32 9 C35 15 35 19 32 22 C29 19 29 15 32 9Z" fill="oklch(0.7 0.2 45)" />
        </g>
      ) : (
        <path d="M32 14 C34 18 34 21 32 23 C30 21 30 18 32 14Z" fill="oklch(0.72 0.02 60)" />
      )}
      <path
        d="M4 26 Q32 30 60 26 Q56 46 32 46 Q8 46 4 26Z"
        fill={lit ? "oklch(0.55 0.17 35)" : "oklch(0.8 0.025 70)"}
      />
      <path
        d="M10 30 Q32 34 54 30"
        stroke={lit ? "oklch(0.85 0.15 80)" : "oklch(0.88 0.02 70)"}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export function LightTheDiyas() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seq, setSeq] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [lit, setLit] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [wrong, setWrong] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const seqRef = useRef<number[]>([]);

  useEffect(() => {
    setBest(readBest("diyas"));
  }, []);

  const start = () => {
    const s = makeSeq();
    seqRef.current = s;
    setSeq(s);
    setPos(0);
    setLit([]);
    setFlash(null);
    setWrong(null);
    setTimeLeft(TIME);
    setScore(0);
    setPhase("show");
    logGameEvent("diwali_game_start", { game: GAME });
  };

  // Walk through the hidden order once, then hand control to the player.
  useEffect(() => {
    if (phase !== "show") return;
    const s = seqRef.current;
    let i = 0;
    let alive = true;
    setFlash(s[0]);
    const id = setInterval(() => {
      i += 1;
      if (i >= s.length) {
        clearInterval(id);
        setFlash(null);
        window.setTimeout(() => {
          if (alive) setPhase("play");
        }, 550);
      } else {
        setFlash(s[i]);
      }
    }, 560);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(
      () => setTimeLeft((t) => Math.max(0, +(t - 0.1).toFixed(2))),
      100,
    );
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && timeLeft <= 0) {
      setPhase("lost");
      logGameEvent("diwali_game_lost", { game: GAME, score: 0 });
    }
  }, [phase, timeLeft]);

  const tap = (i: number) => {
    if (phase !== "play" || lit.includes(i)) return;
    if (i === seqRef.current[pos]) {
      const next = [...lit, i];
      setLit(next);
      const np = pos + 1;
      setPos(np);
      if (np === seqRef.current.length) {
        const s = 100 + Math.round(timeLeft * 10);
        setScore(s);
        setPhase("won");
        setBest(writeBest("diyas", s));
        logGameEvent("diwali_game_win", { game: GAME, score: s });
      }
    } else {
      setWrong(i);
      setTimeLeft((t) => Math.max(0, +(t - 2).toFixed(2)));
      window.setTimeout(() => setWrong(null), 420);
    }
  };

  const order = new Map(seq.map((c, k) => [c, k + 1]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-muted-foreground">
          Light <b className="text-foreground">{pos}</b> / {SEQ_LEN} diyas in the shown order
        </p>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <Timer className="h-4 w-4 text-primary" /> {Math.ceil(timeLeft)}s
          </span>
          <span className="text-muted-foreground">
            Best <b className="text-foreground">{best}</b>
          </span>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-[width] duration-100"
          style={{ width: `${(timeLeft / TIME) * 100}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: GRID }).map((_, i) => {
          const isLit = lit.includes(i);
          const showNum = phase === "show" && order.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => tap(i)}
              aria-label={`Diya ${i + 1}${isLit ? " (lit)" : ""}`}
              className={`relative flex aspect-[4/3] items-center justify-center rounded-2xl border transition-all ${
                isLit
                  ? "border-primary/50 bg-primary-soft shadow-glow"
                  : "border-border bg-card hover:border-primary/60 hover:bg-primary-soft/60"
              } ${flash === i ? "diwali-glow border-primary" : ""} ${wrong === i ? "diwali-shake" : ""}`}
            >
              <DiyaLamp lit={isLit} className="h-3/4 w-3/4" />
              {showNum && (
                <span className="diwali-pop absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-xs font-extrabold text-primary-foreground">
                  {order.get(i)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {phase === "idle" && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Watch the numbered diyas, then tap them in that exact order before the timer runs out.
            A wrong tap costs 2 seconds.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
          >
            Start round
          </button>
        </div>
      )}

      {phase === "show" && (
        <p className="mt-4 text-center text-sm font-semibold text-primary">
          Memorise the order…
        </p>
      )}

      {phase === "lost" && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            The diyas went out — you lit {pos} of {SEQ_LEN}. Try again for a faster round.
          </p>
          <button
            type="button"
            onClick={start}
            className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-4 w-4" /> Play again
          </button>
        </div>
      )}

      {phase === "won" && <PrizeCard game={GAME} score={score} best={best} onReplay={start} />}
    </div>
  );
}
