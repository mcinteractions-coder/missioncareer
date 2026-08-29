import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Wallet, Languages, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const LEVELS = ["Bachelors", "Masters", "PhD"] as const;
const BUDGETS = [
  { label: "Under ₹10L", value: 1 },
  { label: "₹10–20L", value: 2 },
  { label: "₹20–35L", value: 3 },
  { label: "₹35L+", value: 4 },
] as const;
const TESTS = [
  { label: "IELTS / TOEFL done", value: 3 },
  { label: "Preparing", value: 2 },
  { label: "Not started", value: 1 },
] as const;

const COUNTRY_FIT: { name: string; needBudget: number; note: string }[] = [
  { name: "Germany", needBudget: 1, note: "Low tuition public universities" },
  { name: "Ireland", needBudget: 2, note: "2-year stay-back for Masters" },
  { name: "UK", needBudget: 3, note: "1-year Masters, fast ROI" },
  { name: "Canada", needBudget: 3, note: "PG work permit + PR pathway" },
  { name: "Australia", needBudget: 3, note: "Strong post-study work rights" },
  { name: "USA", needBudget: 4, note: "Best research + OPT/STEM options" },
];

export function ProfileEvaluation() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Masters");
  const [percent, setPercent] = useState("");
  const [budget, setBudget] = useState(2);
  const [test, setTest] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const p = Math.max(0, Math.min(100, Number(percent) || 0));
    const academic = Math.round((p / 100) * 45);
    const budgetScore = budget * 8;
    const testScore = test * 9;
    const base = level === "PhD" ? 8 : level === "Masters" ? 6 : 4;
    const score = Math.max(18, Math.min(97, academic + budgetScore + testScore + base));
    const matches = COUNTRY_FIT.filter((c) => c.needBudget <= budget).slice(-3).reverse();
    return { score, matches: matches.length ? matches : [COUNTRY_FIT[0]!] };
  }, [percent, budget, test, level]);

  const tier =
    result.score >= 80 ? "Strong profile" : result.score >= 60 ? "Competitive profile" : "Needs strengthening";

  return (
    <section id="evaluation" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Free Profile Evaluation</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Check where your profile stands — in 30 seconds
          </h2>
          <p className="mt-4 text-muted-foreground">
            An honest, advisor-grade read on your academics, budget and test readiness, with the destinations that
            actually fit you.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Card className="p-6 shadow-card">
            <div className="space-y-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" /> Study level
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <Button
                      key={l}
                      type="button"
                      size="sm"
                      variant={level === l ? "default" : "outline"}
                      onClick={() => setLevel(l)}
                    >
                      {l}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Last qualification percentage</label>
                <Input
                  inputMode="numeric"
                  placeholder="e.g. 72"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value.replace(/[^0-9.]/g, ""))}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Wallet className="h-4 w-4 text-primary" /> Yearly budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <Button
                      key={b.label}
                      type="button"
                      size="sm"
                      variant={budget === b.value ? "default" : "outline"}
                      onClick={() => setBudget(b.value)}
                    >
                      {b.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Languages className="h-4 w-4 text-primary" /> English test status
                </label>
                <div className="flex flex-wrap gap-2">
                  {TESTS.map((t) => (
                    <Button
                      key={t.label}
                      type="button"
                      size="sm"
                      variant={test === t.value ? "default" : "outline"}
                      onClick={() => setTest(t.value)}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => setSubmitted(true)}>
                Evaluate my profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col justify-center p-6 shadow-card">
            {!submitted ? (
              <div className="text-center text-muted-foreground">
                <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="text-sm">
                  Fill the form and your evaluation appears here — no signup, no spam. Counsellor review stays free.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Profile readiness</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-extrabold tracking-tight">{result.score}</span>
                    <span className="pb-2 text-sm font-semibold text-primary">/ 100</span>
                  </div>
                  <Progress value={result.score} className="mt-3" />
                  <p className="mt-2 text-sm font-semibold">{tier}</p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold">Best-fit destinations for you</p>
                  <ul className="space-y-2">
                    {result.matches.map((c) => (
                      <li key={c.name} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <span className="font-semibold">{c.name}</span>
                          <span className="text-muted-foreground"> — {c.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild variant="secondary" className="w-full">
                  <a href="#contact">Get a free counsellor review</a>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
