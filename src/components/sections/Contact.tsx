import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary mb-3">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Ready to start your study abroad journey? Get in touch with our expert counselors today.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-3xl shadow-card p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input type="text" placeholder="Your name" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input type="email" placeholder="your@email.com" className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Preferred Country</label>
                  <select className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                    <option value="">Select Country</option>
                    {["USA","UK","Canada","Australia","Germany","Ireland"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Study Level</label>
                  <select className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" defaultValue="">
                    <option value="">Select Level</option>
                    {["Bachelors","Masters","MBA","Diploma"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Your Message</label>
                <textarea rows={4} placeholder="Tell us about your study abroad goals..." className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Our Office", text: "Kandivali East, Mumbai" },
              { icon: Phone, title: "Call Us", text: "+91 9870003748" },
              { icon: Mail, title: "Email Us", text: "mcinteractions@gmail.com" },
            ].map((c) => (
              <div key={c.title} className="bg-card rounded-2xl shadow-card p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{c.title}</h4>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
            ))}

            <div className="bg-gradient-primary rounded-2xl shadow-soft p-6 text-primary-foreground">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Chat on WhatsApp</h4>
                  <p className="text-sm opacity-90">Get instant response from our counselors</p>
                  <button className="mt-3 rounded-full bg-white text-primary px-5 py-2 text-sm font-semibold">Chat Now</button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
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
