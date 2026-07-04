import { MessageCircle } from "lucide-react";

const PHONE = "919870003748";
const MSG = encodeURIComponent(
  "Hi Mission Career! I'd like to know more about studying abroad."
);

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Mission Career on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
      style={{ boxShadow: "0 8px 24px rgba(37,211,102,0.5)" }}
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"
        style={{ animationDuration: "2.5s" }}
      />
      <MessageCircle className="relative h-7 w-7" fill="currentColor" />
    </a>
  );
}
