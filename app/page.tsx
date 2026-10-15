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
import { StatementSection } from "@/components/site/StatementSection";
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
 * The whole site, on one page.
 *
 * The work, the people and the contact form each had a route of their own
 * (/projects, /about, /contact) and are sections again. Those routes are gone
 * rather than kept alongside these: the same section served at two URLs is the
 * same content indexed twice and maintained once, and the first time one of
 * them drifts the other is quietly wrong.
 *
 * What the merge cost, so it is not rediscovered later:
 *
 *   Headings. Each of the three carried an h1 as a page of its own. There is
 *   one h1 on a page, and here it is the hero's headline, so all three are h2
 *   now — see the note at each.
 *
 *   The #contact id. The footer held it, as the navbar's target back when the
 *   footer was the only place the address lived. Both are on this page now and
 *   an id cannot be in two places: the contact section took it and the footer
 *   gave it up, or the nav link would land on the footer and the form would be
 *   unreachable from it.
 *
 * The order is the argument the page makes: what we do, what we have built,
 * who says it worked, who we are, and how to start.
 */
export default function Home() {
  /**
   * Who this is, for a search engine — and, increasingly, for an answer
   * engine being asked what Shahi Solutions does.
   *
   * The home page carries the organisation's own identity because it is the
   * page that *is* the company. The node itself comes from `organizationNode()`
   * in lib/site.ts rather than being written here, so that every article's
   * `publisher` and the service page's `provider` can point at the same
   * `@id` and resolve to one entity. Two hand-written organisation blocks
   * differing by a field are two companies with the same name.
   *
   * ── What was added, and why each one ──
   * `legalName` and `alternateName` are the brand/entity work: the brand is
   * "Shahi Solutions", the registered company is "Shahi Solutions Private
   * Limited", and declaring both is what merges them into a single entity
   * instead of leaving a crawler to guess whether they are related.
   *
   * `hasOfferCatalog` is the part that matters most for being *answered* with
   * rather than merely ranked. A model asked "what does Shahi Solutions do"
   * from a paragraph has to infer a list; from an offer catalogue it has one.
   * It is built from lib/services.ts, which is the same array the grid on
   * this page renders — so the catalogue cannot claim a service the page does
   * not show, which is the failure mode all of this is being kept clear of.
   *
   * `sameAs` is absent, not empty. There are no confirmed social profiles yet
   * (see SOCIAL_PROFILES in lib/site.ts), and an identity claim pointing at a
   * guessed handle is the one mistake here that is hard to undo.
   *
   * `WebSite` alongside it exists for one reason — it is what carries the site
   * name shown above a result in place of a bare domain. No `SearchAction`:
   * that declares a site search endpoint, and there isn't one.
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
              /* Only the one service with a page of its own gets a URL. The
                 rest are real services without a route to point at, and a
                 fabricated one would 404 for anything that followed it. */
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
      {/* Pauses the ambient loops in every section that is not on screen.
          Renders nothing; see the note in the component. */}
      <MotionGate />
      {/* Lays out the below-the-fold sections in idle time, so neither
          arriving here nor scrolling down pays for them. Renders nothing. */}
      <RenderAhead />
      <main>
        {/* The hero is pinned and the section beneath rides up over it, so the
            move from one to the next is a scene being covered rather than a
            page being scrolled past. */}
        {/* revealAt 0.08, from the default 0.42: the services intro starts
            as the rising edge first shows, instead of waiting for it to pass
            the middle of the screen — a fast scroll was reaching the heading
            before it had begun. It resets only back at the very top. */}
        <SceneCover next={<ServicesSection />} revealAt={0.08}>
          <Hero />
        </SceneCover>
        {/* The giant typographic layer, pushed up out from under the services
            grid as the visitor scrolls into it. */}
        <StatementSection />
        {/* The ecosystem, one venture at a time. */}
        <VenturesSection />
        {/* What the ventures are built out of, on a loop. */}
        <TechStrip />
        {/* The work itself — a deck of cards dealt by the scroll. */}
        <ProjectsSection />
        {/* The proof, immediately after the work it is about. */}
        <TestimonialsSection />
        {/* The people behind it. */}
        <FounderSection />
        {/* The ask, last before the directory. */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
