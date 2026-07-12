import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Trash2, Upload, Star, Newspaper, Sparkles, Lock, Inbox, ArrowUp, ArrowDown, Pencil, X, CalendarDays, Clock, Phone, Mail, Globe2, Activity, MapPin, Smartphone, Monitor, Eye, Users, TrendingUp, Wand2, MousePointerClick, ChevronRight } from "lucide-react";
import { fetchPosts, fileToDataURL, type Post, type PostKind } from "@/lib/content-store";
import { supabase } from "@/integrations/supabase/client";
import {
  adminAddPost,
  adminDeletePost,
  adminUpdatePost,
  adminListLeads,
  adminDeleteLead,
  adminSwapOrder,
  adminListBookings,
  adminDeleteBooking,
  adminAnalytics,
  adminListSessions,
  adminSessionDetail,
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

type TabKey = PostKind | "leads" | "bookings" | "analytics";

const TABS: { key: TabKey; label: string; icon: typeof Newspaper }[] = [
  { key: "analytics", label: "Live Analytics", icon: Activity },
  { key: "bookings", label: "Counseling Bookings", icon: CalendarDays },
  { key: "blog", label: "Blog Posts", icon: Newspaper },
  { key: "success", label: "Success Stories", icon: Star },
  { key: "review", label: "Reviews", icon: Star },
  { key: "admit", label: "Recent Admits", icon: Star },
  { key: "festival", label: "Festival Offers", icon: Sparkles },
  { key: "leads", label: "Counseling Leads", icon: Inbox },
];


function AdminPanel() {
  const [tab, setTab] = useState<TabKey>("analytics");

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
        {tab === "leads" ? <LeadsPanel /> : tab === "bookings" ? <BookingsPanel /> : tab === "analytics" ? <AnalyticsPanel /> : <PostsPanel kind={tab} />}
      </main>
    </div>
  );
}

