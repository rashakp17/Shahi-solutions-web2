/**
 * Service data, used by the home page grid and the `hasOfferCatalog` JSON-LD.
 * Icons stay in ServicesSection, whose icon map is typed against `ServiceId`,
 * so a new service without an icon fails the build.
 */

export type ServiceId =
  | "website-development"
  | "custom-software-development"
  | "mobile-app-development"
  | "ui-ux-design"
  | "erp-crm"
  | "digital-marketing"
  | "sales-solutions"
  | "business-automation";

export type Service = {
  id: ServiceId;
  /** Card heading and offer catalogue name. */
  title: string;
  body: string;
  /**
   * Service page URL, if one exists. When set, the card title becomes a link.
   * See lib/service-pages.ts.
   */
  href?: string;
};

export const SERVICES: Service[] = [
  {
    id: "website-development",
    title: "Website Development",
    body: "Fast, responsive websites built with Next.js and React, and set up properly for search from day one.",
    href: "/services/website-development",
  },
  {
    id: "custom-software-development",
    title: "Custom Software Development",
    body: "Backends, APIs and cloud infrastructure built around the way your business actually works.",
    href: "/services/custom-software-development",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    body: "iOS and Android apps built with React Native and Flutter, from a single shared codebase.",
    href: "/services/mobile-app-development",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    body: "Clear, accessible wireframes and interface designs that make your product easy to use and easy to trust.",
    href: "/services/ui-ux-design",
  },
  {
    id: "erp-crm",
    title: "ERP & CRM Solutions",
    body: "Finance, inventory and customer records in one system, so every team works from the same numbers.",
    href: "/services/erp-crm",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    body: "Campaigns, SEO and content planned around measurable results, aiming for steady growth over one-off spikes.",
  },
  {
    id: "sales-solutions",
    title: "Sales Solutions",
    body: "Sales funnels and pipeline tools that help turn enquiries into paying customers.",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    body: "Scripts and integrations that take repetitive, manual work out of your daily operations.",
    href: "/services/business-automation",
  },
];
