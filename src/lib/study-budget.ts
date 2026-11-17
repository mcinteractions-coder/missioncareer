import { COUNTRY_GUIDES, type CountryGuide } from "@/data/country-guides";

import { COST_DATA, INR_PER, type CostData, type Money } from "./study-cost-data";

export { COSTS_CHECKED_ON, COST_DATA, RATE_SOURCES, type CostSource } from "./study-cost-data";

/** Yearly study costs per country, converted to rupees. Figures and sources live in study-cost-data.ts. */
export type CountryCost = {
  currency: string;
  symbol: string;
  /** INR for 1 unit of the country's currency. */
  inrRate: number;
  tuitionMin: number;
  tuitionMax: number;
  /** Yearly living cost in INR. */
  livingInr: number;
  /** One-time visa and permit government fees in INR. */
  visaInr: number;
  /** Health insurance per year in INR. */
  insuranceInr: number;
  /** One-way flight from India in INR. */
  flightInr: number;
  defaultYears: number;
};

export const toInr = (m: Money) => m.amount * INR_PER[m.currency];

const derive = (d: CostData): CountryCost => ({
  currency: d.currency,
  symbol: d.symbol,
  inrRate: INR_PER[d.currency],
  tuitionMin: d.tuition.min,
  tuitionMax: d.tuition.max,
  livingInr: toInr(d.living),
  visaInr: Math.round(toInr(d.visa)),
  insuranceInr: toInr(d.insurance),
  flightInr: d.flight.inr,
  defaultYears: d.defaultYears,
});

export const COUNTRY_COSTS: Record<string, CountryCost> = Object.fromEntries(
  Object.entries(COST_DATA).map(([slug, d]) => [slug, derive(d)]),
);

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
  const livingYear = c.livingInr * LIFESTYLES[input.lifestyle].factor;
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

/** Cost of one year (mid tuition, standard living, insurance) in INR. */
export function yearlyCostInr(slug: string) {
  const r = estimateBudget({ slug, years: 1, tuitionLevel: 0.5, lifestyle: "standard", scholarshipInr: 0, includeFlights: false });
  return r ? r.tuition + r.living + r.insurance : 0;
}

export function formatInr(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} crore`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} lakh`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Format an amount in its own currency, e.g. "€75" or "₹21,120". */
export function formatMoney(slug: string, m: Money) {
  if (m.currency === "INR") return `₹${Math.round(m.amount).toLocaleString("en-IN")}`;
  const c = COST_DATA[slug];
  const symbol = c && c.currency === m.currency ? c.symbol : `${m.currency} `;
  return `${symbol}${Math.round(m.amount).toLocaleString("en-US")}`;
}

export function formatLocal(slug: string, n: number) {
  const c = COUNTRY_COSTS[slug];
  if (!c) return "";
  return `${c.symbol}${Math.round(n).toLocaleString("en-US")}`;
}

export const plainName = (g: CountryGuide) => g.name.replace(/^the /, "");

export const BUDGET_COUNTRIES = COUNTRY_GUIDES.filter((g) => COUNTRY_COSTS[g.slug]);
