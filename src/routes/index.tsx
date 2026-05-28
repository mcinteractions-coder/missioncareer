import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Destinations } from "@/components/sections/Destinations";
import { Process } from "@/components/sections/Process";
import { Success } from "@/components/sections/Success";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
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
      <FestivalPopup />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Destinations />
      <Process />
      <Success />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
