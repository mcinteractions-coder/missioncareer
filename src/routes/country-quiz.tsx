import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, Download, Lock, MessageCircle, RotateCcw, Scale, Share2, Sparkles, TriangleAlert, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { supabase } from "@/integrations/supabase/client";
import { getCountryGuide } from "@/data/country-guides";
import { QUESTIONS, answerLabel, rankCountries, type Answers, type CountryMatch, type QuestionId } from "@/lib/country-quiz";
import { formatInr, plainName } from "@/lib/study-budget";
import { logGameEvent } from "@/lib/game-track";

const SITE = "https://www.missioncareer.net";
const TITLE = "Which Country Suits You? Free Study Abroad Quiz | Mission Career";
const DESC = "Answer 8 quick questions on your course, marks, budget and plans and find your best study abroad country out of 30 — with your match score and real yearly costs.";
const QUIZ_URL = `${SITE}/country-quiz`;
const UNLOCK_KEY = "mc_quiz_unlocked";

export const Route = createFileRoute("/country-quiz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: QUIZ_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: QUIZ_URL }],
  }),
  component: CountryQuizPage,
});

const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name.").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Please enter a valid phone number."),
});

type Step = "intro" | number | "gate" | "result";

const flagEmoji = (code: string) => String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
const nameOf = (slug: string) => plainName(getCountryGuide(slug)!);
const codeOf = (slug: string) => getCountryGuide(slug)!.code;

function CountryQuizPage() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1"); } catch { /* ignore */ }
  }, []);

  const complete = QUESTIONS.every((q) => answers[q.id]);
  const ranked = useMemo(() => (complete ? rankCountries(answers as Answers) : []), [answers, complete]);

  const start = () => { setAnswers({}); setStep(0); logGameEvent("quiz_start"); };
  const choose = (id: QuestionId, value: string, index: number) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    if (index < QUESTIONS.length - 1) { setStep(index + 1); return; }
    const top = rankCountries(next as Answers)[0];
    logGameEvent("quiz_complete", { top: top.slug, percent: top.percent });
    setStep(unlocked ? "result" : "gate");
  };

  return (
    <main className="min-h-screen bg-background">
      <ToolHeader
        kicker="1-minute quiz"
        title={<>Which country <span className="text-gradient">suits you?</span></>}
        intro="Answer 8 quick questions about your course, marks, budget and plans. We match you with the best of 30 study abroad countries."
      />
      <div className="container mx-auto px-4 md:px-8 -mt-8 pb-16">
        <div className="mx-auto max-w-3xl">
          {step === "intro" && <Intro onStart={start} />}
          {typeof step === "number" && (
            <QuestionCard
              index={step}
              selected={answers[QUESTIONS[step].id]}
              onChoose={(v) => choose(QUESTIONS[step].id, v, step)}
              onBack={() => setStep(step === 0 ? "intro" : step - 1)}
            />
          )}
          {step === "gate" && ranked.length > 0 && (
            <Gate
              top={ranked[0]}
              answers={answers as Answers}
              ranked={ranked}
              onUnlocked={() => {
                setUnlocked(true);
                try { localStorage.setItem(UNLOCK_KEY, "1"); } catch { /* ignore */ }
                setStep("result");
              }}
            />
          )}
          {step === "result" && ranked.length > 0 && <Result ranked={ranked} onRetake={start} />}
        </div>
      </div>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="rounded-3xl bg-card p-6 md:p-10 shadow-soft border border-border/60 text-center">
      <div className="flex justify-center -space-x-3">
        {["de", "ca", "gb", "au", "ie"].map((c) => (
          <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt="" className="h-12 w-12 rounded-full border-4 border-card object-cover shadow-card" />
        ))}
      </div>
      <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-foreground">Find your perfect study abroad country</h2>
      <p className="mx-auto mt-2 max-w-lg text-muted-foreground">8 questions · about 1 minute · free. You get your top 3 countries with a match score, yearly cost in rupees and why each one suits you.</p>
      <button type="button" onClick={onStart} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 text-lg font-bold text-primary-foreground shadow-glow hover:opacity-90">
        Start the quiz <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}

