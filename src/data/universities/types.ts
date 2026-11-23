// Compact row format for the University Finder catalogue.
// Figures are approximate guidance for international students; students must confirm on the university website.

export const COURSES = {
  CS: "Computer Science",
  AI: "AI & Machine Learning",
  DS: "Data Science & Analytics",
  IT: "Information Technology",
  CYB: "Cyber Security",
  ENG: "Engineering",
  MECH: "Mechanical Engineering",
  CIV: "Civil Engineering",
  ELEC: "Electrical & Electronics",
  CHEM: "Chemical Engineering",
  AERO: "Aerospace Engineering",
  BUS: "Business & Management",
  MBA: "MBA",
  FIN: "Finance & Accounting",
  MKT: "Marketing",
  ECO: "Economics",
  SCM: "Supply Chain & Logistics",
  HOS: "Hospitality & Tourism",
  BIO: "Biotechnology & Life Sciences",
  MED: "Medicine (MBBS / MD)",
  PHA: "Pharmacy",
  NUR: "Nursing",
  PH: "Public Health",
  PSY: "Psychology",
  LAW: "Law",
  ARCH: "Architecture",
  DES: "Design & Arts",
  MEDIA: "Media & Communication",
  EDU: "Education",
  ENV: "Environmental Science",
  AGRI: "Agriculture & Food Science",
} as const;

export type CourseCode = keyof typeof COURSES;

/**
 * [id, name, city, type, qsRank, tuitionUSD, ieltsMin, greMin, gmatMin, levels, intakes, courses, website]
 * - qsRank: QS World University Rankings 2026 position (lower end of a band, e.g. 601-650 -> 601); null when unranked or unsure.
 * - tuitionUSD: typical yearly international tuition in US dollars (0 for tuition-free public universities).
 * - ieltsMin / greMin / gmatMin: typical minimums; 0 means not normally required.
 * - levels: letters from "BMAD" (B Bachelors, M Masters, A MBA, D Diploma / Certificate).
 * - intakes: letters from "FSU" (F Fall/Sept, S Spring/Jan-Feb, U Summer/May).
 * - website: official homepage (https).
 */
export type UniRow = [
  id: string,
  name: string,
  city: string,
  type: "Public" | "Private",
  qsRank: number | null,
  tuitionUSD: number,
  ieltsMin: number,
  greMin: number,
  gmatMin: number,
  levels: string,
  intakes: string,
  courses: CourseCode[],
  website: string,
];

export type CountryUnis = { country: string; rows: UniRow[] };
