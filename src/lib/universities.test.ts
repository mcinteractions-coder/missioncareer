import { describe, expect, it } from "vitest";
import { UNIVERSITIES, FINDER_COUNTRIES, searchUniversities, applyLinks, type University } from "./universities";

const uni = (over: Partial<University>): University => ({
  id: "x", name: "Test University", country: "Germany", city: "Berlin", type: "Public",
  courses: ["Computer Science"], levels: ["Masters"], intakes: ["Fall"],
  ieltsMin: 6.5, greMin: 0, gmatMin: 0, tuitionUSD: 10000, ranking: 100, website: "https://example.org",
  ...over,
});

describe("university catalogue", () => {
  it("covers all 30 study countries", () => {
    expect(FINDER_COUNTRIES).toHaveLength(30);
  });

  it("has at least 500 universities", () => {
    expect(UNIVERSITIES.length).toBeGreaterThanOrEqual(500);
  });

  it("has unique ids and https websites", () => {
    expect(new Set(UNIVERSITIES.map((u) => u.id)).size).toBe(UNIVERSITIES.length);
    for (const u of UNIVERSITIES) expect(u.website.startsWith("https://")).toBe(true);
  });

  it("has no duplicate university names within a country", () => {
    const keys = UNIVERSITIES.map((u) => `${u.country}|${u.name.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("searchUniversities", () => {
  it("hides universities whose IELTS minimum is above the student's score", () => {
    const list = [uni({ id: "a", ieltsMin: 7 }), uni({ id: "b", ieltsMin: 6 })];
    expect(searchUniversities({ ielts: "6.5" }, list).map((u) => u.id)).toEqual(["b"]);
  });

  it("puts QS-ranked universities before unranked ones", () => {
    const list = [uni({ id: "u", ranking: null }), uni({ id: "r2", ranking: 200 }), uni({ id: "r1", ranking: 5 })];
    expect(searchUniversities({}, list).map((u) => u.id)).toEqual(["r1", "r2", "u"]);
  });

  it("matches the text search against name or city", () => {
    const list = [uni({ id: "a", name: "Alpha Uni", city: "Munich" }), uni({ id: "b", name: "Beta Uni", city: "Berlin" })];
    expect(searchUniversities({ query: "munich" }, list).map((u) => u.id)).toEqual(["a"]);
  });

  it("keeps only universities inside the chosen tuition band", () => {
    const list = [uni({ id: "free", tuitionUSD: 700 }), uni({ id: "mid", tuitionUSD: 20000 })];
    expect(searchUniversities({ budget: "Very Low" }, list).map((u) => u.id)).toEqual(["free"]);
  });
});


describe("applyLinks", () => {
  it("always starts with the university's own https site", () => {
    for (const u of UNIVERSITIES) {
      const l = applyLinks(u);
      expect(l[0]?.url).toBe(u.website);
      expect(l.every((x) => x.url.startsWith("https://"))).toBe(true);
    }
  });
  it("adds UCAS for UK bachelor's universities", () => {
    const uk = UNIVERSITIES.find((u) => u.country === "UK" && u.levels.includes("Bachelors"));
    expect(uk && applyLinks(uk).some((l) => l.url.includes("ucas.com"))).toBe(true);
  });
});
