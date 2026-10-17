import { describe, it, expect } from "vitest";
import { unlockedRewards, rewardMonths } from "./rewards";

describe("caller rewards", () => {
  it("4 meetings unlock nothing", () => expect(unlockedRewards(4)).toEqual([]));
  it("5 meetings unlock dark chocolate", () => expect(unlockedRewards(5)).toEqual(["Dark Chocolate"]));
  it("10 meetings add ramen set", () => expect(unlockedRewards(10)).toContain("Ramen Set"));
  it("15 meetings add earbuds", () => expect(unlockedRewards(15)).toContain("Earbuds"));
  it("20 meetings add smartwatch", () => expect(unlockedRewards(20)).toContain("Smartwatch"));
  it("months start from September 2026", () => {
    expect(rewardMonths(new Date(2026, 9, 17))).toEqual(["2026-09", "2026-10"]);
  });
});
