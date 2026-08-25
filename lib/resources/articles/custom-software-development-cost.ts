import type { Article } from "../types";

/**
 * The cost article.
 *
 * The one page in the cluster where being specific is the entire value. Every
 * competitor result for this query says "it depends" and then lists the things
 * it depends on; this one gives ranges, names what moves them, and shows the
 * arithmetic for the build-versus-subscribe crossover.
 *
 * The figures are in USD and are the ranges this practice actually quotes.
 * They are the one thing in the cluster with a shelf life — revisit them
 * annually, and change `updated` when they move, because a stale price on a
 * page a buyer is using to set a budget is worse than no price at all.
 */
export const article: Article = {
  slug: "custom-software-development-cost",
  title: "How Much Does Custom Software Development Cost?",
  metaTitle: "Custom Software Development Cost: Real Ranges and What Moves Them",
  description:
    "Real custom software development cost ranges by project type, the five factors that actually move the number, and the arithmetic for when building beats subscribing.",
  eyebrow: "Custom Software Development",
  lead: "Most answers to this question are a list of things the cost depends on, which is not an answer. Below are the ranges we actually quote, what moves a number within them, the running cost after launch, and the point at which building stops being more expensive than subscribing.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "ranges",
      heading: "Custom software development cost by project type",
      blocks: [
        {
          kind: "p",
          text: "These are the ranges this practice quotes, in US dollars, for a complete engagement — discovery, design, build, testing and launch. They are not the cheapest numbers available anywhere; they are what it costs to build something that can still be maintained in year three.",
        },
        {
          kind: "table",
          caption:
            "Typical total engagement cost by project shape. Figures reviewed annually — this page was last updated in August 2026.",
          head: ["Project shape", "Typical range", "Timeline", "What sets the number"],
          rows: [
            [
              "Automation or document generation",
              "$4,000 – $12,000",
              "3–8 weeks",
              "How many document types and how messy the source data is",
            ],
            [
              "Integration between existing systems",
              "$6,000 – $18,000",
              "4–10 weeks",
              "Quality of the APIs at each end; a system with no API doubles it",
            ],
            [
              "Internal operations tool",
              "$12,000 – $40,000",
              "2–4 months",
              "Number of distinct user roles, and whether it works offline",
            ],
            [
              "Customer-facing product or storefront",
              "$15,000 – $60,000",
              "6 weeks – 4 months",
              "Design ambition, payments, and how much is genuinely bespoke",
            ],
            [
              "Full system of record (ERP, CRM, platform)",
              "$40,000 – $150,000+",
              "4–9 months",
              "Module count, permissions model, and data migration volume",
            ],
            [
              "Mobile app, alongside a web platform",
              "+$10,000 – $35,000",
              "+6–12 weeks",
              "Offline support, device features, and app store requirements",
            ],
          ],
        },
        {
          kind: "note",
          label: "Read the ranges as shapes, not as prices",
          text: "The gap between the bottom and the top of each row is real and it is mostly not features. A $12,000 operations tool and a $40,000 one can have the same screen count; the difference is roles, permissions, integrations and how much existing data has to be brought across.",
        },
      ],
    },

    {
      id: "what-moves-it",
      heading: "The five things that actually move the number",
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
              text: "The most under-estimated variable in the industry. Each additional user role multiplies permissions, navigation, testing and edge cases across every screen that already exists. A system with one role and forty screens is cheaper than one with five roles and fifteen. Ask any estimate how many roles it assumes.",
            },
            {
              label: "02",
              title: "Integrations, and the quality of what you are integrating with",
              text: "A modern REST API with documentation is a known quantity. A system whose only export is a CSV on an FTP server, or a vendor who will not give you an API at all, can cost more than the feature it feeds. Name every external system during discovery and check what each one will actually give you.",
            },
            {
              label: "03",
              title: "Data migration",
              text: "Consistently the most under-budgeted line. It is rarely the volume; it is that fifteen years of records contain four spellings of the same supplier, dates in three formats and a column somebody repurposed in 2019. Budget it as its own item, not as a rounding error on launch.",
            },
            {
              label: "04",
              title: "Design ambition",
              text: "An internal tool needs to be clear. A customer-facing product needs to be persuasive, which is a different and more expensive kind of work. Both are worth paying for in the right place; paying customer-facing design rates for an internal dispatch console is not.",
            },
            {
              label: "05",
              title: "How settled the requirement is",
              text: "The cheapest projects are the ones where the client knows exactly what the software must do because they have been doing it by hand for three years. The expensive ones are where the process is being invented during the build — each change is small, and there are two hundred of them.",
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
          text: "A build cost with no running cost beside it is half a quote. Custom software has ongoing costs the way a vehicle does, and a system with no maintenance budget is usually abandoned somewhere around month fourteen — not because it broke, but because nobody was funded to keep it current.",
        },
        {
          kind: "table",
          caption: "Annual running costs for a mid-sized custom platform.",
          head: ["Line", "Typical annual cost", "What it covers"],
          rows: [
            [
              "Hosting and infrastructure",
              "$600 – $6,000",
              "Servers, database, storage, CDN, backups. Scales with usage, not with build cost.",
            ],
            [
              "Third-party services",
              "$0 – $4,000",
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
              "New capability. Optional in any given year, which is the point.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The distinction between the last two lines is worth insisting on in a contract. Maintenance keeps the system working and is not negotiable. Enhancement makes it do more and is entirely your call, year by year. Suppliers who bundle them into one retainer make it impossible to tell what you are actually buying.",
        },
        {
          kind: "bridge",
          prompt:
            "Want a real number for your project rather than a range? Discovery produces a fixed scope and a fixed price.",
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
          text: "This is the arithmetic that decides most of these conversations, and it is simple enough to do on the back of an envelope. Take your seat count, multiply by the monthly licence, multiply by thirty-six. That is the three-year subscription cost. Compare it to a build plus three years of maintenance.",
        },
        {
          kind: "table",
          caption:
            "Three-year total cost, comparing a $45/seat/month subscription against a $30,000 build with 18% annual maintenance ($46,200 over three years).",
          head: ["Seats", "Subscription, 3 years", "Build + maintenance, 3 years", "Cheaper"],
          rows: [
            ["10", "$16,200", "$46,200", "Subscribe"],
            ["25", "$40,500", "$46,200", "Subscribe"],
            ["30", "$48,600", "$46,200", "Roughly even"],
            ["50", "$81,000", "$46,200", "Build"],
            ["100", "$162,000", "$46,200", "Build"],
          ],
        },
        {
          kind: "p",
          text: "The crossover in this example sits around thirty seats, and it moves with your licence price and your build cost — run it with your own numbers rather than borrowing these. Two things the table does not show, both of which favour building at the top end: subscription cost rises every time you hire, while build cost does not; and vendors raise prices, while a system you own does not have a renewal negotiation.",
        },
        {
          kind: "note",
          label: "The honest caveat",
          text: "This arithmetic only holds when the product and the build genuinely do the same job. If the subscription does ten things and you would build the two you use, compare it to those two — and then ask seriously whether you will want the other eight in year two.",
        },
        {
          kind: "p",
          text: "The rest of the decision — the parts that are not cost — is set out in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
        },
      ],
    },

    {
      id: "reducing-cost",
      heading: "Four legitimate ways to spend less",
      blocks: [
        {
          kind: "p",
          text: "All four reduce the number without reducing what you end up owning. Deliberately excluded: cutting testing, skipping discovery, and choosing the cheapest quote — each of those moves cost into next year rather than removing it.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Cut scope, not quality.** Build the three things that carry the value properly and leave the rest for version two. Half a system built well is an asset; a whole one built thinly is a rewrite.",
            "**Do the data cleanup yourself.** Migration is priced on how messy the source is. A month of somebody internal deduplicating records before the project starts is the single highest-leverage thing a client can do.",
            "**Reduce the roles for version one.** Launch with two roles and add the third once the system is in use. Roles are the most expensive axis to build against and the easiest to defer.",
            "**Buy the commodity parts.** Authentication, payments, email delivery, file storage, error monitoring — use the established services. Building these from scratch is expensive, slower and less secure, and no client has ever been glad of it.",
          ],
        },
      ],
    },
  ],

  faqs: [
    {
      q: "How much does custom software development cost?",
      a: "A focused automation or integration typically runs $4,000 to $18,000, an internal operations tool $12,000 to $40,000, a customer-facing product $15,000 to $60,000, and a full system of record such as an ERP from $40,000 upward. These are complete engagement costs including discovery, design, build, testing and launch.",
    },
    {
      q: "Why do custom software quotes vary so much?",
      a: "Mostly because of assumptions that are not stated. The biggest is how many distinct user roles the system supports, which multiplies permissions and testing across every screen. Data migration and the quality of the systems being integrated with are the next two. Two quotes for the same brief can differ threefold and both be honest.",
    },
    {
      q: "What does custom software cost per year after launch?",
      a: "Hosting and infrastructure of $600 to $6,000, third-party services up to around $4,000, and maintenance at roughly 15 to 20 percent of the build cost. Enhancement work is separate and optional in any given year.",
    },
    {
      q: "Is custom software cheaper than a subscription?",
      a: "It depends on seat count. Multiply your seats by the monthly licence by thirty-six and compare with a build plus three years of maintenance. For a $45 per seat product against a $30,000 build, the crossover sits around thirty seats — and it moves in favour of building every time you hire.",
    },
    {
      q: "Can I get a fixed price for custom software?",
      a: "For a well-scoped project, yes, and that is what discovery exists to produce. A fixed price quoted before discovery is either padded to cover the unknowns or will be revised once they surface.",
    },
    {
      q: "What is the most under-budgeted part of a custom software project?",
      a: "Data migration, consistently. It is rarely the volume that costs — it is that years of accumulated records contain multiple spellings of the same entity, inconsistent date formats and columns that were repurposed at some point. Budget it as its own line.",
    },
  ],

  caseStudies: ["emarath-erp", "fetch-kids", "vrs-real-invest"],
};
