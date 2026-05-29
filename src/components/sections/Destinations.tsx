import { ArrowRight, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Counter } from "@/components/Counter";

const COUNTRIES = [
  { code: "gb", name: "UK", unis: "150+" },
  { code: "us", name: "USA", unis: "200+" },
  { code: "ca", name: "Canada", unis: "100+" },
  { code: "au", name: "Australia", unis: "80+" },
  { code: "de", name: "Germany", unis: "90+" },
  { code: "ie", name: "Ireland", unis: "40+" },
  { code: "nz", name: "New Zealand", unis: "30+" },
  { code: "it", name: "Italy", unis: "50+" },
  { code: "fr", name: "France", unis: "60+" },
  { code: "es", name: "Spain", unis: "45+" },
  { code: "nl", name: "Netherlands", unis: "35+" },
  { code: "se", name: "Sweden", unis: "25+" },
  { code: "no", name: "Norway", unis: "20+" },
  { code: "dk", name: "Denmark", unis: "22+" },
  { code: "fi", name: "Finland", unis: "18+" },
  { code: "ch", name: "Switzerland", unis: "28+" },
  { code: "at", name: "Austria", unis: "24+" },
  { code: "be", name: "Belgium", unis: "20+" },
  { code: "pl", name: "Poland", unis: "30+" },
  { code: "cz", name: "Czech Republic", unis: "18+" },
  { code: "hu", name: "Hungary", unis: "15+" },
  { code: "pt", name: "Portugal", unis: "22+" },
  { code: "sg", name: "Singapore", unis: "12+" },
  { code: "my", name: "Malaysia", unis: "20+" },
  { code: "jp", name: "Japan", unis: "40+" },
  { code: "kr", name: "South Korea", unis: "30+" },
  { code: "cn", name: "China", unis: "55+" },
  { code: "ae", name: "UAE", unis: "18+" },
  { code: "tr", name: "Turkey", unis: "25+" },
  { code: "ru", name: "Russia", unis: "35+" },
];

const INITIAL_COUNT = 8;

export function Destinations() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? COUNTRIES : COUNTRIES.slice(0, INITIAL_COUNT);

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
          {visible.map((c) => (
            <div key={c.code} className="group bg-card rounded-2xl p-4 md:p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all text-center">
              <div className="flex justify-center mb-2 md:mb-3">
                <div className="flag-wave w-16 h-12 md:w-20 md:h-14 overflow-hidden rounded-md shadow-md group-hover:scale-110 transition-transform">
                  <img
                    src={`https://flagcdn.com/w160/${c.code}.png`}
                    srcSet={`https://flagcdn.com/w320/${c.code}.png 2x`}
                    alt={`${c.name} flag`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-base md:text-xl font-bold text-foreground">{c.name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{c.unis}</span> Universities
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
          >
            {showAll ? (
              <>Show Less <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>View All Countries <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
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
