/**
 * "Which country suits you?" quiz: questions, country profiles and scoring.
 * Yearly costs come from study-budget (official figures); the 0–1 country ratings below are
 * Mission Career counselling judgements, not official data.
 */
import { COUNTRY_COSTS, formatInr, yearlyCostInr } from "./study-budget";

export type Field = "tech" | "business" | "medicine" | "arts" | "science";

type Profile = {
  /** How far you can get by with English only, in class and daily life. */
  english: number;
  /** How high an English test score universities usually ask for. */
  ieltsNeed: number;
  /** How high your marks need to be for good universities. */
  selectivity: number;
  /** Path to settle permanently after studies. */
  pr: number;
  /** Post-study work visa. */
  psw: number;
  /** Part-time work rights while studying. */
  work: number;
  /** Top-ranked universities. */
  prestige: number;
  /** Safety and visa smoothness. */
  safety: number;
  /** Closeness to India. */
  close: number;
  fields: Record<Field, number>;
};

const p = (english: number, ieltsNeed: number, selectivity: number, pr: number, psw: number, work: number, prestige: number, safety: number, close: number, tech: number, business: number, medicine: number, arts: number, science: number): Profile => ({
  english, ieltsNeed, selectivity, pr, psw, work, prestige, safety, close, fields: { tech, business, medicine, arts, science },
});

