import type { Article } from "../types";

/**
 * Examples article: eight builds, each written as trigger, build, result.
 */
export const article: Article = {
  slug: "custom-software-development-examples",
  title: "Custom Software Development Examples",
  metaTitle: "Custom Software Development Examples (With Real Use Cases)",
  description:
    "Eight real custom software development examples (ERP, fleet tracking, e-commerce customisation, field apps) with what prompted each build and what changed.",
  eyebrow: "Custom Software Development",
  lead: "A quick way to judge whether you need custom software is to look at what other businesses had built and why. Below are eight custom software development examples grouped by the problem they solved. Each one covers what prompted the build, what was made and what changed afterwards.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "how-to-read",
      heading: "How to read these examples",
      blocks: [
        {
          kind: "p",
          text: "Each example uses the same three parts, which are also the parts of a sound business case: **the trigger** (what was actually going wrong), **the build** (what was made) and **the result** (what changed). If you cannot fill in all three for your own situation, the requirement is not ready yet. That is useful to know before you spend anything.",
        },
        {
          kind: "p",
          text: "They are grouped by the five shapes a custom build usually takes. If you have not read [what custom software development is](/resources/what-is-custom-software-development), that page defines the categories these examples sit in.",
        },
      ],
    },

    {
      id: "systems-of-record",
      heading: "Examples: systems of record",
      blocks: [
        {
          kind: "p",
          text: "A system of record holds the single authoritative version of something, such as stock, a customer, an order or a case. These are the largest custom builds and show the clearest before-and-after, because what they replace is almost always a set of spreadsheets that quietly disagree with each other.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 01",
              title: "An ERP for a multi-division trading business",
              text: "**Trigger.** Inventory lived in one system, purchase orders in another, HR in a third, and the monthly picture was assembled by hand in a spreadsheet that took two people three days to produce and was out of date the moment it was finished. **Build.** A single platform covering inventory, procurement, finance, HR and reporting, with role-based access so a warehouse supervisor and a finance controller see the same data through different views. **Result.** Nobody assembles the month-end report any more, because the dashboard is the report. This is the shape of the [Emarath ERP](/#projects) build below.",
            },
            {
              label: "Example 02",
              title: "A case management system for a services firm",
              text: "**Trigger.** Every client engagement was a folder, a mailbox thread and a partner's memory. Nobody could answer how many matters were open, or which were at risk, without asking five people. **Build.** A system built around matters: one record per engagement holding its documents, correspondence, deadlines and billing state, plus an escalation view for anything overdue. **Result.** Capacity planning became possible, because the firm could see for the first time what it had actually committed to.",
            },
          ],
        },
        {
          kind: "figure",
          diagram: "systems-map",
          caption:
            "The pattern every system-of-record build follows: many interfaces reading from one authoritative store, instead of many stores that have to be reconciled.",
        },
      ],
    },

    {
      id: "operations-tools",
      heading: "Examples: operations and field tools",
      blocks: [
        {
          kind: "p",
          text: "Operations tools are judged on seconds. If a task happens four hundred times a day, taking fifteen seconds out of it is worth more than any feature you could add. That is why these builds are designed around the person doing the work rather than the data model underneath.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 03",
              title: "A fleet and vehicle tracking console",
              text: "**Trigger.** Vehicle positions came from one supplier's portal, fuel spend from receipts, driver hours from a paper log, and service schedules from a wall calendar. Nobody could tell whether a route was profitable. **Build.** A live console: GPS positions, trip and driver logs, fuel and expense capture, and automated service alerts driven by odometer readings rather than by dates. **Result.** Operating cost could be traced to each vehicle and route, so the reports started being used to cut costs.",
            },
            {
              label: "Example 04",
              title: "A field app for technicians with no signal",
              text: "**Trigger.** Job sheets were completed on paper because the sites had no reliable connectivity, then re-keyed at the depot the next morning. That meant a day's delay and an error rate nobody wanted to measure. **Build.** An offline-first mobile app. The day's jobs download in the morning, get completed with photos and signatures wherever the technician is, and sync when the device next finds a network. **Result.** The re-keying step disappeared, and invoices went out the same day rather than the next week.",
            },
          ],
        },
        {
          kind: "note",
          label: "A pattern worth copying",
          text: "Both of these removed a hand-off rather than replacing a screen. The operations builds with the best return almost always remove a point where information changes hands: paper to keyboard, portal to spreadsheet, phone call to whiteboard.",
        },
      ],
    },

    {
      id: "integration",
      heading: "Examples: integration and data plumbing",
      blocks: [
        {
          kind: "p",
          text: "This is the cheapest custom software most businesses will ever commission, and the kind least likely to be thought of as custom software at all. Nothing new appears on anyone's screen. Two systems just stop disagreeing.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 05",
              title: "A reconciliation layer between storefront, warehouse and accounts",
              text: "**Trigger.** An online order was entered three times: once by the storefront, once into the warehouse system by a picker, and once into the accounting package by a bookkeeper. Stock levels were always wrong by whatever had sold since the last manual sync. **Build.** A middleware service holding the canonical mapping between the three systems, pushing orders and pulling stock on a schedule, with an exception queue for anything that did not reconcile. **Result.** Two re-keying jobs disappeared. The exception queue, usually four or five items a day, became the only thing anyone had to check.",
            },
            {
              label: "Example 06",
              title: "Automated document generation from live data",
              text: "**Trigger.** Quotes, contracts and delivery notes were produced by copying last month's file and editing it, which is how a superseded price list ends up on a signed document. **Build.** A generation service that assembles each document from the current record and the current price list, renders it, and files it against the job. **Result.** That kind of error can no longer happen, and a job that took twenty minutes now takes none.",
            },
          ],
        },
        {
          kind: "bridge",
          prompt:
            "If one of these sounds like your operation, we build systems around how the work already happens.",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "customer-facing",
      heading: "Examples: customer-facing products",
      blocks: [
        {
          kind: "p",
          text: "When the software is what you are selling, the market sets the standard. Staff will work around a clumsy internal tool, but a customer will just leave. These builds need more design and performance work than any other category.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 07",
              title: "A storefront with customisation on the product page",
              text: "**Trigger.** The products are personalised with names, colours and combinations, and every hosted store platform treats customisation as an add-on typed into a text box at checkout. That produced exactly the order errors you would expect. **Build.** A storefront where the customisation *is* the product page. Choices are made and previewed in place, then carried through collections, wishlist, cart and fulfilment as structured data instead of a note. **Result.** The order and the thing being made are the same record. This is the [Fetch Kids](https://www.fetchkids.in/) build.",
            },
            {
              label: "Example 08",
              title: "A studio site where the experience is the pitch",
              text: "**Trigger.** An interiors practice with spatial, cinematic work was using a template gallery that made it look like everyone else. **Build.** A dark, scroll-led site designed as one continuous descent. The hero is a room you walk into, and services, philosophy and work follow on from it. **Result.** The site filters enquiries for the studio, so the people who get in touch already understand the standard of work. This is [MOODbyTEAL](https://moodbyteal.com/).",
            },
          ],
        },
      ],
    },

    {
      id: "business-use-cases",
      heading: "Business use cases, by what you are trying to fix",
      blocks: [
        {
          kind: "p",
          text: "Here are the same eight examples sorted by business problem instead of software category. This is usually the quicker way to spot your own situation.",
        },
        {
          kind: "table",
          caption:
            "Matching a business problem to the kind of custom software that solves it.",
          head: ["If this is the problem", "The build is usually", "Typical scale"],
          rows: [
            [
              "The same data is entered into two systems",
              "An integration layer with an exception queue",
              "4–10 weeks",
            ],
            [
              "Nobody can answer a question without asking three people",
              "A system of record with a reporting view",
              "4–9 months",
            ],
            [
              "Work is recorded on paper and re-keyed later",
              "An offline-capable field or floor app",
              "2–4 months",
            ],
            [
              "Documents are made by editing last month's copy",
              "A generation service driven by live records",
              "3–8 weeks",
            ],
            [
              "Licence spend rises every time you hire",
              "An internal replacement for the part you use",
              "2–4 months",
            ],
            [
              "The product is the software and it looks generic",
              "A bespoke front end with real design work",
              "6 weeks–4 months",
            ],
          ],
        },
      ],
    },

    {
      id: "when-custom-makes-sense",
      heading: "When custom software makes sense, and when it does not",
      blocks: [
        {
          kind: "p",
          text: "After reading a list of examples, every problem starts to look like a custom software problem. Before going further, run through this short test.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Can you name the hours?** If you cannot say roughly how many person-hours a week the current process consumes, you cannot justify replacing it and you probably do not understand it yet.",
            "**Is the process settled?** Software locks a process in place. If people are still arguing about the process, building around it just gives you an expensive record of the argument.",
            "**Is it actually different?** If a subscription product does 90% of it and the missing 10% is preference rather than advantage, buy the product.",
            "**Is there an owner?** Someone inside the business has to decide what it does next year. Without that person the system drifts and is replaced.",
          ],
        },
        {
          kind: "p",
          text: "With four yeses, a custom build will pay for itself. With three, a discovery engagement is worth doing to find out. With fewer, we would usually recommend configuring something you already own more effectively. The full comparison is in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
        },
      ],
    },
  ],

  faqs: [
    {
      q: "What are some common examples of custom software?",
      a: "The most common are ERP and inventory systems, CRM and case management, fleet and logistics consoles, offline-capable field apps, integration layers between existing systems, automated document generation, and customer-facing products such as storefronts with real product customisation.",
    },
    {
      q: "What is an example of custom software in a small business?",
      a: "Usually an integration or an automation rather than a platform. A layer that keeps a storefront, a warehouse system and an accounting package in agreement, or a service that generates quotes and delivery notes from live records, are both small builds with a return that is easy to measure.",
    },
    {
      q: "Is a custom website an example of custom software development?",
      a: "Yes, when it does something rather than just presenting pages, as with a storefront with product customisation, a booking system or a customer portal. A brochure site built on a template is not. A bespoke front end built around the brand sits somewhere in between, and should be judged on whether the design is actually bringing in business.",
    },
    {
      q: "How do I know if my business needs custom software?",
      a: "Ask whether you can name the hours the current process consumes, whether the process is settled, whether it is genuinely different from how other businesses do it, and whether someone inside the company will own the system. If all four answers are yes, a build will pay for itself.",
    },
    {
      q: "What is the smallest useful custom software project?",
      a: "Typically a document generation service or a single integration between two systems you already have. Both are usually three to eight weeks, and both remove a recurring manual step rather than adding a new screen anyone has to learn.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "fetch-kids", "mood-by-teal"],
};
