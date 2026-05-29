import {
  Compass, School, FileCheck2, Award, Banknote, ClipboardCheck, MessageSquare, Languages, MapPin,
} from "lucide-react";

const SERVICES = [
  { icon: Compass, title: "Career Counseling", desc: "Guidance to choose the right country and university." },
  { icon: School, title: "University Selection", desc: "Shortlisting top universities based on your profile." },
  { icon: FileCheck2, title: "Visa Assistance", desc: "Professional support for visa documentation." },
  { icon: Award, title: "Scholarship Guidance", desc: "We help you find scholarships for international study." },
  { icon: Banknote, title: "Loan Assistance", desc: "Support for education loan approval." },
  { icon: ClipboardCheck, title: "Admission Processing", desc: "Complete application & documentation support." },
  { icon: MessageSquare, title: "Interview Preparation", desc: "Mock interviews for visa & university." },
  { icon: Languages, title: "IELTS / PTE Guidance", desc: "Training support for language exams." },
  { icon: MapPin, title: "Post Landing Help", desc: "Accommodation & airport pickup support." },
];

export function Services() {
  return (
    <section id="services" className="py-12 md:py-24 bg-gradient-hero relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">Comprehensive support for your study abroad journey from start to finish</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="group relative bg-card rounded-2xl p-5 md:p-6 shadow-card hover:shadow-soft transition-all hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary-foreground transition-colors">{s.title}</h3>
                <p className="mt-1.5 md:mt-2 text-sm text-muted-foreground group-hover:text-primary-foreground/90 transition-colors">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
