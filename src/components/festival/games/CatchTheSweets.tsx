import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Heart, RotateCcw, Timer } from "lucide-react";
import { logGameEvent, readBest, writeBest } from "@/lib/game-track";
import { PrizeCard } from "./PrizeCard";

const GAME = "Catch the Sweets";
const TIME = 30;
const TARGET = 150;
const LIVES = 3;
const BASKET_W = 96;

type Kind = { emoji: string; points: number; bad: boolean; label: string };
const SWEET: Kind = { emoji: "🍬", points: 10, bad: false, label: "sweet" };
const DIYA: Kind = { emoji: "🪔", points: 15, bad: false, label: "diya" };
const GIFT: Kind = { emoji: "🎁", points: 25, bad: false, label: "gift" };
const CRACKER: Kind = { emoji: "🧨", points: -15, bad: true, label: "firecracker" };

type Item = { id: number; x: number; y: number; v: number; kind: Kind; rot: number };
type Phase = "idle" | "play" | "won" | "lost";

let uid = 0;

function pickKind(): Kind {
  const r = Math.random();
  if (r < 0.45) return SWEET;
  if (r < 0.68) return DIYA;
  if (r < 0.78) return GIFT;
  return CRACKER;
}

export function CatchTheSweets() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [best, setBest] = useState(0);
  const [note, setNote] = useState("");
  const arenaRef = useRef<HTMLDivElement>(null);
  const wRef = useRef(360);
  const model = useRef({
    items: [] as Item[],
    basketX: 180,
    score: 0,
    lives: LIVES,
    time: TIME,
    spawn: 0.5,
    hitAt: 0,
    catchAt: 0,
  });
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    setBest(readBest("sweets"));
  }, []);

  useEffect(() => {
    const measure = () => {
      if (arenaRef.current) wRef.current = arenaRef.current.clientWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const finish = useCallback((won: boolean, why: string) => {
    const s = model.current.score;
    if (won) {
      setBest(writeBest("sweets", s));
      logGameEvent("diwali_game_win", { game: GAME, score: s });
      setPhase("won");
    } else {
      setNote(why);
      logGameEvent("diwali_game_lost", { game: GAME, score: s });
      setPhase("lost");
    }
  }, []);

  const start = () => {
    const w = wRef.current;
    model.current = {
      items: [],
      basketX: w / 2,
      score: 0,
      lives: LIVES,
      time: TIME,
      spawn: 0.5,
      hitAt: 0,
      catchAt: 0,
    };
    setNote("");
    setPhase("play");
    logGameEvent("diwali_game_start", { game: GAME });
  };

  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = model.current;
      const w = wRef.current;
      const h = arenaRef.current?.clientHeight ?? 360;

      m.time = Math.max(0, m.time - dt);
      const elapsed = TIME - m.time;

      m.spawn -= dt;
      if (m.spawn <= 0) {
        m.spawn = Math.max(0.32, 0.8 - elapsed * 0.012);
        m.items.push({
          id: ++uid,
          x: 26 + Math.random() * Math.max(40, w - 52),
          y: -28,
          v: 105 + elapsed * 6 + Math.random() * 70,
          kind: pickKind(),
          rot: Math.random() * 30 - 15,
        });
      }

      const kept: Item[] = [];
      for (const it of m.items) {
        it.y += it.v * dt;
        if (it.y >= h - 58 && Math.abs(it.x - m.basketX) < BASKET_W / 2 + 10) {
          m.score = Math.max(0, m.score + it.kind.points);
          if (it.kind.bad) {
            m.lives -= 1;
            m.hitAt = Date.now();
          } else {
            m.catchAt = Date.now();
          }
          continue;
        }
        if (it.y < h + 40) kept.push(it);
      }
      m.items = kept;
      force();

      if (m.lives <= 0) {
        finish(false, "Too many firecrackers landed in your basket.");
        return;
      }
      if (m.time <= 0) {
        finish(
          m.score >= TARGET,
          m.score >= TARGET ? "" : `You scored ${m.score} — ${TARGET} was needed to win.`,
        );
        return;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, finish]);

  const move = (clientX: number) => {
    const el = arenaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    model.current.basketX = Math.min(r.width - BASKET_W / 2, Math.max(BASKET_W / 2, x));
  };

  const nudge = (delta: number) => {
    const el = arenaRef.current;
    if (!el) return;
    const w = el.clientWidth;
    model.current.basketX = Math.min(
      w - BASKET_W / 2,
      Math.max(BASKET_W / 2, model.current.basketX + delta),
    );
  };

  const m = model.current;
  const now = Date.now();
  const hurt = now - m.hitAt < 320;
  const sweet = now - m.catchAt < 220;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-muted-foreground">
          Score <b className="text-foreground">{m.score}</b> / {TARGET}
        </p>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <Timer className="h-4 w-4 text-primary" /> {Math.ceil(m.time)}s
          </span>
          <span className="inline-flex items-center gap-1" aria-label={`${m.lives} lives left`}>
            {Array.from({ length: LIVES }).map((_, i) => (
              <Heart
                key={i}
                className={`h-4 w-4 ${i < m.lives ? "fill-destructive text-destructive" : "text-muted"}`}
              />
            ))}
          </span>
          <span className="text-muted-foreground">
            Best <b className="text-foreground">{best}</b>
          </span>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-[width] duration-100"
          style={{ width: `${(m.time / TIME) * 100}%` }}
        />
      </div>

      <div
        ref={arenaRef}
        tabIndex={0}
        role="application"
        aria-label="Catch the sweets game area. Move the basket with your pointer or arrow keys."
        onPointerMove={(e) => move(e.clientX)}
        onPointerDown={(e) => move(e.clientX)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            nudge(-20);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            nudge(20);
          }
        }}
        className="relative mt-4 h-[360px] touch-none overflow-hidden rounded-3xl border border-border bg-gradient-hero shadow-card outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-[420px]"
      >
        {m.items.map((it) => (
          <span
            key={it.id}
            className="absolute select-none text-3xl leading-none"
            style={{
              left: it.x,
              top: it.y,
              transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
            }}
            aria-hidden="true"
          >
            {it.kind.emoji}
          </span>
        ))}

        <div
          className={`absolute bottom-2 h-11 rounded-b-[999px] rounded-t-lg border-2 transition-colors ${
            hurt
              ? "border-destructive bg-destructive/25"
              : sweet
                ? "border-primary bg-primary-soft shadow-glow"
                : "border-primary/60 bg-card"
          }`}
          style={{ left: m.basketX - BASKET_W / 2, width: BASKET_W }}
          aria-hidden="true"
        >
          <div className="mx-auto mt-1.5 h-1.5 w-3/4 rounded-full bg-primary/40" />
        </div>

        {phase !== "play" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-5 backdrop-blur-sm">
            <div className="max-w-sm text-center">
              {phase === "idle" && (
                <>
                  <p className="text-lg font-extrabold text-gradient">Catch the Sweets</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Slide the basket to catch sweets, diyas and gifts. Firecrackers cost points and
                    a life. Reach {TARGET} points in {TIME} seconds to win your Diwali prize.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    🍬 +10 &nbsp; 🪔 +15 &nbsp; 🎁 +25 &nbsp; 🧨 −15
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
                  >
                    Start round
                  </button>
                </>
              )}
              {phase === "lost" && (
                <>
                  <p className="text-lg font-extrabold text-foreground">Round over</p>
                  <p className="mt-2 text-sm text-muted-foreground">{note}</p>
                  <button
                    type="button"
                    onClick={start}
                    className="mx-auto mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <RotateCcw className="h-4 w-4" /> Play again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Drag anywhere in the arena, or use the ← → keys.
      </p>

      {phase === "won" && <PrizeCard game={GAME} score={m.score} best={best} onReplay={start} />}
    </div>
  );
}