function QuestionCard({ index, selected, onChoose, onBack }: { index: number; selected?: string; onChoose: (v: string) => void; onBack: () => void }) {
  const q = QUESTIONS[index];
  return (
    <section aria-labelledby="quiz-question" className="rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-muted-foreground">Question {index + 1} of {QUESTIONS.length}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      <h2 id="quiz-question" className="mt-6 text-2xl md:text-3xl font-extrabold text-foreground">{q.title}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChoose(o.id)}
            aria-pressed={selected === o.id}
            className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${selected === o.id ? "border-primary bg-primary/10 shadow-card" : "border-border bg-background hover:border-primary/50 hover:shadow-card"}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl" aria-hidden>{o.emoji}</span>
            <span className="font-bold text-foreground">{o.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Gate({ top, ranked, answers, onUnlocked }: { top: CountryMatch; ranked: CountryMatch[]; answers: Answers; onUnlocked: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const parsed = leadSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    let sid: string | null = null;
    try { sid = sessionStorage.getItem("mc_visitor_sid"); } catch { /* ignore */ }
    const top3 = ranked.slice(0, 3).map((m) => `${nameOf(m.slug)} ${m.percent}%`).join(", ");
    const answerText = QUESTIONS.map((q) => `${q.title} ${answerLabel(q.id, answers[q.id])}`).join("\n");
    setBusy(true);
    const { error: err } = await supabase.from("leads").insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      country: nameOf(top.slug),
      study_level: answerLabel("field", answers.field).slice(0, 80),
      message: `Country quiz result: ${top3}\n\n${answerText}`,
      session_id: sid,
    });
    setBusy(false);
    if (err) { setError("Something went wrong. Please try again or WhatsApp us."); return; }
    logGameEvent("quiz_lead", { top: top.slug });
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof w.fbq === "function") w.fbq("track", "Lead");
    onUnlocked();
  };

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <section aria-labelledby="gate-title" className="overflow-hidden rounded-3xl bg-card shadow-soft border border-border/60">
      <div className="relative overflow-hidden bg-gradient-primary p-6 md:p-8 text-center text-primary-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] opacity-90">Your top match</p>
        <img src={`https://flagcdn.com/w160/${codeOf(top.slug)}.png`} alt={`${nameOf(top.slug)} flag`} className="relative mx-auto mt-4 h-14 w-20 rounded-lg object-cover shadow-card" />
        <p className="relative mt-3 text-3xl md:text-4xl font-extrabold">{nameOf(top.slug)}</p>
        <p className="relative mt-1 text-5xl md:text-6xl font-extrabold">{top.percent}%<span className="text-xl font-bold"> match</span></p>
      </div>
      <div className="p-6 md:p-8">
        <div className="space-y-2" aria-hidden>
          {[2, 3].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
              <span className="flex items-center gap-3 font-bold text-foreground"><span className="text-muted-foreground">#{n}</span><span className="select-none blur-sm">Hidden country</span></span>
              <span className="select-none font-extrabold text-foreground blur-sm">88%</span>
            </div>
          ))}
        </div>
        <h2 id="gate-title" className="mt-6 flex items-center gap-2 text-xl font-extrabold text-foreground"><Lock className="h-5 w-5 text-primary" /> See your full result</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your top 3 countries, why each suits you, yearly cost in rupees and a card to share with friends.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input name="full_name" placeholder="Your name *" className={input} maxLength={100} aria-label="Your name" autoComplete="name" />
          <input name="phone" type="tel" placeholder="Phone / WhatsApp number *" className={input} maxLength={20} aria-label="Phone number" autoComplete="tel" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 font-bold text-primary-foreground shadow-glow disabled:opacity-60">
            {busy ? "Unlocking..." : <>Show my full result <Sparkles className="h-4 w-4" /></>}
          </button>
          <p className="text-center text-xs text-muted-foreground">By continuing, you agree that a Mission Career counsellor may call or WhatsApp you about your result.</p>
        </form>
      </div>
    </section>
  );
}

