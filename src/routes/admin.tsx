import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Upload, Star, Newspaper, Sparkles, Lock } from "lucide-react";
import {
  addPost,
  deletePost,
  fileToDataURL,
  getPosts,
  updatePost,
  type Post,
  type PostKind,
} from "@/lib/content-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Mission Career" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const ADMIN_PIN = "125809";

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("mc_admin") === "1") setUnlocked(true);
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === ADMIN_PIN) {
              sessionStorage.setItem("mc_admin", "1");
              setUnlocked(true);
            } else setErr("Invalid PIN");
          }}
          className="bg-card rounded-3xl shadow-card p-8 w-full max-w-sm text-center"
        >
          <div className="mx-auto h-14 w-14 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter PIN to continue</p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(""); }}
            placeholder="••••••"
            className="mt-5 w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {err && <p className="text-sm text-destructive mt-2">{err}</p>}
          <button className="mt-4 w-full rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-soft">Unlock</button>
          <Link to="/" className="mt-4 inline-block text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}

const TABS: { kind: PostKind; label: string; icon: typeof Newspaper }[] = [
  { kind: "blog", label: "Blog Posts", icon: Newspaper },
  { kind: "success", label: "Success Stories", icon: Star },
  { kind: "festival", label: "Festival Offers", icon: Sparkles },
];

function AdminPanel() {
  const [tab, setTab] = useState<PostKind>("blog");
  const [posts, setPosts] = useState<Post[]>([]);
  const refresh = () => setPosts(getPosts(tab));

  useEffect(() => { refresh(); }, [tab]);
  useEffect(() => {
    const fn = () => refresh();
    window.addEventListener("mc-content-updated", fn);
    return () => window.removeEventListener("mc-content-updated", fn);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-extrabold">Admin Panel</h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("mc_admin"); location.reload(); }}
            className="text-sm font-semibold text-muted-foreground hover:text-primary"
          >Lock</button>
        </div>
        <div className="container mx-auto px-4 md:px-8 flex gap-2 overflow-x-auto pb-3">
          {TABS.map(({ kind, label, icon: Icon }) => (
            <button
              key={kind}
              onClick={() => setTab(kind)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                tab === kind ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-2 gap-8">
        <PostForm kind={tab} />
        <div>
          <h2 className="font-bold text-lg mb-4">Existing ({posts.length})</h2>
          <div className="space-y-4">
            {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
            {posts.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl shadow-card p-4 flex gap-3">
                {p.image && <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {p.kind === "festival" && (
                      <label className="text-xs flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!p.active}
                          onChange={(e) => updatePost(p.id, { active: e.target.checked })}
                        /> Show popup
                      </label>
                    )}
                    <button onClick={() => deletePost(p.id)} className="text-xs text-destructive inline-flex items-center gap-1 ml-auto">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function PostForm({ kind }: { kind: PostKind }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);

  const reset = () => { setTitle(""); setText(""); setImage(undefined); setActive(true); };

  const onFile = async (f?: File) => {
    if (!f) return;
    if (f.size > 2_500_000) { alert("Image too large. Use under 2.5MB."); return; }
    setImage(await fileToDataURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setBusy(true);
    addPost({ kind, title: title.trim(), text: text.trim(), image, active: kind === "festival" ? active : undefined });
    reset();
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-2xl shadow-card p-6 space-y-4 h-fit sticky top-32">
      <h2 className="font-bold text-lg">Add new {kind}</h2>
      <div>
        <label className="text-sm font-semibold">Title {kind === "success" && <span className="text-muted-foreground font-normal">(Student name)</span>}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="text-sm font-semibold">Text {kind === "success" && <span className="text-muted-foreground font-normal">(Story / university)</span>}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required maxLength={1000} rows={5}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="text-sm font-semibold">Image</label>
        <label className="mt-1 flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 cursor-pointer hover:border-primary transition">
          {image ? <img src={image} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
          <span className="text-sm text-muted-foreground">{image ? "Change image" : "Click to upload"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      {kind === "festival" && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Show as popup on site load
        </label>
      )}
      <button disabled={busy} className="w-full rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition">
        {busy ? "Saving…" : "Publish"}
      </button>
    </form>
  );
}
