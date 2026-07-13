import { useEffect, useState } from "react";
import { Gift, Sparkles, X, ArrowRight, MessageCircle } from "lucide-react";

const STORAGE_KEY = "mc_discount_popup_v1";
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

function trackPopupEvent(event_type: string) {
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
      }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;
    const already = localStorage.getItem(STORAGE_KEY);
    if (already) return;
    setOpen(true);
    trackPopupEvent("discount_popup_shown");
  }, []);

  const handleReveal = () => {
    trackPopupEvent("discount_reveal_click");
    setRevealed(true);
    localStorage.setItem(STORAGE_KEY, "revealed");
  };

  const handleClose = () => {
    trackPopupEvent("discount_popup_dismiss");
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setOpen(false);
  };

  const handleWhatsAppClick = () => {
    trackPopupEvent("discount_whatsapp_click");
    localStorage.setItem(STORAGE_KEY, "whatsapp");
    setOpen(false);
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/70 hover:bg-background transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

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
          <p className="text-sm text-muted-foreground mb-5">
            An exclusive discount is waiting for you on our study-abroad services.
          </p>

          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Gift className="w-5 h-5" />
              Reveal My Discount
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full py-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary text-primary font-extrabold text-lg tracking-wide">
              🎉 20% OFF – Code: MC20
            </div>
          )}

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" fill="currentColor" />
            Talk to us on WhatsApp
          </a>

          <p className="text-[11px] text-muted-foreground/80 mt-3 italic">
            Limited time offer for new students.
          </p>

          <button
            onClick={handleClose}
            className="mt-3 w-full py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition"
          >
            Close the offer & continue to website
          </button>
        </div>
      </div>
    </div>
  );
}
