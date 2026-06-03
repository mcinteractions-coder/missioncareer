import { useEffect, useState } from "react";

export function IntroSplash() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Show once per session
    if (sessionStorage.getItem("mc_intro_played") === "1") {
      setShow(false);
      return;
    }
    sessionStorage.setItem("mc_intro_played", "1");
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, oklch(0.28 0.08 245) 0%, oklch(0.12 0.04 250) 70%)",
      }}
    >
      {/* glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] rounded-full bg-primary-glow/30 blur-[120px] animate-pulse" />

      {/* sweeping shine line */}
      <div className="splash-shine absolute inset-0 pointer-events-none" />

      <div className="relative text-center px-6">
        <div className="splash-title">
          <span className="splash-word">Mission</span>{" "}
          <span className="splash-word splash-word-2">Career</span>
        </div>
        <div className="splash-underline mx-auto mt-4" />
        <p className="splash-tag mt-5 text-sm md:text-base tracking-[0.4em] uppercase text-white/70">
          Study Abroad. Simplified.
        </p>
      </div>

      <style>{`
        .splash-title {
          font-family: var(--font-sans);
          font-weight: 900;
          letter-spacing: -0.04em;
          font-size: clamp(3rem, 12vw, 9rem);
          line-height: 1;
          background: linear-gradient(120deg, #ffffff 0%, #a5d8ff 40%, #74c0fc 60%, #ffffff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: splashShine 2.4s ease-in-out infinite;
          text-shadow: 0 0 60px rgba(116,192,252,0.25);
        }
        .splash-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) scale(0.9);
          animation: splashRise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .splash-word-2 { animation-delay: 0.25s; }
        .splash-underline {
          height: 3px; width: 0;
          background: linear-gradient(90deg, transparent, #74c0fc, transparent);
          border-radius: 9999px;
          animation: splashLine 1s ease-out 0.6s forwards;
        }
        .splash-tag {
          opacity: 0;
          animation: splashFade 0.8s ease-out 1s forwards;
        }
        .splash-shine::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: splashSweep 1.8s ease-in-out 0.3s;
        }
        @keyframes splashRise {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splashLine {
          to { width: min(420px, 70vw); }
        }
        @keyframes splashFade {
          to { opacity: 1; }
        }
        @keyframes splashShine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes splashSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
