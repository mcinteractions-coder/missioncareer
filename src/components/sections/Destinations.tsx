import { ArrowRight } from "lucide-react";
import { Counter } from "@/components/Counter";

const COUNTRIES = [
  { flag: "🇬🇧", name: "UK", unis: "150+" },
  { flag: "🇺🇸", name: "USA", unis: "200+" },
  { flag: "🇨🇦", name: "Canada", unis: "100+" },
  { flag: "🇦🇺", name: "Australia", unis: "80+" },
  { flag: "🇩🇪", name: "Germany", unis: "90+" },
  { flag: "🇮🇪", name: "Ireland", unis: "40+" },
  { flag: "🇳🇿", name: "New Zealand", unis: "30+" },
  { flag: "🇮🇹", name: "Italy", unis: "50+" },
];

export function Destinations() {
  return (
    <section id="destinations" className="py-12 md:py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">Explore the World</span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Top Study <span className="text-gradient">Destinations</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">Choose from the world's best countries for higher education</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {COUNTRIES.map((c) => (
            <div key={c.name} className="group bg-card rounded-2xl p-4 md:p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all text-center">
              <div className="text-4xl md:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{c.flag}</div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">{c.name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{c.unis}</span> Universities
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow">
            View All Countries <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-6 bg-gradient-primary rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-soft text-primary-foreground">
          <div className="text-center"><Counter value={5000} suffix="+" className="block text-2xl md:text-4xl font-extrabold" /><div className="text-[11px] md:text-sm opacity-90">Students Guided</div></div>
          <div className="text-center"><Counter value={98} suffix="%" className="block text-2xl md:text-4xl font-extrabold" /><div className="text-[11px] md:text-sm opacity-90">Visa Success</div></div>
          <div className="text-center"><Counter value={120} suffix="+" className="block text-2xl md:text-4xl font-extrabold" /><div className="text-[11px] md:text-sm opacity-90">University Partners</div></div>
        </div>
      </div>
    </section>
  );
}
