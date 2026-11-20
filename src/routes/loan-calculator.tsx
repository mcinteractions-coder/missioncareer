import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, Calculator, CalendarClock, ExternalLink, Info, Landmark, MessageCircle, PiggyBank, Receipt, TrendingDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToolHeader } from "@/components/tools/ToolHeader";
import {
  DEFAULT_GRACE_MONTHS,
  LOAN_RATES_CHECKED_ON,
  RATE_PRESETS,
  SBI_GLOBAL_EDVANTAGE,
  SBI_RATE_CARD,
  calculateLoan,
  processingFee,
} from "@/lib/education-loan";
import { formatInr } from "@/lib/study-budget";

const SITE = "https://www.missioncareer.net";
const TITLE = "Education Loan EMI Calculator for Study Abroad | Mission Career";
const DESC = "Work out your monthly EMI, interest during studies and total repayment for a study abroad education loan, using SBI's latest official interest rates.";

const MIN_AMOUNT = 100000;
const MAX_AMOUNT = 15000000;
const YEARS = [1, 1.5, 2, 3, 4];
const TENURES = [5, 7, 10, 12, 15];

export const Route = createFileRoute("/loan-calculator")({
  validateSearch: (s: Record<string, unknown>): { amount?: number; years?: number } => {
    const amount = Number(s.amount);
    const years = Number(s.years);
    return {
      amount: Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= 30000000 ? Math.round(amount) : undefined,
      years: YEARS.includes(years) ? years : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/loan-calculator` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE}/loan-calculator` }],
  }),
  component: LoanCalculatorPage,
});

const lakhLabel = (n: number) => formatInr(n).replace("₹", "₹ ");

