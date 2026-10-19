import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

/**
 * Layout for service pages: the custom software page plus the shorter pages
 * in app/services/[slug].
 */
export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="rs-main">{children}</main>
      <Footer />
    </>
  );
}
