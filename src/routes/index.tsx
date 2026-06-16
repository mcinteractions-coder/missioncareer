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
import { Booking } from "@/components/sections/Booking";
import { TodaysMeetings } from "@/components/sections/TodaysMeetings";
import { Footer } from "@/components/sections/Footer";
import { FestivalPopup } from "@/components/FestivalPopup";


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
      <Navbar />
      <Hero />
      <UniversityMarquee />
      <FestivalPopup />
      <div data-reveal><About /></div>
      <div data-reveal><Services /></div>
      <div data-reveal><Destinations /></div>
      <div data-reveal><WorldMap /></div>
      <div data-reveal><Globe3D /></div>
      <div data-reveal><Reviews /></div>
      <div data-reveal><Process /></div>
      <div data-reveal><Success /></div>
      <div data-reveal><Deadlines /></div>
      <div data-reveal><Blog /></div>
      <div data-reveal><Booking /></div>
      <div data-reveal><TodaysMeetings /></div>
      <div data-reveal><Contact /></div>
      <Footer />
    </main>
  );
}
