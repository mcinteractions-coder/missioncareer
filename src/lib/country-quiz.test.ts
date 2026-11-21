import { describe, expect, it } from "vitest";
import { COUNTRY_COSTS } from "./study-budget";
import { PROFILES, QUESTIONS, rankCountries, type Answers } from "./country-quiz";

const base: Answers = { field: "tech", marks: "70", budget: "20", english: "6", language: "little", plan: "work", work: "nice", priority: "cost" };

describe("country quiz", () => {
  it("asks exactly 8 questions", () => {
    expect(QUESTIONS).toHaveLength(8);
  });

  it("scores every country that has cost data", () => {
    expect(Object.keys(PROFILES).sort()).toEqual(Object.keys(COUNTRY_COSTS).sort());
    expect(rankCountries(base)).toHaveLength(Object.keys(COUNTRY_COSTS).length);
  });

  it("returns match percentages between 0 and 100, best first", () => {
    const r = rankCountries(base);
    for (const m of r) expect(m.percent).toBeGreaterThanOrEqual(0), expect(m.percent).toBeLessThanOrEqual(100);
    for (let i = 1; i < r.length; i++) expect(r[i - 1].percent).toBeGreaterThanOrEqual(r[i].percent);
  });

  it("puts an MBBS country first for medicine on a small budget", () => {
    const r = rankCountries({ ...base, field: "medicine", budget: "10", marks: "60" });
    expect(["russia", "china", "hungary", "poland", "czech-republic", "italy"]).toContain(r[0].slug);
  });

  it("puts the UK or USA in the top 2 for business at a top-ranked university with a big budget and English only", () => {
    const r = rankCountries({ ...base, field: "business", budget: "max", marks: "85", english: "7", language: "no", plan: "return", priority: "ranking" });
    expect(["uk", "usa"]).toContain(r[0].slug);
    expect(["uk", "usa"]).toContain(r[1].slug);
  });

  it("never says a country over the budget fits it", () => {
    const r = rankCountries({ ...base, budget: "10" });
    for (const m of r) if (m.yearlyCost > 10e5) expect(m.reasons.join(" ")).not.toMatch(/fits your budget/);
  });

  it("does not claim English-taught courses for countries that mostly teach in the local language", () => {
    const r = rankCountries({ ...base, field: "medicine", budget: "10", language: "yes" });
    const russia = r.find((m) => m.slug === "russia")!;
    expect(russia.reasons).not.toContain("Many courses taught in English");
  });
});
