import { describe, expect, it } from "vitest";
import { COUNTRY_GUIDES } from "@/data/country-guides";
import { COST_DATA, COUNTRY_COSTS, estimateBudget } from "./study-budget";

describe("study budget calculator", () => {
  it("has cost data for every country guide", () => {
    for (const g of COUNTRY_GUIDES) expect(COUNTRY_COSTS[g.slug], g.slug).toBeDefined();
  });

  it("gives every figure either an official link or marks it as an estimate", () => {
    for (const [slug, d] of Object.entries(COST_DATA)) {
      for (const src of [d.tuition.source, d.living.source, d.visa.source, d.insurance.source, d.flight.source]) {
        expect(Boolean(src.name) === Boolean(src.url), slug).toBe(true);
        if (src.url) expect(src.url, slug).toMatch(/^https:\/\//);
      }
    }
  });

  it("adds tuition, living, insurance, visa and return flights for Germany using official figures", () => {
    // Mid tuition €1,500, blocked account €11,904, TK insurance €1,755, visa €75, flight ₹42,297; ECB €1 = ₹104.1575.
    const r = estimateBudget({ slug: "germany", years: 2, tuitionLevel: 0.5, lifestyle: "standard", scholarshipInr: 0, includeFlights: true })!;
    expect(r.tuition).toBe(312000);
    expect(r.living).toBe(2480000);
    expect(r.insurance).toBe(366000);
    expect(r.visa).toBe(7812);
    expect(r.flights).toBe(84594);
    expect(r.total).toBe(3250406);
  });

  it("subtracts the scholarship but never goes below zero", () => {
    const base = { slug: "uk", years: 1, tuitionLevel: 0, lifestyle: "budget" as const, includeFlights: false };
    const without = estimateBudget({ ...base, scholarshipInr: 0 })!;
    expect(estimateBudget({ ...base, scholarshipInr: 500000 })!.total).toBe(without.total - 500000);
    expect(estimateBudget({ ...base, scholarshipInr: 99_00_00_000 })!.total).toBe(0);
  });
});
