import type { Faq } from "@/lib/resources/types";

/**
 * Content for the shorter service pages rendered by app/services/[slug].
 * Custom software has its own, longer page in
 * app/services/custom-software-development, which takes precedence over the
 * dynamic route. Every slug here must also be set as an `href` in
 * lib/services.ts and the footer.
 */

export type ServicePage = {
  slug: string;
  /** H1 and JSON-LD name. */
  name: string;
  /** Lighter second half of the H1. */
  tagline: string;
  metaTitle: string;
  description: string;
  serviceType: string;
  lead: string;
  /** Intro paragraph above the offering list. */
  offeringsIntro: string;
  offerings: Array<{ title: string; body: string; detail: string }>;
  /** Short process, four steps. */
  phases: Array<{ name: string; body: string }>;
  faqs: Faq[];
  /** Ids from lib/resources/case-studies.ts. Omit for no rail. */
  caseStudies?: string[];
  caseStudyHeading?: string;
  caseStudyIntro?: string;
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "website-development",
    name: "Website Development",
    tagline: " that loads fast and gets found.",
    metaTitle: "Website Development Services",
    description:
      "Fast, responsive websites built with Next.js and React: marketing sites, storefronts and content platforms, set up properly for search from day one.",
    serviceType: "Website development",
    lead: "We build websites that load quickly on any device, read well, and are set up for search engines from the first deploy. Each site is built for the one job it has to do, whether that is bringing in enquiries, selling products or showing off your work.",
    offeringsIntro:
      "Most websites we build are one of four kinds. The kind sets the scope, so it is the first thing we agree on.",
    offerings: [
      {
        title: "Marketing & company sites",
        body: "A clear account of what you do and who it is for, with pages that lead visitors to an enquiry, a booking or a call.",
        detail: "Judged by the enquiries it brings in, not by how many pages it has.",
      },
      {
        title: "E-commerce storefronts",
        body: "Product catalogues, cart and checkout, plus custom product options when a hosted template cannot do what you sell.",
        detail: "Built around how your customers actually buy.",
      },
      {
        title: "Brand & portfolio sites",
        body: "Scroll-led, design-heavy front ends for studios and brands, where the experience of the site is part of what you are selling.",
        detail: "Still fast, even with all the motion.",
      },
      {
        title: "Content & landing pages",
        body: "Blogs, resource hubs and campaign pages your team can edit, with metadata, structured data and sitemaps built in.",
        detail: "Set up for search before launch, not added afterwards.",
      },
    ],
    phases: [
      {
        name: "Brief & structure",
        body: "We agree the audience, the main action each page should drive, and a sitemap before anyone opens a design tool.",
      },
      {
        name: "Design",
        body: "Responsive page designs for mobile and desktop, reviewed with real content rather than placeholder text.",
      },
      {
        name: "Build",
        body: "Next.js and React, with performance, accessibility and search metadata checked on a staging link you can open at any time.",
      },
      {
        name: "Launch",
        body: "Domain, hosting, analytics and redirects set up in accounts you own, and the site submitted to search engines.",
      },
    ],
    faqs: [
      {
        q: "Which technology do you build websites with?",
        a: "Mostly Next.js and React, which give fast page loads and good search visibility. If a hosted platform suits you better, for example for a simple shop, we will tell you.",
      },
      {
        q: "Can my team update the content themselves?",
        a: "Yes. Content that changes often, such as blog posts, products or team pages, can be edited through a content management system, without a developer.",
      },
      {
        q: "Do you handle SEO?",
        a: "The technical side, yes: page speed, metadata, structured data, sitemaps and clean URLs are part of every build. Ongoing content and campaign work is a separate service.",
      },
      {
        q: "Who owns the site?",
        a: "You do. The code, the domain and the hosting accounts are in your name from day one.",
      },
    ],
    caseStudies: ["mood-by-teal", "vrs-real-invest", "fetch-kids"],
    caseStudyHeading: "Websites we have built",
    caseStudyIntro: "Three sites from our portfolio, each built for a different job.",
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    tagline: " for iOS and Android, from one codebase.",
    metaTitle: "Mobile App Development Services",
    description:
      "iOS and Android apps built with React Native and Flutter from a single shared codebase: customer apps, field and staff apps, and companion apps for existing systems.",
    serviceType: "Mobile app development",
    lead: "We build mobile apps for iOS and Android from one shared codebase, using React Native or Flutter. You get two native apps for close to the cost of one, and a single codebase to maintain after launch.",
    offeringsIntro:
      "Most apps we build fall into one of three groups, depending on who uses them and where.",
    offerings: [
      {
        title: "Customer apps",
        body: "Booking, ordering, loyalty and account apps that put your service in your customers' pockets, with push notifications and payments.",
        detail: "Designed to be easy enough that people keep using them.",
      },
      {
        title: "Field & staff apps",
        body: "Apps for drivers, technicians and sales teams: job lists, check-ins, photos, signatures and GPS, with offline support where coverage is patchy.",
        detail: "Built around the person using it on the job.",
      },
      {
        title: "Companion apps",
        body: "Mobile front ends for a system you already run, such as an ERP, CRM or fleet platform, sharing the same data and permissions.",
        detail: "One source of truth, now on a phone.",
      },
    ],
    phases: [
      {
        name: "Scope",
        body: "We list the screens, user roles and integrations, and agree what goes in the first release and what waits.",
      },
      {
        name: "Design",
        body: "Interface designs that follow iOS and Android conventions, tested as a clickable prototype before we write any code.",
      },
      {
        name: "Build",
        body: "Short cycles, each ending with a test build you can install on your own phone.",
      },
      {
        name: "Release",
        body: "App Store and Play Store submission under your developer accounts, followed by monitoring and crash reporting.",
      },
    ],
    faqs: [
      {
        q: "Native or cross-platform?",
        a: "For most business apps we recommend cross-platform with React Native or Flutter: one codebase, both stores, and native performance for everyday use. We will say so if your app needs fully native development.",
      },
      {
        q: "Can the app work offline?",
        a: "Yes, when it needs to. Field apps can store work on the device and sync it when the connection comes back.",
      },
      {
        q: "Do you publish the app to the stores?",
        a: "Yes, under your own Apple and Google developer accounts, so the listings belong to you.",
      },
      {
        q: "Can the app connect to our existing system?",
        a: "Usually. If your system has an API we connect to it directly; if it does not, we can build one.",
      },
    ],
    caseStudies: ["fleet-management"],
    caseStudyHeading: "Related work",
    caseStudyIntro: "A real-time platform of the kind that our mobile apps often sit on top of.",
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    tagline: " that makes software easy to use.",
    metaTitle: "UI/UX Design Services",
    description:
      "UI/UX design for web and mobile products: user flows, wireframes, interface designs and clickable prototypes that are clear, accessible and ready for developers.",
    serviceType: "UI/UX design",
    lead: "We design interfaces that people understand the first time they use them. That starts with how the work actually gets done and ends with detailed, accessible designs that developers can build from without guessing.",
    offeringsIntro:
      "Design work can be commissioned on its own or as the first stage of a build. Either way, it usually covers these four things.",
    offerings: [
      {
        title: "User flows & wireframes",
        body: "The structure of the product: which screens exist, what each one is for, and how people move between them.",
        detail: "Cheap to change at this stage, expensive later.",
      },
      {
        title: "Interface design",
        body: "Detailed, responsive layouts for web and mobile, with real content, every state covered, and accessible colour contrast.",
        detail: "Includes empty, loading and error states, not only the happy path.",
      },
      {
        title: "Prototypes & testing",
        body: "Clickable prototypes that you and your users can try before development starts, so problems surface early.",
        detail: "Watching someone use it beats any review meeting.",
      },
      {
        title: "Design systems",
        body: "Reusable components, type and colour tokens, so new screens stay consistent and get built faster.",
        detail: "Handed over in Figma with notes for developers.",
      },
    ],
    phases: [
      {
        name: "Research",
        body: "We talk to the people who will use the product and study the tools they use now, including the spreadsheets.",
      },
      {
        name: "Structure",
        body: "User flows and wireframes, agreed before any visual design so the layout serves the task.",
      },
      {
        name: "Design",
        body: "Visual design and a clickable prototype, refined through review rounds with you and real users.",
      },
      {
        name: "Handover",
        body: "Organised Figma files, a component library and specifications, plus support for the developers while they build.",
      },
    ],
    faqs: [
      {
        q: "Can we hire you for design only?",
        a: "Yes. You get Figma files and specifications that any development team can build from, ours or someone else's.",
      },
      {
        q: "Can you redesign an existing product?",
        a: "Yes. We start by reviewing what works and what does not, often with the people using it, then prioritise the changes that matter most.",
      },
      {
        q: "Do you design for accessibility?",
        a: "Yes. Colour contrast, readable type sizes, keyboard and screen-reader support are checked as part of every design.",
      },
      {
        q: "Which tools do you use?",
        a: "Figma for wireframes, interface designs, prototypes and design systems. You get full access to the files.",
      },
    ],
  },
  {
    slug: "erp-crm",
    name: "ERP & CRM Systems",
    tagline: " with every team on the same numbers.",
    metaTitle: "ERP & CRM Development Services",
    description:
      "Custom ERP and CRM systems that bring finance, inventory, procurement, HR and customer records into one platform, with role-based access and live dashboards.",
    serviceType: "ERP and CRM development",
    lead: "We build ERP and CRM systems that bring finance, inventory, sales and customer records into one place, so every team works from the same numbers. Each one is built around your processes, not a generic template you have to adjust to.",
    offeringsIntro:
      "A system is usually made up of a few of these modules, built in the order that pays off soonest.",
    offerings: [
      {
        title: "Finance & inventory",
        body: "Stock levels, purchasing, invoicing and accounts in one system, so a sale updates stock and the books together.",
        detail: "One stock figure that everyone trusts.",
      },
      {
        title: "Sales & CRM",
        body: "Leads, follow-ups, quotes and customer history, with pipelines and team leaderboards that show where every deal stands.",
        detail: "No more lost follow-ups in someone's inbox.",
      },
      {
        title: "HR & operations",
        body: "Staff records, attendance, approvals and the operational workflows specific to your business.",
        detail: "Approvals that do not depend on email chains.",
      },
      {
        title: "Reporting & dashboards",
        body: "Live dashboards and reports built from the same records, with role-based access so each person sees what they need.",
        detail: "Answers in seconds instead of a month-end spreadsheet.",
      },
    ],
    phases: [
      {
        name: "Discovery",
        body: "We map how each department works today and where the numbers disagree, then agree a scope and a fixed price.",
      },
      {
        name: "Data model & design",
        body: "We design the data model first, then the screens for each role, reviewed with the people who will use them.",
      },
      {
        name: "Build & migrate",
        body: "Modules delivered in short cycles, with your existing data migrated and checked against the old system.",
      },
      {
        name: "Rollout",
        body: "Training per team, a staged go-live, and support while people move over from the old tools.",
      },
    ],
    faqs: [
      {
        q: "Why custom instead of an off-the-shelf ERP?",
        a: "Off-the-shelf systems suit standard processes. When your workflows are what sets you apart, or licence and customisation costs keep climbing, a custom system can fit better. If an existing product does the job, we will recommend it.",
      },
      {
        q: "Can you migrate our existing data?",
        a: "Yes. Spreadsheets, older databases and exports from other systems can be cleaned and imported, and the result is checked before go-live.",
      },
      {
        q: "Can it connect to our other tools?",
        a: "Yes. Accounting software, payment gateways, e-commerce stores and messaging tools can all be integrated.",
      },
      {
        q: "Who owns the system?",
        a: "You do: the code, the database and the hosting accounts, all in your organisation's name.",
      },
    ],
    caseStudies: ["emarath-erp", "fleet-management"],
    caseStudyHeading: "Systems we have built",
    caseStudyIntro: "Two platforms from our portfolio that replaced a stack of disconnected tools.",
  },
  {
    slug: "business-automation",
    name: "Business Automation",
    tagline: " that takes the busywork off your team.",
    metaTitle: "Business Automation Services",
    description:
      "Business automation: integrations, scheduled workflows, document generation and reporting that remove repetitive manual work from your daily operations.",
    serviceType: "Business process automation",
    lead: "We automate the repetitive work your team does by hand every day: copying data between systems, building the same reports, chasing approvals. It is often the smallest project with the clearest return.",
    offeringsIntro:
      "Most automation work falls into one of four patterns. Many projects combine two or three.",
    offerings: [
      {
        title: "System integrations",
        body: "Connections that keep your tools in step, so an order, invoice or customer record entered once appears everywhere it is needed.",
        detail: "With an exception queue for anything that does not match.",
      },
      {
        title: "Workflow automation",
        body: "Approvals, notifications, reminders and hand-offs that run on their own, triggered by events or on a schedule.",
        detail: "Fewer status-update messages.",
      },
      {
        title: "Documents & reports",
        body: "Invoices, quotes, certificates and recurring reports generated from live data and sent out automatically.",
        detail: "The Monday report, ready before Monday.",
      },
      {
        title: "Data processing",
        body: "Scripts that import, clean and reconcile data from spreadsheets, emails and exports that someone currently handles by hand.",
        detail: "Hours of copy-and-paste replaced by one run.",
      },
    ],
    phases: [
      {
        name: "Audit",
        body: "We sit with your team and list the manual tasks, how often they happen and how long each one takes.",
      },
      {
        name: "Prioritise",
        body: "We rank the tasks by time saved against effort, and agree which ones to automate first and at what price.",
      },
      {
        name: "Build",
        body: "The automations are built and run alongside the manual process until the results match.",
      },
      {
        name: "Monitor",
        body: "Logging and alerts, so if a connected system changes or something fails, someone hears about it straight away.",
      },
    ],
    faqs: [
      {
        q: "Which tasks are worth automating?",
        a: "Tasks that are frequent, rule-based and time-consuming, such as data entry between systems, recurring reports and routine approvals. The audit puts numbers on each one.",
      },
      {
        q: "Do we need to replace our current software?",
        a: "Usually not. Most automation connects the tools you already have.",
      },
      {
        q: "What happens when something fails?",
        a: "Every automation logs what it does and raises an alert when something goes wrong, with an exception queue for records that need a person to look at them.",
      },
      {
        q: "How quickly will we see results?",
        a: "Faster than with most software projects. A focused automation is often in use within a few weeks.",
      },
    ],
    caseStudies: ["emarath-erp"],
    caseStudyHeading: "Related work",
    caseStudyIntro: "A system where reporting and approvals run from live records.",
  },
];

const BY_SLUG = new Map(SERVICE_PAGES.map((page) => [page.slug, page]));

export function servicePageBySlug(slug: string): ServicePage | undefined {
  return BY_SLUG.get(slug);
}
