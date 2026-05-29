import { useEffect, useState } from "react";
import { Quote, ArrowRight } from "lucide-react";
import { fetchPosts, type Post } from "@/lib/content-store";

const STORIES = [
  { i: "M", name: "Martin Ronak Angello", uni: "TU Berlin, Germany", course: "Masters in Computer Science", quote: "Mission Career made my dream of studying in Germany a reality. Their guidance was exceptional!" },
  { i: "J", name: "Jayesh Sharma", uni: "TU Dresden, Germany", course: "Masters in Engineering", quote: "The entire process was smooth and stress-free. Best consultancy for Germany admissions." },
  { i: "R", name: "Riya Patil", uni: "TU Braunschweig, Germany", course: "Masters in Data Science", quote: "From application to visa, they supported me at every step. Highly recommended!" },
  { i: "H", name: "Hrushikesh Shetty", uni: "Indiana University, USA", course: "MBA", quote: "Professional team with deep knowledge of US universities. Got into my dream school!" },
  { i: "A", name: "Akshada Patil", uni: "University of Melbourne, Australia", course: "Masters in Business", quote: "Their scholarship guidance helped me save significant money on my education abroad." },
  { i: "K", name: "Karan Singh", uni: "University of Toronto, Canada", course: "Masters in AI", quote: "The visa process was made so simple. Got my student visa approved on the first attempt!" },
];

export function Success() {
  const [admin, setAdmin] = useState<Post[]>([]);
  useEffect(() => {
    fetchPosts("success").then(setAdmin);
  }, []);

  const adminCards = admin.map((p) => ({
    key: p.id,
    i: p.title.charAt(0).toUpperCase(),
    name: p.title,
    uni: "",
    course: "Student",
    quote: p.text,
    image: p.image ?? undefined,
  }));
  const defaults = STORIES.map((s) => ({ ...s, key: s.name, image: undefined as string | undefined }));
  const all = [...adminCards, ...defaults];

  return (
    <section id="success" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary mb-3">Our Pride</span>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Student <span className="text-gradient">Success Stories</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Real students, real achievements. See how Mission Career has transformed their lives.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((s) => (
            <div key={s.key} className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all hover:-translate-y-1">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              <div className="flex items-center gap-3 mb-4">
                {s.image ? (
                  <img src={s.image} alt={s.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground text-lg font-bold flex items-center justify-center">{s.i}</div>
                )}
                <div>
                  <h3 className="font-bold text-foreground">{s.name}</h3>
                  {s.uni && <p className="text-xs text-primary">{s.uni}</p>}
                </div>
              </div>
              <div className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary mb-3">{s.course}</div>
              <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">"{s.quote}"</p>
              <div className="mt-3 text-amber-500">★★★★★</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow">
            View All Success Stories <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