//                                 eng  ielts sel  pr   psw  work prest safe close  tech bus  med  arts sci
export const PROFILES: Record<string, Profile> = {
  germany:          p(0.7, 0.6, 0.75, 0.9, 0.9, 0.8, 0.8, 0.85, 0.5, 1, 0.7, 0.3, 0.6, 0.95),
  canada:           p(1, 0.75, 0.6, 0.9, 0.9, 0.8, 0.8, 0.75, 0.2, 0.85, 0.85, 0.3, 0.75, 0.85),
  uk:               p(1, 0.75, 0.65, 0.55, 0.75, 0.75, 1, 0.75, 0.5, 0.85, 1, 0.4, 0.95, 0.9),
  usa:              p(1, 0.75, 0.7, 0.4, 0.85, 0.35, 1, 0.5, 0.2, 1, 1, 0.3, 0.9, 1),
  australia:        p(1, 0.8, 0.6, 0.75, 0.85, 0.8, 0.85, 0.6, 0.4, 0.85, 0.85, 0.5, 0.75, 0.85),
  ireland:          p(1, 0.75, 0.6, 0.7, 0.8, 0.8, 0.7, 0.85, 0.5, 0.95, 0.85, 0.5, 0.65, 0.75),
  "new-zealand":    p(1, 0.75, 0.55, 0.8, 0.8, 0.8, 0.6, 0.9, 0.4, 0.7, 0.7, 0.4, 0.7, 0.7),
  italy:            p(0.55, 0.5, 0.5, 0.5, 0.6, 0.6, 0.65, 0.8, 0.5, 0.75, 0.75, 0.85, 1, 0.7),
  france:           p(0.55, 0.55, 0.6, 0.55, 0.75, 0.75, 0.75, 0.75, 0.5, 0.75, 0.95, 0.3, 0.9, 0.8),
  spain:            p(0.5, 0.5, 0.5, 0.55, 0.6, 0.6, 0.55, 0.8, 0.5, 0.6, 0.8, 0.4, 0.75, 0.6),
  netherlands:      p(0.9, 0.7, 0.7, 0.6, 0.75, 0.5, 0.8, 0.85, 0.5, 0.9, 0.85, 0.4, 0.75, 0.85),
  sweden:           p(0.85, 0.7, 0.7, 0.6, 0.7, 0.8, 0.75, 0.95, 0.45, 0.9, 0.7, 0.4, 0.7, 0.9),
  norway:           p(0.8, 0.7, 0.7, 0.55, 0.7, 0.6, 0.6, 0.95, 0.45, 0.75, 0.6, 0.3, 0.55, 0.8),
  denmark:          p(0.85, 0.7, 0.7, 0.5, 0.7, 0.7, 0.7, 0.95, 0.45, 0.8, 0.75, 0.3, 0.75, 0.8),
  finland:          p(0.85, 0.7, 0.6, 0.65, 0.75, 0.8, 0.65, 0.95, 0.45, 0.85, 0.65, 0.3, 0.7, 0.8),
  switzerland:      p(0.65, 0.7, 0.85, 0.3, 0.4, 0.45, 0.95, 0.95, 0.5, 1, 0.85, 0.3, 0.55, 0.95),
  austria:          p(0.55, 0.55, 0.55, 0.55, 0.6, 0.6, 0.6, 0.9, 0.5, 0.75, 0.6, 0.4, 0.8, 0.75),
  belgium:          p(0.6, 0.6, 0.6, 0.5, 0.6, 0.6, 0.65, 0.8, 0.5, 0.7, 0.75, 0.35, 0.65, 0.75),
  poland:           p(0.6, 0.45, 0.35, 0.55, 0.6, 0.8, 0.45, 0.85, 0.5, 0.7, 0.6, 0.85, 0.5, 0.6),
  "czech-republic": p(0.55, 0.45, 0.4, 0.5, 0.55, 0.55, 0.5, 0.9, 0.5, 0.7, 0.55, 0.85, 0.6, 0.65),
  hungary:          p(0.6, 0.45, 0.35, 0.45, 0.55, 0.6, 0.45, 0.85, 0.5, 0.6, 0.55, 0.9, 0.55, 0.6),
  portugal:         p(0.55, 0.5, 0.45, 0.7, 0.6, 0.7, 0.5, 0.9, 0.5, 0.6, 0.65, 0.35, 0.6, 0.55),
  singapore:        p(1, 0.7, 0.85, 0.35, 0.5, 0.45, 0.95, 1, 0.9, 0.95, 0.95, 0.4, 0.55, 0.9),
  malaysia:         p(0.9, 0.45, 0.35, 0.25, 0.35, 0.3, 0.5, 0.8, 0.9, 0.7, 0.7, 0.6, 0.55, 0.6),
  japan:            p(0.4, 0.5, 0.6, 0.55, 0.6, 0.7, 0.8, 1, 0.75, 0.9, 0.55, 0.2, 0.7, 0.85),
  "south-korea":    p(0.5, 0.5, 0.6, 0.45, 0.55, 0.6, 0.75, 0.95, 0.75, 0.85, 0.6, 0.2, 0.7, 0.8),
  china:            p(0.5, 0.4, 0.4, 0.15, 0.25, 0.2, 0.75, 0.8, 0.75, 0.75, 0.6, 0.85, 0.45, 0.75),
  uae:              p(0.95, 0.5, 0.4, 0.3, 0.5, 0.5, 0.5, 0.95, 1, 0.65, 0.8, 0.4, 0.5, 0.5),
  turkey:           p(0.55, 0.45, 0.35, 0.3, 0.35, 0.3, 0.45, 0.65, 0.7, 0.55, 0.55, 0.7, 0.55, 0.55),
  russia:           p(0.4, 0.3, 0.3, 0.2, 0.25, 0.2, 0.5, 0.55, 0.6, 0.5, 0.3, 0.95, 0.3, 0.55),
};

type Option = { id: string; label: string; hint?: string; emoji: string };
export type Question = { id: QuestionId; title: string; options: Option[] };
export type QuestionId = "field" | "marks" | "budget" | "english" | "language" | "plan" | "work" | "priority";
export type Answers = Record<QuestionId, string>;

