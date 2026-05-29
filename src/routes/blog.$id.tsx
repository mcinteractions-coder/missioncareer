import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { fetchPosts, type Post } from "@/lib/content-store";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/blog/$id")({
  head: () => ({ meta: [{ title: "Blog — Mission Career" }] }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { id } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    fetchPosts("blog").then((posts) => {
      setPost(posts.find((p) => p.id === id) ?? null);
    });
  }, [id]);

  if (post === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (post === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-extrabold">Post not found</h1>
        <p className="text-muted-foreground">This blog post may have been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-background">
      <Navbar />
      <article className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <p className="text-sm text-primary font-semibold mb-3">{new Date(post.created_at).toLocaleDateString()}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{post.title}</h1>
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full rounded-3xl shadow-card mb-8 object-cover max-h-[480px]" />
        )}
        <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap leading-relaxed text-lg">
          {post.text}
        </div>
      </article>
      <Footer />
    </main>
  );
}
