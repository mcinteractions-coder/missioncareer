import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, Sparkles, User, Mail, Phone, Globe2, Loader2, Building2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SLOTS = [
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM",
];

function getNextDays(count: number) {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

// Local YYYY-MM-DD (avoid UTC shift from toISOString in IST/other tz)
const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const compactSlot = (slot: string) => slot.replace(/^0/, "").replace(":00", "");

export function Booking() {
  const days = useMemo(() => getNextDays(10), []);
  const [date, setDate] = useState<Date>(days[0]);
  const [time, setTime] = useState<string>("");
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"offline" | "online">("offline");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("slot_time")
        .eq("slot_date", toISO(date))
        .eq("mode", mode);
      if (!alive) return;
      setTaken(new Set((data ?? []).map((r: { slot_time: string }) => r.slot_time)));
      setTime("");
    })();
    return () => { alive = false; };
  }, [date, mode]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!time) { setError("Please pick a time slot."); return; }
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      full_name: String(f.get("full_name") || "").trim(),
      email: String(f.get("email") || "").trim(),
      phone: String(f.get("phone") || "").trim(),
      country: String(f.get("country") || "").trim() || null,
      notes: String(f.get("notes") || "").trim() || null,
      slot_date: toISO(date),
      slot_time: time,
      mode,
    };
    if (!payload.full_name || !payload.phone) {
      setError("Name and phone are required."); return;
    }
    if (!payload.email && !payload.phone) {
      setError("Please provide either email or phone so we can reach you."); return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("bookings").insert(payload as any);
    setBusy(false);
    if (err) {
      if (err.code === "23505") setError("Oops! Someone just grabbed that slot. Pick another.");
      else setError(err.message);
      return;
    }
    setDone(true);
    form.reset();
  };

  return (
    <section id="booking" className="relative overflow-x-clip bg-gradient-hero py-12 sm:py-16 md:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-10">
          <span className="mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5 shrink-0" /> 100% Free · No obligation
          </span>
          <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            Book Your <span className="text-gradient">Free Counseling</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pick a date, choose a time — our expert counselor will call you.
          </p>
        </div>

        {done ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-border bg-card p-6 text-center shadow-card sm:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow sm:h-16 sm:w-16">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground sm:h-8 sm:w-8" />
            </div>
            <p className="text-xl font-extrabold tracking-normal sm:text-2xl">You're booked! 🎉</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              See you on <span className="font-semibold text-foreground">{date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span> at <span className="font-semibold text-foreground">{time}</span>.
              <br />Our counselor will reach out shortly to confirm.
            </p>
            <button type="button" onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-primary hover:underline">
              Book another slot
            </button>
          </div>
        ) : (
          <div className="mx-auto grid w-full min-w-0 max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
            <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-border bg-card shadow-card">
              <div className="bg-gradient-primary px-4 py-4 text-primary-foreground sm:px-6 sm:py-5">
                <div className="flex items-center gap-2 text-sm font-semibold opacity-95">
                  <CalendarDays className="h-4 w-4 shrink-0" /> Counseling slot
                </div>
                <div className="mt-2 text-2xl font-extrabold leading-tight tracking-normal sm:text-3xl">
                  {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </div>
                <div className="mt-1 text-sm font-medium opacity-90">{time ? compactSlot(time) : "Choose a time"}</div>
              </div>

              <div className="space-y-6 p-4 sm:p-6">
                <div className="flex gap-2 rounded-2xl border border-border bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setMode("offline")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                      mode === "offline"
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building2 className="h-4 w-4" /> Offline Counseling
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("online")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                      mode === "online"
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Video className="h-4 w-4" /> Online Counseling
                  </button>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-base font-extrabold tracking-normal sm:text-lg">Select a date</p>
                  </div>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {days.map((d) => {
                      const active = toISO(d) === toISO(date);
                      return (
                        <button
                          key={d.toISOString()}
                          type="button"
                          onClick={() => setDate(d)}
                          className={`min-w-0 rounded-2xl border px-1 py-2.5 text-center transition-all sm:py-3 ${
                            active
                              ? "scale-[1.03] border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                              : "border-border bg-secondary text-foreground hover:border-primary/40 hover:-translate-y-0.5"
                          }`}
                        >
                          <div className="truncate text-[10px] font-bold uppercase opacity-80">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                          <div className="text-2xl font-extrabold leading-none tracking-normal sm:text-3xl">{d.getDate()}</div>
                          <div className="mt-1 truncate text-[10px] font-medium opacity-80">{d.toLocaleDateString(undefined, { month: "short" })}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-base font-extrabold tracking-normal sm:text-lg">Pick a time slot</p>
                  </div>
                  <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                    {SLOTS.map((s) => {
                      const isTaken = taken.has(s);
                      const active = time === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setTime(s)}
                          className={`min-w-0 rounded-2xl border px-2 py-3 text-center text-[13px] font-bold leading-none transition-all sm:text-sm ${
                            isTaken
                              ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-60"
                              : active
                                ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                                : "border-border bg-secondary text-foreground hover:border-primary/50 hover:-translate-y-0.5"
                          }`}
                        >
                          <span className="block truncate">{compactSlot(s)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-muted-foreground/40 align-middle" /> Greyed = already booked
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="w-full min-w-0 space-y-3 overflow-hidden rounded-[28px] border border-border bg-card p-4 shadow-card sm:p-6">
              <div>
                <p className="text-lg font-extrabold tracking-normal">Your details</p>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                  {time && <> · <span className="font-semibold text-primary">{compactSlot(time)}</span></>}
                </div>
              </div>

              <div className="relative min-w-0">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="full_name" required maxLength={120} placeholder="Full name" className="h-12 w-full min-w-0 rounded-2xl border border-border bg-secondary pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
              </div>
              <div className="relative min-w-0">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="email" type="email" maxLength={200} placeholder="Email (optional)" className="h-12 w-full min-w-0 rounded-2xl border border-border bg-secondary pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
              </div>
              <div className="relative min-w-0">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="phone" type="tel" required maxLength={30} placeholder="Phone (+91...)" className="h-12 w-full min-w-0 rounded-2xl border border-border bg-secondary pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
              </div>
              <div className="relative min-w-0">
                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select name="country" defaultValue="" className="h-12 w-full min-w-0 appearance-none rounded-2xl border border-border bg-secondary pl-10 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm">
                  <option value="">Preferred country (optional)</option>
                  {["USA","UK","Canada","Australia","Germany","Ireland","New Zealand"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <textarea name="notes" rows={3} maxLength={1000} placeholder="Anything we should know? (optional)" className="w-full min-w-0 resize-none rounded-2xl border border-border bg-secondary px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button disabled={busy || !time} className="inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 sm:text-base">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</> : <>Confirm booking</>}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">By booking, you agree to be contacted by our counselor.</p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
