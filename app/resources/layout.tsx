import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

/**
 * Layout for resource pages: same navbar and footer as the home page, without
 * the heavy canvas/WebGL effects. The title template comes from the root layout.
 */
export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* rs-main offsets content below the fixed navbar. */}
      <main className="rs-main">{children}</main>
      <Footer />
    </>
  );
}
