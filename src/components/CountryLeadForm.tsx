import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name.").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  study_level: z.string().max(50).optional(),
});

export function CountryLeadForm({ country }: { country: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(d);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    let sid: string | null = null;
    try { sid = sessionStorage.getItem("mc_visitor_sid"); } catch { /* ignore */ }
    setBusy(true);
    const { error: err } = await supabase.from("leads").insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      country,
      study_level: parsed.data.study_level || null,
      message: `Enquiry from Study in ${country} page`,
      session_id: sid,
    });
    setBusy(false);
    if (err) { setError("Something went wrong. Please try again or WhatsApp us."); return; }
    setDone(true);
    form.reset();
    const w = window as any;
    if (typeof w.fbq === "function") w.fbq("track", "Lead");
  };

  if (done)
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <p className="mt-3 text-lg font-bold text-foreground">Thank you! We'll call you shortly.</p>
      </div>
    );

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="full_name" placeholder="Your name *" className={input} maxLength={100} aria-label="Your name" />
      <input name="phone" type="tel" placeholder="Phone number *" className={input} maxLength={20} aria-label="Phone number" />
      <input name="email" type="email" placeholder="Email (optional)" className={input} maxLength={255} aria-label="Email" />
      <select name="study_level" className={input} aria-label="Study level" defaultValue="">
        <option value="">Study level</option>
        <option>Bachelor's</option>
        <option>Master's</option>
        <option>MBA</option>
        <option>PhD</option>
        <option>Diploma</option>
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft disabled:opacity-60">
        {busy ? "Sending..." : <>Get Free Counselling <Send className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
