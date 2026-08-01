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
  const [direction, setDirection] = useState<1 | -1>(1);

  const next = useCallback(() => {
    setDirection(1);
    setI((v) => (v + 1) % SLIDES.length);
  }, []);
  const prev = useCallback(() => {
    setDirection(-1);
    setI((v) => (v - 1 + SLIDES.length) % SLIDES.length);
  }, []);
  const goTo = useCallback((idx: number) => {
    setDirection(idx > i ? 1 : -1);
    setI(idx);
  }, [i]);

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
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
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm font-semibold transition-all hover:border-primary/50 hover:bg-accent hover:shadow-glow"
          >
            <Maximize2 className="h-4 w-4 transition-transform group-hover:scale-110" /> Present
          </button>
          <a
            href={deckPdf.url}
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:shadow-glow hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> PDF
          </a>
        </div>
      </div>

      <div className="group overflow-hidden rounded-[28px] border border-border bg-card shadow-card">
        <div className="relative bg-muted">
          <div
            key={i}
            className={`animate-slide-reveal ${direction === 1 ? "origin-left" : "origin-right"}`}
          >
            <img
              src={SLIDES[i]}
              alt={`Seminar slide ${i + 1} of ${SLIDES.length}`}
              className="w-full select-none"
              loading="lazy"
            />
          </div>

          {/* Hover-reveal cinematic nav overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="pointer-events-auto absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="pointer-events-auto absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            {String(i + 1).padStart(2, "0")} <span className="text-white/40">/</span> {SLIDES.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {SLIDES.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(idx)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
              idx === i
                ? "border-primary ring-2 ring-primary/40 shadow-glow"
                : "border-border opacity-80 hover:opacity-100 hover:scale-[1.03] hover:-translate-y-1 hover:border-primary/50 hover:shadow-card"
            }`}
          >
            <img src={src} alt={`Slide ${idx + 1} thumbnail`} className="w-full" loading="lazy" />
            <span
              className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                idx === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/50 text-white/90 opacity-0 transition-opacity group-hover:opacity-100"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {full && (
        <div className="animate-present-enter fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
          <img src={SLIDES[i]} alt={`Seminar slide ${i + 1}`} className="max-h-full max-w-full rounded-lg" />
          <button
            type="button"
            onClick={() => setFull(false)}
            aria-label="Exit presentation"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-card/90 text-foreground shadow-card backdrop-blur transition-transform hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-card/90 text-foreground shadow-card backdrop-blur transition-transform hover:scale-105"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-card/90 text-foreground shadow-card backdrop-blur transition-transform hover:scale-105"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-card/90 px-4 py-1.5 text-sm font-bold text-foreground shadow-card backdrop-blur">
            {String(i + 1).padStart(2, "0")} / {SLIDES.length}
          </div>
        </div>
      )}
    </div>
  );
}
