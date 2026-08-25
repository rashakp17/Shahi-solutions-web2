import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

/**
 * The service layer's shell — the same bar and the same footer as everywhere
 * else, for the same reason the resource layer shares them.
 *
 * ── Why there is a /services route at all ──
 * The home page is deliberately one page: the work, the team and the contact
 * form each had a route once and were merged back into sections, on the
 * argument that the same content at two URLs is indexed twice and maintained
 * once. That argument still holds, and this route does not contradict it,
 * because this is not the services section with a URL attached.
 *
 * It exists because the resource layer needs somewhere to send a reader. The
 * funnel the section is built around runs search → article → service →
 * work → conversation, and without a service page the third step lands on an
 * anchor in the middle of the home page: a grid of eight cards, one of which
 * is the subject they just read two thousand words about. That is a worse
 * answer to "tell me more" than the article they came from.
 *
 * So there is exactly one page here, for the one service the resource cluster
 * funnels into. It is not the start of a set of eight. If a second cluster is
 * written, its service page arrives with it; services without a cluster
 * pointing at them stay as cards on the home page, where they read better.
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
