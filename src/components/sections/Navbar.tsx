import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/mission-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "Success Stories", href: "#success" },
  { label: "Book Slot", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-card py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2 group shrink-0">
          <div className="relative rounded-2xl bg-white/90 backdrop-blur-sm px-2 py-1.5 shadow-soft border border-white/20 group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
            <img src={logo} alt="Mission Career" className="h-9 md:h-10 w-auto object-contain" draggable={false} />
          </div>
          <span className="hidden sm:block text-base md:text-lg font-bold leading-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent whitespace-nowrap">
            Mission Career
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-2.5 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors group whitespace-nowrap"
            >
              {l.label}
              <span className="absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a
            href="#booking"
            className="inline-flex items-center rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow whitespace-nowrap"
          >
            Free Counseling
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-md text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border mt-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-foreground/80 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Free Counseling
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
