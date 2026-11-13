import { COUNTRY_GUIDES, type CountryGuide } from "@/data/country-guides";

/**
 * Approximate yearly study costs per country, in each country's own currency.
 * Rates and fees are rough planning figures — students should confirm exact costs with us.
 */
export type CountryCost = {
  currency: string;
  symbol: string;
  /** Approximate INR for 1 unit of the currency. */
  inrRate: number;
  tuitionMin: number;
  tuitionMax: number;
  livingYear: number;
  /** One-time visa application cost in INR. */
  visaInr: number;
  /** Health insurance per year in INR. */
  insuranceInr: number;
  /** One-way flight from India in INR. */
  flightInr: number;
  defaultYears: number;
};

const EUR = { currency: "EUR", symbol: "€", inrRate: 96 };
const USD = { currency: "USD", symbol: "$", inrRate: 85 };

export const COUNTRY_COSTS: Record<string, CountryCost> = {
  germany: { ...EUR, tuitionMin: 0, tuitionMax: 3000, livingYear: 11904, visaInr: 7500, insuranceInr: 150000, flightInr: 45000, defaultYears: 2 },
  canada: { currency: "CAD", symbol: "CA$", inrRate: 61, tuitionMin: 15000, tuitionMax: 40000, livingYear: 20635, visaInr: 14500, insuranceInr: 50000, flightInr: 75000, defaultYears: 2 },
  uk: { currency: "GBP", symbol: "£", inrRate: 112, tuitionMin: 12000, tuitionMax: 38000, livingYear: 13000, visaInr: 60000, insuranceInr: 87000, flightInr: 55000, defaultYears: 1 },
  usa: { ...USD, tuitionMin: 25000, tuitionMax: 70000, livingYear: 16000, visaInr: 45000, insuranceInr: 210000, flightInr: 85000, defaultYears: 2 },
  australia: { currency: "AUD", symbol: "AU$", inrRate: 56, tuitionMin: 20000, tuitionMax: 45000, livingYear: 29710, visaInr: 112000, insuranceInr: 40000, flightInr: 60000, defaultYears: 2 },
  ireland: { ...EUR, tuitionMin: 10000, tuitionMax: 25000, livingYear: 11000, visaInr: 35000, insuranceInr: 48000, flightInr: 45000, defaultYears: 1 },
  "new-zealand": { currency: "NZD", symbol: "NZ$", inrRate: 50, tuitionMin: 22000, tuitionMax: 35000, livingYear: 20000, visaInr: 37500, insuranceInr: 35000, flightInr: 80000, defaultYears: 2 },
  italy: { ...EUR, tuitionMin: 1000, tuitionMax: 4000, livingYear: 9500, visaInr: 11500, insuranceInr: 15000, flightInr: 40000, defaultYears: 2 },
  france: { ...EUR, tuitionMin: 3000, tuitionMax: 18000, livingYear: 10500, visaInr: 30000, insuranceInr: 15000, flightInr: 42000, defaultYears: 2 },
  spain: { ...EUR, tuitionMin: 1500, tuitionMax: 20000, livingYear: 10000, visaInr: 8000, insuranceInr: 50000, flightInr: 42000, defaultYears: 1 },
  netherlands: { ...EUR, tuitionMin: 8000, tuitionMax: 20000, livingYear: 12000, visaInr: 22000, insuranceInr: 60000, flightInr: 45000, defaultYears: 1 },
  sweden: { currency: "SEK", symbol: "SEK ", inrRate: 8.9, tuitionMin: 80000, tuitionMax: 200000, livingYear: 120000, visaInr: 13500, insuranceInr: 20000, flightInr: 50000, defaultYears: 2 },
  norway: { currency: "NOK", symbol: "NOK ", inrRate: 8.3, tuitionMin: 0, tuitionMax: 170000, livingYear: 160000, visaInr: 52000, insuranceInr: 30000, flightInr: 50000, defaultYears: 2 },
  denmark: { currency: "DKK", symbol: "DKK ", inrRate: 12.9, tuitionMin: 45000, tuitionMax: 120000, livingYear: 100000, visaInr: 32000, insuranceInr: 10000, flightInr: 50000, defaultYears: 2 },
  finland: { ...EUR, tuitionMin: 8000, tuitionMax: 18000, livingYear: 10000, visaInr: 34000, insuranceInr: 40000, flightInr: 50000, defaultYears: 2 },
  switzerland: { currency: "CHF", symbol: "CHF ", inrRate: 105, tuitionMin: 1500, tuitionMax: 8000, livingYear: 22500, visaInr: 9000, insuranceInr: 120000, flightInr: 50000, defaultYears: 2 },
  austria: { ...EUR, tuitionMin: 1500, tuitionMax: 15000, livingYear: 12000, visaInr: 15500, insuranceInr: 85000, flightInr: 45000, defaultYears: 2 },
  belgium: { ...EUR, tuitionMin: 4000, tuitionMax: 13000, livingYear: 11000, visaInr: 17500, insuranceInr: 40000, flightInr: 45000, defaultYears: 1 },
  poland: { ...EUR, tuitionMin: 2000, tuitionMax: 6000, livingYear: 7000, visaInr: 8000, insuranceInr: 25000, flightInr: 40000, defaultYears: 2 },
  "czech-republic": { ...EUR, tuitionMin: 0, tuitionMax: 10000, livingYear: 8000, visaInr: 9500, insuranceInr: 60000, flightInr: 42000, defaultYears: 2 },
  hungary: { ...EUR, tuitionMin: 3000, tuitionMax: 8000, livingYear: 7000, visaInr: 11000, insuranceInr: 25000, flightInr: 42000, defaultYears: 2 },
  portugal: { ...EUR, tuitionMin: 1000, tuitionMax: 7000, livingYear: 8000, visaInr: 9000, insuranceInr: 25000, flightInr: 45000, defaultYears: 2 },
  singapore: { currency: "SGD", symbol: "S$", inrRate: 65, tuitionMin: 17000, tuitionMax: 50000, livingYear: 17500, visaInr: 8000, insuranceInr: 15000, flightInr: 25000, defaultYears: 1 },
  malaysia: { currency: "MYR", symbol: "RM ", inrRate: 19.5, tuitionMin: 10000, tuitionMax: 40000, livingYear: 17500, visaInr: 49000, insuranceInr: 10000, flightInr: 20000, defaultYears: 2 },
  japan: { currency: "JPY", symbol: "¥", inrRate: 0.56, tuitionMin: 500000, tuitionMax: 1500000, livingYear: 1200000, visaInr: 3000, insuranceInr: 11000, flightInr: 45000, defaultYears: 2 },
  "south-korea": { currency: "KRW", symbol: "₩", inrRate: 0.061, tuitionMin: 4000000, tuitionMax: 12000000, livingYear: 10000000, visaInr: 6000, insuranceInr: 51000, flightInr: 40000, defaultYears: 2 },
  china: { currency: "CNY", symbol: "CN¥", inrRate: 11.8, tuitionMin: 20000, tuitionMax: 50000, livingYear: 40000, visaInr: 7000, insuranceInr: 10000, flightInr: 35000, defaultYears: 2 },
  uae: { currency: "AED", symbol: "AED ", inrRate: 23, tuitionMin: 40000, tuitionMax: 90000, livingYear: 42500, visaInr: 25000, insuranceInr: 50000, flightInr: 15000, defaultYears: 2 },
  turkey: { ...USD, tuitionMin: 2000, tuitionMax: 12000, livingYear: 6000, visaInr: 5000, insuranceInr: 10000, flightInr: 30000, defaultYears: 2 },
  russia: { ...USD, tuitionMin: 3000, tuitionMax: 8000, livingYear: 4000, visaInr: 5000, insuranceInr: 10000, flightInr: 35000, defaultYears: 2 },
};

