import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Sparkles, Loader2, PartyPopper, CheckCircle2, Zap } from "lucide-react";

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

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "reveal">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    localStorage.setItem(STORAGE_KEY, "claimed");
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
    try {
      const { error: insErr } = await supabase.from("leads").insert({
        full_name: trimmedName.slice(0, 100),
        phone: cleanPhone.slice(0, 20),
        session_id: getSessionId(),
        message: `Discount popup signup — FREE counseling session unlocked`,
      });
      if (insErr) throw insErr;
      setStep("reveal");
      localStorage.setItem(STORAGE_KEY, "claimed");
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative header */}
        <div className="relative h-28 bg-gradient-to-r from-primary via-primary/80 to-primary overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <Sparkles className="absolute top-3 left-6 w-6 h-6 text-white animate-pulse" />
            <Sparkles className="absolute top-10 right-12 w-4 h-4 text-white animate-pulse" style={{ animationDelay: "0.5s" }} />
            <Sparkles className="absolute bottom-3 left-16 w-5 h-5 text-white animate-pulse" style={{ animationDelay: "1s" }} />
            <Zap className="absolute top-5 right-24 w-5 h-5 text-white animate-pulse" style={{ animationDelay: "0.3s" }} />
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
                  Register now and get a chance to win{" "}
                  <span className="font-semibold text-primary">up to 20% OFF</span> or even
                  a <span className="font-semibold text-primary">FREE</span> counseling session
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
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground mb-1">Boom {name.split(" ")[0]}! 🎉</p>

              <div className="my-4 space-y-2">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                  Your Counselling Session is
                </div>
                <div className="text-5xl sm:text-6xl font-black text-primary animate-pulse">
                  ABSOLUTELY FREE
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                No hidden charges. No payment needed. Just pure guidance.
              </p>

              <p className="text-sm text-foreground/80 mb-5">
                Our counsellor will call you shortly on{" "}
                <span className="font-semibold">{phone}</span> to book your free session.
              </p>

              <button
                onClick={close}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <PartyPopper className="w-4 h-4" /> Awesome, thanks!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
