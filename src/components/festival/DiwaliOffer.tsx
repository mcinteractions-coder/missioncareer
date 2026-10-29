import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Diya } from "./DiwaliDecor";

const WA = `https://wa.me/919870003748?text=${encodeURIComponent("Hi Mission Career! I want to claim the Diwali offer on consultancy.")}`;

export function DiwaliOffer() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-6 z-40 flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow"
      >
        <Sparkles className="h-4 w-4" /> Diwali Offer
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 w-[min(92vw,340px)] rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-soft md:left-6">
      <button onClick={() => setOpen(false)} aria-label="Close Diwali offer" className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2">
        <Diya className="h-8 w-11" />
        <p className="text-lg font-extrabold text-gradient">Happy Diwali Offer</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        <li className="rounded-xl bg-primary-soft p-2.5">
          <span className="font-extrabold text-primary">100% OFF</span> consultancy fee — <b>FREE consultancy</b> for USA, UK, Canada, Australia, Ireland & New Zealand
        </li>
        <li className="rounded-xl bg-primary-soft p-2.5">
          <span className="font-extrabold text-primary">₹5,000 OFF</span> consultancy fee for European countries
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">Valid till 15 November 2026.</p>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block rounded-full bg-gradient-primary py-2 text-center text-sm font-bold text-primary-foreground shadow-soft"
      >
        Claim on WhatsApp
      </a>
    </div>
  );
}
