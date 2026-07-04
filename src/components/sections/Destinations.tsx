import { ArrowRight, ChevronUp, GraduationCap, Wallet, Calendar, Thermometer } from "lucide-react";
import { useState } from "react";
import { Counter } from "@/components/Counter";

type Country = {
  code: string;
  name: string;
  unis: string;
  tuition: string;
  topUnis: string;
  intake: string;
  climate: string;
};

const COUNTRIES: Country[] = [
  { code: "gb", name: "UK",           unis: "150+", tuition: "£12k – £38k",  topUnis: "Oxford, Cambridge, Imperial",       intake: "Sep, Jan",       climate: "Cool & rainy" },
  { code: "us", name: "USA",          unis: "200+", tuition: "$25k – $70k",  topUnis: "MIT, Harvard, Stanford",            intake: "Aug, Jan",       climate: "Varies by state" },
  { code: "ca", name: "Canada",       unis: "100+", tuition: "CA$15k – $40k", topUnis: "Toronto, McGill, UBC",              intake: "Sep, Jan, May",  climate: "Cold winters" },
  { code: "au", name: "Australia",    unis: "80+",  tuition: "AU$20k – $45k", topUnis: "Melbourne, ANU, Sydney",            intake: "Feb, Jul",       climate: "Warm & sunny" },
  { code: "de", name: "Germany",      unis: "90+",  tuition: "€0 – €20k",     topUnis: "TUM, LMU Munich, Heidelberg",       intake: "Oct, Apr",       climate: "Mild seasons" },
  { code: "ie", name: "Ireland",      unis: "40+",  tuition: "€10k – €25k",   topUnis: "Trinity, UCD, UCC",                 intake: "Sep, Jan",       climate: "Cool & wet" },
  { code: "nz", name: "New Zealand",  unis: "30+",  tuition: "NZ$22k – $35k", topUnis: "Auckland, Otago, Wellington",       intake: "Feb, Jul",       climate: "Mild oceanic" },
  { code: "it", name: "Italy",        unis: "50+",  tuition: "€1k – €20k",    topUnis: "Bologna, Milan, Sapienza",          intake: "Sep, Feb",       climate: "Mediterranean" },
  { code: "fr", name: "France",       unis: "60+",  tuition: "€3k – €18k",    topUnis: "Sorbonne, École Poly, Sciences Po", intake: "Sep, Jan",       climate: "Temperate" },
  { code: "es", name: "Spain",        unis: "45+",  tuition: "€1.5k – €20k",  topUnis: "Barcelona, Madrid, IE",             intake: "Sep, Feb",       climate: "Warm & sunny" },
  { code: "nl", name: "Netherlands",  unis: "35+",  tuition: "€8k – €20k",    topUnis: "TU Delft, Amsterdam, Utrecht",      intake: "Sep, Feb",       climate: "Cool & breezy" },
  { code: "se", name: "Sweden",       unis: "25+",  tuition: "SEK 80k – 200k",topUnis: "Lund, KTH, Uppsala",                intake: "Aug, Jan",       climate: "Cold winters" },
  { code: "no", name: "Norway",       unis: "20+",  tuition: "€0 – €15k",     topUnis: "Oslo, NTNU, Bergen",                intake: "Aug, Jan",       climate: "Cold & snowy" },
  { code: "dk", name: "Denmark",      unis: "22+",  tuition: "€6k – €16k",    topUnis: "Copenhagen, DTU, Aarhus",           intake: "Sep, Feb",       climate: "Cool oceanic" },
  { code: "fi", name: "Finland",      unis: "18+",  tuition: "€8k – €18k",    topUnis: "Helsinki, Aalto, Tampere",          intake: "Sep, Jan",       climate: "Cold winters" },
  { code: "ch", name: "Switzerland",  unis: "28+",  tuition: "CHF 1.5k – 8k", topUnis: "ETH Zurich, EPFL, Geneva",          intake: "Sep, Feb",       climate: "Alpine" },
  { code: "at", name: "Austria",      unis: "24+",  tuition: "€1.5k – €15k",  topUnis: "Vienna, TU Wien, Graz",             intake: "Oct, Mar",       climate: "Continental" },
  { code: "be", name: "Belgium",      unis: "20+",  tuition: "€4k – €13k",    topUnis: "KU Leuven, Ghent, ULB",             intake: "Sep, Feb",       climate: "Mild & wet" },
  { code: "pl", name: "Poland",       unis: "30+",  tuition: "€2k – €6k",     topUnis: "Warsaw, Jagiellonian, AGH",         intake: "Oct, Feb",       climate: "Cool continental" },
  { code: "cz", name: "Czech Republic",unis:"18+",  tuition: "€0 – €10k",     topUnis: "Charles, CTU Prague, Masaryk",      intake: "Sep, Feb",       climate: "Cool continental" },
  { code: "hu", name: "Hungary",      unis: "15+",  tuition: "€3k – €8k",     topUnis: "ELTE, Corvinus, Budapest Tech",     intake: "Sep, Feb",       climate: "Continental" },
  { code: "pt", name: "Portugal",     unis: "22+",  tuition: "€1k – €7k",     topUnis: "Lisbon, Porto, Coimbra",            intake: "Sep, Feb",       climate: "Mediterranean" },
  { code: "sg", name: "Singapore",    unis: "12+",  tuition: "S$17k – $50k",  topUnis: "NUS, NTU, SMU",                     intake: "Aug, Jan",       climate: "Tropical" },
  { code: "my", name: "Malaysia",     unis: "20+",  tuition: "RM 10k – 40k",  topUnis: "Malaya, Monash, Taylor's",          intake: "Feb, Sep",       climate: "Tropical" },
  { code: "jp", name: "Japan",        unis: "40+",  tuition: "¥500k – ¥1.5M", topUnis: "Tokyo, Kyoto, Osaka",               intake: "Apr, Oct",       climate: "Four seasons" },
  { code: "kr", name: "South Korea",  unis: "30+",  tuition: "₩4M – ₩12M",    topUnis: "SNU, KAIST, Yonsei",                intake: "Mar, Sep",       climate: "Four seasons" },
  { code: "cn", name: "China",        unis: "55+",  tuition: "¥20k – ¥50k",   topUnis: "Tsinghua, Peking, Fudan",           intake: "Sep, Mar",       climate: "Varies widely" },
  { code: "ae", name: "UAE",          unis: "18+",  tuition: "AED 40k – 90k", topUnis: "NYU Abu Dhabi, AUS, Khalifa",       intake: "Sep, Jan",       climate: "Hot & dry" },
  { code: "tr", name: "Turkey",       unis: "25+",  tuition: "$2k – $12k",    topUnis: "Boğaziçi, METU, Koç",               intake: "Sep, Feb",       climate: "Mediterranean" },
  { code: "ru", name: "Russia",       unis: "35+",  tuition: "$3k – $8k",     topUnis: "MSU, ITMO, HSE",                    intake: "Sep, Feb",       climate: "Cold & long winters" },
];

