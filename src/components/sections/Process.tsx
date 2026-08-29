import { useEffect, useRef, useState } from "react";
import { Phone, ClipboardList, Building2, FileText, Stamp, Plane, ArrowRight } from "lucide-react";

const STEPS = [
  { n: "01", icon: Phone, title: "Free Counseling", desc: "Book a free session with our expert counselors to discuss your goals, preferences, and budget." },
  { n: "02", icon: ClipboardList, title: "Profile Evaluation", desc: "We analyze your academic background, test scores, and career aspirations to create a roadmap." },
  { n: "03", icon: Building2, title: "University Shortlisting", desc: "Based on your profile, we shortlist the best universities and courses that match your goals." },
  { n: "04", icon: FileText, title: "Application Support", desc: "Complete assistance with SOP, LOR, and all application documents for your chosen universities." },
  { n: "05", icon: Stamp, title: "Visa Assistance", desc: "Expert guidance for visa documentation, interview preparation, and appointment scheduling." },
  { n: "06", icon: Plane, title: "Pre-Departure Support", desc: "Help with accommodation, travel arrangements, forex, and everything before you fly." },
];

export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight * 0.5;
      const seen = window.innerHeight * 0.85 - r.top;
      setProgress(Math.max(0, Math.min(1, seen / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const knots = Math.round(progress * STEPS.length);

  return (
    <section id="process" className="py-12 md:py-24 bg-gradient-hero relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Our <span className="text-gradient">Process</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">A simple 6-step journey to your dream university abroad</p>
        </div>

        {/* progress line that fills step-by-step as you scroll */}
        <div className="relative mx-auto mb-8 h-6 max-w-4xl" aria-hidden="true">
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary/15" />
          <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-primary" style={{ width: `${progress * 100}%` }} />
          {STEPS.map((s, i) => (
            <span
              key={s.n}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-primary transition-all duration-500"
              style={{
                left: `${(i / (STEPS.length - 1)) * 100}%`,
                width: 14,
                height: 14,
                opacity: i < knots ? 1 : 0.25,
                transform: `translate(-50%, -50%) scale(${i < knots ? 1 : 0.7})`,
              }}
            />
          ))}
        </div>


        <div ref={wrapRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative bg-card rounded-2xl p-5 md:p-6 shadow-card hover:shadow-soft transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-4xl md:text-5xl font-extrabold text-gradient">{s.n}</span>
                <div className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <s.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
              <p className="text-base md:text-lg font-bold text-foreground">{s.title}</p>
              <p className="mt-1.5 md:mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary/40 h-6 w-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