function LoanCalculatorPage() {
  const search = Route.useSearch();
  const fromBudget = search.amount !== undefined;
  const [amount, setAmount] = useState(search.amount ?? 2000000);
  const [presetId, setPresetId] = useState<string>(RATE_PRESETS[0].id);
  const [rate, setRate] = useState(RATE_PRESETS[0].rate);
  const [rateText, setRateText] = useState(String(RATE_PRESETS[0].rate));
  const [years, setYears] = useState(search.years ?? 2);
  const [grace, setGrace] = useState(DEFAULT_GRACE_MONTHS);
  const [tenure, setTenure] = useState(10);
  const [payWhileStudying, setPayWhileStudying] = useState(false);

  const input = { amount, annualRatePct: rate, courseYears: years, graceMonths: grace, tenureYears: tenure };
  const result = useMemo(() => calculateLoan({ ...input, payInterestWhileStudying: payWhileStudying }), [amount, rate, years, grace, tenure, payWhileStudying]);
  const other = useMemo(() => calculateLoan({ ...input, payInterestWhileStudying: !payWhileStudying }), [amount, rate, years, grace, tenure, payWhileStudying]);
  const saving = Math.abs(other.totalInterest - result.totalInterest);
  const fee = processingFee(amount);
  const principalShare = result.totalPaid > 0 ? (amount / result.totalPaid) * 100 : 100;

  const pickPreset = (id: string) => {
    const p = RATE_PRESETS.find((x) => x.id === id)!;
    setPresetId(id);
    setRate(p.rate);
    setRateText(String(p.rate));
  };
  const typeRate = (v: string) => {
    const clean = v.replace(/[^\d.]/g, "").slice(0, 5);
    setRateText(clean);
    setPresetId("custom");
    const n = Number(clean);
    if (Number.isFinite(n) && n > 0 && n <= 25) setRate(n);
  };
  const typeAmount = (v: string) => {
    const n = Number(v.replace(/\D/g, "").slice(0, 9));
    setAmount(Math.min(MAX_AMOUNT * 2, Math.max(0, n)));
  };

  const yearsLabel = `${years} ${years === 1 ? "year" : "years"}`;
  const startLabel = result.monthsUntilEmi % 12 === 0 ? `${result.monthsUntilEmi / 12} years` : `${Math.floor(result.monthsUntilEmi / 12)} years ${result.monthsUntilEmi % 12} months`;
  const waText = `Hi Mission Career! I used your loan calculator: ${formatInr(amount)} education loan at ${rate}% for ${tenure} years comes to an EMI of about ₹${result.emi.toLocaleString("en-IN")} a month. Please help me with my education loan.`;

  return (
    <main className="min-h-screen bg-background">
      <ToolHeader
        kicker="Free planning tool"
        title={<>Education loan <span className="text-gradient">EMI calculator</span></>}
        intro="See your monthly EMI, the interest that builds up while you study and the total you will repay — using SBI's latest official education loan rates."
      />

      <div className="container mx-auto px-4 md:px-8 -mt-8 pb-16 grid lg:grid-cols-5 gap-6 lg:gap-8">
        <section aria-label="Your loan" className="lg:col-span-3 rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60 space-y-8">
          {fromBudget && (
            <p className="flex items-start gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-foreground">
              <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Loan amount filled in from your budget calculator total. Banks usually ask you to pay a part yourself (the margin), so you may borrow a little less.
            </p>
          )}

          <div>
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="loan-amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan amount</label>
              <p className="text-sm font-bold text-foreground">{lakhLabel(amount)}</p>
            </div>
            <input
              id="loan-amount"
              inputMode="numeric"
              value={amount ? amount.toLocaleString("en-IN") : ""}
              onChange={(e) => typeAmount(e.target.value)}
              placeholder="e.g. 20,00,000"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-lg font-bold text-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Slider
              className="mt-4"
              value={[Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, amount))]}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={50000}
              onValueChange={(v) => setAmount(v[0])}
              aria-label="Loan amount"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹1 lakh</span>
              <span>₹1.5 crore</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interest rate</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {RATE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickPreset(p.id)}
                  aria-pressed={presetId === p.id}
                  className={`rounded-2xl border p-3 text-left transition-all ${presetId === p.id ? "border-primary bg-primary/10 shadow-card" : "border-border bg-background hover:border-primary/50"}`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-bold ${presetId === p.id ? "text-primary" : "text-foreground"}`}>{p.label}</span>
                    <span className="shrink-0 text-sm font-extrabold text-foreground">{p.rate}%</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{p.note}</span>
                </button>
              ))}
            </div>
            <label htmlFor="loan-rate" className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5">
              <span className="flex-1 text-sm font-semibold text-foreground">Got a different rate from your bank?</span>
              <input
                id="loan-rate"
                inputMode="decimal"
                value={rateText}
                onChange={(e) => typeRate(e.target.value)}
                className="w-20 rounded-lg border border-input bg-card px-2 py-1.5 text-right text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm font-bold text-muted-foreground">%</span>
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              Rates float with the RBI repo rate. Girl students get 0.50% off SBI's regular Global Ed-Vantage and Student Loan rates.{" "}
              <a href={SBI_RATE_CARD.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">SBI rate card</a>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course length</p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  aria-pressed={years === y}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${years === y ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "border-border bg-background text-foreground hover:border-primary/50"}`}
                >
                  {y} {y === 1 ? "yr" : "yrs"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">EMIs start after the course</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[6, 12].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrace(g)}
                    aria-pressed={grace === g}
                    className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${grace === g ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary/50"}`}
                  >
                    {g} months
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pay back over</p>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {TENURES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    aria-pressed={tenure === t}
                    className={`rounded-xl border px-1 py-2.5 text-sm font-bold transition-all ${tenure === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary/50"}`}
                  >
                    {t}y
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interest while you study</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {[
                { v: false, title: "Add it to the loan", note: "Nothing to pay until EMIs start (SBI's default)" },
                { v: true, title: "Pay it every month", note: "Family pays the interest during the course" },
              ].map((o) => (
                <button
                  key={o.title}
                  type="button"
                  onClick={() => setPayWhileStudying(o.v)}
                  aria-pressed={payWhileStudying === o.v}
                  className={`rounded-2xl border p-3 text-left transition-all ${payWhileStudying === o.v ? "border-primary bg-primary/10 shadow-card" : "border-border bg-background hover:border-primary/50"}`}
                >
                  <span className={`block text-sm font-bold ${payWhileStudying === o.v ? "text-primary" : "text-foreground"}`}>{o.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside aria-live="polite" className="lg:col-span-2 lg:sticky lg:top-6 h-fit overflow-hidden rounded-3xl bg-card shadow-soft border border-border/60">
          <div className="relative overflow-hidden bg-gradient-primary p-6 text-primary-foreground">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
            <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-90"><Landmark className="h-4 w-4" /> Monthly EMI</p>
            <p className="relative mt-2 text-4xl md:text-5xl font-extrabold">₹{result.emi.toLocaleString("en-IN")}</p>
            <p className="relative mt-1 text-sm opacity-90">for {tenure} years at {rate}% · starts {startLabel} after the first payout</p>
          </div>
          <div className="p-6 space-y-4">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 font-medium text-foreground"><Landmark className="h-4 w-4 text-primary" /> Loan amount</dt>
                <dd className="font-bold text-foreground">{formatInr(amount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 font-medium text-foreground"><CalendarClock className="h-4 w-4 text-primary" /> Interest while studying</dt>
                <dd className="font-bold text-foreground">{formatInr(result.studyInterest)}</dd>
              </div>
              {payWhileStudying ? (
                <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">You pay about <strong className="text-foreground">₹{result.studyMonthly.toLocaleString("en-IN")} a month</strong> during the course and grace period.</p>
              ) : (
                <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">Added to your loan, so EMIs are worked out on <strong className="text-foreground">{formatInr(result.repayPrincipal)}</strong>.</p>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 font-medium text-foreground"><Receipt className="h-4 w-4 text-primary" /> Total interest</dt>
                <dd className="font-bold text-foreground">{formatInr(result.totalInterest)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <dt className="font-bold text-foreground">Total you repay</dt>
                <dd className="text-lg font-extrabold text-foreground">{formatInr(result.totalPaid)}</dd>
              </div>
            </dl>
            <div>
              <div className="flex h-3 overflow-hidden rounded-full bg-primary/15">
                <div className="h-full bg-gradient-primary transition-all duration-500" style={{ width: `${principalShare}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Loan {Math.round(principalShare)}%</span>
                <span>Interest {100 - Math.round(principalShare)}%</span>
              </div>
            </div>
            {saving > 0 && (
              <p className="flex items-start gap-2 rounded-xl bg-whatsapp/10 px-3 py-2 text-sm text-foreground">
                {payWhileStudying ? <PiggyBank className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp" /> : <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp" />}
                <span>
                  {payWhileStudying
                    ? <>Paying interest while studying saves you <strong>{formatInr(saving)}</strong> compared with adding it to the loan.</>
                    : <>Tip: paying the interest while studying would save <strong>{formatInr(saving)}</strong>.</>}
                </span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Processing fee at SBI: about <strong className="text-foreground">₹{fee.toLocaleString("en-IN")}</strong> (0.50% of the loan, ₹10,000–₹50,000, plus GST).
            </p>
            <a
              href={`https://wa.me/919870003748?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Get help with my education loan
            </a>
            <Link to="/budget-calculator" className="flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
              <Calculator className="h-4 w-4" /> Work out my study budget first
            </Link>
          </div>
        </aside>

        <section id="sources" aria-labelledby="loan-sources" className="lg:col-span-5 rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60">
          <h2 id="loan-sources" className="text-xl md:text-2xl font-extrabold text-foreground">How this is worked out</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>The loan is paid out in equal parts at the start of each year of the course ({yearsLabel} here). Each part gathers simple interest until EMIs start, as SBI charges simple interest during the course and grace period.</span></li>
            <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>EMIs use the standard reducing-balance formula and assume the rate stays the same. Education loan rates float, so your EMI can change when the RBI repo rate changes.</span></li>
            <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Interest paid on an education loan can be claimed as a tax deduction under Section 80E of the Income Tax Act.</span></li>
            <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Other banks and NBFCs charge different rates. Type the rate your bank offers you in the box above to see your own EMI.</span></li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {[SBI_RATE_CARD, SBI_GLOBAL_EDVANTAGE].map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                <BadgeCheck className="h-3.5 w-3.5" /> {s.name} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            <span className="text-muted-foreground">Checked on {LOAN_RATES_CHECKED_ON}.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
