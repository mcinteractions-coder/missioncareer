import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Download, Presentation } from "lucide-react";
import s01 from "@/assets/seminar/slide-01.jpg.asset.json";
import s02 from "@/assets/seminar/slide-02.jpg.asset.json";
import s03 from "@/assets/seminar/slide-03.jpg.asset.json";
import s04 from "@/assets/seminar/slide-04.jpg.asset.json";
import s05 from "@/assets/seminar/slide-05.jpg.asset.json";
import s06 from "@/assets/seminar/slide-06.jpg.asset.json";
import s07 from "@/assets/seminar/slide-07.jpg.asset.json";
import s08 from "@/assets/seminar/slide-08.jpg.asset.json";
import s09 from "@/assets/seminar/slide-09.jpg.asset.json";
import s10 from "@/assets/seminar/slide-10.jpg.asset.json";
import s11 from "@/assets/seminar/slide-11.jpg.asset.json";
import s12 from "@/assets/seminar/slide-12.jpg.asset.json";
import deckPdf from "@/assets/seminar/deck.pdf.asset.json";

const SLIDES = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12].map((a) => a.url);

export function SeminarDeck() {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);

  const next = useCallback(() => setI((v) => (v + 1) % SLIDES.length), []);
  const prev = useCallback(() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Presentation className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-extrabold leading-tight">Mission Career Seminar</p>
            <p className="text-xs text-muted-foreground">Presentation deck · {SLIDES.length} slides</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFull(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm font-semibold transition-colors hover:border-primary/50"
          >
            <Maximize2 className="h-4 w-4" /> Present
          </button>
          <a
            href={deckPdf.url}
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition-shadow hover:shadow-glow"
          >
            <Download className="h-4 w-4" /> PDF
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-card">
        <div className="relative bg-muted">
          <img
            src={SLIDES[i]}
            alt={`Seminar slide ${i + 1} of ${SLIDES.length}`}
            className="w-full select-none"
            loading="lazy"
          />
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/85 shadow-card backdrop-blur transition-transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/85 shadow-card backdrop-blur transition-transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card/85 px-3 py-1 text-xs font-bold shadow-card backdrop-blur">
            {i + 1} / {SLIDES.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SLIDES.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(idx)}
            className={`overflow-hidden rounded-xl border transition-all ${
              idx === i ? "border-primary ring-2 ring-primary/40" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={src} alt={`Slide ${idx + 1} thumbnail`} className="w-full" loading="lazy" />
          </button>
        ))}
      </div>

      {full && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
          <img src={SLIDES[i]} alt={`Seminar slide ${i + 1}`} className="max-h-full max-w-full rounded-lg" />
          <button
            type="button"
            onClick={() => setFull(false)}
            aria-label="Exit presentation"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-card"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-card"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-card"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-4 py-1.5 text-sm font-bold shadow-card">
            {i + 1} / {SLIDES.length}
          </div>
        </div>
      )}
    </div>
  );
}
