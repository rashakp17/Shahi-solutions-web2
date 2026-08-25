import type { Article } from "../types";

/**
 * The pillar of the custom software development cluster.
 *
 * Everything else in the cluster is a chapter of this page — examples, the
 * process, the cost, the build-versus-buy decision — so this one stays broad
 * and hands off rather than trying to be all four. The four articles link back
 * here; this one links out to each of them at the point where the reader is
 * most likely to want the detail.
 */
export const article: Article = {
  slug: "what-is-custom-software-development",
  title: "What Is Custom Software Development?",
  metaTitle: "What Is Custom Software Development? A Practical Guide",
  description:
    "Custom software development means building software around how your business already works, rather than changing how it works to fit a product. Here is what that involves.",
  eyebrow: "Custom Software Development",
  lead: "Custom software development is the practice of designing and building an application around one organisation's actual operations, instead of adopting a product built for the average of everyone else's. This guide covers what gets built, when it is worth it, what it costs, and — just as usefully — when buying something off the shelf is the better answer.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "definition",
      heading: "What custom software development actually means",
      blocks: [
        {
          kind: "p",
          text: "Custom software is written for one organisation and shaped by that organisation's processes. Off-the-shelf software is written for a market and shaped by the average of everyone in it. That is the whole distinction, and every practical difference between the two follows from it.",
        },
        {
          kind: "p",
          text: "In practice, a custom build starts from how work already happens. Someone sits with the people doing the job, watches the spreadsheet get filled in, the message get sent, the paper docket get carried across the yard — and then designs a system that removes those steps rather than one that assumes they never existed. The result is usually *less* software than a commercial product, not more: a smaller surface, with nothing on it that this business does not do.",
        },
        {
          kind: "note",
          label: "A useful test",
          text: "If the honest answer to a question about how something gets handled is “we have a workaround for it”, you are already paying for custom software. You are paying for it in salaried hours, and it is being maintained by whoever remembers the workaround.",
        },
        {
          kind: "p",
          text: "The term covers a wide range of things. A **bespoke web application** replacing four spreadsheets is custom software. So is an integration layer that makes an accounting package and a warehouse system agree on what a stock level is. So is a customer-facing product that *is* the business. What they have in common is that the specification came from the organisation rather than from a vendor's roadmap.",
        },
      ],
    },

    {
      id: "how-it-differs",
      heading: "How it differs from off-the-shelf software",
      blocks: [
        {
          kind: "p",
          text: "The trade is not quality against cost — good commercial software is very good, and a bad custom build is worse than either. The trade is between **fit** and **leverage**. A product you buy has thousands of other customers paying down its development and filing its bug reports. A product you build fits your operation exactly and answers only to you.",
        },
        {
          kind: "table",
          caption:
            "The differences that actually change a decision. Everything else is detail.",
          head: ["", "Off-the-shelf", "Custom"],
          rows: [
            [
              "Time to first use",
              "Days. Sign up and configure.",
              "Weeks to months. It has to be built.",
            ],
            [
              "Cost shape",
              "Low to start, per seat, forever — and it rises with headcount.",
              "High to start, then hosting and maintenance. Flat as you grow.",
            ],
            [
              "Fit",
              "Good for the 80% every business shares. Awkward for the rest.",
              "Built for the 20% that is actually your business.",
            ],
            [
              "Change",
              "You wait for the roadmap, or you do not get it.",
              "You decide the roadmap. You also pay for it.",
            ],
            [
              "Data",
              "Lives in their system, exported on their terms.",
              "Lives in yours, in a schema you chose.",
            ],
            [
              "Risk",
              "Vendor pricing, acquisition, sunsetting.",
              "Build quality, and whether you can maintain it.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Most organisations end up with both, and that is the correct outcome rather than a compromise. You buy the things that are the same everywhere — email, payroll, accounting, video calls — and you build the thing that is different, which is usually the operation your customers actually pay you for. The full version of this argument, with the arithmetic, is in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
        },
      ],
    },

    {
      id: "what-gets-built",
      heading: "What custom software development usually gets built to do",
      blocks: [
        {
          kind: "p",
          text: "Across the projects we take on, custom builds fall into five recognisable shapes. Knowing which one you are looking at is most of the estimating work, because each has a very different centre of gravity.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Systems of record",
              title: "One place the truth lives",
              text: "ERP and CRM builds, inventory systems, case management. The point is not features — it is that stock, or a customer, or an order has exactly one authoritative representation, and every screen reads from it. These are the builds that eliminate reconciliation meetings.",
            },
            {
              label: "Operations tools",
              title: "The work itself, made faster",
              text: "Dispatch consoles, field apps, scheduling boards, approval queues. Judged on how many seconds they take out of a task that happens four hundred times a day — which is why they are worth designing around the person doing it rather than around the data model.",
            },
            {
              label: "Integration",
              title: "Making two systems agree",
              text: "The least glamorous category and often the highest return. A layer that reconciles an accounting package, a storefront and a warehouse so that nobody re-keys anything. Frequently the cheapest custom software a business will ever commission.",
            },
            {
              label: "Customer-facing products",
              title: "The thing being sold",
              text: "A storefront with a configurator, a booking platform, a portal customers log into. Here the software *is* the product, so the bar is set by the market rather than by internal tolerance: it has to be fast, obvious and good-looking or it does not get used.",
            },
            {
              label: "Automation",
              title: "Work that stops needing a person",
              text: "Document generation, reconciliation, alerting, report assembly. Usually the smallest projects and the easiest to justify, because the before and after is measured in hours per week that somebody can name.",
            },
          ],
        },
        {
          kind: "p",
          text: "Real builds in each of these five shapes, with what was made and why, are in [Custom Software Development Examples](/resources/custom-software-development-examples).",
        },
        {
          kind: "bridge",
          prompt:
            "Need a software solution designed around how your business already works?",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "when-it-makes-sense",
      heading: "When custom software makes sense",
      blocks: [
        {
          kind: "p",
          text: "There are four situations where a custom build is straightforwardly the right call. They are worth stating plainly, because most of the material written on this subject concludes that the answer is always yes.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**The process is the advantage.** If how you route jobs, price work or handle exceptions is a reason customers choose you, a product that normalises it to the industry default is removing the thing you are selling.",
            "**Per-seat licensing has outgrown the build.** Somewhere past roughly forty to sixty seats on a mid-priced subscription tool, three years of licences costs more than building the part of it you actually use. That crossover is arithmetic, not opinion — it is worked through in [Custom Software Development Cost](/resources/custom-software-development-cost).",
            "**Nothing joins up.** When the real system of record is a spreadsheet somebody maintains by hand from three other systems, the integration work has already been commissioned. It is just being done by a person, unreliably, forever.",
            "**The software is the product.** If customers pay for the application, it cannot be somebody else's application with your logo on it.",
          ],
        },
        {
          kind: "p",
          text: "And the situations where it does not make sense, which are just as common:",
        },
        {
          kind: "list",
          items: [
            "The process is genuinely standard. Payroll, accounting, email, helpdesk — these are solved, regulated, and cheaper to buy than to own.",
            "The requirement is not settled. Building software around a process nobody has agreed on yet produces an expensive record of the disagreement.",
            "There is nobody to own it. Custom software needs a person inside the business who decides what it does next. Without one it drifts for a year and is then replaced.",
            "The budget only covers the build. A build with no maintenance line is a system that will be quietly abandoned around month fourteen.",
          ],
        },
        {
          kind: "note",
          label: "Worth saying out loud",
          text: "We turn down custom builds that should be a subscription. It is a short conversation and it saves everyone a year — and the businesses we have it with tend to come back when they hit the case that genuinely needs building.",
        },
      ],
    },

    {
      id: "how-it-gets-built",
      heading: "How a custom software project actually runs",
      blocks: [
        {
          kind: "p",
          text: "A custom software development project is mostly not typing. The build phase is the visible part, but the phases either side of it are where projects are won or lost: discovery decides whether the right thing gets built, and handover decides whether it survives.",
        },
        {
          kind: "figure",
          diagram: "build-process",
          caption:
            "The five phases of a custom software development process, with the share of a typical engagement each one takes.",
        },
        {
          kind: "p",
          text: "The single most useful thing to understand about the sequence: **discovery is not a formality and it is not free.** It is where the requirement gets pinned down to something specific enough to estimate, and a project that skips it does not save that time — it spends it later, during the build, at development rates, on rework. Each phase is broken down step by step in [the custom software development process](/resources/custom-software-development-process).",
        },
        {
          kind: "p",
          text: "Timelines follow the shape more than the feature count. A focused automation or integration is usually three to ten weeks. An operations tool with a handful of roles runs two to four months. A full system of record — an ERP, a platform with several user types and real permissions — is a four to nine month engagement, and anyone quoting six weeks for one is quoting for a prototype.",
        },
      ],
    },

    {
      id: "what-you-own",
      heading: "What you own at the end",
      blocks: [
        {
          kind: "p",
          text: "This is the part that gets skipped in most engagements, and it is the part that decides whether the project produced an asset or a liability. At handover you should have all of the following, and it should be written into the agreement before the first line of code:",
        },
        {
          kind: "list",
          items: [
            "**The source code**, in a repository your organisation owns, with its full history.",
            "**The infrastructure**, in accounts held in your name — not in the agency's account with a bill forwarded on.",
            "**The data**, in a documented schema, in a database you can back up and export without asking.",
            "**The ability to hand it to someone else.** The honest test of a handover is whether a competent developer who has never met us can run the project locally from the README and ship a change in a day.",
          ],
        },
        {
          kind: "p",
          text: "The last one is the only one that costs something to do properly, which is exactly why it is the one to insist on. Software that only its original authors can safely change is not owned, whatever the contract says.",
        },
      ],
    },
  ],

  faqs: [
    {
      q: "What is custom software development in simple terms?",
      a: "It is building an application specifically for one organisation, designed around how that organisation actually works, rather than buying a ready-made product and adapting the business to fit it.",
    },
    {
      q: "How much does custom software development cost?",
      a: "A focused automation or integration typically runs from around $4,000 to $18,000, an operations tool from $12,000 to $40,000, and a full system of record such as an ERP from $40,000 upward. The variable that moves the number most is the number of distinct user roles, not the number of screens.",
    },
    {
      q: "How long does a custom software project take?",
      a: "Three to ten weeks for an automation or integration, two to four months for an operations tool, and four to nine months for a full platform. Discovery accounts for the first two to four weeks in every case.",
    },
    {
      q: "Is custom software better than off-the-shelf software?",
      a: "Neither is better in general. Buy the things every business does the same way — accounting, payroll, email. Build the thing your business does differently, particularly if that difference is why customers choose you.",
    },
    {
      q: "Who owns the code in a custom software project?",
      a: "You should. Insist that the source code, the hosting accounts and the data all sit in your organisation's name, and that this is written into the agreement before the build starts. That is how we run every engagement.",
    },
    {
      q: "What happens after the software is delivered?",
      a: "It needs an owner and a maintenance budget. Dependencies need updating, browsers and mobile operating systems change underneath it, and the business changes around it. Budget roughly 15 to 20 percent of the build cost per year to keep it healthy.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "fetch-kids"],
};
