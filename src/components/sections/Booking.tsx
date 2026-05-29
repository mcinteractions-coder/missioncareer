import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, Sparkles, User, Mail, Phone, Globe2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM",
];

function getNextDays(count: number) {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let i = 0;
  while (days.length < count) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // skip Sundays (By Appointment)
    if (d.getDay() !== 0) days.push(d);
    i++;
  }
  return days;
}

const toISO = (d: Date) => d.toISOString().slice(0, 10);

export function Booking() {
  const days = useMemo(() => getNextDays(10), []);
  const [date, setDate] = useState<Date>(days[0]);
  const [time, setTime] = useState<string>("");
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("slot_time")
        .eq("slot_date", toISO(date));
      if (!alive) return;
      setTaken(new Set((data ?? []).map((r: { slot_time: string }) => r.slot_time)));
      setTime("");
    })();
    return () => { alive = false; };
  }, [date]);

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
    };
    if (!payload.full_name || !payload.phone) {
      setError("Name and phone are required."); return;
    }
    if (!payload.email && !payload.phone) {
      setError("Please provide either email or phone so we can reach you."); return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("bookings").insert(payload);
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
    <section id="booking" className="relative py-16 md:py-28 overflow-hidden bg-background">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" /> 100% Free · No obligation
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Book Your <span className="text-gradient">Free Counseling</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            Pick a date, choose a time — our expert counselor will call you. It's that simple.
          </p>
        </div>

        {done ? (
          <div className="max-w-xl mx-auto bg-card rounded-3xl shadow-card p-10 text-center border border-border">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-extrabold">You're booked! 🎉</h3>
            <p className="mt-2 text-muted-foreground">
              See you on <span className="font-semibold text-foreground">{date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span> at <span className="font-semibold text-foreground">{time}</span>.
              <br />Our counselor will reach out shortly to confirm.
            </p>
            <button onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-primary hover:underline">
              Book another slot
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Left: date + time picker */}
            <div className="lg:col-span-3 bg-card rounded-3xl shadow-card p-5 md:p-7 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Select a date</h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {days.map((d) => {
                  const active = toISO(d) === toISO(date);
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => setDate(d)}
                      className={`snap-start shrink-0 w-[78px] rounded-2xl px-3 py-3 text-center transition-all border ${
                        active
                          ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow scale-105"
                          : "bg-secondary text-foreground border-border hover:border-primary/40 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wide opacity-80">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                      <div className="text-2xl font-extrabold leading-tight">{d.getDate()}</div>
                      <div className="text-[10px] opacity-80">{d.toLocaleDateString(undefined, { month: "short" })}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-7 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Pick a time slot</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SLOTS.map((s) => {
                  const isTaken = taken.has(s);
                  const active = time === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setTime(s)}
                      className={`relative rounded-xl px-3 py-3 text-sm font-semibold border transition-all ${
                        isTaken
                          ? "bg-muted text-muted-foreground line-through border-border cursor-not-allowed opacity-60"
                          : active
                            ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                            : "bg-secondary text-foreground border-border hover:border-primary/50 hover:-translate-y-0.5"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/40 mr-1.5 align-middle" /> Greyed = already booked
              </p>
            </div>

            {/* Right: details form */}
            <form onSubmit={onSubmit} className="lg:col-span-2 bg-card rounded-3xl shadow-card p-5 md:p-7 border border-border space-y-3">
              <h3 className="font-bold text-lg mb-1">Your details</h3>
              <div className="text-xs text-muted-foreground mb-3">
                {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                {time && <> · <span className="text-primary font-semibold">{time}</span></>}
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input name="full_name" required maxLength={120} placeholder="Full name" className="w-full rounded-xl border border-border bg-secondary pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input name="email" type="email" maxLength={200} placeholder="Email (optional)" className="w-full rounded-xl border border-border bg-secondary pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input name="phone" type="tel" required maxLength={30} placeholder="Phone (+91...)" className="w-full rounded-xl border border-border bg-secondary pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select name="country" defaultValue="" className="w-full rounded-xl border border-border bg-secondary pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option value="">Preferred country (optional)</option>
                  {["USA","UK","Canada","Australia","Germany","Ireland","New Zealand"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <textarea name="notes" rows={3} maxLength={1000} placeholder="Anything we should know? (optional)" className="w-full rounded-xl border border-border bg-secondary px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button disabled={busy || !time} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</> : <>Confirm booking</>}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">By booking, you agree to be contacted by our counselor.</p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
