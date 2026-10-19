import { MotionGate } from "@/components/ui/MotionGate";
import { RenderAhead } from "@/components/ui/RenderAhead";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { FounderSection } from "@/components/site/FounderSection";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { SceneCover } from "@/components/site/SceneCover";
import { ServicesSection } from "@/components/site/ServicesSection";
import { TechStrip } from "@/components/site/TechStrip";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { VenturesSection } from "@/components/site/VenturesSection";
import { SERVICES } from "@/lib/services";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absolute,
  organizationNode,
} from "@/lib/site";

/**
 * Single-page site. /projects, /about and /contact were folded in as sections,
 * so their headings are h2 (the hero has the only h1) and #contact lives on
 * the contact section, not the footer.
 */
export default function Home() {
  /**
   * Organization + WebSite JSON-LD. The org node is shared via
   * `organizationNode()` so other pages can reference its `@id`.
   * `hasOfferCatalog` is built from SERVICES, the same data the grid renders.
   * No `SearchAction` since there is no site search.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationNode(),
        knowsAbout: [
          "Custom software development",
          "ERP and CRM systems",
          "Web application development",
          "Mobile app development",
          "Business automation",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${SITE_NAME} services`,
          itemListElement: SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.body,
              /* Only services with their own page get a URL. */
              ...(service.href ? { url: absolute(service.href) } : {}),
              provider: { "@id": `${absolute("/")}#organization` },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${absolute("/")}#website`,
        url: absolute("/"),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": `${absolute("/")}#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />
      {/* Pauses animations in off-screen sections. Renders nothing. */}
      <MotionGate />
      {/* Pre-renders below-the-fold sections during idle time. Renders nothing. */}
      <RenderAhead />
      <main>
        {/* Hero is pinned; services slides up over it. revealAt is lowered
            from 0.42 so the services intro starts before a fast scroll
            reaches the heading. */}
        <SceneCover next={<ServicesSection />} revealAt={0.08}>
          <Hero />
        </SceneCover>
        <VenturesSection />
        <TechStrip />
        <ProjectsSection />
        <TestimonialsSection />
        <FounderSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
