import { Search } from "lucide-react";

const FIELDS: { label: string; options: string[] }[] = [
  { label: "Country", options: ["USA","UK","Canada","Australia","Germany","Ireland","New Zealand","Italy","France","Spain"] },
  { label: "Course", options: ["Computer Science","Business","Engineering","Data Science","MBA","Mechanical","IT","AI","AIML","Cyber Security","Finance","Bio Technology"] },
  { label: "Level", options: ["Bachelors","Masters","MBA","Diploma"] },
  { label: "Intake", options: ["Fall","Spring","Summer"] },
  { label: "IELTS", options: ["Not Required","6","6.5","7","7.5","8"] },
  { label: "GRE", options: ["Not Required","300","310","320"] },
  { label: "GMAT", options: ["Not Required","550","600","650","700"] },
  { label: "Budget", options: ["Low","Medium","High","Very High"] },
];

const ADMITS = [
  { i: "M", name: "Martin Ronak Angello", uni: "TU Berlin" },
  { i: "J", name: "Jayesh Sharma", uni: "TU Dresden" },
  { i: "R", name: "Riya Patil", uni: "TU Braunschweig" },
  { i: "H", name: "Hrushikesh Shetty", uni: "Indiana University" },
];

const DESTS = ["USA","UK","Australia","Canada","Germany","Ireland","New Zealand","Italy","France"];

const REVIEWS = [
  { t: "Mission Career guided me step by step for Germany admission. Very professional and supportive staff.", n: "Rishikesh" },
  { t: "Best consultancy in Kandivali. Very honest guidance.", n: "Karan" },
  { t: "Got my visa smoothly without stress.", n: "Akshada" },
  { t: "Staff is friendly and explains everything clearly.", n: "Pooja" },
  { t: "Highly recommended for study abroad.", n: "Akshay" },
  { t: "Helped me choose correct university.", n: "Sneha" },
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 rounded-full bg-primary-soft/40 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Study Abroad <br />
              <span className="text-gradient">Made Simple</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-md">
              Discover universities, explore countries and start your international career with expert guidance.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="rounded-full bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-soft">Free Counseling</a>
              <a href="#destinations" className="rounded-full border-2 border-primary/30 bg-card px-5 py-2.5 font-semibold text-primary">Find Universities</a>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 bg-card rounded-3xl shadow-soft p-5">
              {FIELDS.map((f) => (
                <select
                  key={f.label}
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue=""
                >
                  <option value="">{f.label}</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
              <button className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow">
                <Search className="h-4 w-4" /> Search Universities
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-8">
              <div><span className="block text-2xl font-extrabold text-gradient">5000+</span><span className="text-sm text-muted-foreground">Students</span></div>
              <div><span className="block text-2xl font-extrabold text-gradient">98%</span><span className="text-sm text-muted-foreground">Visa Success</span></div>
              <div><span className="block text-2xl font-extrabold text-gradient">120+</span><span className="text-sm text-muted-foreground">Universities</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-3xl shadow-card p-6">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-primary" /> Recent Admits
              </h3>
              <div className="space-y-3">
                {ADMITS.map((a) => (
                  <div key={a.name} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground font-bold flex items-center justify-center">{a.i}</div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.uni}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-3xl shadow-card p-6 overflow-hidden">
              <h3 className="font-bold text-foreground mb-4">Top Destinations</h3>
              <div className="relative overflow-hidden">
                <div className="flex gap-3 animate-marquee whitespace-nowrap">
                  {[...DESTS, ...DESTS].map((d, i) => (
                    <div key={i} className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">{d}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl shadow-card p-6">
              <h3 className="font-bold text-foreground mb-4">Student Reviews</h3>
              <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                {REVIEWS.map((r) => (
                  <div key={r.n} className="rounded-xl bg-secondary p-3">
                    <div className="text-amber-500 text-sm">★★★★★</div>
                    <p className="mt-1 text-sm text-foreground">{r.t}</p>
                    <p className="mt-1 text-xs text-muted-foreground">– {r.n}</p>
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