function PostsPanel({ kind }: { kind: PostKind }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const deleteFn = useServerFn(adminDeletePost);
  const updateFn = useServerFn(adminUpdatePost);
  const swapFn = useServerFn(adminSwapOrder);
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

  const move = async (idx: number, dir: -1 | 1) => {
    const a = posts[idx];
    const b = posts[idx + dir];
    if (!a || !b) return;
    setBusy(true);
    try {
      await swapFn({ data: { pin, a: a.id, b: b.id } });
      refresh();
    } catch (e) {
      alert("Reorder failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const isSuccess = kind === "success";
  const isReview = kind === "review";
  const isAdmit = kind === "admit";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <PostForm kind={kind} pin={pin} onCreated={refresh} />
      <div>
        <h2 className="font-bold text-lg mb-4">Existing ({posts.length})</h2>
        <div className="space-y-3">
          {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
          {posts.map((p, i) => (
            <div key={p.id} className="bg-card rounded-2xl shadow-card p-4 flex gap-3">
              {isSuccess ? (
                <img
                  src={`https://flagcdn.com/w80/${(p.flag_code || "un").toLowerCase()}.png`}
                  alt=""
                  className="h-10 w-14 rounded object-cover flex-shrink-0 ring-1 ring-black/10"
                />
              ) : (isReview || isAdmit) ? (
                p.image ? (
                  <img src={p.image} alt="" className="h-12 w-12 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground font-bold flex items-center justify-center flex-shrink-0">{p.title.charAt(0)}</div>
                )
              ) : p.image ? (
                <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />
              ) : null}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{p.title}</h3>
                {isSuccess ? (
                  <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                    {p.university && <p className="truncate">🎓 {p.university}{p.course && ` — ${p.course}`}</p>}
                    {p.prev_college && <p className="truncate">🏫 {p.prev_college}{p.prev_course && ` — ${p.prev_course}`}</p>}
                    {p.destination && <p>📍 {p.destination}</p>}
                  </div>
                ) : isReview ? (
                  <>
                    <div className="text-amber-500 text-sm">{"★".repeat(p.rating ?? 5)}{"☆".repeat(5 - (p.rating ?? 5))}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.text}</p>
                  </>
                ) : isAdmit ? (
                  <p className="text-xs text-muted-foreground truncate mt-1">🎓 {p.university || "—"}</p>
                ) : (
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.text}</p>
                )}

                <div className="flex items-center flex-wrap gap-2 mt-2">
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
                    disabled={busy || i === 0}
                    onClick={() => move(i, -1)}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-1 disabled:opacity-30 hover:bg-accent"
                    title="Move up"
                  ><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button
                    disabled={busy || i === posts.length - 1}
                    onClick={() => move(i, 1)}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-1 disabled:opacity-30 hover:bg-accent"
                    title="Move down"
                  ><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button
                    onClick={() => setEditing(p)}
                    className="text-xs inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2.5 py-1 font-semibold"
                  ><Pencil className="h-3.5 w-3.5" /> Edit</button>
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
      {editing && (
        <EditModal
          post={editing}
          pin={pin}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      )}
    </div>
  );
}

function EditModal({ post, pin, onClose, onSaved }: { post: Post; pin: string; onClose: () => void; onSaved: () => void }) {
  const updateFn = useServerFn(adminUpdatePost);
  const [title, setTitle] = useState(post.title);
  const [text, setText] = useState(post.text || "");
  const [image, setImage] = useState<string | null | undefined>(post.image);
  const [university, setUniversity] = useState(post.university || "");
  const [course, setCourse] = useState(post.course || "");
  const [destination, setDestination] = useState(post.destination || "");
  const [flagCode, setFlagCode] = useState(post.flag_code || "");
  const [prevCourse, setPrevCourse] = useState(post.prev_course || "");
  const [prevCollege, setPrevCollege] = useState(post.prev_college || "");
  const [gender, setGender] = useState<"male" | "female">((post.gender as "male" | "female") || "male");
  const [rating, setRating] = useState<number>(post.rating ?? 5);
  const [busy, setBusy] = useState(false);
  const isSuccess = post.kind === "success";
  const isReview = post.kind === "review";
  const isAdmit = post.kind === "admit";

  const onFile = async (f?: File) => {
    if (!f) return;
    if (f.size > 2_500_000) { alert("Image too large. Use under 2.5MB."); return; }
    setImage(await fileToDataURL(f));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateFn({
        data: {
          pin,
          id: post.id,
          title: title.trim(),
          text: text.trim(),
          image: image ?? null,
          university: (isSuccess || isAdmit) ? (university.trim() || null) : undefined,
          course: isSuccess ? (course.trim() || null) : undefined,
          destination: isSuccess ? (destination.trim() || null) : undefined,
          flag_code: isSuccess ? (flagCode.trim().toLowerCase() || null) : undefined,
          prev_course: isSuccess ? (prevCourse.trim() || null) : undefined,
          prev_college: isSuccess ? (prevCollege.trim() || null) : undefined,
          gender: isSuccess ? gender : undefined,
          rating: isReview ? rating : undefined,
        },
      });
      onSaved();
    } catch (e) {
      alert("Save failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-card p-6 w-full max-w-lg space-y-3 my-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Edit {post.kind}</h3>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <Field label={(isSuccess || isReview || isAdmit) ? "Name" : "Title"}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl border border-input bg-background px-3 py-2" />
        </Field>
        {isSuccess ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Destination">
                <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
              </Field>
              <Field label="Flag Code (2 letters)">
                <input value={flagCode} onChange={(e) => setFlagCode(e.target.value)} maxLength={4} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
              </Field>
            </div>
            <Field label="Abroad University">
              <input value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
            </Field>
            <Field label="Abroad Course">
              <input value={course} onChange={(e) => setCourse(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
            </Field>
            <Field label="Indian College">
              <input value={prevCollege} onChange={(e) => setPrevCollege(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
            </Field>
            <Field label="Indian Course">
              <input value={prevCourse} onChange={(e) => setPrevCourse(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
            </Field>
            <Field label="Gender">
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button type="button" key={g} onClick={() => setGender(g)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold capitalize ${
                      gender === g ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-background border-input"
                    }`}>{g}</button>
                ))}
              </div>
            </Field>
          </>
        ) : isReview ? (
          <>
            <Field label="Stars (1-5)">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} className="text-2xl leading-none">
                    <span className={n <= rating ? "text-amber-500" : "text-muted-foreground/40"}>★</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Review Text">
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
            </Field>
          </>
        ) : isAdmit ? (
          <Field label="University / College">
            <input value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
          </Field>
        ) : (
          <Field label="Text">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full rounded-xl border border-input bg-background px-3 py-2" />
          </Field>
        )}

        <Field label="Photo">
          <label className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-3 cursor-pointer hover:border-primary">
            {image ? <img src={image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{image ? "Change" : "Upload"}</span>
            {image && <button type="button" onClick={(e) => { e.preventDefault(); setImage(null); }} className="ml-auto text-xs text-destructive">Remove</button>}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </Field>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-input py-2.5 font-semibold">Cancel</button>
          <button disabled={busy} className="flex-1 rounded-full bg-gradient-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
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
  const [rating, setRating] = useState<number>(5);
  const addFn = useServerFn(adminAddPost);

  const isSuccess = kind === "success";
  const isReview = kind === "review";
  const isAdmit = kind === "admit";

  const reset = () => {
    setTitle(""); setText(""); setImage(undefined); setActive(true);
    setUniversity(""); setCourse(""); setDestination(""); setFlagCode("");
    setPrevCourse(""); setPrevCollege(""); setGender("male"); setRating(5);
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    if (f.size > 2_500_000) { alert("Image too large. Use under 2.5MB."); return; }
    setImage(await fileToDataURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isReview && !text.trim()) return;
    if (!isSuccess && !isReview && !isAdmit && !text.trim()) return;
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
          university: (isSuccess || isAdmit) ? university.trim() || undefined : undefined,
          course: isSuccess ? course.trim() || undefined : undefined,
          destination: isSuccess ? destination.trim() || undefined : undefined,
          flag_code: isSuccess ? (flagCode.trim().toLowerCase() || undefined) : undefined,
          prev_course: isSuccess ? prevCourse.trim() || undefined : undefined,
          prev_college: isSuccess ? prevCollege.trim() || undefined : undefined,
          gender: isSuccess ? gender : undefined,
          rating: isReview ? rating : undefined,
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
        <label className="text-sm font-semibold">{(isSuccess || isReview || isAdmit) ? "Name" : "Title"}</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
          placeholder={isSuccess ? "e.g. Martin Dsouza" : isReview ? "e.g. Rishikesh" : isAdmit ? "e.g. Riya Patil" : ""}
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
      ) : isReview ? (
        <>
          <div>
            <label className="text-sm font-semibold">Stars</label>
            <div className="mt-1 flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} className="text-3xl leading-none">
                  <span className={n <= rating ? "text-amber-500" : "text-muted-foreground/40"}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Review Text</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} required maxLength={5000} rows={4}
              placeholder="Mission Career guided me step by step..."
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </>
      ) : isAdmit ? (
        <div>
          <label className="text-sm font-semibold">University / College</label>
          <input value={university} onChange={(e) => setUniversity(e.target.value)} maxLength={200}
            placeholder="TU Berlin"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
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

interface Booking {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  country: string | null;
  slot_date: string;
  slot_time: string;
  notes: string | null;
  status: string;
  mode: string;
  created_at: string;
}

function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"upcoming" | "today" | "past" | "all">("upcoming");
  const listFn = useServerFn(adminListBookings);
  const deleteFn = useServerFn(adminDeleteBooking);
  const pin = sessionStorage.getItem("mc_admin_pin") || "";

  const refresh = useCallback(async () => {
    setError("");
    try {
      const rows = await listFn({ data: { pin } });
      setBookings(rows as Booking[]);
    } catch (e) {
      setError((e as Error).message);
      setBookings([]);
    }
  }, [listFn, pin]);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("admin-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        refresh();
      })
      .subscribe();
    const interval = setInterval(refresh, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [refresh]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteFn({ data: { pin, id } });
      refresh();
    } catch (e) {
      alert("Delete failed: " + (e as Error).message);
    }
  };

  if (bookings === null) return <p className="text-sm text-muted-foreground">Loading bookings…</p>;

  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "today") return b.slot_date === todayISO;
    if (filter === "upcoming") return b.slot_date >= todayISO;
    return b.slot_date < todayISO;
  });

  // group by date
  const groups: Record<string, Booking[]> = {};
  for (const b of filtered) {
    (groups[b.slot_date] ||= []).push(b);
  }
  const dates = Object.keys(groups).sort((a, z) =>
    filter === "past" ? z.localeCompare(a) : a.localeCompare(z),
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "today", label: "Today" },
    { key: "past", label: "Past" },
    { key: "all", label: "All" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="font-bold text-lg">Counseling Bookings ({filtered.length})</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs rounded-full px-3 py-1.5 font-semibold transition ${
                filter === f.key ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary hover:bg-accent"
              }`}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No bookings in this view.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-foreground">{formatDate(date)}</h3>
                <span className="text-xs text-muted-foreground">· {groups[date].length} {groups[date].length === 1 ? "booking" : "bookings"}</span>
                {date === todayISO && <span className="text-[10px] uppercase tracking-wide bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-bold">Today</span>}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {groups[date].map((b) => (
                  <div key={b.id} className="bg-card rounded-2xl shadow-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground truncate">{b.full_name}</h4>
                        <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-0.5">
                          <Clock className="h-3.5 w-3.5" /> {b.slot_time}
                        </div>
                      </div>
                      <button onClick={() => onDelete(b.id)} className="text-xs text-destructive inline-flex items-center gap-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm">
                      {b.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <a href={`tel:${b.phone}`} className="text-primary font-medium">{b.phone}</a>
                        </div>
                      )}
                      {b.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a href={`mailto:${b.email}`} className="text-primary font-medium truncate">{b.email}</a>
                        </div>
                      )}
                      {b.country && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe2 className="h-3.5 w-3.5" /> {b.country}
                        </div>
                      )}
                    </div>
                    {b.notes && <p className="mt-3 text-xs text-foreground whitespace-pre-wrap border-t border-border pt-2">{b.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AnalyticsData {
  totals: { pageviews: number; uniqueSessions: number; liveVisitors: number; bookings: number; leads: number };
  byCountry: { k: string; v: number }[];
  byCity: { k: string; v: number }[];
  byPath: { k: string; v: number }[];
  byDevice: { k: string; v: number }[];
  byReferrer: { k: string; v: number }[];
  byHour: { k: string; v: number }[];
  liveSessions: { session_id: string; path: string; country: string | null; city: string | null; device: string | null; last_seen: string; pages: number }[];
  recentEvents: { id: string; session_id: string; path: string; referrer: string | null; country: string | null; city: string | null; device: string | null; event_type: string; created_at: string }[];
  recentBookings: { id: string; full_name: string; phone: string | null; email: string | null; country: string | null; slot_date: string; slot_time: string; mode: string; created_at: string }[];
  recentLeads: { id: string; full_name: string; phone: string | null; email: string | null; country: string | null; study_level: string | null; created_at: string }[];
}

function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [err, setErr] = useState("");
  const [hours, setHours] = useState<number>(24);
  const fn = useServerFn(adminAnalytics);
  const pin = sessionStorage.getItem("mc_admin_pin") || "";

  const refresh = useCallback(async () => {
    try {
      const r = await fn({ data: { pin, hours } });
      setData(r as AnalyticsData);
      setErr("");
    } catch (e) {
      setErr((e as Error).message);
    }
  }, [fn, pin, hours]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [refresh]);

  if (err) return <p className="text-sm text-destructive">{err}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading analytics…</p>;

  const RANGES: { h: number; label: string }[] = [
    { h: 1, label: "Last 1h" },
    { h: 24, label: "Today (24h)" },
    { h: 24 * 7, label: "7 days" },
    { h: 24 * 30, label: "30 days" },
  ];

  const maxHour = Math.max(...data.byHour.map((h) => h.v), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Live Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Auto-refreshing every 15 seconds</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {RANGES.map((r) => (
            <button
              key={r.h}
              onClick={() => setHours(r.h)}
              className={`text-xs rounded-full px-3 py-1.5 font-semibold transition ${
                hours === r.h ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary hover:bg-accent"
              }`}
            >{r.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Users} label="Live now" value={data.totals.liveVisitors} accent="text-emerald-500" pulse />
        <StatCard icon={Eye} label="Pageviews" value={data.totals.pageviews} />
        <StatCard icon={TrendingUp} label="Unique visitors" value={data.totals.uniqueSessions} />
        <StatCard icon={CalendarDays} label="Bookings" value={data.totals.bookings} accent="text-primary" />
        <StatCard icon={Inbox} label="Leads" value={data.totals.leads} accent="text-primary" />
      </div>

      {/* Live visitors table */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Currently on site ({data.liveSessions.length})
        </h3>
        {data.liveSessions.length === 0 ? (
          <p className="text-xs text-muted-foreground">No active visitors right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="text-left"><th className="py-2 pr-3">Location</th><th className="py-2 pr-3">Page</th><th className="py-2 pr-3">Device</th><th className="py-2 pr-3">Pages</th><th className="py-2 pr-3">Last seen</th></tr>
              </thead>
              <tbody>
                {data.liveSessions.map((s) => (
                  <tr key={s.session_id} className="border-t border-border">
                    <td className="py-2 pr-3">{flag(s.country)} {[s.city, s.country].filter(Boolean).join(", ") || "Unknown"}</td>
                    <td className="py-2 pr-3 font-mono text-xs truncate max-w-[220px]">{s.path}</td>
                    <td className="py-2 pr-3 capitalize">{s.device || "—"}</td>
                    <td className="py-2 pr-3">{s.pages}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{timeAgo(s.last_seen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hourly chart */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-base mb-3">Pageviews over time</h3>
        {data.byHour.length === 0 ? (
          <p className="text-xs text-muted-foreground">No data yet.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {data.byHour.map((h) => (
              <div key={h.k} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-gradient-primary rounded-t opacity-80 group-hover:opacity-100 transition" style={{ height: `${(h.v / maxHour) * 100}%`, minHeight: "2px" }} title={`${h.k}:00 — ${h.v} views`} />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
          <span>{data.byHour[0]?.k.slice(11) || ""}h</span>
          <span>{data.byHour[data.byHour.length - 1]?.k.slice(11) || ""}h</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <BarList title="Top Countries" icon={Globe2} items={data.byCountry} render={(k) => `${flag(k)} ${k}`} />
        <BarList title="Top Cities" icon={MapPin} items={data.byCity} />
        <BarList title="Top Pages" icon={Eye} items={data.byPath} mono />
        <BarList title="Traffic Sources" icon={TrendingUp} items={data.byReferrer} />
        <BarList title="Devices" icon={Smartphone} items={data.byDevice} />
      </div>

      {/* Recent form submissions */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Recent Booking Form Submissions ({data.recentBookings.length})</h3>
        {data.recentBookings.length === 0 ? (
          <p className="text-xs text-muted-foreground">No bookings in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="text-left"><th className="py-2 pr-3">Time</th><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Phone</th><th className="py-2 pr-3">Country</th><th className="py-2 pr-3">Slot</th><th className="py-2 pr-3">Mode</th></tr>
              </thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="py-2 pr-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(b.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</td>
                    <td className="py-2 pr-3 font-semibold">{b.full_name}</td>
                    <td className="py-2 pr-3"><a href={`tel:${b.phone}`} className="text-primary">{b.phone}</a></td>
                    <td className="py-2 pr-3">{flag(b.country)} {b.country || "—"}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{b.slot_date} · {b.slot_time}</td>
                    <td className="py-2 pr-3 capitalize">{b.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2"><Inbox className="h-4 w-4 text-primary" /> Recent Lead Form Submissions ({data.recentLeads.length})</h3>
        {data.recentLeads.length === 0 ? (
          <p className="text-xs text-muted-foreground">No leads in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="text-left"><th className="py-2 pr-3">Time</th><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Contact</th><th className="py-2 pr-3">Country</th><th className="py-2 pr-3">Level</th></tr>
              </thead>
              <tbody>
                {data.recentLeads.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="py-2 pr-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</td>
                    <td className="py-2 pr-3 font-semibold">{l.full_name}</td>
                    <td className="py-2 pr-3 text-xs">{l.phone || l.email || "—"}</td>
                    <td className="py-2 pr-3">{flag(l.country)} {l.country || "—"}</td>
                    <td className="py-2 pr-3">{l.study_level || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed visitor sessions with AI journey summaries */}
      <VisitorSessionsPanel hours={hours} />

      {/* Recent visitor events feed */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-base mb-3">Recent Visitor Activity</h3>
        <div className="max-h-96 overflow-y-auto divide-y divide-border">
          {data.recentEvents.slice(0, 60).map((e) => (
            <div key={e.id} className="py-2 flex items-center gap-3 text-xs">
              <span className="text-muted-foreground w-24 shrink-0">{timeAgo(e.created_at)}</span>
              <span className="w-32 shrink-0 truncate">{flag(e.country)} {[e.city, e.country].filter(Boolean).join(", ") || "Unknown"}</span>
              <span className="font-mono truncate flex-1">{e.path}</span>
              <span className="text-muted-foreground capitalize hidden sm:inline">{e.device}</span>
            </div>
          ))}
          {data.recentEvents.length === 0 && <p className="text-xs text-muted-foreground py-3">No visitor events yet.</p>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, pulse }: { icon: typeof Eye; label: string; value: number; accent?: string; pulse?: boolean }) {
  return (
    <div className="bg-card rounded-2xl shadow-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent || ""}`} /> {label}
      </div>
      <div className={`mt-2 text-3xl font-extrabold ${accent || "text-foreground"} ${pulse && value > 0 ? "animate-pulse" : ""}`}>{value}</div>
    </div>
  );
}

function BarList({ title, icon: Icon, items, render, mono }: { title: string; icon: typeof Eye; items: { k: string; v: number }[]; render?: (k: string) => React.ReactNode; mono?: boolean }) {
  const max = Math.max(...items.map((i) => i.v), 1);
  return (
    <div className="bg-card rounded-2xl shadow-card p-5">
      <h3 className="font-bold text-base mb-3 flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No data.</p>
      ) : (
        <div className="space-y-1.5">
          {items.slice(0, 10).map((it) => (
            <div key={it.k} className="relative">
              <div className="absolute inset-0 bg-primary-soft rounded" style={{ width: `${(it.v / max) * 100}%` }} />
              <div className="relative flex justify-between items-center px-2 py-1 text-xs">
                <span className={`truncate ${mono ? "font-mono" : ""}`}>{render ? render(it.k) : it.k}</span>
                <span className="font-semibold ml-2">{it.v}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function flag(code: string | null | undefined) {
  if (!code || code.length !== 2) return "🌐";
  const c = code.toUpperCase();
  return String.fromCodePoint(...[...c].map((x) => 127397 + x.charCodeAt(0)));
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

