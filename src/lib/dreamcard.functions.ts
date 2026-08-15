import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getAiProvider } from "./ai-provider.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const InputSchema = z.object({
  fullName: z.string().min(1).max(120),
  phone: z.string().max(30).optional(),
  email: z.string().max(200).optional(),
  course: z.string().min(1).max(120),
  country: z.string().min(1).max(100),
  studyLevel: z.string().min(1).max(60),
  sessionId: z.string().max(128).optional(),
});

const ResultSchema = z.object({
  dreamUniversity: z.string().max(120),
  dreamCourse: z.string().max(120),
  dreamCity: z.string().max(100),
  dreamCountry: z.string().max(100),
  salaryEstimate: z.string().max(80),
  lifestyle: z.string().max(500),
  oneLine: z.string().max(160),
  emoji: z.string().max(8),
  color: z.string().max(7),
});

export type DreamCardResult = z.infer<typeof ResultSchema>;

export const generateDreamCard = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const ai = getAiProvider();
    if (!ai) throw new Error("AI not configured");

    const system = `You are a creative study-abroad career oracle for Mission Career, an Indian study-abroad consultancy.
Given a student's profile, generate an inspiring, slightly dramatic "5 Years From Now" vision card.
Be realistic but motivational. Pick a well-known university in the chosen country that fits the course/study level.
Salary should be in local currency of the target country and be a realistic post-graduation range.
Lifestyle should be 2-3 vivid sentences about their life in that city.
OneLine should be a punchy, shareable tagline.
Emoji should be one relevant emoji.
Color should be a single hex color that matches the country/city vibe (e.g. #3B82F6 for USA, #10B981 for Ireland, #F59E0B for Australia).`;

    const prompt = `Student profile:
Name: ${data.fullName}
Dream course: ${data.course}
Preferred country: ${data.country}
Study level: ${data.studyLevel}

Generate a "5 Years From Now" dream card. Return ONLY valid JSON matching the schema.`;

    const { output } = await generateText({
      model: ai.provider(ai.modelId),
      system,
      prompt,
      output: Output.object({ schema: ResultSchema }),
    });

    // Persist the submission + AI result
    const { error } = await supabaseAdmin.from("dream_cards").insert({
      full_name: data.fullName,
      phone: data.phone || null,
      email: data.email || null,
      country: data.country,
      course: data.course,
      study_level: data.studyLevel,
      dream_university: output.dreamUniversity,
      dream_course: output.dreamCourse,
      dream_city: output.dreamCity,
      dream_country: output.dreamCountry,
      salary_estimate: output.salaryEstimate,
      lifestyle: output.lifestyle,
      one_line: output.oneLine,
      emoji: output.emoji,
      color: output.color,
      session_id: data.sessionId || null,
    });

    if (error) {
      console.error("dream_cards insert error", error);
      // Don't fail the user-facing request if persistence fails
    }

    return output;
  });
