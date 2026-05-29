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

  const handleGrabOffer = () => {
    setOpen(false);
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!open || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] md:h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-md transition"
        >
          <X className="h-5 w-5" />
        </button>
        {post.image && (
          <div className="flex-1 min-h-0">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-10 text-center shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            <Sparkles className="h-4 w-4" /> Festival Offer
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground">{post.title}</h3>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground whitespace-pre-wrap max-w-2xl mx-auto">{post.text}</p>
          <button
            onClick={handleGrabOffer}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
          >
            Grab the Offer
          </button>
        </div>
      </div>
    </div>
  );
}
