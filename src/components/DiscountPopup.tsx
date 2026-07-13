import { useEffect, useState } from "react";
import { Gift, Sparkles, ArrowRight, MessageCircle } from "lucide-react";

const SESSION_KEY = "mc_session_id";
const PHONE = "919870003748";
const WHATSAPP_MSG = encodeURIComponent(
  "Hi Mission Career! I'd like to know more about studying abroad."
);
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${WHATSAPP_MSG}`;

function getSessionId() {
  if (typeof window === "undefined") return null;
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function trackPopupEvent(event_type: string, metadata?: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    const sid = getSessionId();
    if (!sid) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        session_id: sid,
        path: window.location.pathname,
        referrer: document.referrer || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        event_type,
        metadata,
      }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;
    setOpen(true);
    trackPopupEvent("discount_popup_shown");
  }, []);

  const isValidPhone = (v: string) => /^\d{10}$/.test(v.replace(/\D/g, ""));

  const handleReveal = () => {
    const cleaned = phone.replace(/\D/g, "");
    if (!isValidPhone(cleaned)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    trackPopupEvent("discount_phone_submit", { phone: cleaned });
    trackPopupEvent("discount_reveal_click", { phone: cleaned });
    setRevealed(true);
  };

  const handleClose = () => {
    trackPopupEvent("discount_popup_dismiss");
    setOpen(false);
  };

  const handleWhatsAppClick = () => {
    const cleaned = phone.replace(/\D/g, "");
    trackPopupEvent("discount_whatsapp_click", cleaned ? { phone: cleaned } : undefined);
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        <div className="relative h-28 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <Sparkles className="absolute top-3 left-6 w-6 h-6 text-white" />
            <Sparkles className="absolute top-10 right-10 w-4 h-4 text-white" />
            <Sparkles className="absolute bottom-3 left-24 w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-background border-4 border-primary flex items-center justify-center">
            <Gift className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="pt-10 px-6 pb-6 text-center">
          <h3 className="text-xl font-bold mb-2">Unlock Your Special Offer</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your phone number to reveal an exclusive discount on our study-abroad services.
          </p>

          {!revealed ? (
            <>
              <div className="flex items-stretch gap-2 mb-1 text-left">
                <span className="inline-flex items-center px-3 rounded-lg border border-border bg-muted text-sm font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (error) setError("");
                  }}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {error && (
                <p className="text-[11px] text-red-500 text-left mb-1">{error}</p>
              )}

              <button
                onClick={handleReveal}
                disabled={!isValidPhone(phone)}
                className="mt-3 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Gift className="w-5 h-5" />
                Reveal My Discount
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full py-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary text-primary font-extrabold text-lg tracking-wide">
              🎉 20% OFF – Code: MC20
            </div>
          )}

          <button
            onClick={handleWhatsAppClick}
            className="mt-3 w-full py-2.5 rounded-xl border border-[#25D366]/40 text-[#25D366] font-semibold text-sm hover:bg-[#25D366]/10 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" fill="currentColor" />
            Talk to us on WhatsApp instead
          </button>

          <button
            onClick={handleClose}
            className="mt-2 w-full py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition"
          >
            Lose the offer & continue to website
          </button>

          <p className="text-[11px] text-muted-foreground/80 mt-3 italic">
            Limited time offer for new students.
          </p>
        </div>
      </div>
    </div>
  );
}
