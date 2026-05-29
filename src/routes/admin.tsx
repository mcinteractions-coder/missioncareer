import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Trash2, Upload, Star, Newspaper, Sparkles, Lock, Inbox, ArrowUp, ArrowDown, Pencil, X } from "lucide-react";
import { fetchPosts, fileToDataURL, type Post, type PostKind } from "@/lib/content-store";
import {
  adminAddPost,
  adminDeletePost,
  adminUpdatePost,
  adminListLeads,
  adminDeleteLead,
  adminSwapOrder,
} from "@/lib/admin.functions";

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
              sessionStorage.setItem("mc_admin_pin", pin);
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

type TabKey = PostKind | "leads";

const TABS: { key: TabKey; label: string; icon: typeof Newspaper }[] = [
  { key: "blog", label: "Blog Posts", icon: Newspaper },
  { key: "success", label: "Success Stories", icon: Star },
  { key: "festival", label: "Festival Offers", icon: Sparkles },
  { key: "leads", label: "Counseling Leads", icon: Inbox },
];

function AdminPanel() {
  const [tab, setTab] = useState<TabKey>("blog");

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
            onClick={() => { sessionStorage.removeItem("mc_admin"); sessionStorage.removeItem("mc_admin_pin"); location.reload(); }}
            className="text-sm font-semibold text-muted-foreground hover:text-primary"
          >Lock</button>
        </div>
        <div className="container mx-auto px-4 md:px-8 flex gap-2 overflow-x-auto pb-3">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                tab === key ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8">
        {tab === "leads" ? <LeadsPanel /> : <PostsPanel kind={tab} />}
      </main>
    </div>
  );
}

