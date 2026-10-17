import { useState } from "react";
import { X } from "lucide-react";

const STEPS = [
  { item: "🍜", itemLabel: "Ramen", target: "🍳", targetLabel: "Pan", hint: "Ramen ko utha ke pan mein daalo" },
  { item: "💧", itemLabel: "Pani", target: "🍳", targetLabel: "Pan", hint: "Pan mein pani daalo" },
  { item: "🍳", itemLabel: "Pan", target: "🔥", targetLabel: "Gas", hint: "Pan ko utha ke gas pe rakho" },
  { item: "🧂", itemLabel: "Masala", target: "🍲", targetLabel: "Pan on gas", hint: "Upar se masala daalo" },
];

export function RamenVerify({
  studentName,
  onClose,
  onVerify,
}: {
  studentName: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const done = step >= STEPS.length;
  const s = STEPS[Math.min(step, STEPS.length - 1)];

  const drop = () => {
    setPicked(false);
    setStep((x) => x + 1);
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="rewards-theme w-full max-w-md rounded-3xl bg-background border border-border p-6 shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">Verify entry</p>
            <p className="font-extrabold text-lg text-foreground">{studentName}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-primary/15"}`} />
          ))}
        </div>

        {!done ? (
          <>
            <p className="text-center text-sm font-semibold text-foreground">Step {step + 1}: {s.hint} 🍜</p>
            <div className="flex items-center justify-around py-4">
              <button
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("text", "x"); setPicked(true); }}
                onClick={() => setPicked((p) => !p)}
                className={`flex flex-col items-center rounded-2xl p-4 transition cursor-grab ${picked ? "bg-primary/20 scale-110 ring-2 ring-primary" : "bg-card"}`}
              >
                <span className="text-5xl">{s.item}</span>
                <span className="text-xs font-bold text-foreground mt-1">{s.itemLabel}</span>
              </button>
              <span className="text-2xl text-muted-foreground">→</span>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); drop(); }}
                onClick={() => picked && drop()}
                className={`flex flex-col items-center rounded-2xl p-4 border-2 border-dashed transition ${picked ? "border-primary bg-primary/10 cursor-pointer" : "border-border"}`}
              >
                <span className="text-5xl">{s.target}</span>
                <span className="text-xs font-bold text-foreground mt-1">{s.targetLabel}</span>
              </div>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">Drag karo, ya pehle item pe tap karke phir target pe tap karo</p>
          </>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setErr("");
              try {
                await onVerify(code);
              } catch {
                setErr("Galat code 🙈");
              } finally {
                setBusy(false);
              }
            }}
          >
            <p className="text-center text-4xl">🍲✨</p>
            <p className="text-center text-sm font-semibold text-foreground">Ramen ready! Ab code daalo</p>
            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={10}
              placeholder="Code"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center text-lg tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {err && <p className="text-center text-xs text-destructive">{err}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-primary py-2 font-bold text-primary-foreground disabled:opacity-60">Verify</button>
          </form>
        )}
      </div>
    </div>
  );
}
