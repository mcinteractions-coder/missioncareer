import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import smartTvLegacyCss from "../smart-tv-legacy.css?raw";
import { ChatBot } from "@/components/ChatBot";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Mission Career",
  alternateName: "Mission Career Education",
  description:
    "Mumbai-based study-abroad consultancy helping students get admission, visas and scholarships across 20+ countries.",
  url: "https://www.missioncareer.net",
  logo: "https://www.missioncareer.net/mission-logo-transparent.png",
  image: "https://www.missioncareer.net/mission-logo.png",
  telephone: "+91-9870003748",
  email: "mcinteractions@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kandivali East",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "17:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/missioncareer",
    "https://www.facebook.com/missioncareer",
  ],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which countries does Mission Career help students study in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We help students study abroad in USA, UK, Canada, Australia, Germany, Ireland, New Zealand, Italy, France, Spain, Netherlands, Sweden, Singapore, Japan, South Korea, UAE and 15+ more destinations.",
      },
    },
    {
      "@type": "Question",
      name: "Is the counseling free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The first career counseling and profile evaluation session is completely free. Book a slot on our website or call +91 9870003748.",
      },
    },
    {
      "@type": "Question",
      name: "What is your visa approval rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mission Career has a 98% student visa approval rate, with 5000+ students successfully placed in universities abroad.",
      },
    },
    {
      "@type": "Question",
      name: "Do you help with scholarships and education loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We guide you through scholarship applications and connect you with education loan partners for hassle-free financing.",
      },
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mission Career — Study Abroad Consultants" },
      { name: "description", content: "Mission Career helps students study abroad — find the best countries, universities, scholarships, and visa guidance from expert counsellors." },
      { name: "author", content: "Mission Career" },
      { property: "og:site_name", content: "Mission Career" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/mission-logo-transparent.png" },
      { rel: "shortcut icon", href: "/mission-logo-transparent.png" },
      { rel: "apple-touch-icon", href: "/mission-logo-transparent.png" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=AW-18313112211",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-18313112211');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(LOCAL_BUSINESS_JSONLD),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(FAQ_JSONLD),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style
          id="smart-tv-legacy-css"
          dangerouslySetInnerHTML={{ __html: smartTvLegacyCss }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Disable browser's automatic scroll restoration so refresh always lands at top
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Clear any hash on refresh and scroll to top
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <ChatBot />
      <WhatsAppFloat />
    </QueryClientProvider>
  );
}