function PostsPanel({ kind }: { kind: PostKind }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [busy, setBusy] = useState(false);
  const deleteFn = useServerFn(adminDeletePost);
  const updateFn = useServerFn(adminUpdatePost);
  const pin = sessionStorage.getItem("mc_admin_pin") || "";

  const refresh = useCallback(() => {
    fetchPosts(kind).then(setPosts);
  }, [kind]);

  useEffect(() => { refresh(); }, [refresh]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await deleteFn({ data: { pin, id } });
      refresh();
    } catch (e) {
      alert("Delete failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onToggleActive = async (id: string, active: boolean) => {
    try {
      await updateFn({ data: { pin, id, active } });
      refresh();
    } catch (e) {
      alert("Update failed: " + (e as Error).message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <PostForm kind={kind} pin={pin} onCreated={refresh} />
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
                        onChange={(e) => onToggleActive(p.id, e.target.checked)}
                      /> Show popup
                    </label>
                  )}
                  <button
                    disabled={busy}
                    onClick={() => onDelete(p.id)}
                    className="text-xs text-destructive inline-flex items-center gap-1 ml-auto disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostForm({ kind, pin, onCreated }: { kind: PostKind; pin: string; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  // Success-specific fields
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [destination, setDestination] = useState("");
  const [flagCode, setFlagCode] = useState("");
  const [prevCourse, setPrevCourse] = useState("");
  const [prevCollege, setPrevCollege] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const addFn = useServerFn(adminAddPost);

  const isSuccess = kind === "success";

  const reset = () => {
    setTitle(""); setText(""); setImage(undefined); setActive(true);
    setUniversity(""); setCourse(""); setDestination(""); setFlagCode("");
    setPrevCourse(""); setPrevCollege(""); setGender("male");
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    if (f.size > 2_500_000) { alert("Image too large. Use under 2.5MB."); return; }
    setImage(await fileToDataURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!isSuccess && !text.trim()) return;
    setBusy(true);
    try {
      await addFn({
        data: {
          pin,
          kind,
          title: title.trim(),
          text: text.trim() || (isSuccess ? `${title.trim()} — placed at ${university || destination}` : ""),
          image,
          active: kind === "festival" ? active : undefined,
          university: isSuccess ? university.trim() || undefined : undefined,
          course: isSuccess ? course.trim() || undefined : undefined,
          destination: isSuccess ? destination.trim() || undefined : undefined,
          flag_code: isSuccess ? (flagCode.trim().toLowerCase() || undefined) : undefined,
          prev_course: isSuccess ? prevCourse.trim() || undefined : undefined,
          prev_college: isSuccess ? prevCollege.trim() || undefined : undefined,
          gender: isSuccess ? gender : undefined,
        },
      });
      reset();
      onCreated();
    } catch (err) {
      alert("Publish failed: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-2xl shadow-card p-6 space-y-4 h-fit lg:sticky lg:top-32">
      <h2 className="font-bold text-lg">Add new {kind}</h2>
      <div>
        <label className="text-sm font-semibold">{isSuccess ? "Student Name" : "Title"}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
          placeholder={isSuccess ? "e.g. Martin Dsouza" : ""}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {isSuccess ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Destination Country</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} maxLength={100}
                placeholder="Germany"
                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold">Flag Code <span className="text-muted-foreground font-normal">(2 letters)</span></label>
              <input value={flagCode} onChange={(e) => setFlagCode(e.target.value)} maxLength={4}
                placeholder="de, us, gb, ca…"
                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Abroad University</label>
            <input value={university} onChange={(e) => setUniversity(e.target.value)} maxLength={200}
              placeholder="Technische Universität Berlin"
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold">Course (Abroad)</label>
            <input value={course} onChange={(e) => setCourse(e.target.value)} maxLength={200}
              placeholder="M.Sc. Computer Science"
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold">Previous Course <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input value={prevCourse} onChange={(e) => setPrevCourse(e.target.value)} maxLength={200}
              placeholder="Mechanical Engineering"
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold">Previous College <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input value={prevCollege} onChange={(e) => setPrevCollege(e.target.value)} maxLength={200}
              placeholder="Thakur College of Engineering"
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold">Gender <span className="text-muted-foreground font-normal">(for default avatar)</span></label>
            <div className="mt-1 flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button type="button" key={g} onClick={() => setGender(g)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                    gender === g ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-background text-foreground border-input hover:border-primary"
                  }`}>{g}</button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <label className="text-sm font-semibold">Text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} required maxLength={5000} rows={5}
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      )}

      <div>
        <label className="text-sm font-semibold">{isSuccess ? "Student Photo (optional)" : "Image"}</label>
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
      <button disabled={busy} className="w-full rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition disabled:opacity-60">
        {busy ? "Saving…" : "Publish"}
      </button>
    </form>
  );
}

interface Lead {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  country: string | null;
  study_level: string | null;
  message: string | null;
  created_at: string;
}

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string>("");
  const listFn = useServerFn(adminListLeads);
  const deleteFn = useServerFn(adminDeleteLead);
  const pin = sessionStorage.getItem("mc_admin_pin") || "";

  const refresh = useCallback(async () => {
    setError("");
    try {
      const rows = await listFn({ data: { pin } });
      setLeads(rows as Lead[]);
    } catch (e) {
      setError((e as Error).message);
      setLeads([]);
    }
  }, [listFn, pin]);

  useEffect(() => { refresh(); }, [refresh]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteFn({ data: { pin, id } });
      refresh();
    } catch (e) {
      alert("Delete failed: " + (e as Error).message);
    }
  };

  if (leads === null) return <p className="text-sm text-muted-foreground">Loading leads…</p>;

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">Free Counseling Leads ({leads.length})</h2>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {leads.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card p-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No leads yet. Submissions from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="bg-card rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{l.full_name}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => onDelete(l.id)} className="text-xs text-destructive inline-flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                {l.phone && <div><span className="text-muted-foreground">Phone:</span> <a href={`tel:${l.phone}`} className="text-primary font-medium">{l.phone}</a></div>}
                {l.email && <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${l.email}`} className="text-primary font-medium">{l.email}</a></div>}
                {l.country && <div><span className="text-muted-foreground">Country:</span> {l.country}</div>}
                {l.study_level && <div><span className="text-muted-foreground">Level:</span> {l.study_level}</div>}
              </div>
              {l.message && <p className="mt-3 text-sm text-foreground whitespace-pre-wrap border-t border-border pt-3">{l.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