export const LIFESTYLES = {
  budget: { label: "Budget", note: "Shared room, home cooking", factor: 0.85 },
  standard: { label: "Standard", note: "Typical student life", factor: 1 },
  comfortable: { label: "Comfortable", note: "Own room, eating out", factor: 1.25 },
} as const;
export type Lifestyle = keyof typeof LIFESTYLES;

export type BudgetInput = {
  slug: string;
  years: number;
  /** 0 = lowest tuition in the range, 1 = highest. */
  tuitionLevel: number;
  lifestyle: Lifestyle;
  scholarshipInr: number;
  includeFlights: boolean;
};

export type BudgetResult = {
  tuition: number;
  living: number;
  insurance: number;
  visa: number;
  flights: number;
  scholarship: number;
  total: number;
  perYear: number;
};

const round1000 = (n: number) => Math.round(n / 1000) * 1000;

export function estimateBudget(input: BudgetInput): BudgetResult | null {
  const c = COUNTRY_COSTS[input.slug];
  if (!c) return null;
  const years = Math.max(0.5, input.years);
  const level = Math.min(1, Math.max(0, input.tuitionLevel));
  const tuitionYear = (c.tuitionMin + (c.tuitionMax - c.tuitionMin) * level) * c.inrRate;
  const livingYear = c.livingYear * LIFESTYLES[input.lifestyle].factor * c.inrRate;
  const tuition = round1000(tuitionYear * years);
  const living = round1000(livingYear * years);
  const insurance = round1000(c.insuranceInr * years);
  const visa = c.visaInr;
  // Going there at the start and coming back at the end.
  const flights = input.includeFlights ? c.flightInr * 2 : 0;
  const gross = tuition + living + insurance + visa + flights;
  const scholarship = Math.min(Math.max(0, input.scholarshipInr), gross);
  const total = gross - scholarship;
  return { tuition, living, insurance, visa, flights, scholarship, total, perYear: round1000(total / years) };
}

/** Approximate cost of one year (mid tuition, standard living, insurance) in INR. */
export function yearlyCostInr(slug: string) {
  const r = estimateBudget({ slug, years: 1, tuitionLevel: 0.5, lifestyle: "standard", scholarshipInr: 0, includeFlights: false });
  return r ? r.tuition + r.living + r.insurance : 0;
}

export function formatInr(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} crore`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} lakh`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatLocal(slug: string, n: number) {
  const c = COUNTRY_COSTS[slug];
  if (!c) return "";
  return `${c.symbol}${Math.round(n).toLocaleString("en-US")}`;
}

export const plainName = (g: CountryGuide) => g.name.replace(/^the /, "");

export const BUDGET_COUNTRIES = COUNTRY_GUIDES.filter((g) => COUNTRY_COSTS[g.slug]);
