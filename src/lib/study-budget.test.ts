import { describe, expect, it } from "vitest";
import { COUNTRY_GUIDES } from "@/data/country-guides";
import { COUNTRY_COSTS, estimateBudget } from "./study-budget";

describe("study budget calculator", () => {
  it("has cost data for every country guide", () => {
    for (const g of COUNTRY_GUIDES) expect(COUNTRY_COSTS[g.slug], g.slug).toBeDefined();
  });

  it("adds tuition, living, insurance, visa and return flights for Germany", () => {
    const r = estimateBudget({ slug: "germany", years: 2, tuitionLevel: 0.5, lifestyle: "standard", scholarshipInr: 0, includeFlights: true })!;
    expect(r.tuition).toBe(288000);
    expect(r.living).toBe(2286000);
    expect(r.insurance).toBe(300000);
    expect(r.visa).toBe(7500);
    expect(r.flights).toBe(90000);
    expect(r.total).toBe(2971500);
  });

  it("subtracts the scholarship but never goes below zero", () => {
    const base = { slug: "uk", years: 1, tuitionLevel: 0, lifestyle: "budget" as const, includeFlights: false };
    const without = estimateBudget({ ...base, scholarshipInr: 0 })!;
    expect(estimateBudget({ ...base, scholarshipInr: 500000 })!.total).toBe(without.total - 500000);
    expect(estimateBudget({ ...base, scholarshipInr: 99_00_00_000 })!.total).toBe(0);
  });
});
