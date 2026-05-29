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
    const payload = {
      full_name: String(data.get("full_name") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      email: String(data.get("email") || "").trim() || null,
      country: String(data.get("country") || "").trim() || null,
      study_level: String(data.get("study_level") || "").trim() || null,
      message: String(data.get("message") || "").trim() || null,
    };
    if (!payload.full_name) { setError("Please enter your name."); return; }
    if (!payload.phone && !payload.email) { setError("Please share phone or email."); return; }
    setBusy(true);
    const { error: err } = await supabase.from("leads").insert(payload);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    form.reset();
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
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Send us a message</h3>
            {done ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-3" />
                <h4 className="text-xl font-bold">Thank you!</h4>
                <p className="text-muted-foreground mt-1">Our counselor will reach out to you shortly.</p>
                <button onClick={() => setDone(false)} className="mt-5 text-sm font-semibold text-primary">Send another message</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input name="full_name" required maxLength={120} type="text" placeholder="Your name" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input name="phone" maxLength={30} type="tel" placeholder="+91 XXXXX XXXXX" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input name="email" maxLength={200} type="email" placeholder="your@email.com" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Preferred Country</label>
                    <select name="country" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                      <option value="">Select Country</option>
                      {["USA","UK","Canada","Australia","Germany","Ireland"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Study Level</label>
                    <select name="study_level" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                      <option value="">Select Level</option>
                      {["Bachelors","Masters","MBA","Diploma"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Your Message</label>
                  <textarea name="message" maxLength={2000} rows={4} placeholder="Tell us about your study abroad goals..." className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow disabled:opacity-60">
                  <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            {[
              { icon: MapPin, title: "Our Office", text: "Kandivali East, Mumbai" },
              { icon: Phone, title: "Call Us", text: "+91 9870003748" },
              { icon: Mail, title: "Email Us", text: "mcinteractions@gmail.com" },
            ].map((c) => (
              <div key={c.title} className="bg-card rounded-2xl shadow-card p-4 md:p-5 flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{c.title}</h4>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
            ))}

            <div className="bg-gradient-primary rounded-2xl shadow-soft p-5 md:p-6 text-primary-foreground">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Chat on WhatsApp</h4>
                  <p className="text-sm opacity-90">Get instant response from our counselors</p>
                  <a href="https://wa.me/919870003748" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-white text-primary px-5 py-2 text-sm font-semibold">Chat Now</a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-5 md:p-6">
              <h4 className="font-bold text-foreground mb-3">Office Hours</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["Monday - Friday","10:00 AM - 7:00 PM"],
                  ["Saturday","10:00 AM - 5:00 PM"],
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
