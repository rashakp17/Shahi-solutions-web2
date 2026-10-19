import type { Article } from "../types";

/**
 * Cost article. No prices are published here: quotes come out of discovery.
 * Review the timelines yearly and bump `updated` when they change.
 */
export const article: Article = {
  slug: "custom-software-development-cost",
  title: "How Much Does Custom Software Development Cost?",
  metaTitle: "Custom Software Development Cost: What Drives the Price",
  description:
    "What drives custom software development cost, typical timelines by project type, running costs after launch, and when building beats subscribing.",
  eyebrow: "Custom Software Development",
  lead: "Custom software development cost depends on the shape of the project and a handful of factors that can be named in advance. Below are the project types we build and how long each takes, what pushes the price up or down, the running cost after launch, and how to work out when building becomes cheaper than subscribing.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "ranges",
      heading: "Custom software development cost by project type",
      blocks: [
        {
          kind: "p",
          text: "Every engagement we quote covers discovery, design, build, testing and launch. We do not publish prices, because two projects of the same type can differ several times over. A firm figure comes out of discovery. What we can say in advance is how long each type of project takes and what sets its cost.",
        },
        {
          kind: "table",
          caption:
            "Typical timeline by project shape. Reviewed annually; this page was last updated in August 2026.",
          head: ["Project shape", "Timeline", "What sets the cost"],
          rows: [
            [
              "Automation or document generation",
              "3–8 weeks",
              "How many document types and how messy the source data is",
            ],
            [
              "Integration between existing systems",
              "4–10 weeks",
              "Quality of the APIs at each end; a system with no API doubles it",
            ],
            [
              "Internal operations tool",
              "2–4 months",
              "Number of distinct user roles, and whether it works offline",
            ],
            [
              "Customer-facing product or storefront",
              "6 weeks – 4 months",
              "Design ambition, payments, and how much is genuinely bespoke",
            ],
            [
              "Full system of record (ERP, CRM, platform)",
              "4–9 months",
              "Module count, permissions model, and data migration volume",
            ],
            [
              "Mobile app, alongside a web platform",
              "+6–12 weeks",
              "Offline support, device features, and app store requirements",
            ],
          ],
        },
        {
          kind: "note",
          label: "Features are a poor guide to price",
          text: "Two operations tools with the same number of screens can differ in cost several times over. The difference comes from roles, permissions, integrations and how much existing data has to be brought across, which is why the next section matters more than a feature list.",
        },
      ],
    },

    {
      id: "what-moves-it",
      heading: "Five factors that drive custom software development cost",
      blocks: [
        {
          kind: "figure",
          diagram: "cost-composition",
          caption:
            "Where the money goes in a typical mid-sized custom software build. Writing feature code is under half of it.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "01",
              title: "Roles, not screens",
              text: "This is the variable people underestimate most. Each extra user role multiplies permissions, navigation, testing and edge cases across every screen that already exists. A system with one role and forty screens is cheaper than one with five roles and fifteen. When you get an estimate, ask how many roles it assumes.",
            },
            {
              label: "02",
              title: "Integrations, and the quality of what you are integrating with",
              text: "A modern, documented REST API is predictable to work with. A system whose only export is a CSV on an FTP server, or a vendor who will not give you an API at all, can cost more than the feature it feeds. Name every external system during discovery and check what each one will actually give you.",
            },
            {
              label: "03",
              title: "Data migration",
              text: "This is the line that is under-budgeted most often. Volume is rarely the problem. The problem is that fifteen years of records contain four spellings of the same supplier, dates in three formats and a column somebody repurposed in 2019. Give it its own budget line instead of treating it as a rounding error on launch.",
            },
            {
              label: "04",
              title: "Design ambition",
              text: "An internal tool needs to be clear. A customer-facing product needs to be persuasive, which is different and more expensive work. Both are worth paying for in the right place, but there is no reason to pay customer-facing design rates for an internal dispatch console.",
            },
            {
              label: "05",
              title: "How settled the requirement is",
              text: "The cheapest projects are the ones where the client knows exactly what the software must do because they have been doing it by hand for three years. The expensive ones are where the process is being invented during the build. Each change is small, but there are two hundred of them.",
            },
          ],
        },
      ],
    },

    {
      id: "running-cost",
      heading: "What it costs after launch",
      blocks: [
        {
          kind: "p",
          text: "A build cost without a running cost next to it is only half a quote. Custom software has ongoing costs, much like a vehicle. A system with no maintenance budget is usually abandoned around month fourteen, typically because nobody was paid to keep it current rather than because it broke.",
        },
        {
          kind: "table",
          caption: "Annual running costs for a mid-sized custom platform.",
          head: ["Line", "How it is priced", "What it covers"],
          rows: [
            [
              "Hosting and infrastructure",
              "Scales with usage",
              "Servers, database, storage, CDN, backups. Grows with traffic and data, not with build cost.",
            ],
            [
              "Third-party services",
              "Per service used",
              "Payments, mapping, email delivery, SMS, error monitoring.",
            ],
            [
              "Maintenance and support",
              "15–20% of build cost",
              "Security patches, dependency updates, fixes, monitoring, small changes.",
            ],
            [
              "Enhancement",
              "Whatever you choose",
              "New capability. Optional in any given year.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Keep the last two lines separate in any contract. Maintenance keeps the system working and is not optional. Enhancement makes it do more, and whether to spend on it is your decision each year. When a supplier bundles both into one retainer, you cannot tell what you are paying for.",
        },
        {
          kind: "bridge",
          prompt:
            "Need a firm number for your project instead of a range? Discovery produces a fixed scope and a fixed price.",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "build-vs-subscribe",
      heading: "When building becomes cheaper than subscribing",
      blocks: [
        {
          kind: "p",
          text: "This calculation settles most of these conversations, and you can do it on the back of an envelope. Take your seat count, multiply by the monthly licence, then multiply by thirty-six. That is the three-year subscription cost. Compare it to a build plus three years of maintenance.",
        },
        {
          kind: "p",
          text: "Below a certain seat count the subscription wins, and above it the build does. Where that point falls depends on your licence price and the build quote, so run it with your own numbers. Two things favour building as you grow. Subscription cost rises every time you hire, and build cost does not. Vendors also raise prices, while a system you own has no renewal negotiation.",
        },
        {
          kind: "note",
          label: "One caveat",
          text: "This only holds when the product and the build really do the same job. If the subscription does ten things and you would build the two you use, compare it against those two. Then think hard about whether you will want the other eight in year two.",
        },
        {
          kind: "p",
          text: "The non-cost side of the decision is covered in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
        },
      ],
    },

    {
      id: "reducing-cost",
      heading: "Four legitimate ways to spend less",
      blocks: [
        {
          kind: "p",
          text: "Each of these lowers the price without reducing what you end up owning. We have left out cutting testing, skipping discovery and choosing the cheapest quote, because those push the cost into next year instead of removing it.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Cut scope, not quality.** Build the parts that carry the value properly and leave the rest for version two. Half a system built well is an asset. A whole one built thinly will need rewriting.",
            "**Do the data cleanup yourself.** Migration is priced on how messy the source is. Having someone internal spend a month deduplicating records before the project starts saves more than anything else a client can do.",
            "**Reduce the roles for version one.** Launch with two roles and add the third once the system is in use. Roles are the most expensive thing to build for and the easiest to put off.",
            "**Buy the commodity parts.** Use established services for authentication, payments, email delivery, file storage and error monitoring. Building these from scratch costs more, takes longer and is less secure, and we have never seen a client benefit from it.",
          ],
        },
      ],
    },
  ],

  faqs: [
    {
      q: "How much does custom software development cost?",
      a: "It depends mainly on the type of project and the number of distinct user roles, integrations and data to migrate. A focused automation is the smallest kind of engagement and a full system of record such as an ERP is the largest. Discovery produces a fixed price covering design, build, testing and launch.",
    },
    {
      q: "Why do custom software quotes vary so much?",
      a: "Mostly because of assumptions that are not stated. The biggest is how many distinct user roles the system supports, which multiplies permissions and testing across every screen. Data migration and the quality of the systems being integrated with are the next two. Two quotes for the same brief can differ threefold and both be honest.",
    },
    {
      q: "What does custom software cost per year after launch?",
      a: "Hosting and infrastructure, which scale with usage, any third-party services the system relies on, and maintenance at roughly 15 to 20 percent of the build cost per year. Enhancement work is separate and optional in any given year.",
    },
    {
      q: "Is custom software cheaper than a subscription?",
      a: "It depends on seat count. Multiply your seats by the monthly licence by thirty-six and compare with a build plus three years of maintenance. Small teams usually do better subscribing, and every new hire tips the balance further towards building.",
    },
    {
      q: "Can I get a fixed price for custom software?",
      a: "For a well-scoped project, yes. Producing that price is what discovery is for. A fixed price quoted before discovery is either padded to cover the unknowns or will be revised once they surface.",
    },
    {
      q: "What is the most under-budgeted part of a custom software project?",
      a: "Data migration, almost every time. The cost rarely comes from volume. It comes from years of accumulated records that contain multiple spellings of the same entity, inconsistent date formats and columns that were repurposed at some point. Budget it as its own line.",
    },
  ],

  caseStudies: ["emarath-erp", "fetch-kids", "vrs-real-invest"],
};
