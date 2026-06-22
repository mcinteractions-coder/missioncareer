import {
  Sparkles, GraduationCap, Globe2, FileCheck, Wallet, Plane, LifeBuoy, ArrowRight,
  Star, Award, CalendarCheck,
} from "lucide-react";
import pooja from "@/assets/pooja-welling.png";
import gautam from "@/assets/gautam-umashankar.png";
import reema from "@/assets/reema-welling.png";
import julee from "@/assets/julee-shakya.png";
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
    <section id="home" className="relative overflow-hidden pt-16 md:pt-24 pb-12 md:pb-20">
      {/* subtle background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Contained video showcase — matches the screenshot */}
        <div className="mx-auto max-w-5xl mb-8 md:mb-10">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            {/* Floating sparkles around the video */}
            <Sparkles className="absolute top-4 left-6 w-5 h-5 text-primary/60 animate-pulse z-20 pointer-events-none" />
            <Sparkles className="absolute top-8 right-10 w-4 h-4 text-primary-glow/50 animate-pulse z-20 pointer-events-none" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-16 left-10 w-6 h-6 text-primary/40 animate-pulse z-20 pointer-events-none" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-20 right-6 w-5 h-5 text-primary-glow/40 animate-pulse z-20 pointer-events-none" style={{ animationDelay: '1.5s' }} />
            <Star className="absolute top-1/2 -left-3 w-4 h-4 text-primary/30 animate-pulse z-20 pointer-events-none" style={{ animationDelay: '0.8s' }} />
            <Award className="absolute top-1/3 -right-3 w-4 h-4 text-primary-glow/30 animate-pulse z-20 pointer-events-none" style={{ animationDelay: '1.2s' }} />

            {/* Vimeo video */}
            <div className="relative w-full aspect-video bg-black overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/1202782475?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                className="absolute inset-0 w-full h-full"
                title="Mission Career"
              />
              {/* Cover Gemini watermark (top-right corner) */}
              <div className="absolute top-0 right-0 w-32 h-12 bg-black pointer-events-none z-10" />
              {/* Cover any bottom-right watermark too */}
              <div className="absolute bottom-0 right-0 w-32 h-12 bg-black pointer-events-none z-10" />
            </div>

            {/* Bottom gradient overlay + Book Your Slot button */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 md:bottom-7 left-0 right-0 flex justify-center pointer-events-auto">
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm md:text-base font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
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
          </div>
        </div>

        {/* Trusted badge — below the video container */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 shadow-card animate-pulse-glow">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary animate-spin-slow" />
            <span className="text-xs md:text-sm font-medium text-primary">Trusted by 5000+ students across India</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
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
