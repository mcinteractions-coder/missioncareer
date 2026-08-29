import { Facebook, Instagram, Linkedin, Twitter, ArrowUp, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
const logoAsset = { url: "/mission-logo-transparent.png" };

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-10 md:pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div>
            <div className="inline-block">
              <img src={logoAsset.url} alt="Mission Career" className="h-12 w-auto drop-shadow-sm" draggable={false} />
            </div>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Helping students achieve their dream of studying abroad with expert counseling and complete admission support.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Facebook, label: "Share on Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://www.missioncareer.net" },
                { Icon: Twitter, label: "Share on Twitter", href: "https://twitter.com/intent/tweet?url=https://www.missioncareer.net&text=Study%20Abroad%20with%20Mission%20Career" },
                { Icon: Linkedin, label: "Share on LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://www.missioncareer.net" },
                { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/" },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="h-10 w-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-lg mb-6">Quick Links</p>
            <ul className="space-y-3 text-sm text-background/70">
              {[["Mission Career Home","#home"],["About Our Consultancy","#about"],["Counseling Services","#services"],["Study Destinations","#destinations"],["Admission Process","#process"],["Book a Free Session","#contact"]].map(([l,h]) => (
                <li key={l}><a href={h} className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-lg mb-6">Top Destinations</p>
            <ul className="space-y-3 text-sm text-background/70">
              {["Canada","UK","Australia","Germany","USA"].map((c) => (
                <li key={c}><a href="#destinations" className="hover:text-primary transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-lg mb-6">Contact Us</p>
            <div className="space-y-6 text-sm text-background/70">
              <div className="leading-relaxed">
                📍&nbsp;&nbsp;&nbsp;28 Bldg No-27, Thakur Village Rd, Evershine Millennium Paradise, Evershine Nagar, Kandivali East, Mumbai, Maharashtra 400101
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+919870003748" className="hover:text-primary transition-colors font-medium">+91 9870003748</a>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:mcinteractions@gmail.com" className="hover:text-primary transition-colors font-medium">mcinteractions@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">© 2026. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-background/10 hover:bg-primary px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Lock className="h-4 w-4" /> Admin
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full bg-background/10 hover:bg-primary px-4 py-2 text-sm font-semibold transition-colors"
            >
              <span>Back to Top</span> <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
