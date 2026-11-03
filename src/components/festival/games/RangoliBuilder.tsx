import { useEffect, useRef, useState } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { logGameEvent, readBest, writeBest } from "@/lib/game-track";
import { PrizeCard } from "./PrizeCard";

const GAME = "Rangoli Builder";
const TIME = 25;
const SHOW_TIME = 4;
const MAX_STRIKES = 3;

const COLOURS = [
  { id: "marigold", name: "Marigold", hex: "#f59e0b" },
  { id: "rose", name: "Rose", hex: "#e11d48" },
  { id: "peacock", name: "Peacock", hex: "#2563eb" },
  { id: "leaf", name: "Leaf", hex: "#16a34a" },
] as const;

type ColourId = (typeof COLOURS)[number]["id"];

// Diamond rangoli: cells of a 5x5 grid whose distance from centre is <= 2.
const CELLS: number[] = [];
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    if (Math.abs(r - 2) + Math.abs(c - 2) <= 2) CELLS.push(r * 5 + c);
  }
}
const TOTAL = CELLS.length;

type Phase = "idle" | "show" | "play" | "won" | "lost";

function makeTargets(): Record<number, ColourId> {
  const t: Record<number, ColourId> = {};
  for (const i of CELLS) t[i] = COLOURS[Math.floor(Math.random() * COLOURS.length)].id;
  return t;
}

export function RangoliBuilder() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targets, setTargets] = useState<Record<number, ColourId>>({});
  const [filled, setFilled] = useState<Record<number, ColourId>>({});
  const [picked, setPicked] = useState<ColourId>("marigold");
  const [strikes, setStrikes] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(SHOW_TIME);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const targetsRef = useRef<Record<number, ColourId>>({});

  useEffect(() => {
    setBest(readBest("rangoli"));
  }, []);

  const start = () => {
    const t = makeTargets();
    targetsRef.current = t;
    setTargets(t);
    setFilled({});
    setStrikes(0);
    setWrong(null);
    setPicked("marigold");
    setCountdown(SHOW_TIME);
    setTimeLeft(TIME);
    setScore(0);
    setPhase("show");
    logGameEvent("diwali_game_start", { game: GAME });
  };

  // Reveal the pattern for a few seconds, then hide it.
  useEffect(() => {
    if (phase !== "show") return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          setPhase("play");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
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
      logGameEvent("diwali_game_lost", { game: GAME, score: Object.keys(filled).length });
    }
  }, [phase, timeLeft, filled]);

  const tap = (i: number) => {
    if (phase !== "play" || filled[i]) return;
    if (picked === targetsRef.current[i]) {
      const next = { ...filled, [i]: picked };
      setFilled(next);
      if (Object.keys(next).length === TOTAL) {
        const s = Math.max(
          60,
          150 + Math.round(timeLeft * 8) - strikes * 20,
        );
        setScore(s);
        setPhase("won");
        setBest(writeBest("rangoli", s));
        logGameEvent("diwali_game_win", { game: GAME, score: s });
      }
    } else {
      const st = strikes + 1;
      setStrikes(st);
      setWrong(i);
      window.setTimeout(() => setWrong(null), 420);
      if (st >= MAX_STRIKES) {
        setPhase("lost");
        logGameEvent("diwali_game_lost", { game: GAME, score: Object.keys(filled).length });
      }
    }
  };

  const done = Object.keys(filled).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-muted-foreground">
          Petals filled <b className="text-foreground">{done}</b> / {TOTAL}
          <span className="mx-2">·</span>
          Strikes <b className="text-destructive">{strikes}</b> / {MAX_STRIKES}
        </p>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <Timer className="h-4 w-4 text-primary" />
            {phase === "show" ? `${countdown}s` : `${Math.ceil(timeLeft)}s`}
          </span>
          <span className="text-muted-foreground">
            Best <b className="text-foreground">{best}</b>
          </span>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-[width] duration-100"
          style={{
            width: `${
              phase === "show"
                ? (countdown / SHOW_TIME) * 100
                : (timeLeft / TIME) * 100
            }%`,
          }}
        />
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 md:flex-row md:items-start md:justify-center">
        <div className="grid grid-cols-5 gap-1.5 rounded-3xl border border-border bg-card p-3 shadow-card">
          {Array.from({ length: 25 }).map((_, i) => {
            const inRangoli = CELLS.includes(i);
            if (!inRangoli) return <div key={i} className="h-9 w-9 md:h-11 md:w-11" />;
            const isFilled = Boolean(filled[i]);
            const showTarget = phase === "show";
            const target = targets[i];
            const hex = COLOURS.find((c) => c.id === (isFilled ? filled[i] : target))?.hex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => tap(i)}
                aria-label={`Rangoli petal ${i + 1}${isFilled ? " filled" : ""}`}
                className={`h-9 w-9 rotate-45 rounded-md border transition-all md:h-11 md:w-11 ${
                  isFilled
                    ? "border-transparent"
                    : "border-dashed border-border bg-muted/60 hover:border-primary"
                } ${wrong === i ? "diwali-shake ring-2 ring-destructive" : ""}`}
                style={
                  isFilled || showTarget
                    ? { background: hex, opacity: isFilled ? 1 : 0.55 }
                    : undefined
                }
              />
            );
          })}
        </div>

        <div className="w-full max-w-[220px]">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Pick a colour
          </p>
          <div className="mt-2 grid gap-2">
            {COLOURS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPicked(c.id)}
                aria-pressed={picked === c.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                  picked === c.id
                    ? "border-primary bg-primary-soft text-foreground shadow-card"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60"
                }`}
              >
                <span
                  className="h-5 w-5 rotate-45 rounded-sm"
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {phase === "idle" && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            The rangoli shows every petal colour for {SHOW_TIME} seconds. When it goes blank, fill
            each petal with the colour you remember. Three wrong petals ends the round.
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
          Remember the colours…
        </p>
      )}

      {phase === "lost" && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {strikes >= MAX_STRIKES
              ? "Three wrong petals — the rangoli lost its colour."
              : "Time up — the rangoli stayed half-finished."}{" "}
            You filled {done} of {TOTAL} petals.
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
