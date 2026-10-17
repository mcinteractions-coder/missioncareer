import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Heart, Lock, Plus, Sparkles, Trash2, Trophy } from "lucide-react";
import { listCallerMeetings, addCallerMeeting, deleteCallerMeeting } from "@/lib/callers.functions";
import { REWARD_TIERS, rewardMonths } from "@/lib/rewards";
import chocolate from "@/assets/rewards/chocolate.png";
import ramen from "@/assets/rewards/ramen.png";
import earbuds from "@/assets/rewards/earbuds.png";
import smartwatch from "@/assets/rewards/smartwatch.png";

const CALLERS = ["Akshara Ravidas", "Kamakshi Gaur"] as const;
type Caller = (typeof CALLERS)[number];
const IMAGES = [chocolate, ramen, earbuds, smartwatch];
const EMOJI: Record<Caller, string> = { "Akshara Ravidas": "🦋", "Kamakshi Gaur": "🌸" };

type Row = { id: string; caller: string; student_name: string; student_phone: string; created_at: string };

const monthLabel = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

export function CallerRewards() {
  const pin = typeof window !== "undefined" ? sessionStorage.getItem("mc_admin_pin") ?? "" : "";
  const months = useMemo(() => rewardMonths(), []);
  const [month, setMonth] = useState(months[months.length - 1]);
  const [rows, setRows] = useState<Row[]>([]);
  const list = useServerFn(listCallerMeetings);
  const add = useServerFn(addCallerMeeting);
  const del = useServerFn(deleteCallerMeeting);

  const load = useCallback(async () => {
    try {
      setRows((await list({ data: { pin, month } })) as Row[]);
    } catch {
      setRows([]);
    }
  }, [list, pin, month]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="rewards-theme rounded-3xl bg-background p-4 md:p-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" /> Caller Rewards
        </div>
        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-foreground">Meeting Rewards 💜</h2>
        <p className="text-muted-foreground mt-1">Bring meetings, unlock goodies every month!</p>
      </div>

      <div className="flex gap-2 overflow-x-auto justify-center pb-1">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              m === month ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-foreground hover:bg-primary/10"
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {CALLERS.map((c) => (
          <CallerCard
            key={c}
            caller={c}
            rows={rows.filter((r) => r.caller === c)}
            onAdd={async (name, phone) => {
              await add({ data: { pin, month, caller: c, student_name: name, student_phone: phone } });
              await load();
            }}
            onDelete={async (id) => {
              await del({ data: { pin, id } });
              await load();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CallerCard({
  caller,
  rows,
  onAdd,
  onDelete,
}: {
  caller: Caller;
  rows: Row[];
  onAdd: (name: string, phone: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pop, setPop] = useState(false);
  const count = rows.length;
  const next = REWARD_TIERS.find((t) => count < t.at);
  const pct = Math.min(100, (count / 20) * 100);

  return (
    <div className="rounded-3xl bg-card border border-border p-5 md:p-6 shadow-lg space-y-5">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">{EMOJI[caller]}</div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-lg text-foreground truncate">{caller}</p>
          <p className="text-xs text-muted-foreground">
            {next ? `${next.at - count} more for ${next.name}` : "All rewards unlocked! 🎉"}
          </p>
        </div>
        <div
          className={`relative h-20 w-20 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-lg transition-transform ${pop ? "scale-125" : ""}`}
        >
          <Heart className="absolute -top-1 -right-1 h-6 w-6 fill-accent text-accent" />
          <span className="text-3xl font-black leading-none">{count}</span>
          <span className="text-[10px] font-semibold opacity-80">meetings</span>
        </div>
      </div>

      <div>
        <div className="h-3 rounded-full bg-primary/15 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {REWARD_TIERS.map((t, i) => {
            const got = count >= t.at;
            return (
              <div
                key={t.at}
                className={`relative rounded-2xl p-2 text-center border transition ${got ? "border-primary bg-primary/10" : "border-border bg-background opacity-60"}`}
              >
                <img src={IMAGES[i]} alt={t.name} loading="lazy" width={816} height={816} className={`mx-auto h-14 w-14 object-contain ${got ? "" : "grayscale"}`} />
                <p className="text-[11px] font-bold text-foreground mt-1 leading-tight">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.at} meetings</p>
                {got ? (
                  <Trophy className="absolute top-1 right-1 h-4 w-4 text-primary" />
                ) : (
                  <Lock className="absolute top-1 right-1 h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim() || phone.replace(/\D/g, "").length < 6) {
            setErr("Student name and valid number required");
            return;
          }
          setBusy(true);
          setErr("");
          try {
            await onAdd(name.trim(), phone.trim());
            setName("");
            setPhone("");
            setPop(true);
            setTimeout(() => setPop(false), 400);
          } catch {
            setErr("Could not save, try again");
          } finally {
            setBusy(false);
          }
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" maxLength={120} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" inputMode="tel" maxLength={20} className="sm:w-40 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        <button disabled={busy} className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      {err && <p className="text-xs text-destructive -mt-3">{err}</p>}

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {rows.length === 0 && <li className="text-center text-sm text-muted-foreground py-4">No meetings yet this month ✨</li>}
        {rows.map((r, i) => (
          <li key={r.id} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2">
            <span className="h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{rows.length - i}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{r.student_name}</p>
              <p className="text-xs text-muted-foreground">{r.student_phone}</p>
            </div>
            <button
              onClick={() => confirm("Delete this entry?") && onDelete(r.id)}
              aria-label="Delete entry"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
