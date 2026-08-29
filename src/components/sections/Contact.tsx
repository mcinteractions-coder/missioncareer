import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export function Contact() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    let sid: string | null = null;
    try { sid = sessionStorage.getItem("mc_visitor_sid"); } catch { /* ignore */ }
    const payload = {
      full_name: String(data.get("full_name") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      email: String(data.get("email") || "").trim() || null,
      country: String(data.get("country") || "").trim() || null,
      study_level: String(data.get("study_level") || "").trim() || null,
      message: String(data.get("message") || "").trim() || null,
      session_id: sid,
    };
    if (!payload.full_name) { setError("Please enter your name."); return; }
    if (!payload.phone && !payload.email) { setError("Please share phone or email."); return; }
    setBusy(true);
    const { error: err } = await supabase.from("leads").insert(payload);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    form.reset();
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead");
    }
  };

  return (
    <section id="contact" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">Get In Touch</span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">Ready to start your study abroad journey? Get in touch with our expert counselors today.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-card rounded-2xl md:rounded-3xl shadow-card p-5 md:p-8">
            <p className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Send us a message</p>
            {done ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-3" />
                <p className="text-xl font-bold">Thank you!</p>
                <p className="text-muted-foreground mt-1">Our counselor will reach out to you shortly.</p>
                <button onClick={() => setDone(false)} className="mt-5 text-sm font-semibold text-primary">Send another message</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-full-name" className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input id="contact-full-name" name="full_name" required maxLength={120} type="text" placeholder="Your name" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input id="contact-phone" name="phone" maxLength={30} type="tel" placeholder="+91 XXXXX XXXXX" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input id="contact-email" name="email" maxLength={200} type="email" placeholder="your@email.com" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-country" className="block text-sm font-medium mb-1.5">Preferred Country</label>
                    <select id="contact-country" name="country" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                      <option value="">Select Country</option>
                      {["USA","UK","Canada","Australia","Germany","Ireland"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-study-level" className="block text-sm font-medium mb-1.5">Study Level</label>
                    <select id="contact-study-level" name="study_level" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                      <option value="">Select Level</option>
                      {["Bachelors","Masters","MBA","Diploma"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">Your Message</label>
                  <textarea id="contact-message" name="message" maxLength={2000} rows={4} placeholder="Tell us about your study abroad goals..." className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow disabled:opacity-60">
                  <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            {/* Glassy Office Card with Map */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-card group">
              {/* Map background */}
              <iframe
                title="Mission Career Location"
                src="https://www.google.com/maps?q=Mission+Career,+28+Bldg+No-27,+Thakur+Village+Rd,+Evershine+Millennium+Paradise,+Evershine+Nagar,+Kandivali+East,+Mumbai,+Maharashtra+400101&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Gradient overlay for legibility */}
              <div className="relative pt-48 md:pt-64 pointer-events-none">
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
              </div>
              {/* Glass info panel */}
              <div className="relative -mt-2 m-3 md:m-4 rounded-2xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-soft p-4 md:p-5">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-foreground">Our Office</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-xs font-semibold">
                        ★ 4.2 <span className="opacity-70">· 179 Reviews</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                      28 Bldg No-27, Thakur Village Rd, Evershine Millennium Paradise, Evershine Nagar, Kandivali East, Mumbai, Maharashtra 400101
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Mission+Career+Evershine+Nagar+Kandivali+East+Mumbai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {[
              { icon: Phone, title: "Call Us", text: "+91 9870003748" },
              { icon: Mail, title: "Email Us", text: "mcinteractions@gmail.com" },
            ].map((c) => (
              <div key={c.title} className="bg-card rounded-2xl shadow-card p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{c.text}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl shadow-soft p-5 md:p-6 text-white" style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">Chat on WhatsApp</p>
                  <p className="text-sm opacity-90">Get instant response from our counselors</p>
                  <a href="https://wa.me/919870003748" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold" style={{ color: "#128C7E" }}>Chat Now</a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-5 md:p-6">
              <p className="font-bold text-foreground mb-3">Office Hours</p>
              <div className="space-y-2 text-sm">
                {[
                  ["Monday - Friday","11:30 AM - 8:00 PM"],
                  ["Saturday","11:30 AM - 8:00 PM"],
                  ["Sunday","By Appointment"],
                ].map(([d, t]) => (
                  <div key={d} className="flex justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                    <span className="text-muted-foreground">{d}</span>
                    <span className="font-semibold text-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
