/**
 * The things that need to know who this is and where it lives.
 *
 * Canonical URLs, the sitemap, `robots.txt`, Open Graph and every piece of
 * JSON-LD read from here, so the brand is asserted once and identically
 * everywhere. That consistency is the whole point rather than tidiness: a
 * search engine deciding whether "Shahi Solutions" is one entity or several is
 * doing it by comparing the name, the URL, the logo and the address across
 * every page it has, and any one of those disagreeing with itself is what
 * makes an entity ambiguous.
 */

/**
 * The origin, confirmed rather than guessed.
 *
 * `NEXT_PUBLIC_SITE_URL` still overrides it, and should be set in the
 * deployment environment — not because the fallback is wrong, but because a
 * preview deployment inherits it otherwise, and a preview publishing
 * `<link rel="canonical" href="https://www.shahisolutions.com/...">` is
 * telling Google that the preview *is* production. That is the one way a
 * canonical tag actively causes harm.
 *
 * The scheme is required and a trailing slash is stripped, so `absolute()`
 * below can join paths without producing a double slash.
 *
 * NEXT_PUBLIC_ because the value is inlined at build time and read from
 * components on both sides of the server/client boundary. It is a public
 * hostname; there is nothing here to keep out of the bundle.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shahisolutions.com"
).replace(/\/+$/, "");

/**
 * The brand, and the only name that should appear in a title tag, a heading,
 * a footer or a sentence. Short, spoken, and the string people search for.
 */
export const SITE_NAME = "Shahi Solutions";

/**
 * The registered company, which is a different fact and belongs in different
 * places.
 *
 * It appears in exactly two: `legalName` in the organisation's structured
 * data, and the copyright line in the footer. That split is the convention
 * search engines expect — `name` is what the entity is called and `legalName`
 * is what it is registered as, and supplying both is what lets Google resolve
 * "Shahi Solutions", "Shahi Solutions Pvt Ltd" and the registered entity to
 * one company instead of three.
 *
 * It deliberately does not go in the title tag, the H1 or the hero. A legal
 * suffix in a heading costs characters in a search result and reads as filing
 * paperwork rather than as a brand.
 */
export const LEGAL_NAME = "Shahi Solutions Private Limited";

/**
 * Other ways the company is genuinely written, for `alternateName`.
 *
 * Only real variants — the abbreviation people actually type and the full
 * legal form. This field is not a keyword list, and putting
 * "software company calicut" in it would be exactly the stuffing this site
 * is being kept clear of.
 */
export const ALTERNATE_NAMES = ["Shahi Solutions Pvt Ltd", LEGAL_NAME];

/**
 * The one-line description of what the company is, reused as the default meta
 * description and as `description` in the structured data.
 *
 * Rewritten from "Infrastructure for teams who refuse the default", which was
 * the brand line doing a job it could not do. A description has one reader who
 * matters — somebody scanning a page of search results deciding whether this
 * is a software company — and an abstract sentence answers no question they
 * are asking. This one names the category and the work, in the order they
 * would be looked for, and stays under the ~160 characters Google will show.
 *
 * The brand line survives, in `slogan` below, which is where a slogan goes.
 */
export const SITE_DESCRIPTION =
  "Shahi Solutions builds custom software, web and mobile applications, and ERP platforms for businesses that have outgrown their tools. Based in Calicut, Kerala.";

/** The brand line. Real brand equity, published as `slogan` rather than lost. */
export const SITE_SLOGAN = "Build Beyond The Ordinary";

/** Where the company actually is, and how to reach it. */
export const ORG = {
  email: "request.sdec@gmail.com",
  /** E.164, which is the form structured data and `tel:` both want. */
  phone: "+918590371761",
  /** The same number as a person reads it, for anything user-facing. */
  phoneDisplay: "+91 85903 71761",
  street: "2105, F1, T2, Hilite Business Park, Palazhi",
  locality: "Calicut",
  region: "Kerala",
  postalCode: "673016",
  country: "IN",
  logo: "/brand/shahi-logo.png",
  /** Intrinsic size of the logo file. `ImageObject` wants both, and Google's
      logo guidance is explicit that it reads them. */
  logoSize: { width: 2201, height: 773 },
} as const;

