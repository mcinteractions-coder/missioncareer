import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { UniversityMarquee } from "@/components/sections/UniversityMarquee";
import { ScrollReveal } from "@/components/ScrollReveal";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Destinations } from "@/components/sections/Destinations";
import { WorldMap } from "@/components/sections/WorldMap";
import { Process } from "@/components/sections/Process";
import { Success } from "@/components/sections/Success";

import { Blog } from "@/components/sections/Blog";
import { Deadlines } from "@/components/sections/Deadlines";
import { Globe3D } from "@/components/sections/Globe3D";
import { Contact } from "@/components/sections/Contact";
import { Reviews } from "@/components/sections/Reviews";
import { TodaysMeetings } from "@/components/sections/TodaysMeetings";
import { Footer } from "@/components/sections/Footer";
import { FestivalPopup } from "@/components/FestivalPopup";
import { DocumentGrader } from "@/components/sections/DocumentGrader";
import { DreamCard } from "@/components/sections/DreamCard";
import { IndependenceBanner, IndependenceRibbon, IndependenceAmbience, TricolorDivider, FestiveSection } from "@/components/IndependenceTheme";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Career — Study Abroad Without the Confusion" },
      { name: "description", content: "Mission Career helps you discover the best countries, universities, and scholarships with expert guidance at every step." },
      { property: "og:title", content: "Mission Career — Study Abroad Without the Confusion" },
      { property: "og:description", content: "Expert study abroad guidance — countries, universities, scholarships, visa & more." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <ScrollReveal />
      <IndependenceRibbon />
      <IndependenceAmbience />
      <Navbar />
      <IndependenceBanner />
      <Hero />
      <UniversityMarquee />
      <FestivalPopup />
      <TricolorDivider />
      <div data-reveal><FestiveSection><About /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Services /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Destinations /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><WorldMap /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Globe3D /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Reviews /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Process /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Success /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><DocumentGrader /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Deadlines /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Blog /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><DreamCard /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><TodaysMeetings /></FestiveSection></div>
      <TricolorDivider />
      <div data-reveal><FestiveSection><Contact /></FestiveSection></div>
      <TricolorDivider />
      <Footer />
    </main>

  );
}
