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
      className="ganpati-floating-control fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110 active:scale-95"
    >
      <span
        className="absolute inset-0 rounded-full bg-primary-glow opacity-60 animate-ping"
        style={{ animationDuration: "2.5s" }}
      />
      <MessageCircle className="relative h-7 w-7" fill="currentColor" />
    </a>
  );
}
