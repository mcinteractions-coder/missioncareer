import { useEffect, useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

const STORAGE_KEY = "mc_whatsapp_gate_v1";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;
    const already = localStorage.getItem(STORAGE_KEY);
    if (already) return;
    setOpen(true);
    trackPopupEvent("whatsapp_popup_shown");
  }, []);

  // Lock body scroll while the popup is open (mandatory gate)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleWhatsAppClick = () => {
    trackPopupEvent("whatsapp_button_click");
    localStorage.setItem(STORAGE_KEY, "claimed");
    setOpen(false);
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        // Mandatory gate — backdrop click does NOT close the popup
        if (e.target === e.currentTarget) trackPopupEvent("whatsapp_backdrop_click");
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* WhatsApp green header */}
        <div className="relative h-32 bg-gradient-to-r from-[#25D366] to-[#128C7E] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <MessageCircle className="absolute top-4 left-6 w-8 h-8 text-white" />
            <MessageCircle className="absolute top-12 right-10 w-5 h-5 text-white" />
            <MessageCircle className="absolute bottom-2 left-20 w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-background border-4 border-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-[#25D366]" fill="currentColor" />
          </div>
        </div>

        <div className="pt-12 px-6 pb-6 text-center">
          <h3 className="text-xl font-bold mb-2">Talk to us directly on WhatsApp</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get instant, personalised guidance from our study-abroad counsellors.
            Tap the button below to start chatting on WhatsApp right now.
          </p>

          <button
            onClick={handleWhatsAppClick}
            className="w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#22bf5a] transition flex items-center justify-center gap-2 shadow-lg"
            style={{ boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
          >
            <MessageCircle className="w-5 h-5" fill="currentColor" />
            Directly talk to us on WhatsApp
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-muted-foreground/80 mt-4 italic">
            No forms to fill — just one tap and you're chatting with us.
          </p>
        </div>
      </div>
    </div>
  );
}
