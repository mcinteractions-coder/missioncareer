import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { reviews, type Review } from "@/data/reviews";

const GOOGLE_REVIEW_URL = "https://www.google.com/search?kgmid=/g/11byxgc8n8&q=Mission+Career";

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.6 35.5 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

function Stars({ count = 5, size = "h-4 w-4" }: { count?: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={`${size} fill-amber-400 text-amber-400`} />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="group relative w-[340px] shrink-0 rounded-3xl p-[1.5px] bg-gradient-to-br from-primary/30 via-transparent to-primary-glow/30 hover:from-primary/60 hover:to-primary-glow/60 transition-all">
      <div className="h-full rounded-[calc(1.5rem-1.5px)] glass border border-border/40 p-6 flex flex-col gap-4 hover-lift">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br ${r.gradient} grid place-items-center text-white font-bold shadow-soft`}>
              {r.initials}
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background grid place-items-center shadow-card border border-border/50">
                <GoogleG className="h-3 w-3" />
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm leading-tight text-foreground">{r.name}</h4>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
          </div>
          <Quote className="h-6 w-6 text-primary/30 shrink-0" />
        </div>

        <Stars />

        <p className="text-sm leading-relaxed text-foreground/85 line-clamp-5">
          {r.text}
        </p>

        {r.destination && (
          <div className="mt-auto pt-3 border-t border-border/40">
            <p className="text-xs text-muted-foreground">Now studying at</p>
            <p className="text-sm font-semibold text-primary">{r.destination}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export function Reviews() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);



  return (
    <section id="reviews" className="relative py-20 md:py-28 overflow-hidden">
      {/* ambient glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[60rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass border border-border/50 px-4 py-1.5 mb-5 shadow-card">
            <GoogleG className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wide text-foreground/80">VERIFIED GOOGLE REVIEWS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Loved by Students <span className="text-gradient">Worldwide</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground">
            Real stories from students who trusted us to launch their study-abroad journey.
          </p>

          {/* rating badge */}
          <div className="mt-7 inline-flex items-center gap-4 rounded-2xl glass border border-border/50 px-6 py-4 shadow-soft">
            <div className="text-left">
              <div className="text-4xl font-extrabold text-gradient leading-none">4.9</div>
              <Stars size="h-3.5 w-3.5" />
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <GoogleG className="h-5 w-5" />
                <span className="font-bold text-foreground">Google Reviews</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Based on 200+ verified reviews</p>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div
          className="relative -mx-4 md:-mx-6 mb-14"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused] py-2 px-4">
            {reviews.map((r, i) => (
              <ReviewCard key={`r-${i}`} r={r} />
            ))}
            {mounted && (
              <div aria-hidden="true" className="flex gap-5">
                {reviews.map((r, i) => (
                  <ReviewCard key={`c-${i}`} r={r} />
                ))}
              </div>
            )}
          </div>
        </div>



        {/* CTA */}
        <div className="text-center">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
          >
            <GoogleG className="h-4 w-4" />
            Read all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
