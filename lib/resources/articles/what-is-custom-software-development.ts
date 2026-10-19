import type { Article } from "../types";

/**
 * Pillar page for the custom software development cluster. Stays broad and
 * links out to the four detail articles, which all link back here.
 */
export const article: Article = {
  slug: "what-is-custom-software-development",
  title: "What Is Custom Software Development?",
  metaTitle: "What Is Custom Software Development? A Practical Guide",
  description:
    "Custom software development means building software around how your business already works, instead of reshaping the business to suit a product.",
  eyebrow: "Custom Software Development",
  lead: "Custom software development is the practice of designing and building an application around one organisation's actual operations, instead of adopting a product built for the average of everyone else's. This guide covers what gets built, when it is worth it and what it costs. It also covers when buying something off the shelf is the better answer.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "definition",
      heading: "What custom software development actually means",
      blocks: [
        {
          kind: "p",
          text: "Custom software is written for one organisation and shaped by that organisation's processes. Off-the-shelf software is written for a market and shaped by the average of everyone in it. Most of the practical differences between the two come from that.",
        },
        {
          kind: "p",
          text: "In practice, a custom build starts from how work already happens. Someone sits with the people doing the job and watches the spreadsheet get filled in, the message get sent and the paper docket get carried across the yard. Then they design a system that removes those steps, instead of one that assumes they never existed. You usually end up with *less* software than a commercial product gives you, with nothing in it that this business does not do.",
        },
        {
          kind: "note",
          label: "A useful test",
          text: "If the honest answer to a question about how something gets handled is “we have a workaround for it”, you are already paying for custom software. The payment is in salaried hours, and the maintenance is done by whoever remembers the workaround.",
        },
        {
          kind: "p",
          text: "The term covers a wide range of things. A **bespoke web application** replacing four spreadsheets is custom software. So is an integration layer that makes an accounting package and a warehouse system agree on what a stock level is. So is a customer-facing product that *is* the business. In each case the specification came from the organisation, not from a vendor's roadmap.",
        },
      ],
    },

    {
      id: "how-it-differs",
      heading: "How it differs from off-the-shelf software",
      blocks: [
        {
          kind: "p",
          text: "People often frame this as quality against cost, but good commercial software is very good, and a bad custom build is worse than either. The real trade-off is between **fit** and **leverage**. A product you buy has thousands of other customers paying down its development and filing its bug reports. A product you build fits your operation exactly and answers only to you.",
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
              "Low to start, then per seat, forever. It rises with headcount.",
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
          text: "Most organisations end up with both, and that is usually the right outcome. You buy the things that are the same everywhere (email, payroll, accounting, video calls) and build the thing that is different, which is usually the operation your customers actually pay you for. The full version of this argument, with the arithmetic, is in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
        },
      ],
    },

    {
      id: "what-gets-built",
      heading: "What custom software development usually gets built to do",
      blocks: [
        {
          kind: "p",
          text: "Across the projects we take on, custom builds fall into five recognisable shapes. Working out which one you are looking at is most of the estimating work, because the effort sits in a different place for each.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Systems of record",
              title: "One place the truth lives",
              text: "ERP and CRM builds, inventory systems, case management. The aim is that stock, a customer or an order has exactly one authoritative record, and every screen reads from it. The feature list matters less. These are the builds that get rid of reconciliation meetings.",
            },
            {
              label: "Operations tools",
              title: "The work itself, made faster",
              text: "Dispatch consoles, field apps, scheduling boards, approval queues. They are judged on how many seconds they take out of a task that happens four hundred times a day, so they should be designed around the person doing it rather than around the data model.",
            },
            {
              label: "Integration",
              title: "Making two systems agree",
              text: "The least glamorous category, and often the one with the best return. A layer that reconciles an accounting package, a storefront and a warehouse so that nobody re-keys anything. Frequently the cheapest custom software a business will ever commission.",
            },
            {
              label: "Customer-facing products",
              title: "The thing being sold",
              text: "A storefront with a configurator, a booking platform, a portal customers log into. Here the software *is* the product, so the market sets the standard, not internal staff who will put up with things. If it is slow, confusing or ugly, people will not use it.",
            },
            {
              label: "Automation",
              title: "Work that stops needing a person",
              text: "Document generation, reconciliation, alerting, report assembly. Usually the smallest projects and the easiest to justify, because the saving is a number of hours per week that somebody can point to.",
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
          text: "In four situations a custom build is clearly the right call. We list them plainly because most of what is written on this subject concludes that the answer is always yes.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**The process is the advantage.** If how you route jobs, price work or handle exceptions is a reason customers choose you, a product that normalises it to the industry default is removing the thing you are selling.",
            "**Per-seat licensing has outgrown the build.** Somewhere past roughly forty to sixty seats on a mid-priced subscription tool, three years of licences costs more than building the part of it you actually use. The arithmetic is worked through in [Custom Software Development Cost](/resources/custom-software-development-cost).",
            "**Nothing joins up.** When the real system of record is a spreadsheet somebody maintains by hand from three other systems, you are already paying for integration work. A person is doing it, unreliably, with no end date.",
            "**The software is the product.** If customers pay for the application, it cannot be somebody else's application with your logo on it.",
          ],
        },
        {
          kind: "p",
          text: "The situations where it does not make sense are just as common:",
        },
        {
          kind: "list",
          items: [
            "The process is genuinely standard. Payroll, accounting, email and helpdesk are solved problems, often regulated, and cheaper to buy than to own.",
            "The requirement is not settled. Building software around a process nobody has agreed on yet produces an expensive record of the disagreement.",
            "There is nobody to own it. Custom software needs a person inside the business who decides what it does next. Without one it drifts for a year and is then replaced.",
            "The budget only covers the build. A build with no maintenance line is a system that will be quietly abandoned around month fourteen.",
          ],
        },
        {
          kind: "note",
          label: "For the record",
          text: "We turn down custom builds that should be a subscription. It is a short conversation and it saves everyone a year. The businesses we have it with tend to come back when they hit something that genuinely needs building.",
        },
      ],
    },

    {
      id: "how-it-gets-built",
      heading: "How a custom software project actually runs",
      blocks: [
        {
          kind: "p",
          text: "Most of a custom software development project is not writing code. The build phase is the part people see, but projects succeed or fail in the phases either side of it. Discovery decides whether the right thing gets built, and handover decides whether it survives.",
        },
        {
          kind: "figure",
          diagram: "build-process",
          caption:
            "The five phases of a custom software development process, with the share of a typical engagement each one takes.",
        },
        {
          kind: "p",
          text: "If you take one thing from the sequence, make it this: **discovery is a real phase, and it costs money.** It is where the requirement is pinned down well enough to estimate. A project that skips it does not save that time. It spends it later on rework, during the build, at development rates. Each phase is broken down step by step in [the custom software development process](/resources/custom-software-development-process).",
        },
        {
          kind: "p",
          text: "Timelines depend on the shape of the project more than the feature count. A focused automation or integration is usually three to ten weeks. An operations tool with a handful of roles runs two to four months. A full system of record, such as an ERP or a platform with several user types and real permissions, takes four to nine months. Anyone quoting six weeks for one is quoting for a prototype.",
        },
      ],
    },

    {
      id: "what-you-own",
      heading: "What you own at the end",
      blocks: [
        {
          kind: "p",
          text: "Most engagements skip this part, yet it decides whether the project leaves you with an asset or a liability. At handover you should have all of the following, written into the agreement before any code is written:",
        },
        {
          kind: "list",
          items: [
            "**The source code**, in a repository your organisation owns, with its full history.",
            "**The infrastructure**, in accounts held in your name, not in the agency's account with the bill passed on to you.",
            "**The data**, in a documented schema, in a database you can back up and export without asking.",
            "**The ability to hand it to someone else.** A fair test of a handover is whether a competent developer who has never met us can run the project locally from the README and ship a change in a day.",
          ],
        },
        {
          kind: "p",
          text: "The last one is the only item that takes real effort to do properly, which is why you should insist on it. If only the original authors can safely change the software, you do not really own it, whatever the contract says.",
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
      a: "It depends on the type of project, from a focused automation at the small end to a full system of record such as an ERP at the large end. The variable that moves the number most is the number of distinct user roles, not the number of screens. Discovery produces a fixed price.",
    },
    {
      q: "How long does a custom software project take?",
      a: "Three to ten weeks for an automation or integration, two to four months for an operations tool, and four to nine months for a full platform. Discovery accounts for the first two to four weeks in every case.",
    },
    {
      q: "Is custom software better than off-the-shelf software?",
      a: "Neither is better in general. Buy the things every business does the same way, such as accounting, payroll and email. Build the thing your business does differently, particularly if that difference is why customers choose you.",
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
