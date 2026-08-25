import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

/**
 * The resource layer's shell.
 *
 * The same navbar and the same footer as the rest of the site, deliberately
 * and without variation. The whole premise of this section is that a visitor
 * arriving from a search lands *inside the brand* rather than on a content
 * annex that happens to share a logo — and the fastest way to break that is to
 * give the articles their own header.
 *
 * What is different is everything below the bar: no hero canvas, no particle
 * field, no scene-cover rig, no WebGL. Those belong to the home page, where
 * the visitor came to be impressed. Here they came to read, and the atmosphere
 * layers would cost frame budget on a page whose job is to hold still.
 *
 * There is deliberately no `metadata` export here any more. This layout used
 * to declare `title: { template: "%s | Shahi Solutions" }`, which was right
 * when /resources was the only route below the home page. The root layout now
 * declares the same template for the whole site, so keeping a copy here would
 * be two definitions of one string — and the copy that drifts is always the
 * one further from where anybody looks.
 */
export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* The bar is fixed and 56px tall inside a padded container, so content
          starting at the top of the document would begin underneath it. The
          home page never needs this — its first section is a full-height hero
          the bar is meant to float over. Here the first thing on the page is a
          breadcrumb, and it has to clear. */}
      <main className="rs-main">{children}</main>
      <Footer />
    </>
  );
}
