import durgaArtwork from "@/assets/navratri-durga.jpg";
import { Flower2, Sparkles } from "lucide-react";

function Diya() {
  return <span className="navratri-diya"><span className="navratri-flame" /><span className="navratri-diya-bowl" /></span>;
}

export function NavratriBanner() {
  return (
    <section className="navratri-banner" aria-label="Navratri wishes from Mission Career">
      <img className="navratri-artwork" src={durgaArtwork} alt="Maa Durga with her lion, surrounded by marigold garlands and glowing diyas for Navratri" width={1536} height={1024} fetchPriority="high" />
      <div className="navratri-banner-copy">
        <p className="navratri-eyebrow"><Sparkles size={16} aria-hidden="true" /> MISSION CAREER CELEBRATES</p>
        <h2>Shubh<br />Navratri</h2>
        <p className="navratri-hindi" lang="hi">जय माता दी</p>
        <p className="navratri-wishes">Nine nights of devotion.<br />A world of new beginnings.</p>
        <div className="navratri-lights" aria-hidden="true"><Diya /><Flower2 size={24} /><Diya /></div>
      </div>
    </section>
  );
}

export function NavratriDivider() {
  return (
    <div className="navratri-divider" aria-hidden="true">
      <span className="navratri-divider-line" />
      <Flower2 className="navratri-flower" size={20} />
      <Diya />
      <span className="navratri-dandiya"><i /><i /></span>
      <Diya />
      <Flower2 className="navratri-flower" size={20} />
      <span className="navratri-divider-line" />
    </div>
  );
}

export function NavratriPetals() {
  return <div className="navratri-petals" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div>;
}