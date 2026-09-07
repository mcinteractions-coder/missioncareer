import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import ganpatiArtwork from "@/assets/ganpati-festival.png";

const PETALS = Array.from({ length: 12 }, (_, index) => index);

export function GanpatiTheme() {
  useEffect(() => {
    document.body.classList.add("ganpati-active");
    return () => document.body.classList.remove("ganpati-active");
  }, []);

  return (
    <>
      <div className="ganpati-ambient" aria-hidden="true">
        <div className="ganpati-pattern" />
        <div className="ganpati-toran">
          {Array.from({ length: 15 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <img
          src={ganpatiArtwork}
          alt=""
          width={1024}
          height={1280}
          className="ganpati-corner ganpati-corner-left"
        />
        <img
          src={ganpatiArtwork}
          alt=""
          width={1024}
          height={1280}
          className="ganpati-corner ganpati-corner-right"
        />
        <div className="ganpati-petals">
          {PETALS.map((petal) => <span key={petal} />)}
        </div>
      </div>

      <section className="ganpati-welcome" aria-labelledby="ganpati-title">
        <div className="ganpati-diya" aria-hidden="true"><span /></div>
        <div className="ganpati-welcome-copy">
          <div className="ganpati-kalash-line"><span>श्री</span><i /><span>गणेशाय नमः</span><i /><span>शुभ</span></div>
          <p className="ganpati-eyebrow"><Sparkles className="h-4 w-4" /> Ganesh Chaturthi Celebration <Sparkles className="h-4 w-4" /></p>
          <h2 id="ganpati-title">Ganpati Bappa Morya</h2>
          <p>May Bappa remove every obstacle on your journey to a brighter global future.</p>
        </div>
        <div className="ganpati-idol-stage">
          <span className="ganpati-halo" />
          <img
            src={ganpatiArtwork}
            alt="Lord Ganesha blessing students on Ganesh Chaturthi"
            width={1024}
            height={1280}
            className="ganpati-idol"
          />
          <div className="ganpati-rangoli" aria-hidden="true" />
        </div>
        <div className="ganpati-diya" aria-hidden="true"><span /></div>
      </section>
    </>
  );
}

export function GanpatiDivider() {
  return (
    <div className="ganpati-divider" aria-hidden="true">
      <span className="ganpati-divider-line" />
      <span className="ganpati-modak">◆</span>
      <span className="ganpati-divider-mark">ॐ गं गणपतये नमः</span>
      <span className="ganpati-modak">◆</span>
      <span className="ganpati-divider-line" />
    </div>
  );
}