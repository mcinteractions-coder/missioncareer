import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { UniversityMarquee } from "@/components/sections/UniversityMarquee";
import { ScrollReveal } from "@/components/ScrollReveal";

// Lazy-load below-the-fold sections to speed up initial render
const About = lazy(() => import("@/components/sections/About").then(m => ({ default: m.About })));
const Services = lazy(() => import("@/components/sections/Services").then(m => ({ default: m.Services })));
const Destinations = lazy(() => import("@/components/sections/Destinations").then(m => ({ default: m.Destinations })));
const WorldMap = lazy(() => import("@/components/sections/WorldMap").then(m => ({ default: m.WorldMap })));
const Process = lazy(() => import("@/components/sections/Process").then(m => ({ default: m.Process })));
const Success = lazy(() => import("@/components/sections/Success").then(m => ({ default: m.Success })));
const Blog = lazy(() => import("@/components/sections/Blog").then(m => ({ default: m.Blog })));
const Deadlines = lazy(() => import("@/components/sections/Deadlines").then(m => ({ default: m.Deadlines })));
const Globe3D = lazy(() => import("@/components/sections/Globe3D").then(m => ({ default: m.Globe3D })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));
const Reviews = lazy(() => import("@/components/sections/Reviews").then(m => ({ default: m.Reviews })));
const Booking = lazy(() => import("@/components/sections/Booking").then(m => ({ default: m.Booking })));
const TodaysMeetings = lazy(() => import("@/components/sections/TodaysMeetings").then(m => ({ default: m.TodaysMeetings })));
const Footer = lazy(() => import("@/components/sections/Footer").then(m => ({ default: m.Footer })));
const FestivalPopup = lazy(() => import("@/components/FestivalPopup").then(m => ({ default: m.FestivalPopup })));

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

const Fallback = () => <div className="min-h-[200px]" />;

function Index() {
  return (
    <main>
      <ScrollReveal />
      <Navbar />
      <Hero />
      <UniversityMarquee />
      <Suspense fallback={<Fallback />}>
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
      </Suspense>
    </main>
  );
}
