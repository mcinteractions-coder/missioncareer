import { Newspaper } from "lucide-react";

export function Blog() {
  return (
    <section id="blog" className="py-20 md:py-28 bg-gradient-hero">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary mb-3">From Our Blog</span>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Insights & <span className="text-gradient">Updates</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Tips, news, and guidance to help you on your study abroad journey.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-card p-10 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-2xl font-bold text-foreground">New blog posts coming soon</h3>
          <p className="mt-2 text-muted-foreground">Stay tuned for expert articles on study abroad, scholarships, and visa tips.</p>
        </div>
      </div>
    </section>
  );
}
