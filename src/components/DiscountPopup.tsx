import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Gift, Sparkles, Loader2, PartyPopper } from "lucide-react";

const STORAGE_KEY = "mc_discount_popup_v1";
const SESSION_KEY = "mc_session_id";

function getSessionId() {
  if (typeof window === "undefined") return null;
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function randomDiscount() {
  // 5% to 20%, in steps of 5
  const opts = [5, 10, 15, 20];
  return opts[Math.floor(Math.random() * opts.length)];
}

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "reveal">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show on admin
    if (window.location.pathname.startsWith("/admin")) return;
    const already = localStorage.getItem(STORAGE_KEY);
    if (already) return;
    const t = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const cleanPhone = phone.replace(/\s+/g, "");
    if (trimmedName.length < 2) {
      setError("Please enter your name");
      return;
    }
    if (!/^[+\d][\d]{7,14}$/.test(cleanPhone)) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    const off = randomDiscount();
    try {
      const { error: insErr } = await supabase.from("leads").insert({
        full_name: trimmedName.slice(0, 100),
        phone: cleanPhone.slice(0, 20),
        session_id: getSessionId(),
        message: `Discount popup signup — unlocked ${off}% OFF on counseling`,
      });
      if (insErr) throw insErr;
      setDiscount(off);
      setStep("reveal");
      localStorage.setItem(STORAGE_KEY, `claimed_${off}`);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-muted transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Decorative header */}
        <div className="relative h-24 bg-gradient-to-r from-primary via-primary/80 to-primary overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Sparkles className="absolute top-3 left-6 w-6 h-6 text-white animate-pulse" />
            <Sparkles className="absolute top-8 right-10 w-4 h-4 text-white animate-pulse" style={{ animationDelay: "0.5s" }} />
            <Sparkles className="absolute bottom-3 left-16 w-5 h-5 text-white animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center">
            {step === "form" ? (
              <Gift className="w-7 h-7 text-primary" />
            ) : (
              <PartyPopper className="w-7 h-7 text-primary" />
            )}
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          {step === "form" ? (
            <>
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold mb-1">Unlock Your Special Offer 🎁</h3>
                <p className="text-sm text-muted-foreground">
                  Register now and get{" "}
                  <span className="font-semibold text-primary">up to 20% OFF</span> on
                  your counseling session
                </p>
                <p className="text-[11px] text-muted-foreground/80 mt-2 italic">
                  We're only asking your number so we can send you this exclusive offer.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone number (e.g. +91 98765...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-destructive text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Please wait...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Reveal My Discount
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={close}
                  className="w-full text-[11px] text-muted-foreground hover:text-foreground transition"
                >
                  No thanks, maybe later
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground mb-2">Congratulations {name.split(" ")[0]}! 🎉</p>
              <div className="my-4">
                <div className="text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {discount}% OFF
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  on your study-abroad counseling session
                </p>
              </div>
              <p className="text-sm text-foreground/80 mb-4">
                Our counsellor will call you shortly on{" "}
                <span className="font-semibold">{phone}</span> to confirm your offer.
              </p>
              <button
                onClick={close}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                Awesome, thanks!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
