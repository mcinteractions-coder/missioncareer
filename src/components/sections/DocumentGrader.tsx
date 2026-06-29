import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { gradeDocument, type GradeResult } from "@/lib/grader.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ShieldAlert, Bot, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

type DocType = "sop" | "lor" | "resume" | "essay";

const DOC_TYPES: { key: DocType; label: string; emoji: string }[] = [
  { key: "sop", label: "SOP", emoji: "📝" },
  { key: "lor", label: "LOR", emoji: "✉️" },
  { key: "resume", label: "Resume", emoji: "📄" },
  { key: "essay", label: "Essay", emoji: "🎓" },
];

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number) {
  if (score >= 85) return "from-emerald-500 to-green-500";
  if (score >= 70) return "from-blue-500 to-cyan-500";
  if (score >= 50) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

export function DocumentGrader() {
  const grade = useServerFn(gradeDocument);
  const [docType, setDocType] = useState<DocType>("sop");
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  async function handleGrade() {
    if (text.trim().length < 50) {
      setError("Please paste at least 50 characters");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const r = await grade({
        data: {
          docType,
          text,
          targetCountry: country || undefined,
          targetCourse: course || undefined,
        },
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="grader" className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">AI-Powered</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            SOP / LOR / Resume <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Grader</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Paste your draft. Get instant scoring on clarity, structure, grammar, originality,
            AI-detection likelihood, plagiarism/cliché risk, and line-by-line suggestions.
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-xl border-2">
          <div className="flex flex-wrap gap-2 mb-5">
            {DOC_TYPES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDocType(d.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  docType === d.key
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {d.emoji} {d.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <Input
              placeholder="Target country (e.g. Germany)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              maxLength={60}
            />
            <Input
              placeholder="Target course (e.g. MS Computer Science)"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              maxLength={120}
            />
          </div>

          <Textarea
            placeholder={`Paste your ${docType.toUpperCase()} here...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[240px] font-mono text-sm"
            maxLength={20000}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{text.length} / 20000 chars · {text.trim().split(/\s+/).filter(Boolean).length} words</span>
            {error && <span className="text-red-500">{error}</span>}
          </div>

          <Button
            onClick={handleGrade}
            disabled={loading || text.trim().length < 50}
            size="lg"
            className="w-full mt-4 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing your document...</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Grade My Document</>
            )}
          </Button>
        </Card>

        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Overall Score */}
            <Card className="p-8 shadow-xl border-2 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${scoreBg(result.overallScore)} opacity-10`} />
              <div className="relative grid md:grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <div className={`text-7xl font-black ${scoreColor(result.overallScore)}`}>
                    {result.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Overall Score</div>
                  <Badge className="mt-2 text-base px-3 py-1">{result.grade}</Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-lg font-medium mb-3">{result.oneLineSummary}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {result.wordCount} words</span>
                    <span>Reading level: {result.readingLevel}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Detection + Plagiarism */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-2">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-purple-500" />
                  <p className="font-semibold text-lg">AI Detection</p>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl font-bold ${scoreColor(100 - result.aiDetection.aiLikelihoodPercent)}`}>
                    {result.aiDetection.aiLikelihoodPercent}%
                  </span>
                  <span className="text-sm text-muted-foreground">AI-likelihood</span>
                </div>
                <Progress value={result.aiDetection.aiLikelihoodPercent} className="mb-3" />
                <p className="font-medium text-sm mb-2">{result.aiDetection.verdict}</p>
                <p className="text-sm text-muted-foreground mb-3">{result.aiDetection.reasoning}</p>
                {result.aiDetection.flaggedPhrases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.aiDetection.flaggedPhrases.map((p, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-purple-300">{p}</Badge>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6 border-2">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  <p className="font-semibold text-lg">Plagiarism / Cliché Risk</p>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl font-bold ${scoreColor(100 - result.plagiarismRisk.riskPercent)}`}>
                    {result.plagiarismRisk.riskPercent}%
                  </span>
                  <span className="text-sm text-muted-foreground">risk</span>
                </div>
                <Progress value={result.plagiarismRisk.riskPercent} className="mb-3" />
                <p className="font-medium text-sm mb-2">{result.plagiarismRisk.verdict}</p>
                <p className="text-xs text-muted-foreground italic mb-3">{result.plagiarismRisk.note}</p>
                {result.plagiarismRisk.clichedPhrases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.plagiarismRisk.clichedPhrases.map((p, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-amber-300">{p}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Metrics grid */}
            <Card className="p-6 border-2">
              <p className="font-semibold text-lg mb-4">Detailed Metrics</p>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(result.metrics).map(([key, m]) => (
                  <div key={key} className="p-4 rounded-lg bg-muted/40">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{key}</span>
                      <span className={`font-bold text-lg ${scoreColor(m.score)}`}>{m.score}</span>
                    </div>
                    <Progress value={m.score} className="mb-2 h-2" />
                    <div className="text-xs font-medium mb-1">{m.verdict}</div>
                    <div className="text-xs text-muted-foreground">{m.notes}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths + Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-2 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-lg">Strengths</p>
                </div>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm flex gap-2"><span className="text-emerald-600">✓</span>{s}</li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6 border-2 border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="font-semibold text-lg">Weaknesses</p>
                </div>
                <ul className="space-y-2">
                  {result.weaknesses.map((s, i) => (
                    <li key={i} className="text-sm flex gap-2"><span className="text-red-600">✗</span>{s}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Line by line */}
            {result.lineByLineSuggestions.length > 0 && (
              <Card className="p-6 border-2">
                <p className="font-semibold text-lg mb-4">Line-by-Line Suggestions</p>
                <div className="space-y-3">
                  {result.lineByLineSuggestions.map((s, i) => (
                    <div key={i} className="p-4 rounded-lg border bg-muted/30">
                      <div className="text-sm italic text-muted-foreground mb-2">"{s.excerpt}"</div>
                      <div className="text-sm"><span className="font-medium text-red-600">Issue:</span> {s.issue}</div>
                      <div className="text-sm mt-1"><span className="font-medium text-emerald-600">Fix:</span> {s.suggestion}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Rewrite tips */}
            <Card className="p-6 border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <p className="font-semibold text-lg mb-3">✨ Next Steps to Improve</p>
              <ol className="space-y-2 list-decimal list-inside">
                {result.rewriteTips.map((t, i) => (
                  <li key={i} className="text-sm">{t}</li>
                ))}
              </ol>
              <Button asChild className="mt-5 bg-gradient-to-r from-primary to-purple-500" size="lg">
                <a href="#booking">Get Expert Review from Mission Career →</a>
              </Button>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