function Result({ ranked, onRetake }: { ranked: CountryMatch[]; onRetake: () => void }) {
  const top3 = ranked.slice(0, 3);
  const top = top3[0];
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const shareText = `🌍 I'm a ${top.percent}% match for studying in ${nameOf(top.slug)} ${flagEmoji(codeOf(top.slug))}!\nMy top 3: ${top3.map((m) => `${nameOf(m.slug)} ${m.percent}%`).join(", ")}\n\nFind your country in 1 minute: ${QUIZ_URL}`;
  const waCounsellor = `Hi Mission Career! I took your country quiz. My top matches are ${top3.map((m) => `${nameOf(m.slug)} (${m.percent}%)`).join(", ")}. Please help me plan.`;

  const makeImage = async () => {
    const { toPng } = await import("html-to-image");
    return toPng(cardRef.current!, { cacheBust: true, pixelRatio: 3 });
  };
  const download = (dataUrl: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "my-study-abroad-match.png";
    a.click();
  };
  const shareImage = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await makeImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "my-study-abroad-match.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        logGameEvent("quiz_share", { method: "image" });
      } else {
        download(dataUrl);
        logGameEvent("quiz_share", { method: "download" });
      }
    } catch { /* share cancelled */ }
    setSharing(false);
  };

  return (
    <div className="space-y-6">
      <section aria-label="Your top 3 countries" className="space-y-4">
        {top3.map((m, i) => {
          const name = nameOf(m.slug);
          return (
            <article key={m.slug} className={`relative overflow-hidden rounded-3xl border bg-card p-5 md:p-6 shadow-soft ${i === 0 ? "border-primary/60" : "border-border/60"}`}>
              {i === 0 && <span className="absolute right-4 top-4 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-card">Best match</span>}
              <div className="flex items-center gap-4">
                <img src={`https://flagcdn.com/w160/${codeOf(m.slug)}.png`} alt={`${name} flag`} className="h-12 w-[4.5rem] rounded-lg object-cover shadow-card" />
                <div className="min-w-0 flex-1 pr-20">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">#{i + 1}</p>
                  <h3 className="text-2xl font-extrabold text-foreground">{name}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-gradient-primary transition-all duration-700" style={{ width: `${m.percent}%` }} />
                </div>
                <span className="text-2xl font-extrabold text-foreground">{m.percent}%</span>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-foreground">
                {m.reasons.map((r) => <li key={r} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp" /> {r}</li>)}
                {m.caution && <li className="flex gap-2 text-muted-foreground"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {m.caution}</li>}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Typical cost: about <strong className="text-foreground">{formatInr(m.yearlyCost)}</strong> a year (fees, living and insurance)</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/study-abroad/$country" params={{ country: m.slug }} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                  {name} guide <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/budget-calculator" search={{ country: m.slug }} className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-gradient-primary hover:text-primary-foreground">
                  <Calculator className="h-4 w-4" /> Full budget
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="share-title" className="rounded-3xl bg-card p-5 md:p-8 shadow-soft border border-border/60">
        <h2 id="share-title" className="text-xl md:text-2xl font-extrabold text-foreground">Share your result</h2>
        <p className="mt-1 text-sm text-muted-foreground">Post it on your Instagram story or send it to friends — see which country they get!</p>
        <div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="mx-auto w-[300px] overflow-hidden rounded-3xl shadow-soft">
            <div ref={cardRef} className="relative flex aspect-[4/5] w-[300px] flex-col bg-gradient-primary p-6 text-primary-foreground">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-foreground/10" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-primary-foreground/10" />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">My study abroad match</p>
              <img src={`https://flagcdn.com/w160/${codeOf(top.slug)}.png`} crossOrigin="anonymous" alt="" className="relative mt-4 h-12 w-[4.5rem] rounded-lg object-cover shadow-card" />
              <p className="relative mt-3 text-3xl font-extrabold leading-tight">{nameOf(top.slug)}</p>
              <p className="relative text-5xl font-extrabold leading-none">{top.percent}%<span className="text-base font-bold"> match</span></p>
              <div className="relative mt-auto space-y-1.5">
                {top3.slice(1).map((m, i) => (
                  <div key={m.slug} className="flex items-center justify-between rounded-xl bg-primary-foreground/15 px-3 py-1.5 text-sm font-bold">
                    <span className="flex items-center gap-2">
                      <span className="opacity-80">#{i + 2}</span>
                      <img src={`https://flagcdn.com/w40/${codeOf(m.slug)}.png`} crossOrigin="anonymous" alt="" className="h-3.5 w-5 rounded-sm object-cover" />
                      {nameOf(m.slug)}
                    </span>
                    <span>{m.percent}%</span>
                  </div>
                ))}
                <p className="pt-2 text-[11px] font-semibold opacity-90">Find yours → missioncareer.net/country-quiz</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logGameEvent("quiz_share", { method: "whatsapp" })}
              className="flex items-center justify-center gap-2 rounded-2xl bg-whatsapp px-4 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" /> Share on WhatsApp
            </a>
            <button type="button" onClick={shareImage} disabled={sharing} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-4 py-3 font-semibold text-primary-foreground shadow-card hover:opacity-90 disabled:opacity-60">
              {sharing ? "Preparing image..." : <><Share2 className="h-5 w-5" /> Share image (Instagram story)</>}
            </button>
            <button type="button" onClick={async () => { if (cardRef.current) { download(await makeImage()); logGameEvent("quiz_share", { method: "download" }); } }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 font-semibold text-foreground hover:border-primary hover:text-primary">
              <Download className="h-5 w-5" /> Download image
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 md:p-10 text-center text-primary-foreground shadow-soft">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-primary-foreground/10" />
        <h2 className="relative text-2xl md:text-3xl font-extrabold">Want a counsellor to check your match?</h2>
        <p className="relative mx-auto mt-2 max-w-xl opacity-90">We look at your full profile and tell you honestly which country and university fit you best — for free.</p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/919870003748?text=${encodeURIComponent(waCounsellor)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground shadow-card hover:opacity-90">
            <MessageCircle className="h-5 w-5" /> Talk to a counsellor
          </a>
          <Link to="/compare-countries" search={{ c: top3.map((m) => m.slug).join(",") }} className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-6 py-3 font-semibold hover:bg-primary-foreground/25">
            <Scale className="h-5 w-5" /> Compare my top 3
          </Link>
        </div>
      </section>

      <div className="text-center">
        <button type="button" onClick={onRetake} className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/50 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10">
          <RotateCcw className="h-4 w-4" /> Take the quiz again
        </button>
        <p className="mx-auto mt-3 max-w-xl text-xs text-muted-foreground">Match scores are guidance from Mission Career counsellors, combined with official yearly costs. They are not an admission or visa guarantee.</p>
      </div>
    </div>
  );
}
