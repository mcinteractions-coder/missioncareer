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
import { RakhiAmbience, RakhiBanner, RakhiDivider, RakhiSection } from "@/components/RakhiTheme";



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
  const sections = [
    <About key="about" />,
    <Services key="services" />,
    <Destinations key="destinations" />,
    <WorldMap key="worldmap" />,
    <Globe3D key="globe" />,
    <Reviews key="reviews" />,
    <Process key="process" />,
    <Success key="success" />,
    <DocumentGrader key="grader" />,
    <Deadlines key="deadlines" />,
    <Blog key="blog" />,
    <DreamCard key="dreamcard" />,
    <TodaysMeetings key="meetings" />,
    <Contact key="contact" />,
  ];

  return (
    <main className="relative">
      <RakhiAmbience />
      <div className="relative z-10">
        <ScrollReveal />
        <RakhiBanner />
        <RakhiSection><Navbar /></RakhiSection>
        <RakhiSection><Hero /></RakhiSection>
        <RakhiSection><UniversityMarquee /></RakhiSection>
        <FestivalPopup />
        {sections.map((s, i) => (
          <div key={s.key ?? i}>
            <RakhiDivider />
            <div data-reveal>
              <RakhiSection>{s}</RakhiSection>
            </div>
          </div>
        ))}
        <RakhiDivider />
        <RakhiSection><Footer /></RakhiSection>
      </div>
    </main>
  );
}
