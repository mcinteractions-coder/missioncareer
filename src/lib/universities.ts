export type University = {
  id: string;
  name: string;
  country: string;
  city: string;
  courses: string[];
  levels: ("Bachelors" | "Masters" | "MBA" | "Diploma")[];
  intakes: ("Fall" | "Spring" | "Summer")[];
  ieltsMin: number; // 0 = not required
  greMin: number; // 0 = not required
  gmatMin: number; // 0 = not required
  tuitionUSD: number; // annual tuition (approx)
  ranking: number;
};

// Budget bands (USD/year approx)
export const BUDGET_BANDS: Record<string, [number, number]> = {
  Low: [0, 15000],
  Medium: [15000, 30000],
  High: [30000, 50000],
  "Very High": [50000, 200000],
};

const C = {
  CS: "Computer Science",
  BUS: "Business",
  ENG: "Engineering",
  DS: "Data Science",
  MBA: "MBA",
  MECH: "Mechanical",
  IT: "IT",
  AI: "AI",
  AIML: "AIML",
  CYB: "Cyber Security",
  FIN: "Finance",
  BIO: "Bio Technology",
};

export const UNIVERSITIES: University[] = [
  // USA
  { id: "mit", name: "Massachusetts Institute of Technology", country: "USA", city: "Cambridge", courses: [C.CS, C.ENG, C.DS, C.AI, C.AIML, C.MECH, C.BIO], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 7, greMin: 320, gmatMin: 0, tuitionUSD: 57000, ranking: 1 },
  { id: "stanford", name: "Stanford University", country: "USA", city: "Stanford", courses: [C.CS, C.AI, C.AIML, C.DS, C.MBA, C.BUS, C.FIN], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall"], ieltsMin: 7, greMin: 320, gmatMin: 700, tuitionUSD: 56000, ranking: 2 },
  { id: "cmu", name: "Carnegie Mellon University", country: "USA", city: "Pittsburgh", courses: [C.CS, C.AI, C.AIML, C.DS, C.CYB, C.IT], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 7, greMin: 315, gmatMin: 0, tuitionUSD: 50000, ranking: 5 },
  { id: "indiana", name: "Indiana University", country: "USA", city: "Bloomington", courses: [C.BUS, C.FIN, C.DS, C.MBA, C.IT], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 300, gmatMin: 600, tuitionUSD: 38000, ranking: 60 },
  { id: "asu", name: "Arizona State University", country: "USA", city: "Tempe", courses: [C.CS, C.ENG, C.DS, C.AI, C.IT, C.CYB, C.BUS], levels: ["Bachelors","Masters","Diploma"], intakes: ["Fall","Spring","Summer"], ieltsMin: 6.5, greMin: 300, gmatMin: 0, tuitionUSD: 32000, ranking: 80 },
  { id: "nyu", name: "New York University", country: "USA", city: "New York", courses: [C.FIN, C.BUS, C.MBA, C.CS, C.DS], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 7, greMin: 310, gmatMin: 650, tuitionUSD: 58000, ranking: 25 },

  // UK
  { id: "oxford", name: "University of Oxford", country: "UK", city: "Oxford", courses: [C.CS, C.ENG, C.BUS, C.MBA, C.FIN, C.DS, C.AI], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall"], ieltsMin: 7.5, greMin: 0, gmatMin: 700, tuitionUSD: 45000, ranking: 3 },
  { id: "cambridge", name: "University of Cambridge", country: "UK", city: "Cambridge", courses: [C.CS, C.ENG, C.AI, C.BIO, C.MECH], levels: ["Bachelors","Masters"], intakes: ["Fall"], ieltsMin: 7.5, greMin: 0, gmatMin: 0, tuitionUSD: 44000, ranking: 4 },
  { id: "imperial", name: "Imperial College London", country: "UK", city: "London", courses: [C.CS, C.ENG, C.AI, C.AIML, C.DS, C.MECH, C.BIO, C.FIN], levels: ["Bachelors","Masters"], intakes: ["Fall"], ieltsMin: 7, greMin: 0, gmatMin: 0, tuitionUSD: 40000, ranking: 6 },
  { id: "ucl", name: "University College London", country: "UK", city: "London", courses: [C.CS, C.DS, C.AI, C.BUS, C.FIN, C.ENG], levels: ["Bachelors","Masters"], intakes: ["Fall"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 35000, ranking: 9 },
  { id: "manchester", name: "University of Manchester", country: "UK", city: "Manchester", courses: [C.CS, C.ENG, C.BUS, C.MBA, C.MECH, C.DS], levels: ["Bachelors","Masters","MBA","Diploma"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 600, tuitionUSD: 28000, ranking: 35 },

  // Canada
  { id: "toronto", name: "University of Toronto", country: "Canada", city: "Toronto", courses: [C.CS, C.AI, C.DS, C.ENG, C.BIO, C.FIN, C.BUS], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 310, gmatMin: 600, tuitionUSD: 45000, ranking: 18 },
  { id: "ubc", name: "University of British Columbia", country: "Canada", city: "Vancouver", courses: [C.CS, C.ENG, C.DS, C.AI, C.BUS, C.MECH], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 300, gmatMin: 0, tuitionUSD: 40000, ranking: 34 },
  { id: "waterloo", name: "University of Waterloo", country: "Canada", city: "Waterloo", courses: [C.CS, C.AI, C.AIML, C.ENG, C.CYB, C.IT], levels: ["Bachelors","Masters","Diploma"], intakes: ["Fall","Spring","Summer"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 38000, ranking: 110 },
  { id: "mcgill", name: "McGill University", country: "Canada", city: "Montreal", courses: [C.BUS, C.MBA, C.FIN, C.BIO, C.CS, C.ENG], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall"], ieltsMin: 6.5, greMin: 310, gmatMin: 650, tuitionUSD: 36000, ranking: 30 },

  // Australia
  { id: "melbourne", name: "University of Melbourne", country: "Australia", city: "Melbourne", courses: [C.CS, C.DS, C.AI, C.BUS, C.MBA, C.BIO, C.ENG], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 600, tuitionUSD: 32000, ranking: 14 },
  { id: "sydney", name: "University of Sydney", country: "Australia", city: "Sydney", courses: [C.CS, C.IT, C.BUS, C.FIN, C.ENG, C.MECH], levels: ["Bachelors","Masters","Diploma"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 30000, ranking: 19 },
  { id: "unsw", name: "UNSW Sydney", country: "Australia", city: "Sydney", courses: [C.CS, C.AI, C.ENG, C.CYB, C.DS, C.FIN], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring","Summer"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 28000, ranking: 19 },

  // Germany
  { id: "tum", name: "Technical University of Munich", country: "Germany", city: "Munich", courses: [C.CS, C.ENG, C.MECH, C.AI, C.AIML, C.DS, C.BIO], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 3000, ranking: 28 },
  { id: "tuberlin", name: "TU Berlin", country: "Germany", city: "Berlin", courses: [C.CS, C.ENG, C.MECH, C.AI, C.IT, C.CYB], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6, greMin: 0, gmatMin: 0, tuitionUSD: 1500, ranking: 154 },
  { id: "tudresden", name: "TU Dresden", country: "Germany", city: "Dresden", courses: [C.CS, C.ENG, C.MECH, C.DS, C.BIO], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6, greMin: 0, gmatMin: 0, tuitionUSD: 1500, ranking: 250 },
  { id: "tubs", name: "TU Braunschweig", country: "Germany", city: "Braunschweig", courses: [C.ENG, C.MECH, C.CS, C.IT], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6, greMin: 0, gmatMin: 0, tuitionUSD: 1500, ranking: 400 },
  { id: "rwth", name: "RWTH Aachen", country: "Germany", city: "Aachen", courses: [C.ENG, C.MECH, C.CS, C.AI, C.DS], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 2000, ranking: 99 },

  // Ireland
  { id: "tcd", name: "Trinity College Dublin", country: "Ireland", city: "Dublin", courses: [C.CS, C.BUS, C.FIN, C.MBA, C.DS, C.AI], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 600, tuitionUSD: 25000, ranking: 87 },
  { id: "ucd", name: "University College Dublin", country: "Ireland", city: "Dublin", courses: [C.CS, C.BUS, C.ENG, C.FIN, C.DS, C.AI], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 600, tuitionUSD: 24000, ranking: 126 },

  // New Zealand
  { id: "auckland", name: "University of Auckland", country: "New Zealand", city: "Auckland", courses: [C.CS, C.BUS, C.ENG, C.BIO, C.DS], levels: ["Bachelors","Masters","Diploma"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 25000, ranking: 68 },

  // Italy
  { id: "polimi", name: "Politecnico di Milano", country: "Italy", city: "Milan", courses: [C.ENG, C.MECH, C.CS, C.AI, C.DS], levels: ["Bachelors","Masters"], intakes: ["Fall","Spring"], ieltsMin: 6, greMin: 0, gmatMin: 0, tuitionUSD: 4500, ranking: 123 },
  { id: "bocconi", name: "Bocconi University", country: "Italy", city: "Milan", courses: [C.BUS, C.MBA, C.FIN, C.DS], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall"], ieltsMin: 6.5, greMin: 0, gmatMin: 650, tuitionUSD: 18000, ranking: 134 },

  // France
  { id: "psl", name: "PSL University", country: "France", city: "Paris", courses: [C.CS, C.AI, C.DS, C.BIO, C.FIN], levels: ["Bachelors","Masters"], intakes: ["Fall"], ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 5000, ranking: 24 },
  { id: "hec", name: "HEC Paris", country: "France", city: "Paris", courses: [C.MBA, C.BUS, C.FIN], levels: ["Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 7, greMin: 0, gmatMin: 700, tuitionUSD: 28000, ranking: 59 },

  // Spain
  { id: "ie", name: "IE University", country: "Spain", city: "Madrid", courses: [C.BUS, C.MBA, C.FIN, C.CS, C.DS], levels: ["Bachelors","Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 6.5, greMin: 0, gmatMin: 650, tuitionUSD: 22000, ranking: 350 },
  { id: "iese", name: "IESE Business School", country: "Spain", city: "Barcelona", courses: [C.MBA, C.BUS, C.FIN], levels: ["Masters","MBA"], intakes: ["Fall","Spring"], ieltsMin: 7, greMin: 0, gmatMin: 680, tuitionUSD: 30000, ranking: 200 },
];

export type FinderFilters = {
  country?: string;
  course?: string;
  level?: string;
  intake?: string;
  ielts?: string; // "Not Required" or a number string
  gre?: string;
  gmat?: string;
  budget?: string;
};

export function searchUniversities(f: FinderFilters): University[] {
  const ielts = f.ielts && f.ielts !== "Not Required" ? parseFloat(f.ielts) : null;
  const gre = f.gre && f.gre !== "Not Required" ? parseInt(f.gre) : null;
  const gmat = f.gmat && f.gmat !== "Not Required" ? parseInt(f.gmat) : null;
  const budget = f.budget ? BUDGET_BANDS[f.budget] : null;

  return UNIVERSITIES.filter((u) => {
    if (f.country && u.country !== f.country) return false;
    if (f.course && !u.courses.includes(f.course)) return false;
    if (f.level && !u.levels.includes(f.level as University["levels"][number])) return false;
    if (f.intake && !u.intakes.includes(f.intake as University["intakes"][number])) return false;
    // Student's score must MEET OR EXCEED what the university requires.
    if (ielts !== null && u.ieltsMin > 0 && ielts < u.ieltsMin) return false;
    if (gre !== null && u.greMin > 0 && gre < u.greMin) return false;
    if (gmat !== null && u.gmatMin > 0 && gmat < u.gmatMin) return false;
    if (budget && (u.tuitionUSD < budget[0] || u.tuitionUSD > budget[1])) return false;
    return true;
  }).sort((a, b) => a.ranking - b.ranking);
}
