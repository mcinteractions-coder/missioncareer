import { COURSES, type CourseCode } from "@/data/universities/types";
import { UNIVERSITY_COUNTRIES } from "@/data/universities";

export type Level = "Bachelors" | "Masters" | "MBA" | "Diploma";
export type Intake = "Fall" | "Spring" | "Summer";

export type University = {
  id: string;
  name: string;
  country: string;
  city: string;
  type: "Public" | "Private";
  courses: string[];
  levels: Level[];
  intakes: Intake[];
  ieltsMin: number; // 0 = not required
  greMin: number; // 0 = not required
  gmatMin: number; // 0 = not required
  tuitionUSD: number; // typical yearly international tuition (approx)
  ranking: number | null; // QS World University Rankings 2026; null = not ranked
  website: string;
};

const LEVEL_CODES: Record<string, Level> = { B: "Bachelors", M: "Masters", A: "MBA", D: "Diploma" };
const INTAKE_CODES: Record<string, Intake> = { F: "Fall", S: "Spring", U: "Summer" };

const decode = <T,>(codes: string, map: Record<string, T>): T[] =>
  [...codes].map((c) => map[c]).filter((v): v is T => v !== undefined);

export const UNIVERSITIES: University[] = UNIVERSITY_COUNTRIES.flatMap(({ country, rows }) =>
  rows.map(([id, name, city, type, qsRank, tuitionUSD, ieltsMin, greMin, gmatMin, levels, intakes, courses, website]) => ({
    id,
    name,
    country,
    city,
    type,
    ranking: qsRank,
    tuitionUSD,
    ieltsMin,
    greMin,
    gmatMin,
    levels: decode(levels, LEVEL_CODES),
    intakes: decode(intakes, INTAKE_CODES),
    courses: courses.map((c: CourseCode) => COURSES[c]),
    website,
  })),
);

export const FINDER_COUNTRIES: string[] = [...new Set(UNIVERSITIES.map((u) => u.country))].sort();
export const FINDER_COURSES: string[] = Object.values(COURSES);

// Budget bands (USD/year tuition, approx)
export const BUDGET_BANDS: Record<string, [number, number]> = {
  "Very Low": [0, 5000],
  Low: [5000, 15000],
  Medium: [15000, 30000],
  High: [30000, 50000],
  "Very High": [50000, 200000],
};

export type FinderFilters = {
  query?: string;
  country?: string;
  course?: string;
  level?: string;
  intake?: string;
  type?: string;
  ielts?: string; // "Not Required" or a number string
  gre?: string;
  gmat?: string;
  budget?: string;
};

export function searchUniversities(f: FinderFilters, list: University[] = UNIVERSITIES): University[] {
  const ielts = f.ielts && f.ielts !== "Not Required" ? parseFloat(f.ielts) : null;
  const gre = f.gre && f.gre !== "Not Required" ? parseInt(f.gre) : null;
  const gmat = f.gmat && f.gmat !== "Not Required" ? parseInt(f.gmat) : null;
  const budget = f.budget ? BUDGET_BANDS[f.budget] : null;
  const q = f.query?.trim().toLowerCase() ?? "";

  return list
    .filter((u) => {
      if (q && !`${u.name} ${u.city} ${u.country}`.toLowerCase().includes(q)) return false;
      if (f.country && u.country !== f.country) return false;
      if (f.course && !u.courses.includes(f.course)) return false;
      if (f.level && !u.levels.includes(f.level as Level)) return false;
      if (f.intake && !u.intakes.includes(f.intake as Intake)) return false;
      if (f.type && u.type !== f.type) return false;
      // Student's score must MEET OR EXCEED what the university requires.
      if (ielts !== null && u.ieltsMin > 0 && ielts < u.ieltsMin) return false;
      if (gre !== null && u.greMin > 0 && gre < u.greMin) return false;
      if (gmat !== null && u.gmatMin > 0 && gmat < u.gmatMin) return false;
      if (budget && (u.tuitionUSD < budget[0] || u.tuitionUSD > budget[1])) return false;
      return true;
    })
    .sort((a, b) => (a.ranking ?? Infinity) - (b.ranking ?? Infinity) || a.name.localeCompare(b.name));
}
