import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-provider.server";

const InputSchema = z.object({
  docType: z.enum(["sop", "lor", "resume", "essay"]),
  targetCountry: z.string().max(60).optional(),
  targetCourse: z.string().max(120).optional(),
  text: z.string().min(50, "Please paste at least 50 characters").max(20000),
});

const MetricSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  notes: z.string(),
});

const ResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  grade: z.string(),
  oneLineSummary: z.string(),
  wordCount: z.number(),
  readingLevel: z.string(),
  metrics: z.object({
    clarity: MetricSchema,
    structure: MetricSchema,
    grammar: MetricSchema,
    vocabulary: MetricSchema,
    relevance: MetricSchema,
    impact: MetricSchema,
    originality: MetricSchema,
    formatting: MetricSchema,
  }),
  aiDetection: z.object({
    aiLikelihoodPercent: z.number().min(0).max(100),
    verdict: z.string(),
    reasoning: z.string(),
    flaggedPhrases: z.array(z.string()),
  }),
  plagiarismRisk: z.object({
    riskPercent: z.number().min(0).max(100),
    verdict: z.string(),
    clichedPhrases: z.array(z.string()),
    note: z.string(),
  }),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  lineByLineSuggestions: z
    .array(
      z.object({
        excerpt: z.string(),
        issue: z.string(),
        suggestion: z.string(),
      }),
    )
    .max(8),
  rewriteTips: z.array(z.string()).min(3),
});

export const gradeDocument = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const ai = getAiProvider();
    if (!ai) throw new Error("AI not configured");

    const docLabel = {
      sop: "Statement of Purpose (SOP)",
      lor: "Letter of Recommendation (LOR)",
      resume: "Resume / CV",
      essay: "Application Essay",
    }[data.docType];

    const system = `You are a senior study-abroad admissions officer and writing coach.
You grade ${docLabel}s for international university applications with brutal honesty but constructive guidance.
You evaluate EVERYTHING that matters: clarity, structure, grammar, vocabulary, relevance to the target,
emotional impact, originality, formatting, AI-generated tone detection, and plagiarism / cliché risk.

For AI detection: judge by burstiness, sentence rhythm, generic transitions ("Furthermore", "In conclusion", "delve into", "tapestry", "navigate the complexities"), formulaic structure, lack of personal specificity, and over-polish.
For plagiarism risk: you cannot search the web — instead detect overused template phrases common in SOPs/LORs/resumes that signal copied templates. Be explicit this is a cliché/template-risk estimate, not a web check.

Score 0-100 where 90+ = excellent, 75-89 = strong, 60-74 = decent, 40-59 = weak, <40 = rewrite needed.
Give specific, actionable feedback. Quote actual phrases from the text.`;

    const prompt = `Grade this ${docLabel}.
${data.targetCountry ? `Target country: ${data.targetCountry}` : ""}
${data.targetCourse ? `Target course: ${data.targetCourse}` : ""}

--- DOCUMENT START ---
${data.text}
--- DOCUMENT END ---

Return a complete structured evaluation.`;

    const { output } = await generateText({
      model: ai.provider(ai.modelId),
      system,
      prompt,
      output: Output.object({ schema: ResultSchema }),
    });

    return output;
  });

export type GradeResult = z.infer<typeof ResultSchema>;
