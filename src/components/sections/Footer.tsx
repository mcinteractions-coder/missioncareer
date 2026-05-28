import { Facebook, Instagram, Linkedin, Twitter, ArrowUp, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/mission-logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="bg-white rounded-xl p-3 inline-block">
              <img src={logo} alt="Mission Career" className="h-12 w-auto" draggable={false} />
            </div>
            <p className="mt-4 text-sm text-background/70">
              Mission Career Education helps students achieve their dream of studying abroad with expert counseling and complete admission support.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="h-9 w-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[["Home","#home"],["About","#about"],["Services","#services"],["Destinations","#destinations"],["Process","#process"]].map(([l,h]) => (
                <li key={l}><a href={h} className="hover:text-primary-glow transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Top Destinations</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {["Canada","UK","Australia","Germany","USA"].map((c) => (
                <li key={c}><a href="#destinations" className="hover:text-primary-glow transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm text-background/70">
              <div>📍 Kandivali East, Mumbai</div>
              <div>📞 <a href="tel:+919870003748" className="hover:text-primary-glow">+91 9870003748</a></div>
              <div>✉️ <a href="mailto:mcinteractions@gmail.com" className="hover:text-primary-glow">mcinteractions@gmail.com</a></div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">© 2026 Mission Career. All rights reserved.</p>
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
