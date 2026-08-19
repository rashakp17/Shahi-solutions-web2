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
  return (
    <>
      <Navbar />
      <main>
        {/* The hero is pinned and the section beneath rides up over it, so the
            move from one to the next is a scene being covered rather than a
            page being scrolled past. */}
        <SceneCover next={<ServicesSection />}>
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
