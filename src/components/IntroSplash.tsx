import { useEffect, useState } from "react";
import logoAsset from "@/assets/mission-logo.png.asset.json";

export function IntroSplash() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("mc_intro_played") === "1") {
      setShow(false);
      return;
    }
    sessionStorage.setItem("mc_intro_played", "1");
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setLeaving(true), 2600);
    const t2 = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 3300);
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

      {/* orbiting rings */}
      <div className="splash-ring splash-ring-1" />
      <div className="splash-ring splash-ring-2" />
      <div className="splash-ring splash-ring-3" />

      {/* sweeping shine line */}
      <div className="splash-shine absolute inset-0 pointer-events-none" />

      <div className="relative text-center px-6 flex flex-col items-center">
        <div className="splash-logo-wrap">
          <div className="splash-logo-glow" />
          <img
            src={logoAsset.url}
            alt="Mission Career"
            className="splash-logo relative"
            draggable={false}
          />
        </div>
        <div className="splash-underline mx-auto mt-6" />
        <p className="splash-tag mt-5 text-xs md:text-sm tracking-[0.4em] uppercase text-white/70">
          Study Abroad. Simplified.
        </p>
      </div>

      <style>{`
        .splash-logo-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transform: scale(0.7);
          animation: splashLogoIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }
        .splash-logo {
          width: clamp(220px, 50vw, 460px);
          height: auto;
          filter: drop-shadow(0 0 30px rgba(116,192,252,0.6)) drop-shadow(0 0 60px rgba(116,192,252,0.3));
          animation: splashLogoFloat 4s ease-in-out infinite 1s;
        }
        .splash-logo-glow {
          position: absolute;
          inset: 10%;
          background: radial-gradient(circle, rgba(116,192,252,0.4) 0%, transparent 70%);
          filter: blur(40px);
          animation: splashGlowPulse 2.4s ease-in-out infinite;
        }
        .splash-underline {
          height: 3px; width: 0;
          background: linear-gradient(90deg, transparent, #74c0fc, transparent);
          border-radius: 9999px;
          animation: splashLine 1s ease-out 0.9s forwards;
        }
        .splash-tag {
          opacity: 0;
          animation: splashFade 0.8s ease-out 1.3s forwards;
        }
        .splash-shine::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: splashSweep 1.8s ease-in-out 0.5s;
        }
        .splash-ring {
          position: absolute;
          left: 50%; top: 50%;
          border: 1px solid rgba(116,192,252,0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .splash-ring-1 { width: 320px; height: 320px; animation: splashRingPulse 3s ease-out infinite; }
        .splash-ring-2 { width: 480px; height: 480px; animation: splashRingPulse 3s ease-out 0.6s infinite; }
        .splash-ring-3 { width: 660px; height: 660px; animation: splashRingPulse 3s ease-out 1.2s infinite; }

        @keyframes splashLogoIn {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes splashLogoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes splashGlowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes splashLine { to { width: min(420px, 70vw); } }
        @keyframes splashFade { to { opacity: 1; } }
        @keyframes splashSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splashRingPulse {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
        }
      `}</style>
    </div>
  );
}
