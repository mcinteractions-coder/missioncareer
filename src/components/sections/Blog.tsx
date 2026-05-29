import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { fetchPosts, type Post } from "@/lib/content-store";

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetchPosts("blog").then(setPosts);
  }, []);

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

        {posts.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-card p-10 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground">New blog posts coming soon</h3>
            <p className="mt-2 text-muted-foreground">Stay tuned for expert articles on study abroad, scholarships, and visa tips.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$id"
                params={{ id: p.id }}
                className="block bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-soft transition hover:-translate-y-1"
              >
                {p.image && <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />}
                <div className="p-6">
                  <p className="text-xs text-primary font-semibold mb-2">{new Date(p.created_at).toLocaleDateString()}</p>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{p.text}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">Read more →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