/**
 * Social profiles, and the single place they are declared.
 *
 * ── Why this is empty ──
 * The footer carried four icons pointing at `href="#"` — LinkedIn, X, Facebook
 * and GitHub — placeholders left deliberately rather than guessed at. Four
 * links to nothing is a real cost twice over: a visitor who clicks one gets a
 * jump to the top of the page, and a crawler follows four internal links that
 * resolve to the page they started on.
 *
 * The tempting fix is to guess the handles. That is worse than leaving them
 * out, because `sameAs` is an identity claim: pointing it at a profile that
 * turns out to belong to somebody else merges this company with that one in
 * an entity graph, and it is not a mistake that is easy to undo.
 *
 * So the list is empty, both consumers read it, and both do the right thing
 * with nothing: the footer omits the row, and `sameAs` is left off the
 * organisation entirely rather than published as an empty array.
 *
 * ── To turn them on ──
 * Add the live URLs here. Nothing else has to change — the footer picks up the
 * row and the structured data picks up `sameAs` from the same entries. The
 * `label` has to match one of the icons drawn in Footer.tsx, and TypeScript
 * will say so if it does not.
 *
 *   export const SOCIAL_PROFILES: SocialProfile[] = [
 *     { label: "LinkedIn", href: "https://www.linkedin.com/company/…" },
 *     { label: "Instagram", href: "https://www.instagram.com/…" },
 *   ];
 */
export type SocialLabel =
  | "LinkedIn"
  | "Instagram"
  | "X"
  | "Facebook"
  | "GitHub"
  | "YouTube";

export type SocialProfile = { label: SocialLabel; href: string };

export const SOCIAL_PROFILES: SocialProfile[] = [];

/**
 * The Open Graph and Twitter card blocks for one page.
 *
 * ── The bug this exists to make impossible ──
 * Next.js merges metadata shallowly: a page exporting `openGraph` *replaces*
 * the parent layout's whole `openGraph` object rather than merging into it.
 * The `app/opengraph-image.png` file convention works by attaching itself to
 * the `openGraph.images` of the segment it sits in — the root — so every page
 * that declared its own `openGraph` silently dropped the card image. Measured
 * on the built output: the home page carried `og:image`, and `/resources`,
 * `/services/custom-software-development` and all five articles carried none.
 *
 * `twitter` failed the same way and worse. Pages that set `openGraph` but not
 * `twitter` inherited the root's `twitter` verbatim, so every article's Twitter
 * card advertised the *home page's* title and description.
 *
 * Both are the kind of fault that never surfaces in review, because nothing on
 * the page looks wrong — you find it when a link is pasted into Slack six
 * months later and comes back as a bare grey rectangle.
 *
 * So no page writes these by hand. This builds both blocks together, always
 * with the image, from one title and one description — which means the two
 * cards cannot disagree with each other and neither can lose the image.
 *
 * `path` stays relative; `metadataBase` in the root layout resolves it, which
 * is what keeps a preview deployment from advertising production URLs.
 */
export function socialMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}) {
  /* The generated card, served by the file convention at this exact path.
     One image for the whole site, deliberately: a per-article card would mean
     either a build-time font dependency or eight hand-made PNGs, and what a
     link preview has to do here is say "Shahi Solutions" convincingly — which
     the brand card does on every route. */
  const images = ["/opengraph-image.png"];

  return {
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images,
    },
  };
}

/**
 * An absolute URL for a path on this site.
 *
 * Everything that goes into structured data has to be absolute — a crawler
 * reading an `@id` or an `image` has no page context to resolve `/resources`
 * against. Metadata is the exception: `metadataBase` in the root layout lets
 * `alternates.canonical` and the Open Graph fields stay relative, and they do,
 * because relative is what keeps them correct when the origin changes.
 */
export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The organisation, as one reusable node.
 *
 * Built here rather than written into the home page so that every other page's
 * `publisher` can point at the same `@id` and mean it. A crawler resolving
 * `{"@id": ".../#organization"}` on an article to the full node on the home
 * page treats them as one entity; two hand-written organisation blocks that
 * differ by a field are two companies with the same name.
 *
 * `sameAs` is spread conditionally rather than set to `[]` — an empty array is
 * a published claim that there are no profiles, which is not the same as
 * making no claim.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${absolute("/")}#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: ALTERNATE_NAMES,
    url: absolute("/"),
    description: SITE_DESCRIPTION,
    slogan: SITE_SLOGAN,
    logo: {
      "@type": "ImageObject",
      "@id": `${absolute("/")}#logo`,
      url: absolute(ORG.logo),
      width: ORG.logoSize.width,
      height: ORG.logoSize.height,
      caption: SITE_NAME,
    },
    image: { "@id": `${absolute("/")}#logo` },
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.street,
      addressLocality: ORG.locality,
      addressRegion: ORG.region,
      postalCode: ORG.postalCode,
      addressCountry: ORG.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: ORG.phone,
      email: ORG.email,
      /* English only, and left that way on purpose. A Calicut company almost
         certainly takes enquiries in Malayalam too, and `"ml"` belongs here
         the moment somebody can confirm it — but everything in this node is
         a claim the company is making about itself, and a plausible guess is
         still a guess. */
      availableLanguage: ["en"],
    },
    ...(SOCIAL_PROFILES.length
      ? { sameAs: SOCIAL_PROFILES.map((p) => p.href) }
      : {}),
  };
}