export const QUESTIONS: Question[] = [
  { id: "field", title: "What do you want to study?", options: [
    { id: "tech", emoji: "💻", label: "Engineering / Computer Science / IT" },
    { id: "business", emoji: "📈", label: "Business / MBA / Management" },
    { id: "medicine", emoji: "🩺", label: "Medicine (MBBS) / Health" },
    { id: "arts", emoji: "🎨", label: "Design / Arts / Media / Humanities" },
    { id: "science", emoji: "🔬", label: "Science / Research" },
  ] },
  { id: "marks", title: "What were your marks in your last exam or degree?", options: [
    { id: "85", emoji: "🏆", label: "85% or more" },
    { id: "70", emoji: "⭐", label: "70% – 85%" },
    { id: "60", emoji: "👍", label: "60% – 70%" },
    { id: "below", emoji: "🙂", label: "Below 60%" },
  ] },
  { id: "budget", title: "How much can your family spend per year (fees + living)?", options: [
    { id: "10", emoji: "💰", label: "Under ₹10 lakh" },
    { id: "20", emoji: "💰", label: "₹10 – 20 lakh" },
    { id: "35", emoji: "💰", label: "₹20 – 35 lakh" },
    { id: "50", emoji: "💎", label: "₹35 – 50 lakh" },
    { id: "max", emoji: "💎", label: "More than ₹50 lakh" },
  ] },
  { id: "english", title: "What is your IELTS (or similar) score?", options: [
    { id: "7", emoji: "🗣️", label: "7 or more" },
    { id: "6", emoji: "🗣️", label: "6 – 6.5" },
    { id: "low", emoji: "🗣️", label: "Below 6" },
    { id: "none", emoji: "📝", label: "Not taken yet" },
  ] },
  { id: "language", title: "Would you learn a new language like German, French or Japanese?", options: [
    { id: "yes", emoji: "😃", label: "Yes, happily" },
    { id: "little", emoji: "🤔", label: "A little, if needed" },
    { id: "no", emoji: "🙅", label: "No, English only" },
  ] },
  { id: "plan", title: "What is your plan after studies?", options: [
    { id: "settle", emoji: "🏡", label: "Settle abroad (PR)" },
    { id: "work", emoji: "💼", label: "Work there a few years, then decide" },
    { id: "return", emoji: "🇮🇳", label: "Come back to India" },
  ] },
  { id: "work", title: "How important is part-time work while studying?", options: [
    { id: "must", emoji: "⏱️", label: "Very important, I need to earn" },
    { id: "nice", emoji: "👌", label: "Nice to have" },
    { id: "no", emoji: "📚", label: "Not needed" },
  ] },
  { id: "priority", title: "What matters most to you?", options: [
    { id: "cost", emoji: "🪙", label: "Low cost" },
    { id: "ranking", emoji: "🎓", label: "A top-ranked university" },
    { id: "safety", emoji: "🛡️", label: "Safety and an easy visa" },
    { id: "close", emoji: "✈️", label: "Being close to India" },
  ] },
];

const BUDGET_MAX: Record<string, number> = { "10": 10e5, "20": 20e5, "35": 35e5, "50": 50e5, max: Infinity };
const MARKS: Record<string, number> = { "85": 1, "70": 0.75, "60": 0.5, below: 0.25 };
const ENGLISH: Record<string, number> = { "7": 1, "6": 0.75, low: 0.45, none: 0.65 };
const LANGUAGE: Record<string, number> = { yes: 1, little: 0.5, no: 0 };

const WEIGHTS: Record<QuestionId, number> = { field: 1.5, marks: 1, budget: 2, english: 0.8, language: 1.2, plan: 1.5, work: 0.8, priority: 1.2 };

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const meets = (have: number, need: number) => (have >= need ? 1 : clamp(1 - (need - have) * 2));

export type CountryMatch = {
  slug: string;
  percent: number;
  yearlyCost: number;
  reasons: string[];
  caution: string | null;
  parts: Record<QuestionId, number>;
};

const FIELD_LABEL: Record<Field, string> = { tech: "engineering and IT", business: "business and MBA", medicine: "medicine", arts: "design and arts", science: "science and research" };

