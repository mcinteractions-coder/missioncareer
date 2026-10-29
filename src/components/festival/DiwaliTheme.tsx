import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { DiwaliDecor } from "./DiwaliDecor";
import { DiwaliOffer } from "./DiwaliOffer";

// Offer (and theme) runs until end of 15 Nov 2026, India time.
export const DIWALI_END = new Date("2026-11-15T23:59:59+05:30");

export function isDiwaliActive(pathname: string, now = new Date()) {
  return !pathname.startsWith("/admin") && now <= DIWALI_END;
}

export function DiwaliTheme({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isDiwaliActive(pathname);

  // Portalled overlays (dialogs, menus, chat) render on <body>, so mirror the class there.
  useEffect(() => {
    document.body.classList.toggle("theme-diwali", active);
    return () => document.body.classList.remove("theme-diwali");
  }, [active]);

  return (
    <div className={active ? "theme-diwali min-h-screen" : undefined}>
      {children}
      {active && <DiwaliDecor />}
      {active && <DiwaliOffer />}
    </div>
  );
}
