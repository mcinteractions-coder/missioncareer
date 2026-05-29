import {
  Sparkles, GraduationCap, Globe2, FileCheck, Wallet, Plane, LifeBuoy, ArrowRight,
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
    <div className="bg-card rounded-3xl shadow-card p-5 hover-lift">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-soft to-sky-tint mb-3 flex items-center justify-center">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" draggable={false} />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary text-primary-foreground text-3xl font-bold flex items-center justify-center">
            {initial}
          </div>
        )}
      </div>
      <h3 className="font-bold text-foreground">{name}</h3>
      <p className="text-sm text-primary">{role}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-hero pt-28 md:pt-32 pb-20">
      {/* decorative dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-sky-tint/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-4 py-2 shadow-card mb-6 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-primary animate-spin-slow" />
              <span className="text-sm font-medium text-primary">Trusted by 5000+ students across India</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-foreground">
              Study Abroad<br />
              <span className="text-gradient">Without the</span><br />
              <span className="text-gradient">Confusion</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Finding the right university abroad shouldn't be complicated. Mission Career helps you discover
              the best countries, universities, and scholarships with expert guidance at every step.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-xl">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3 rounded-full bg-card px-4 py-2.5 shadow-card">
                  <f.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <Counter value={s.value} suffix={s.suffix} className="text-3xl md:text-4xl font-extrabold text-gradient" />
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-primary gradient-animated px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Free Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#destinations"
                className="inline-flex items-center rounded-full border-2 border-primary/30 bg-card px-6 py-3 font-semibold text-primary hover:bg-primary-soft hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Countries
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -right-8 w-40 h-40 border-2 border-dashed border-primary/30 rounded-full animate-float" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-2 border-dashed border-primary/20 rounded-full" />
            <div className="grid grid-cols-2 gap-4 relative">
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
