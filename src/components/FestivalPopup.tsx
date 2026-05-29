import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { fetchActiveFestival, type Post } from "@/lib/content-store";

export function FestivalPopup() {
  const [post, setPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchActiveFestival().then((p) => {
      setPost(p);
      setOpen(!!p);
    });
  }, []);

  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-card rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-md transition"
        >
          <X className="h-5 w-5" />
        </button>
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
        )}
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Festival Offer
          </div>
          <h3 className="text-2xl font-extrabold text-foreground">{post.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{post.text}</p>
          <button
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
          >
            Grab the Offer
          </button>
        </div>
      </div>
    </div>
  );
}