const INITIAL_COUNT = 8;

function CountryCard({ c }: { c: Country }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="group [perspective:1200px] h-56 md:h-64 cursor-pointer"
      onClick={() => setFlipped((v) => !v)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-card rounded-2xl p-4 md:p-6 shadow-card flex flex-col items-center justify-center text-center">
          <div className="flag-wave w-16 h-12 md:w-20 md:h-14 overflow-hidden rounded-md shadow-md mb-3">
            <img
              src={`https://flagcdn.com/w160/${c.code}.png`}
              srcSet={`https://flagcdn.com/w320/${c.code}.png 2x`}
              alt={`${c.name} flag`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-base md:text-xl font-bold text-foreground">{c.name}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            <span className="text-primary font-semibold">{c.unis}</span> Universities
          </p>
          <p className="mt-3 text-[10px] md:text-xs uppercase tracking-wider text-primary/70 font-semibold">
            Tap / hover for details
          </p>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-4 md:p-5 shadow-soft overflow-hidden text-white"
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
          }}
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/30">
            <img
              src={`https://flagcdn.com/w80/${c.code}.png`}
              alt=""
              className="w-6 h-4 rounded-sm object-cover"
              loading="lazy"
            />
            <p className="font-bold text-sm md:text-base text-white">{c.name}</p>
          </div>
          <ul className="space-y-1.5 md:space-y-2 text-[11px] md:text-[13px] leading-tight text-white">
            <li className="flex gap-2">
              <GraduationCap className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 mt-0.5 text-white" />
              <span><span className="text-white/75">Top: </span>{c.topUnis}</span>
            </li>
            <li className="flex gap-2">
              <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 mt-0.5 text-white" />
              <span><span className="text-white/75">Tuition/yr: </span>{c.tuition}</span>
            </li>
            <li className="flex gap-2">
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 mt-0.5 text-white" />
              <span><span className="text-white/75">Intake: </span>{c.intake}</span>
            </li>
            <li className="flex gap-2">
              <Thermometer className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 mt-0.5 text-white" />
              <span><span className="text-white/75">Climate: </span>{c.climate}</span>
            </li>
          </ul>
          <a
            href="#contact"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[10px] md:text-xs font-bold bg-white text-blue-700 hover:bg-white/90 px-2.5 py-1 rounded-full shadow-md"
          >
            Enquire <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

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
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            Hover or tap any country to see tuition, top universities, intakes and more
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {visible.map((c) => (
            <CountryCard key={c.code} c={c} />
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
