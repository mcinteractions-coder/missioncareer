import { useRef, useState } from "react";
import { Download, Share2, Sparkles } from "lucide-react";
import { KundanRakhi, RakhiMandala } from "@/components/RakhiTheme";

const RELATIONS = [
  { key: "sister", label: "Meri behen ke liye", promise: "Main tumhare sapno ki raksha karunga — har kadam, har desh, har imtihaan tak." },
  { key: "brother", label: "Mere bhai ke liye", promise: "Main tumhare sapno ki raksha karungi — har kadam, har desh, har imtihaan tak." },
];

export function PromiseCard() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rel, setRel] = useState(RELATIONS[0].key);
  const [made, setMade] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const promise = RELATIONS.find((r) => r.key === rel)?.promise ?? RELATIONS[0].promise;

  const download = async () => {
    if (!cardRef.current) return;
    const { toPng } = await import("html-to-image");
    const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `rakhi-promise-${to || "card"}.png`;
    a.click();
  };

  const share = () => {
    const text = `${promise}\n\n— ${from || "Tumhara apna"}, for ${to || "you"} 🪢\n\nMade with Mission Career — https://www.missioncareer.net`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="promise" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <span className="inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs md:text-sm font-semibold text-primary mb-3">Raksha Bandhan Special</span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Rakhi <span className="rb-gold-text">Promise Card</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            Apne bhai ya behen ka naam daalo aur ek beautiful card banao — download karo ya WhatsApp pe bhejo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start max-w-5xl mx-auto">
          {/* form */}
          <div className="bg-card rounded-2xl md:rounded-3xl p-5 md:p-7 rb-zari">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Yeh card kiske liye hai?</label>
                <div className="mt-2 flex gap-2">
                  {RELATIONS.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRel(r.key)}
                      className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition ${
                        rel === r.key ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Unka naam</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Ananya"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Aapka naam</label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Rohan"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => setMade(true)}
                className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition"
              >
                <Sparkles className="h-4 w-4" /> Tie the Promise
              </button>

              {made && (
                <div className="flex flex-wrap gap-2.5">
                  <button onClick={download} className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-card px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft transition">
                    <Download className="h-4 w-4" /> Download PNG
                  </button>
                  <button onClick={share} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.03]"
                    style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
                    <Share2 className="h-4 w-4" /> Share on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* card preview */}
          <div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-7 md:p-9 text-center rb-zari ${made ? "rb-knot-tie" : ""}`}
            style={{ background: "linear-gradient(150deg, #3d0a19 0%, #5c1026 52%, #7d1734 100%)" }}
          >
            <RakhiMandala />
            <div className="relative">
              <KundanRakhi size={82} className="rb-drift mx-auto" />
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-[#f0d78c]/80">Raksha Bandhan</p>
              <p className="mt-3 text-2xl md:text-3xl font-extrabold rb-gold-text">
                {to ? `Dear ${to}` : "Dear ___"}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm md:text-base leading-relaxed text-[#fdf8ee]">
                “{promise}”
              </p>
              <div className="mx-auto my-5 h-px w-24" style={{ background: "linear-gradient(90deg, transparent, #c9a227, transparent)" }} />
              <p className="text-sm font-semibold text-[#f0d78c]">— {from || "Tumhara apna"}</p>
              <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#f0d78c]/60">Mission Career</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
