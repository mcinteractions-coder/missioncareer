import { describe, expect, it } from "vitest";
import { calculateLoan, emi, processingFee } from "./education-loan";

describe("education loan EMI calculator", () => {
  it("uses the standard EMI formula", () => {
    // ₹10 lakh at 9.65% for 10 years.
    expect(Math.round(emi(1_000_000, 9.65, 120))).toBe(13022);
  });

  it("adds simple interest from each yearly payout to the loan until EMIs start (SBI default)", () => {
    // ₹30 lakh, 2-year course, 6 months grace: ₹15 lakh × 9.65% × 2.5 yrs + ₹15 lakh × 9.65% × 1.5 yrs = ₹5,79,000.
    const r = calculateLoan({ amount: 3_000_000, annualRatePct: 9.65, courseYears: 2, graceMonths: 6, tenureYears: 10, payInterestWhileStudying: false });
    expect(r.studyInterest).toBe(579000);
    expect(r.repayPrincipal).toBe(3_579_000);
    expect(r.monthsUntilEmi).toBe(30);
    expect(r.emi).toBe(Math.round(emi(3_579_000, 9.65, 120)));
  });

  it("costs less overall when interest is paid while studying", () => {
    const base = { amount: 3_000_000, annualRatePct: 9.65, courseYears: 2, graceMonths: 6, tenureYears: 10 };
    const added = calculateLoan({ ...base, payInterestWhileStudying: false });
    const paid = calculateLoan({ ...base, payInterestWhileStudying: true });
    expect(paid.repayPrincipal).toBe(3_000_000);
    expect(paid.studyMonthly).toBe(Math.round(579000 / 30));
    expect(paid.totalInterest).toBeLessThan(added.totalInterest);
  });

  it("charges SBI's processing fee of 0.5% between ₹10,000 and ₹50,000 plus GST", () => {
    expect(processingFee(1_000_000)).toBe(11800);
    expect(processingFee(3_000_000)).toBe(17700);
    expect(processingFee(20_000_000)).toBe(59000);
  });
});
