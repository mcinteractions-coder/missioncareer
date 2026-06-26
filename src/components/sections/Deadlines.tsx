import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Search, Flame } from "lucide-react";

type Uni = {
  name: string;
  country: string;
  domain: string;
  intake: string;
  deadline: string; // ISO date
};

// 100 top universities with real domains (used for Clearbit logos) and upcoming intake deadlines
const UNIVERSITIES: Uni[] = [
  // 🇺🇸 USA
  { name: "Harvard University", country: "USA", domain: "harvard.edu", intake: "Fall 2026", deadline: "2026-01-01" },
  { name: "MIT", country: "USA", domain: "mit.edu", intake: "Fall 2026", deadline: "2026-01-04" },
  { name: "Stanford University", country: "USA", domain: "stanford.edu", intake: "Fall 2026", deadline: "2026-01-05" },
  { name: "Princeton University", country: "USA", domain: "princeton.edu", intake: "Fall 2026", deadline: "2026-01-01" },
  { name: "Yale University", country: "USA", domain: "yale.edu", intake: "Fall 2026", deadline: "2026-01-02" },
  { name: "Columbia University", country: "USA", domain: "columbia.edu", intake: "Fall 2026", deadline: "2026-01-01" },
  { name: "University of Chicago", country: "USA", domain: "uchicago.edu", intake: "Fall 2026", deadline: "2026-01-03" },
  { name: "UC Berkeley", country: "USA", domain: "berkeley.edu", intake: "Fall 2026", deadline: "2026-01-15" },
  { name: "UCLA", country: "USA", domain: "ucla.edu", intake: "Fall 2026", deadline: "2026-01-15" },
  { name: "Cornell University", country: "USA", domain: "cornell.edu", intake: "Fall 2026", deadline: "2026-01-02" },
  { name: "University of Pennsylvania", country: "USA", domain: "upenn.edu", intake: "Fall 2026", deadline: "2026-01-05" },
  { name: "Carnegie Mellon University", country: "USA", domain: "cmu.edu", intake: "Fall 2026", deadline: "2026-01-15" },
  { name: "Johns Hopkins University", country: "USA", domain: "jhu.edu", intake: "Fall 2026", deadline: "2026-01-02" },
  { name: "Northwestern University", country: "USA", domain: "northwestern.edu", intake: "Fall 2026", deadline: "2026-01-03" },
  { name: "Duke University", country: "USA", domain: "duke.edu", intake: "Fall 2026", deadline: "2026-01-04" },
  { name: "NYU", country: "USA", domain: "nyu.edu", intake: "Fall 2026", deadline: "2026-01-05" },
  { name: "University of Michigan", country: "USA", domain: "umich.edu", intake: "Fall 2026", deadline: "2026-02-01" },
  { name: "Georgia Tech", country: "USA", domain: "gatech.edu", intake: "Fall 2026", deadline: "2026-01-10" },
  { name: "Boston University", country: "USA", domain: "bu.edu", intake: "Fall 2026", deadline: "2026-01-04" },
  { name: "Purdue University", country: "USA", domain: "purdue.edu", intake: "Fall 2026", deadline: "2026-01-15" },

  // 🇬🇧 UK
  { name: "University of Oxford", country: "UK", domain: "ox.ac.uk", intake: "Sept 2026", deadline: "2025-10-15" },
  { name: "University of Cambridge", country: "UK", domain: "cam.ac.uk", intake: "Sept 2026", deadline: "2025-10-15" },
  { name: "Imperial College London", country: "UK", domain: "imperial.ac.uk", intake: "Sept 2026", deadline: "2026-01-29" },
  { name: "UCL", country: "UK", domain: "ucl.ac.uk", intake: "Sept 2026", deadline: "2026-01-29" },
  { name: "LSE", country: "UK", domain: "lse.ac.uk", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "King's College London", country: "UK", domain: "kcl.ac.uk", intake: "Sept 2026", deadline: "2026-03-31" },
  { name: "University of Edinburgh", country: "UK", domain: "ed.ac.uk", intake: "Sept 2026", deadline: "2026-01-29" },
  { name: "University of Manchester", country: "UK", domain: "manchester.ac.uk", intake: "Sept 2026", deadline: "2026-01-29" },
  { name: "University of Warwick", country: "UK", domain: "warwick.ac.uk", intake: "Sept 2026", deadline: "2026-01-29" },
  { name: "University of Bristol", country: "UK", domain: "bristol.ac.uk", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "University of Glasgow", country: "UK", domain: "gla.ac.uk", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "University of Leeds", country: "UK", domain: "leeds.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "University of Birmingham", country: "UK", domain: "birmingham.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "University of Southampton", country: "UK", domain: "soton.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "University of Sheffield", country: "UK", domain: "sheffield.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "Durham University", country: "UK", domain: "durham.ac.uk", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "Queen Mary University", country: "UK", domain: "qmul.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "Coventry University", country: "UK", domain: "coventry.ac.uk", intake: "Jan 2026", deadline: "2025-11-30" },
  { name: "University of Surrey", country: "UK", domain: "surrey.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "Newcastle University", country: "UK", domain: "ncl.ac.uk", intake: "Sept 2026", deadline: "2026-07-31" },

  // 🇨🇦 Canada
  { name: "University of Toronto", country: "Canada", domain: "utoronto.ca", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "UBC", country: "Canada", domain: "ubc.ca", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "McGill University", country: "Canada", domain: "mcgill.ca", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "University of Alberta", country: "Canada", domain: "ualberta.ca", intake: "Sept 2026", deadline: "2026-03-01" },
  { name: "University of Waterloo", country: "Canada", domain: "uwaterloo.ca", intake: "Sept 2026", deadline: "2026-02-01" },
  { name: "McMaster University", country: "Canada", domain: "mcmaster.ca", intake: "Sept 2026", deadline: "2026-02-01" },
  { name: "Western University", country: "Canada", domain: "uwo.ca", intake: "Sept 2026", deadline: "2026-06-01" },
  { name: "Queen's University", country: "Canada", domain: "queensu.ca", intake: "Sept 2026", deadline: "2026-02-01" },
  { name: "Université de Montréal", country: "Canada", domain: "umontreal.ca", intake: "Sept 2026", deadline: "2026-02-01" },
  { name: "University of Calgary", country: "Canada", domain: "ucalgary.ca", intake: "Sept 2026", deadline: "2026-03-01" },
  { name: "University of Ottawa", country: "Canada", domain: "uottawa.ca", intake: "Sept 2026", deadline: "2026-04-01" },
  { name: "Simon Fraser University", country: "Canada", domain: "sfu.ca", intake: "Sept 2026", deadline: "2026-01-31" },
  { name: "York University", country: "Canada", domain: "yorku.ca", intake: "Sept 2026", deadline: "2026-02-01" },
  { name: "Concordia University", country: "Canada", domain: "concordia.ca", intake: "Sept 2026", deadline: "2026-03-01" },
  { name: "Dalhousie University", country: "Canada", domain: "dal.ca", intake: "Sept 2026", deadline: "2026-04-01" },

  // 🇦🇺 Australia
  { name: "University of Melbourne", country: "Australia", domain: "unimelb.edu.au", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "ANU", country: "Australia", domain: "anu.edu.au", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "University of Sydney", country: "Australia", domain: "sydney.edu.au", intake: "Feb 2026", deadline: "2026-01-15" },
  { name: "UNSW Sydney", country: "Australia", domain: "unsw.edu.au", intake: "Feb 2026", deadline: "2026-01-31" },
  { name: "University of Queensland", country: "Australia", domain: "uq.edu.au", intake: "Feb 2026", deadline: "2025-11-30" },
  { name: "Monash University", country: "Australia", domain: "monash.edu", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "University of Adelaide", country: "Australia", domain: "adelaide.edu.au", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "UWA", country: "Australia", domain: "uwa.edu.au", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "UTS Sydney", country: "Australia", domain: "uts.edu.au", intake: "Feb 2026", deadline: "2025-12-15" },
  { name: "RMIT University", country: "Australia", domain: "rmit.edu.au", intake: "Feb 2026", deadline: "2025-12-31" },
  { name: "Macquarie University", country: "Australia", domain: "mq.edu.au", intake: "Feb 2026", deadline: "2026-01-15" },
  { name: "Deakin University", country: "Australia", domain: "deakin.edu.au", intake: "Mar 2026", deadline: "2026-02-01" },

  // 🇩🇪 Germany
  { name: "TU Munich", country: "Germany", domain: "tum.de", intake: "Winter 2026", deadline: "2026-05-31" },
  { name: "LMU Munich", country: "Germany", domain: "lmu.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "Heidelberg University", country: "Germany", domain: "uni-heidelberg.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "Humboldt University Berlin", country: "Germany", domain: "hu-berlin.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "RWTH Aachen", country: "Germany", domain: "rwth-aachen.de", intake: "Winter 2026", deadline: "2026-03-01" },
  { name: "TU Berlin", country: "Germany", domain: "tu-berlin.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "University of Freiburg", country: "Germany", domain: "uni-freiburg.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "University of Bonn", country: "Germany", domain: "uni-bonn.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "University of Stuttgart", country: "Germany", domain: "uni-stuttgart.de", intake: "Winter 2026", deadline: "2026-07-15" },
  { name: "KIT Karlsruhe", country: "Germany", domain: "kit.edu", intake: "Winter 2026", deadline: "2026-07-15" },

  // 🇮🇪 Ireland
  { name: "Trinity College Dublin", country: "Ireland", domain: "tcd.ie", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "University College Dublin", country: "Ireland", domain: "ucd.ie", intake: "Sept 2026", deadline: "2026-07-31" },
  { name: "University of Galway", country: "Ireland", domain: "universityofgalway.ie", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "University College Cork", country: "Ireland", domain: "ucc.ie", intake: "Sept 2026", deadline: "2026-06-30" },
  { name: "Dublin City University", country: "Ireland", domain: "dcu.ie", intake: "Sept 2026", deadline: "2026-07-31" },

  // 🇫🇷 France
  { name: "Sorbonne University", country: "France", domain: "sorbonne-universite.fr", intake: "Sept 2026", deadline: "2026-04-30" },
  { name: "Sciences Po", country: "France", domain: "sciencespo.fr", intake: "Sept 2026", deadline: "2026-01-04" },
  { name: "HEC Paris", country: "France", domain: "hec.edu", intake: "Sept 2026", deadline: "2026-04-30" },
  { name: "ESSEC Business School", country: "France", domain: "essec.edu", intake: "Sept 2026", deadline: "2026-04-30" },

  // 🇳🇱 Netherlands
  { name: "University of Amsterdam", country: "Netherlands", domain: "uva.nl", intake: "Sept 2026", deadline: "2026-04-01" },
  { name: "TU Delft", country: "Netherlands", domain: "tudelft.nl", intake: "Sept 2026", deadline: "2026-04-01" },
  { name: "Erasmus University Rotterdam", country: "Netherlands", domain: "eur.nl", intake: "Sept 2026", deadline: "2026-05-01" },
  { name: "Leiden University", country: "Netherlands", domain: "universiteitleiden.nl", intake: "Sept 2026", deadline: "2026-04-01" },
  { name: "Utrecht University", country: "Netherlands", domain: "uu.nl", intake: "Sept 2026", deadline: "2026-04-01" },

  // 🇳🇿 New Zealand
  { name: "University of Auckland", country: "New Zealand", domain: "auckland.ac.nz", intake: "Feb 2026", deadline: "2025-12-08" },
  { name: "University of Otago", country: "New Zealand", domain: "otago.ac.nz", intake: "Feb 2026", deadline: "2025-12-10" },
  { name: "Victoria University Wellington", country: "New Zealand", domain: "wgtn.ac.nz", intake: "Feb 2026", deadline: "2025-12-01" },

  // 🇸🇬 Singapore
  { name: "NUS Singapore", country: "Singapore", domain: "nus.edu.sg", intake: "Aug 2026", deadline: "2026-03-15" },
  { name: "NTU Singapore", country: "Singapore", domain: "ntu.edu.sg", intake: "Aug 2026", deadline: "2026-03-19" },
  { name: "SMU Singapore", country: "Singapore", domain: "smu.edu.sg", intake: "Aug 2026", deadline: "2026-03-19" },

  // 🇭🇰 Hong Kong
  { name: "University of Hong Kong", country: "Hong Kong", domain: "hku.hk", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "HKUST", country: "Hong Kong", domain: "ust.hk", intake: "Sept 2026", deadline: "2026-01-15" },
  { name: "Chinese University Hong Kong", country: "Hong Kong", domain: "cuhk.edu.hk", intake: "Sept 2026", deadline: "2026-01-02" },

  // 🇨🇭 Switzerland
  { name: "ETH Zurich", country: "Switzerland", domain: "ethz.ch", intake: "Sept 2026", deadline: "2025-12-15" },
  { name: "EPFL", country: "Switzerland", domain: "epfl.ch", intake: "Sept 2026", deadline: "2025-12-15" },
  { name: "University of Zurich", country: "Switzerland", domain: "uzh.ch", intake: "Sept 2026", deadline: "2026-04-30" },

  // 🇯🇵 Japan
  { name: "University of Tokyo", country: "Japan", domain: "u-tokyo.ac.jp", intake: "Sept 2026", deadline: "2026-01-31" },
  { name: "Kyoto University", country: "Japan", domain: "kyoto-u.ac.jp", intake: "Sept 2026", deadline: "2026-02-15" },

  // 🇸🇪 Sweden
  { name: "KTH Royal Institute", country: "Sweden", domain: "kth.se", intake: "Aug 2026", deadline: "2026-01-15" },
  { name: "Lund University", country: "Sweden", domain: "lu.se", intake: "Aug 2026", deadline: "2026-01-15" },
];

const COUNTRIES = ["All", ...Array.from(new Set(UNIVERSITIES.map(u => u.country)))];

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now === null ? 0 : new Date(target).getTime() - now;
  const expired = now !== null && diff <= 0;
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return { d, h, m, s, expired, diff, ready: now !== null };
}

function CountdownCard({ uni }: { uni: Uni }) {
  const { d, h, m, s, expired, diff } = useCountdown(uni.deadline);
  const urgent = !expired && diff < 30 * 86400000; // < 30 days
  const [imgError, setImgError] = useState(false);
  const initials = uni.name
    .replace(/University|of|College|The/gi, "")
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="group relative rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 p-5 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {urgent && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/90 text-white text-[10px] font-bold animate-pulse">
          <Flame className="w-3 h-3" /> URGENT
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-border">
          {!imgError ? (
            <img
              src={`https://logo.clearbit.com/${uni.domain}`}
              alt={`${uni.name} logo`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight line-clamp-2">{uni.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{uni.country} · {uni.intake}</p>
        </div>
      </div>

      {expired ? (
        <div className="text-center py-3 text-sm font-semibold text-muted-foreground">
          Intake Closed
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { v: d, l: "Days" },
            { v: h, l: "Hrs" },
            { v: m, l: "Min" },
            { v: s, l: "Sec" },
          ].map((u) => (
            <div
              key={u.l}
              className={`rounded-lg py-2 text-center ${
                urgent
                  ? "bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30"
                  : "bg-gradient-to-br from-primary/15 to-primary-glow/10 border border-primary/20"
              }`}
            >
              <div className={`text-lg font-bold tabular-nums ${urgent ? "text-red-600 dark:text-red-400" : "text-primary"}`}>
                {String(u.v).padStart(2, "0")}
              </div>
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{u.l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Deadline:{" "}
          <span className="font-semibold text-foreground">
            {new Date(uni.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </span>
        <a
          href="#booking"
          className="font-semibold text-primary hover:text-primary-glow transition-colors"
        >
          Apply →
        </a>
      </div>
    </div>
  );
}

export function Deadlines() {
  const [country, setCountry] = useState("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const now = Date.now();
    return UNIVERSITIES.filter(u => {
      const matchesCountry = country === "All" || u.country === country;
      const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase());
      return matchesCountry && matchesQuery;
    }).sort((a, b) => {
      const da = new Date(a.deadline).getTime() - now;
      const db = new Date(b.deadline).getTime() - now;
      if (da < 0 && db >= 0) return 1;
      if (db < 0 && da >= 0) return -1;
      return da - db;
    });
  }, [country, query]);

  const visible = showAll ? filtered : filtered.slice(0, 12);

  return (
    <section id="deadlines" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <CalendarClock className="w-4 h-4" /> Live Countdown
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Admission Deadlines —{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Don't Miss Out
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time countdown for {UNIVERSITIES.length}+ top universities worldwide. Apply early, secure your seat.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search university..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {COUNTRIES.map(c => (
              <button
                key={c}
                onClick={() => { setCountry(c); setShowAll(false); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  country === c
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 hover:bg-primary/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((u) => (
            <CountdownCard key={u.name} uni={u} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No universities match your search.</p>
        )}

        {filtered.length > 12 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
            >
              {showAll ? "Show Less" : `View All ${filtered.length} Universities`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
