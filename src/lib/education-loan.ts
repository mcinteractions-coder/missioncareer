/**
 * Education loan EMI maths and lender rate presets for the Loan EMI Calculator.
 * Rates come from SBI's official education loan rate card; checked on LOAN_RATES_CHECKED_ON.
 */
export const LOAN_RATES_CHECKED_ON = "19 November 2026";

export const SBI_RATE_CARD = {
  name: "SBI education loan rate card (w.e.f. 15 Oct 2026)",
  url: "https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/education-loan-scheme",
};
export const SBI_GLOBAL_EDVANTAGE = {
  name: "SBI Global Ed-Vantage scheme",
  url: "https://sbi.bank.in/web/personal-banking/loans/education-loans/global-ed-vantage-scheme",
};

export type RatePreset = { id: string; label: string; note: string; rate: number };

export const RATE_PRESETS: RatePreset[] = [
  { id: "sbi-collateral", label: "SBI Global Ed-Vantage, with collateral", note: "Loans above ₹7.5 lakh, any eligible university", rate: 9.65 },
  { id: "sbi-select", label: "SBI Global Ed-Vantage, select universities", note: "With collateral, at SBI's list of select universities", rate: 9.15 },
  { id: "sbi-select-nocollateral", label: "SBI, select universities, no collateral", note: "Up to ₹50 lakh without collateral at select universities", rate: 9.65 },
  { id: "sbi-student", label: "SBI Student Loan, up to ₹7.5 lakh", note: "Without collateral", rate: 10.15 },
];

/** Grace period after the course before EMIs start (SBI Global Ed-Vantage: 6 months). */
export const DEFAULT_GRACE_MONTHS = 6;

/** SBI Global Ed-Vantage processing fee: 0.50% of the loan, min ₹10,000, max ₹50,000, plus 18% GST. */
export function processingFee(amount: number) {
  const fee = Math.min(50000, Math.max(10000, amount * 0.005));
  return Math.round(fee * 1.18);
}

/** Standard reducing-balance EMI. */
export function emi(principal: number, annualRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export type LoanInput = {
  amount: number;
  annualRatePct: number;
  /** Course length in years. The loan is paid out in equal parts at the start of each course year. */
  courseYears: number;
  graceMonths: number;
  tenureYears: number;
  /** true = pay the interest every month while studying; false = it is added to the loan (SBI's default). */
  payInterestWhileStudying: boolean;
};

export type LoanResult = {
  /** Simple interest that builds up from each payout until EMIs start. */
  studyInterest: number;
  /** Average monthly interest payment while studying (only when paying it). */
  studyMonthly: number;
  /** Amount the EMI is worked out on. */
  repayPrincipal: number;
  emi: number;
  emiInterest: number;
  /** All interest paid over the life of the loan, including while studying. */
  totalInterest: number;
  totalPaid: number;
  monthsUntilEmi: number;
};

export function calculateLoan(input: LoanInput): LoanResult {
  const amount = Math.max(0, input.amount);
  const rate = Math.max(0, input.annualRatePct) / 100;
  const course = Math.max(0.5, input.courseYears);
  const yearsUntilEmi = course + Math.max(0, input.graceMonths) / 12;
  const parts = Math.ceil(course);
  let studyInterest = 0;
  for (let i = 0; i < parts; i++) studyInterest += (amount / parts) * rate * (yearsUntilEmi - i);
  studyInterest = Math.round(studyInterest);
  const monthsUntilEmi = Math.round(yearsUntilEmi * 12);
  const repayPrincipal = input.payInterestWhileStudying ? amount : amount + studyInterest;
  const months = Math.round(input.tenureYears * 12);
  const monthly = Math.round(emi(repayPrincipal, input.annualRatePct, months));
  const emiTotal = monthly * months;
  const emiInterest = emiTotal - repayPrincipal;
  const totalInterest = studyInterest + emiInterest;
  return {
    studyInterest,
    studyMonthly: input.payInterestWhileStudying ? Math.round(studyInterest / monthsUntilEmi) : 0,
    repayPrincipal,
    emi: monthly,
    emiInterest,
    totalInterest,
    totalPaid: amount + totalInterest,
    monthsUntilEmi,
  };
}
