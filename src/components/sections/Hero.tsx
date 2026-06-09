import {
  Sparkles, GraduationCap, Globe2, FileCheck, Wallet, Plane, LifeBuoy, ArrowRight,
  Star, Award, Rocket, Trophy, CalendarCheck,
} from "lucide-react";
import pooja from "@/assets/pooja-welling.png";
import gautam from "@/assets/gautam-umashankar.png";
import reema from "@/assets/reema-welling.png";
import julee from "@/assets/julee-shakya.png";
const logoAsset = { url: "/mission-logo-transparent.png" };
import { Counter } from "@/components/Counter";


const features = [
  { icon: GraduationCap, label: "Career & Course Guidance" },
  { icon: Globe2, label: "Global University Network" },
  { icon: FileCheck, label: "Complete Application Support" },
  { icon: Wallet, label: "Scholarship & Loan Guidance" },
  { icon: Plane, label: "Visa Documentation Help" },
  { icon: LifeBuoy, label: "Pre-Departure Support" },
];

const stats = [
  { value: 5000, suffix: "+", label: "Students Placed Abroad" },
  { value: 98, suffix: "%", label: "Visa Approval Rate" },
  { value: 20, suffix: "+", label: "Global Destinations" },
];

function TeamCard({ img, initial, name, role }: { img?: string; initial?: string; name: string; role: string }) {
  return (
    <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-3 md:p-5 hover-lift">
      <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-primary-soft to-sky-tint mb-2 md:mb-3 flex items-center justify-center">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" draggable={false} />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary text-primary-foreground text-3xl font-bold flex items-center justify-center">
            {initial}
          </div>
        )}
      </div>
      <h3 className="font-bold text-foreground text-sm md:text-base leading-tight">{name}</h3>
      <p className="text-xs md:text-sm text-primary">{role}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-hero pt-20 md:pt-32 pb-12 md:pb-20">
      {/* decorative dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-sky-tint/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Big animated logo showcase */}
        <div className="hero-logo-stage relative mx-auto mb-6 md:mb-10 flex items-center justify-center">
          {/* pulsing rings */}
          <div className="hero-logo-ring hero-logo-ring-1" />
          <div className="hero-logo-ring hero-logo-ring-2" />
          <div className="hero-logo-ring hero-logo-ring-3" />

          {/* orbiting widgets */}
          <div className="hero-orbit hero-orbit-1">
            <div className="hero-widget hero-widget-top"><Star className="h-4 w-4 md:h-5 md:w-5 text-primary" /></div>
            <div className="hero-widget hero-widget-bottom"><Award className="h-4 w-4 md:h-5 md:w-5 text-primary" /></div>
          </div>
          <div className="hero-orbit hero-orbit-2">
            <div className="hero-widget hero-widget-top"><Rocket className="h-4 w-4 md:h-5 md:w-5 text-primary-glow" /></div>
            <div className="hero-widget hero-widget-bottom"><Trophy className="h-4 w-4 md:h-5 md:w-5 text-primary-glow" /></div>
          </div>

          {/* floating sparkles */}
          <Sparkles className="hero-sparkle hero-sparkle-1 text-primary/70" />
          <Sparkles className="hero-sparkle hero-sparkle-2 text-primary-glow/70" />
          <Sparkles className="hero-sparkle hero-sparkle-3 text-primary/60" />
          <Sparkles className="hero-sparkle hero-sparkle-4 text-primary-glow/60" />

          {/* glow behind logo */}
          <div className="hero-logo-glow" />

          {/* the actual logo */}
          <img
            src={logoAsset.url}
            alt="Mission Career — Study Abroad Consulting"
            className="hero-logo-img relative z-10"
            draggable={false}
          />
        </div>

        {/* Book Your Slot CTA under logo */}
        <div className="flex justify-center mb-10 md:mb-14">
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hero-book-btn group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm md:text-base font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)",
              boxShadow: "0 8px 32px rgba(59,130,246,0.45), 0 0 0 1px rgba(255,255,255,0.18) inset",
            }}
          >
            <CalendarCheck className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Book Your Slot</span>
            <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 shadow-card mb-4 md:mb-6 animate-pulse-glow">
              <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary animate-spin-slow" />
              <span className="text-xs md:text-sm font-medium text-primary">Trusted by 5000+ students across India</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-foreground">
              Study Abroad<br />
              <span className="text-gradient">Without the</span><br />
              <span className="text-gradient">Confusion</span>
            </h1>

            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
              Finding the right university abroad shouldn't be complicated. 
              Discover the best countries, universities, and scholarships with expert guidance at every step.
            </p>

            <div className="mt-6 md:mt-8 grid sm:grid-cols-2 gap-2 md:gap-3 max-w-xl">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2 md:gap-3 rounded-full bg-card px-3 py-2 md:px-4 md:py-2.5 shadow-card">
                  <f.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs md:text-sm font-medium text-foreground">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-5 md:gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <Counter value={s.value} suffix={s.suffix} className="text-2xl md:text-4xl font-extrabold text-gradient" />
                  <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-2.5 md:gap-3">
              <a
                href="#contact"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-primary gradient-animated px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Free Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#destinations"
                className="inline-flex items-center rounded-full border-2 border-primary/30 bg-card px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-primary hover:bg-primary-soft hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Countries
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute -top-8 -right-8 w-40 h-40 border-2 border-dashed border-primary/30 rounded-full animate-float" />
            <div className="hidden md:block absolute -bottom-8 -left-8 w-32 h-32 border-2 border-dashed border-primary/20 rounded-full" />
            <div className="grid grid-cols-2 gap-3 md:gap-4 relative">
              <TeamCard img={pooja} name="Pooja Welling" role="Founder and Director" />
              <TeamCard img={gautam} name="Gautam Umashankar" role="International Admission Expert" />
              <TeamCard img={reema} name="Reema Welling" role="Admin Head" />
              <TeamCard img={julee} name="Julee Shakya" role="Admin Executive" />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