function scoreCountry(slug: string, a: Answers): CountryMatch {
  const pr = PROFILES[slug];
  const cost = yearlyCostInr(slug);
  const budget = BUDGET_MAX[a.budget] ?? Infinity;
  const parts: Record<QuestionId, number> = {
    field: pr.fields[a.field as Field] ?? 0.5,
    marks: meets(MARKS[a.marks] ?? 0.5, pr.selectivity),
    budget: cost <= budget ? 1 : clamp(1 - (cost - budget) / (budget * 0.6)),
    english: meets(ENGLISH[a.english] ?? 0.65, pr.ieltsNeed),
    language: pr.english + (1 - pr.english) * (LANGUAGE[a.language] ?? 0.5),
    plan: a.plan === "settle" ? pr.pr : a.plan === "work" ? pr.psw : 0.5 + 0.5 * pr.prestige,
    work: a.work === "must" ? pr.work : a.work === "nice" ? 0.6 + 0.4 * pr.work : 1,
    priority: a.priority === "cost" ? clamp(1 - cost / 60e5) : a.priority === "ranking" ? pr.prestige : a.priority === "safety" ? pr.safety : pr.close,
  };
  let sum = 0;
  let weight = 0;
  for (const q of QUESTIONS) {
    sum += parts[q.id] * WEIGHTS[q.id];
    weight += WEIGHTS[q.id];
  }
  const percent = Math.round((sum / weight) * 100);

  const reasonText: Record<QuestionId, string> = {
    field: `Strong for ${FIELD_LABEL[a.field as Field] ?? "your course"}`,
    marks: "Your marks fit typical entry requirements",
    budget: `About ${formatInr(cost)} a year — fits your budget`,
    english: "Your English score fits what universities ask",
    language: pr.english >= 0.9 ? "Fully English-speaking" : pr.english >= 0.6 ? "Many courses taught in English" : "A great fit since you are happy to learn the local language",
    plan: a.plan === "settle" ? "Good path to settle (PR) after studies" : a.plan === "work" ? "Good post-study work visa" : "Degree well valued by employers in India",
    work: "Part-time work allowed while studying",
    priority: a.priority === "cost" ? "One of the more affordable options" : a.priority === "ranking" ? "Home to top-ranked universities" : a.priority === "safety" ? "Very safe, with a smooth visa process" : "A short flight from India",
  };
  const cautionText: Record<QuestionId, string> = {
    field: "Fewer strong options for your course",
    marks: "Top universities may ask for higher marks",
    budget: `About ${formatInr(cost)} a year — above your budget`,
    english: "You may need a higher English test score",
    language: "You will need some local language for daily life and jobs",
    plan: a.plan === "settle" ? "Settling there long-term is harder" : "Fewer post-study work options",
    work: "Limited part-time work while studying",
    priority: a.priority === "cost" ? "Not one of the cheaper options" : a.priority === "ranking" ? "Fewer top-ranked universities" : a.priority === "safety" ? "Visa process can be strict" : "A long way from India",
  };
  const order = [...QUESTIONS].map((q) => q.id).sort((x, y) => parts[y] * WEIGHTS[y] - parts[x] * WEIGHTS[x]);
  const reasons = order.filter((id) => (id === "budget" ? parts.budget === 1 : parts[id] >= 0.8)).slice(0, 3).map((id) => reasonText[id]);
  const worst = parts.budget < 1 ? "budget" : [...order].reverse().find((id) => parts[id] < 0.55);
  return { slug, percent, yearlyCost: cost, reasons, caution: worst ? cautionText[worst] : null, parts };
}

/** All quiz countries ranked best match first. */
export function rankCountries(a: Answers): CountryMatch[] {
  return Object.keys(PROFILES)
    .filter((s) => COUNTRY_COSTS[s])
    .map((s) => scoreCountry(s, a))
    .sort((x, y) => y.percent - x.percent || x.yearlyCost - y.yearlyCost);
}

export function answerLabel(q: QuestionId, id: string) {
  return QUESTIONS.find((x) => x.id === q)?.options.find((o) => o.id === id)?.label ?? id;
}
