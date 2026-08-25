import type { Article } from "../types";

/**
 * The example-driven entry point to the cluster.
 *
 * This one carries the most inbound intent — somebody searching for examples
 * is usually trying to work out whether their own situation is a custom
 * software problem, which is a question a definition cannot answer and a list
 * of concrete builds can. So it is built as a catalogue: eight examples, each
 * with the trigger that caused it, what got built, and what changed.
 */
export const article: Article = {
  slug: "custom-software-development-examples",
  title: "Custom Software Development Examples",
  metaTitle: "Custom Software Development Examples (With Real Use Cases)",
  description:
    "Eight real-world custom software development examples — ERP, fleet tracking, e-commerce customisation, field apps and more — with what triggered each build and what it changed.",
  eyebrow: "Custom Software Development",
  lead: "The fastest way to work out whether you need custom software is to look at what other businesses actually had built and why. Below are eight custom software development examples grouped by the problem they solved, each with the trigger that caused the build, what was made, and what measurably changed afterwards.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "how-to-read",
      heading: "How to read these examples",
      blocks: [
        {
          kind: "p",
          text: "Every example here follows the same three-part structure, because that is the structure of an honest business case: **the trigger** (what was actually going wrong), **the build** (what was made), and **the result** (what changed). If you cannot fill in all three for your own situation, the requirement is not ready yet — which is a finding, not a failure.",
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
          text: "A system of record is software whose job is to hold the single authoritative version of something — stock, a customer, an order, a case. These are the largest custom builds and the ones with the clearest before-and-after, because the state they replace is almost always a set of spreadsheets that quietly disagree with each other.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 01",
              title: "An ERP for a multi-division trading business",
              text: "**Trigger.** Inventory lived in one system, purchase orders in another, HR in a third, and the monthly picture was assembled by hand in a spreadsheet that took two people three days to produce and was out of date the moment it was finished. **Build.** A single platform covering inventory, procurement, finance, HR and reporting, with role-based access so a warehouse supervisor and a finance controller see the same data through different windows. **Result.** The month-end assembly stopped existing as a task; the dashboard is the report. This is the shape of the [Emarath ERP](/#projects) build below.",
            },
            {
              label: "Example 02",
              title: "A case management system for a services firm",
              text: "**Trigger.** Every client engagement was a folder, a mailbox thread and a partner's memory. Nobody could answer how many matters were open, or which were at risk, without asking five people. **Build.** A matter-centric system: one record per engagement, carrying its documents, its correspondence, its deadlines and its billing state, with an escalation view for anything past a date. **Result.** Capacity planning became possible — the firm could see, for the first time, what it had actually committed to.",
            },
          ],
        },
        {
          kind: "figure",
          diagram: "systems-map",
          caption:
            "The pattern every system-of-record build follows: many interfaces, one authoritative store — instead of many stores that have to be reconciled.",
        },
      ],
    },

    {
      id: "operations-tools",
      heading: "Examples: operations and field tools",
      blocks: [
        {
          kind: "p",
          text: "Operations tools are judged on seconds. If a task happens four hundred times a day, taking fifteen seconds out of it is worth more than any feature you could add — and that arithmetic is why these builds are designed around the person doing the work rather than around the data model underneath.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 03",
              title: "A fleet and vehicle tracking console",
              text: "**Trigger.** Vehicle positions came from one supplier's portal, fuel spend from receipts, driver hours from a paper log, and service schedules from a wall calendar. Nobody could tell whether a route was profitable. **Build.** A live console: GPS positions, trip and driver logs, fuel and expense capture, and automated service alerts driven by odometer readings rather than by dates. **Result.** Operating cost became attributable per vehicle and per route, which turned a reporting exercise into a cost-reduction one.",
            },
            {
              label: "Example 04",
              title: "A field app for technicians with no signal",
              text: "**Trigger.** Job sheets were completed on paper because the sites had no reliable connectivity, then re-keyed at the depot the next morning — with a day's lag and a re-keying error rate nobody wanted to measure. **Build.** An offline-first mobile app: the day's jobs are downloaded in the morning, completed with photos and signatures anywhere, and synchronised when the device next sees a network. **Result.** The re-keying step disappeared, and invoices went out the same day rather than the next week.",
            },
          ],
        },
        {
          kind: "note",
          label: "The pattern worth stealing",
          text: "Both of these replaced a hand-off, not a screen. The highest-return operations builds almost always remove a moment where information changes hands — paper to keyboard, portal to spreadsheet, phone call to whiteboard.",
        },
      ],
    },

    {
      id: "integration",
      heading: "Examples: integration and data plumbing",
      blocks: [
        {
          kind: "p",
          text: "The cheapest custom software most businesses will ever commission, and the least likely to be recognised as custom software at all. Nothing new appears on anyone's screen; two systems simply stop disagreeing.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 05",
              title: "A reconciliation layer between storefront, warehouse and accounts",
              text: "**Trigger.** An online order was entered three times: once by the storefront, once into the warehouse system by a picker, and once into the accounting package by a bookkeeper. Stock levels were reliably wrong by the amount of whatever had been sold since the last manual sync. **Build.** A middleware service holding the canonical mapping between the three systems, pushing orders and pulling stock on a schedule, with an exception queue for anything that did not reconcile. **Result.** Two re-keying jobs stopped existing. The exception queue — usually four or five items a day — became the only thing anyone had to look at.",
            },
            {
              label: "Example 06",
              title: "Automated document generation from live data",
              text: "**Trigger.** Quotes, contracts and delivery notes were produced by copying last month's file and editing it, which is how a superseded price list ends up on a signed document. **Build.** A generation service that assembles each document from the current record and the current price list, renders it, and files it against the job. **Result.** A category of error stopped being possible, and a job that took twenty minutes takes none.",
            },
          ],
        },
        {
          kind: "bridge",
          prompt:
            "Recognise your own operation in one of these? We build systems designed around how the work already happens.",
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
          text: "When the software is the thing being sold, the standard is set by the market rather than by internal tolerance. Staff will work around a clumsy internal tool; a customer will simply leave. These builds carry more design weight and more performance work than any other category.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Example 07",
              title: "A storefront with customisation on the product page",
              text: "**Trigger.** The products are personalised — names, colours, combinations — and every hosted store platform treats customisation as an add-on typed into a text box at checkout, which produces exactly the order errors you would expect. **Build.** A storefront where the customisation *is* the product page: choices are made and previewed in place, then carried through collections, wishlist, cart and fulfilment as structured data rather than as a note. **Result.** The order and the thing being made are the same record. This is the [Fetch Kids](https://www.fetchkids.in/) build.",
            },
            {
              label: "Example 08",
              title: "A studio site where the experience is the pitch",
              text: "**Trigger.** An interiors practice whose work is spatial and cinematic, being represented by a template gallery that made it look like everyone else's. **Build.** A dark, scroll-led site built as one continuous descent — the hero is a room you walk into, and services, philosophy and work unfold from it. **Result.** The site does the qualifying: enquiries arrive from people who have already understood the standard. This is [MOODbyTEAL](https://moodbyteal.com/).",
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
          text: "The same eight examples, indexed the other way round — by the business problem rather than by the software category. This is usually the faster route to recognising your own situation.",
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
      heading: "When custom software makes sense — and when it does not",
      blocks: [
        {
          kind: "p",
          text: "Reading a list of examples makes every problem look like a custom software problem. It is worth applying the brakes deliberately, so here is the short version of the test.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Can you name the hours?** If you cannot say roughly how many person-hours a week the current process consumes, you cannot justify replacing it and you probably do not understand it yet.",
            "**Is the process settled?** Software fixes a process in place. Building around a process still being argued about produces an expensive record of the argument.",
            "**Is it actually different?** If a subscription product does 90% of it and the missing 10% is preference rather than advantage, buy the product.",
            "**Is there an owner?** Someone inside the business has to decide what it does next year. Without that person the system drifts and is replaced.",
          ],
        },
        {
          kind: "p",
          text: "Four yeses and a custom build will pay for itself. Three and it is worth a discovery engagement to find out. Fewer, and the honest recommendation is usually a better configuration of something you already own. The trade is set out in full in [Custom Software vs Off-the-Shelf Software](/resources/custom-software-vs-off-the-shelf).",
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
      a: "Yes, when it does something rather than just presenting pages — a storefront with product customisation, a booking system, or a customer portal. A brochure site built on a template is not; a bespoke front end that carries the brand experience sits somewhere in between and is judged on whether the design work is doing real commercial work.",
    },
    {
      q: "How do I know if my business needs custom software?",
      a: "Ask whether you can name the hours the current process consumes, whether the process is settled, whether it is genuinely different from how other businesses do it, and whether someone inside the company will own the system. Four yeses and a build will pay for itself.",
    },
    {
      q: "What is the smallest useful custom software project?",
      a: "Typically a document generation service or a single integration between two systems you already have. Both are usually three to eight weeks, and both remove a recurring manual step rather than adding a new screen anyone has to learn.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "fetch-kids", "mood-by-teal"],
};
