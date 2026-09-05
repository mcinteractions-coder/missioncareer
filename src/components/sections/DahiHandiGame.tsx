import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Janmashtami "Break the Handi" mini game.
 * A matki swings across the top; tap at the right moment so the
 * govinda's jump lands on it. Purely client-side fun, no backend.
 */

function GameMatki({ broken }: { broken: boolean }) {
  return (
    <svg viewBox="0 0 64 72" className="h-16 w-14 md:h-20 md:w-16" aria-hidden="true">
      <ellipse cx="32" cy="14" rx="14" ry="4" fill="hsl(45 90% 55%)" opacity="0.9" />
      {broken ? (
        <>
          <path d="M18 18 C10 28 10 40 18 50 L30 34 Z" fill="hsl(20 55% 34%)" />
          <path d="M46 18 C54 28 54 40 46 50 L34 34 Z" fill="hsl(18 50% 28%)" />
        </>
      ) : (
        <>
          <path d="M18 18 C8 28 6 44 16 56 C22 64 42 64 48 56 C58 44 56 28 46 18 Z" fill="url(#gameMatkiBody)" />
          <ellipse cx="32" cy="18" rx="15" ry="5" fill="hsl(20 55% 32%)" />
          <ellipse cx="32" cy="17" rx="11" ry="3.4" fill="hsl(0 0% 100%)" opacity="0.85" />
          <path d="M11 36 C24 42 40 42 53 36" stroke="hsl(45 92% 58%)" strokeWidth="3" fill="none" />
          <path d="M13 46 C24 51 40 51 51 46" stroke="hsl(0 72% 52%)" strokeWidth="2.5" fill="none" />
        </>
      )}
      <defs>
        <linearGradient id="gameMatkiBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(22 62% 48%)" />
          <stop offset="55%" stopColor="hsl(18 55% 36%)" />
          <stop offset="100%" stopColor="hsl(14 50% 26%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GameGovinda({ jumping }: { jumping: boolean }) {
  return (
    <svg
      viewBox="0 0 40 60"
      className={`h-24 w-16 transition-transform duration-300 ${jumping ? "-translate-y-24 md:-translate-y-32" : ""}`}
      aria-hidden="true"
    >
      <circle cx="20" cy="10" r="7" fill="hsl(28 45% 62%)" />
      <path d="M13 7 q7 -6 14 0 q-7 -2 -14 0 Z" fill="hsl(0 72% 48%)" />
      <path d="M20 17 l8 6 v16 h-16 V23 Z" fill="hsl(200 70% 45%)" />
      <path d={jumping ? "M12 24 l-6 -12" : "M12 24 l-8 -6"} stroke="hsl(28 45% 62%)" strokeWidth="4" strokeLinecap="round" />
      <path d={jumping ? "M28 24 l6 -12" : "M28 24 l8 -6"} stroke="hsl(28 45% 62%)" strokeWidth="4" strokeLinecap="round" />
      <path d="M15 39 v16" stroke="hsl(28 45% 62%)" strokeWidth="5" strokeLinecap="round" />
      <path d="M25 39 v16" stroke="hsl(28 45% 62%)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function DahiHandiGame() {
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(0); // 0..1 across track
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [jumping, setJumping] = useState(false);
  const [broken, setBroken] = useState(false);
  const [msg, setMsg] = useState("Tap when the handi is right above the pyramid!");
  const [splash, setSplash] = useState(false);

  const raf = useRef<number | null>(null);
  const dir = useRef(1);
  const posRef = useRef(0);
  const lockRef = useRef(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem("dahi-handi-best") || "0");
    if (!Number.isNaN(saved)) setBest(saved);
  }, []);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const speed = 0.28 + level * 0.06;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      let next = posRef.current + dir.current * speed * dt;
      if (next > 1) {
        next = 1;
        dir.current = -1;
      } else if (next < 0) {
        next = 0;
        dir.current = 1;
      }
      posRef.current = next;
      setPos(next);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running, level]);

  const start = () => {
    setScore(0);
    setLevel(1);
    setBroken(false);
    setMsg("Govinda aala re! Time your tap.");
    posRef.current = 0;
    dir.current = 1;
    setRunning(true);
  };

  const tap = useCallback(() => {
    if (!running || lockRef.current) return;
    lockRef.current = true;
    setJumping(true);
    const distance = Math.abs(posRef.current - 0.5);
    const hit = distance < 0.09;
    window.setTimeout(() => {
      if (hit) {
        setBroken(true);
        setSplash(true);
        setScore((s) => {
          const ns = s + (distance < 0.035 ? 2 : 1);
          setBest((b) => {
            const nb = Math.max(b, ns);
            localStorage.setItem("dahi-handi-best", String(nb));
            return nb;
          });
          return ns;
        });
        setLevel((l) => Math.min(l + 1, 9));
        setMsg(distance < 0.035 ? "Perfect hit! Makkhan mil gaya 🧈" : "Handi phoot gayi! Keep going 🎉");
        window.setTimeout(() => {
          setBroken(false);
          setSplash(false);
        }, 700);
      } else {
        setMsg("Miss! Handi bach gayi — thoda aur timing 🙂");
        setScore(0);
        setLevel(1);
      }
      setJumping(false);
      lockRef.current = false;
    }, 320);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        running ? tap() : start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, tap]);

  return (
    <section id="dahi-handi-game" className="relative z-10 py-12 md:py-16" aria-label="Dahi Handi game">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-card/85 p-6 shadow-card backdrop-blur md:p-8">
          <h2 className="text-center text-2xl font-extrabold md:text-3xl">
            Break the <span className="text-gradient">Dahi Handi</span>
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">
            Tap (or press space) exactly when the matki is above the pyramid. Every hit makes it swing faster.
          </p>

          <div className="mt-5 flex items-center justify-center gap-6 text-sm font-bold">
            <span>Score: <span className="text-primary">{score}</span></span>
            <span>Level: <span className="text-primary">{level}</span></span>
            <span>Best: <span className="text-primary">{best}</span></span>
          </div>

          <div className="relative mt-6 h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 to-transparent md:h-80">
            {/* swinging matki on rope */}
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `calc(${pos * 100}% )`, transform: "translateX(-50%)" }}
            >
              <div className="h-8 w-[2px] bg-[hsl(35_60%_45%)] md:h-10" />
              <GameMatki broken={broken} />
            </div>

            {/* curd splash */}
            {splash &&
              Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="dahi-splash"
                  style={{ left: "50%", top: "35%", ["--a" as string]: `${i * 30}deg` }}
                />
              ))}

            {/* pyramid + jumper at center */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <GameGovinda jumping={jumping} />
              <div className="-mt-2 h-2 w-40 rounded-full bg-primary/25 blur-sm" />
            </div>

            {/* target zone marker */}
            <div className="absolute bottom-0 left-1/2 h-full w-24 -translate-x-1/2 border-x border-dashed border-primary/25" />
          </div>

          <p className="mt-4 text-center text-sm font-semibold">{msg}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {!running ? (
              <button
                onClick={start}
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-card transition hover:scale-105"
              >
                Start Playing
              </button>
            ) : (
              <>
                <button
                  onClick={tap}
                  className="rounded-full bg-primary px-8 py-3 text-base font-extrabold text-primary-foreground shadow-card transition hover:scale-105"
                >
                  Tap to Jump!
                </button>
                <button
                  onClick={() => setRunning(false)}
                  className="rounded-full border border-primary/30 px-6 py-3 text-sm font-bold transition hover:bg-primary/10"
                >
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
