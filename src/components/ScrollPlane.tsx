import { useEffect, useRef, useState } from "react";

/**
 * A sexy 3D-ish paper/jet airplane that follows the page as you scroll.
 * - Flies along a sine-wave path across the viewport
 * - Tilts and banks based on scroll velocity
 * - Leaves a smooth gradient contrail behind it
 */
export function ScrollPlane() {
  const planeRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let smoothVel = 0;
    const points: { x: number; y: number }[] = [];

    const update = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const y = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const docH = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(1, Math.max(0, y / docH));

      // Vertical: keep plane roughly centered in viewport
      const screenY = vh * 0.42;

      // Horizontal: sine-wave sweep across viewport based on scroll progress
      const amp = Math.min(vw * 0.35, 320);
      const centerX = vw * 0.5;
      const screenX = centerX + Math.sin(progress * Math.PI * 4) * amp;

      // Velocity (px/ms) -> bank angle
      const vy = (y - lastY) / dt;
      smoothVel = smoothVel * 0.85 + vy * 0.15;
      lastY = y;
      lastT = now;

      // Tangent of sine path gives heading
      const tangent = Math.cos(progress * Math.PI * 4) * (Math.PI * 4) * amp / docH;
      const heading = Math.atan2(smoothVel * 40, 1) + tangent * 0.0008;
      const bank = Math.max(-35, Math.min(35, heading * 30 + smoothVel * 8));
      const pitch = Math.max(-20, Math.min(20, smoothVel * 6));

      const plane = planeRef.current;
      if (plane) {
        plane.style.transform = `translate3d(${screenX - 32}px, ${screenY - 32}px, 0) rotateX(${pitch}deg) rotateZ(${bank}deg)`;
      }

      // Trail
      points.push({ x: screenX, y: screenY });
      if (points.length > 40) points.shift();
      const trail = trailRef.current;
      if (trail && points.length > 1) {
        const d = points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");
        trail.setAttribute("d", d);
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Contrail */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="plane-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
          </linearGradient>
          <filter id="plane-trail-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <path
          ref={trailRef}
          stroke="url(#plane-trail)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          filter="url(#plane-trail-blur)"
        />
      </svg>

      {/* Plane */}
      <div
        ref={planeRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: 64,
          height: 64,
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))",
        }}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <defs>
            <linearGradient id="plane-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
            <linearGradient id="plane-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
            </linearGradient>
          </defs>
          {/* nose pointing right (0deg = flying right) */}
          <g transform="translate(32 32)">
            {/* main fuselage */}
            <polygon
              points="28,0 -22,-6 -18,0 -22,6"
              fill="url(#plane-body)"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            {/* top wing */}
            <polygon
              points="2,-2 -14,-22 -22,-22 -10,-2"
              fill="url(#plane-wing)"
              opacity="0.95"
            />
            {/* bottom wing */}
            <polygon
              points="2,2 -14,22 -22,22 -10,2"
              fill="url(#plane-wing)"
              opacity="0.7"
            />
            {/* tail fin */}
            <polygon
              points="-18,0 -26,-8 -22,0 -26,8"
              fill="hsl(var(--primary))"
              opacity="0.9"
            />
            {/* cockpit highlight */}
            <ellipse cx="14" cy="-1" rx="6" ry="2" fill="white" opacity="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
