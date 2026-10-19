/**
 * Site identity: used by canonicals, sitemap, robots.txt, Open Graph and
 * JSON-LD. Keep these consistent so search engines see one entity.
 */

/**
 * Site origin. Set NEXT_PUBLIC_SITE_URL per environment so preview
 * deployments don't publish production canonicals. Must include the scheme;
 * trailing slashes are stripped so `absolute()` can join paths safely.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shahisolutions.com"
).replace(/\/+$/, "");

/** Brand name used in titles, headings and copy. */
export const SITE_NAME = "Shahi Solutions";

/**
 * Registered name. Only used for `legalName` in structured data and the
 * footer copyright, not in titles or headings.
 */
export const LEGAL_NAME = "Shahi Solutions Private Limited";

/** Real name variants for `alternateName`. Not a keyword list. */
export const ALTERNATE_NAMES = ["Shahi Solutions Pvt Ltd", LEGAL_NAME];

/**
 * Default meta description and structured-data `description`.
 * Keep under ~160 characters.
 */
export const SITE_DESCRIPTION =
  "Shahi Solutions builds custom software, web and mobile applications, and ERP platforms for businesses that have outgrown their tools. Based in Calicut, Kerala.";

/** Brand tagline, published as `slogan` in structured data. */
export const SITE_SLOGAN = "Build Beyond The Ordinary";

/** Contact details and address. */
export const ORG = {
  email: "request.sdec@gmail.com",
  /** E.164 format, for structured data and `tel:` links. */
  phone: "+918590371761",
  /** Human-readable format for display. */
  phoneDisplay: "+91 85903 71761",
  street: "2105, F1, T2, Hilite Business Park, Palazhi",
  locality: "Calicut",
  region: "Kerala",
  postalCode: "673016",
  country: "IN",
  logo: "/brand/shahi-logo.png",
  /** Intrinsic size of the logo file, used in the `ImageObject`. */
  logoSize: { width: 2201, height: 773 },
} as const;

/**
 * Social profiles, used by the footer and `sameAs` in structured data.
 *
 * Empty until the real URLs are confirmed. Don't guess handles: `sameAs` is
 * an identity claim. With an empty list the footer hides the row and `sameAs`
 * is omitted.
 *
 * To enable, add entries here. `label` must match an icon in Footer.tsx.
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
 * Open Graph and Twitter metadata for a page.
 *
 * Next.js merges metadata shallowly: a page's `openGraph` replaces the
 * parent's entirely, which drops the root og:image, and a page without
 * `twitter` inherits the home page's card. Always use this helper instead of
 * writing those blocks by hand.
 *
 * `path` stays relative; `metadataBase` resolves it.
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
  /* Served by the opengraph-image file convention. One card for the whole site. */
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
 * Absolute URL for a site path. Use for structured data; metadata fields
 * should stay relative and rely on `metadataBase`.
 */
export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Organization JSON-LD node. Other pages reference it by `@id` (e.g. as
 * `publisher`). `sameAs` is omitted, not set to `[]`, when there are no profiles.
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
      /* Add "ml" once Malayalam support is confirmed. */
      availableLanguage: ["en"],
    },
    ...(SOCIAL_PROFILES.length
      ? { sameAs: SOCIAL_PROFILES.map((p) => p.href) }
      : {}),
  };
}
