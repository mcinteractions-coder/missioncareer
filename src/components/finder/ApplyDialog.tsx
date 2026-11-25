import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { applyLinks, type University } from "@/lib/universities";

const schema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name.").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email.").max(200).or(z.literal("")),
  level: z.string().trim().min(1, "Please choose a level.").max(40),
  course: z.string().trim().min(1, "Please enter your course.").max(120),
  intake: z.string().trim().max(40),
  marks: z.string().trim().max(60),
  ielts: z.string().trim().max(20),
  notes: z.string().trim().max(1000),
});

const input = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function ApplyDialog({ uni, onClose }: { uni: University | null; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const close = () => { setDone(false); setError(""); onClose(); };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uni) return;
    setError("");
    const p = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!p.success) { setError(p.error.issues[0]?.message ?? "Please check the form."); return; }
    let sid: string | null = null;
    try { sid = sessionStorage.getItem("mc_visitor_sid"); } catch { /* ignore */ }
    const d = p.data;
    setBusy(true);
    const { error: err } = await supabase.from("leads").insert({
      full_name: d.full_name,
      phone: d.phone,
      email: d.email || null,
      country: uni.country,
      study_level: d.level,
      message: [
        `University application: ${uni.name} (${uni.city}, ${uni.country})`,
        `Course: ${d.course}`,
        d.intake && `Intake: ${d.intake}`,
        d.marks && `Marks: ${d.marks}`,
        d.ielts && `IELTS/English: ${d.ielts}`,
        d.notes && `Notes: ${d.notes}`,
      ].filter(Boolean).join("\n"),
      session_id: sid,
    });
    setBusy(false);
    if (err) { setError("Something went wrong. Please try again or WhatsApp us."); return; }
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof w.fbq === "function") w.fbq("track", "Lead");
    setDone(true);
  };

  return (
    <Dialog open={!!uni} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {uni && (
          <>
            <DialogHeader>
              <DialogTitle>Apply to {uni.name}</DialogTitle>
              <DialogDescription>{uni.city}, {uni.country} · Our counsellors will help you with documents, SOP and the official application.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              {applyLinks(uni).map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft">
                  {l.label} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
            {done ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-3 font-semibold text-foreground">Application request received!</p>
                <p className="mt-1 text-sm text-muted-foreground">A Mission Career counsellor will call you soon about {uni.name}.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
                <input name="full_name" required maxLength={100} placeholder="Full name *" aria-label="Full name" className={`${input} sm:col-span-2`} />
                <input name="phone" required maxLength={20} type="tel" placeholder="Phone / WhatsApp *" aria-label="Phone" className={input} />
                <input name="email" maxLength={200} type="email" placeholder="Email" aria-label="Email" className={input} />
                <select name="level" required defaultValue={uni.levels[0] ?? ""} aria-label="Level" className={input}>
                  {uni.levels.map((l) => <option key={l}>{l}</option>)}
                </select>
                <select name="intake" defaultValue={uni.intakes[0] ?? ""} aria-label="Intake" className={input}>
                  {uni.intakes.map((i) => <option key={i}>{i}</option>)}
                </select>
                <input name="course" required maxLength={120} placeholder="Course you want *" aria-label="Course" className={`${input} sm:col-span-2`} />
                <input name="marks" maxLength={60} placeholder="Last marks / CGPA" aria-label="Marks" className={input} />
                <input name="ielts" maxLength={20} placeholder="IELTS / PTE score" aria-label="English score" className={input} />
                <textarea name="notes" maxLength={1000} rows={2} placeholder="Anything else?" aria-label="Notes" className={`${input} sm:col-span-2`} />
                {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
                <button type="submit" disabled={busy} className="sm:col-span-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {busy ? "Submitting..." : "Submit application"}
                </button>
                <p className="text-[11px] text-muted-foreground sm:col-span-2">By submitting, you agree that Mission Career may contact you about this application.</p>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
