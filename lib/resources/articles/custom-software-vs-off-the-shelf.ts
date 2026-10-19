import type { Article } from "../types";

/**
 * Build-vs-buy article. Deliberately two-sided: the "when to buy" section
 * is what makes it credible, so keep it.
 */
export const article: Article = {
  slug: "custom-software-vs-off-the-shelf",
  title: "Custom Software vs Off-the-Shelf Software",
  metaTitle: "Custom Software vs Off-the-Shelf: How to Decide",
  description:
    "A fair comparison of custom software and off-the-shelf products: the trade-offs, the cost crossover, and a decision test you can apply in an afternoon.",
  eyebrow: "Custom Software Development",
  lead: "Almost every business needs both, so the useful question is which parts of your operation belong in each. This compares custom software and off-the-shelf products on the six factors that usually settle it, and ends with a test you can run on your own situation in an afternoon.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "the-real-trade",
      heading: "The real trade-off",
      blocks: [
        {
          kind: "p",
          text: "The comparison is usually framed as cost against quality, which misleads on both sides. Commercial software is often excellent, and a badly run custom build is worse than either option. The trade-off that matters is between **leverage** and **fit**.",
        },
        {
          kind: "p",
          text: "An off-the-shelf product has thousands of customers sharing its development cost and finding its bugs. You get years of accumulated work for a monthly fee. In return you accept the product as it is, designed around the average of everyone using it and changed by a roadmap you do not control.",
        },
        {
          kind: "p",
          text: "Custom software has one customer paying for all of it. In return it fits your operation exactly, changes when you decide, and keeps your data in a schema you chose. Most of the rest of this comparison follows from those two points.",
        },
        {
          kind: "figure",
          diagram: "build-vs-buy",
          caption:
            "How the two options fit an operation: a product covers the common ground well and stops at the edges; a custom build is shaped to include them.",
        },
      ],
    },

    {
      id: "comparison",
      heading: "Custom vs off-the-shelf software, compared on six factors",
      blocks: [
        {
          kind: "table",
          caption:
            "The six factors that change a decision. Speed and support favour buying; fit, control and data favour building.",
          head: ["", "Off-the-shelf", "Custom"],
          rows: [
            [
              "Speed to value",
              "Days. A real advantage, and often the deciding one.",
              "Weeks to months before anyone uses it.",
            ],
            [
              "Cost shape",
              "Low entry, per seat, permanent, and rising with headcount.",
              "High entry, then maintenance. Flat as you grow.",
            ],
            [
              "Fit",
              "Excellent for what every business shares; awkward at your edges.",
              "Shaped to your operation, including the edges.",
            ],
            [
              "Control of change",
              "Their roadmap. Your feature request joins a queue.",
              "Yours entirely, and you fund it.",
            ],
            [
              "Data",
              "Their schema, their export format, their retention policy.",
              "Your database, your schema, your backups.",
            ],
            [
              "Support burden",
              "Theirs. A big benefit that is easy to undervalue.",
              "Yours, whether in-house or contracted.",
            ],
          ],
        },
        {
          kind: "note",
          label: "Two rows that are usually underweighted",
          text: "Speed to value and support burden are the strongest arguments for buying, and comparisons written by development agencies tend to wave them away. A product you can use on Monday, maintained by someone else, makes up for a lot of imperfect fit.",
        },
      ],
    },

    {
      id: "when-to-buy",
      heading: "When to buy off-the-shelf software",
      blocks: [
        {
          kind: "p",
          text: "We build software, so this comparison is only worth reading if we also say when you should not hire us. These are the cases where buying is the better choice.",
        },
        {
          kind: "list",
          items: [
            "**Accounting, payroll and tax.** Regulated, changing every year, and identical across businesses. Building your own is expensive and creates a compliance liability you now own.",
            "**Email, calendars, file storage, video calls.** Already done to a standard no project budget is going to beat.",
            "**Standard helpdesk, HR and applicant tracking.** These processes are the same everywhere for good reasons. Configure a product.",
            "**Anything you have not done manually yet.** If the process does not exist, software will not create it. It will just lock a guess in place.",
            "**Anything where a product does 90% and the missing 10% is preference.** A preference does not justify a build; a competitive advantage can.",
          ],
        },
        {
          kind: "p",
          text: "A simple rule of thumb: if your competitors do it the same way you do, buy it. The parts of an operation worth building are the ones where doing it differently is what sets you apart.",
        },
      ],
    },

    {
      id: "when-to-build",
      heading: "When to build custom software",
      blocks: [
        {
          kind: "list",
          items: [
            "**The process is a competitive advantage.** How you price, route, schedule or handle exceptions is a reason customers choose you. A product that flattens it to the industry default removes the thing you sell.",
            "**Licence spend has passed the crossover.** Seats times monthly price times thirty-six, against a build plus three years of maintenance. The [cost article](/resources/custom-software-development-cost#build-vs-subscribe) shows how to work it out.",
            "**Nothing joins up.** Where the real system of record is a spreadsheet maintained by hand from three other systems, you are already paying for integration. A person is doing it by hand, with no end date.",
            "**The software is the product.** If customers pay for the application, it cannot be somebody else's application with your logo on it.",
            "**A product's limits have become business limits.** Once people are saying \"we can't do that because the system won't\" about something a customer has asked for, the tool is making commercial decisions for you.",
          ],
        },
        {
          kind: "p",
          text: "For what each of these looks like in practice (the trigger, the build and the result), see [Custom Software Development Examples](/resources/custom-software-development-examples).",
        },
        {
          kind: "bridge",
          prompt:
            "If the answer is build, the next step is a scope and a price, not a sales proposal.",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "hybrid",
      heading: "The answer is usually both",
      blocks: [
        {
          kind: "p",
          text: "Established businesses rarely end up with only one or the other. They buy the commodity layers, build the part that is genuinely theirs and connect the two. That makes the integration layer the most valuable and least glamorous software most businesses own.",
        },
        {
          kind: "figure",
          diagram: "integration-spine",
          caption:
            "The arrangement most established businesses end up with: bought products at the edges, a custom core for the work that is actually theirs, and an integration layer holding the two in agreement.",
        },
        {
          kind: "p",
          text: "Plan for one practical consequence. Data goes wrong at the boundary between bought and built, so that boundary needs an owner and an exception queue, not a nightly job nobody watches. It is also the cheapest place to start. An integration is usually a four to ten week project, and it often makes the case for everything that follows.",
        },
      ],
    },

    {
      id: "decision-test",
      heading: "A decision test you can run this week",
      blocks: [
        {
          kind: "p",
          text: "Answer these five questions honestly for one process at a time, not for the business as a whole, because the answer usually differs from one process to the next.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Do your competitors do this the same way?** If yes, you should almost certainly buy.",
            "**Can you say how many hours the current process takes each week?** If not, measure that first. Every business case you make will depend on it.",
            "**Does a product do 90% of it?** If the missing 10% is preference, buy and adapt. If it is the reason customers choose you, build.",
            "**What is seats × monthly price × 36?** Compare against a build plus three years of maintenance at 15–20% a year.",
            "**Is there a person inside the business who will own the system next year?** If not, buy. Custom software without an internal owner drifts for a year and then gets replaced at full cost.",
          ],
        },
        {
          kind: "note",
          label: "What to do with a split result",
          text: "A mixed answer is the most common result, and it usually means the same thing: buy the product, then build the integration or the one screen that closes the 10% gap. That is a much smaller project than replacing the product, and often the right first step even if a full build comes later.",
        },
      ],
    },
  ],

  faqs: [
    {
      q: "What is the difference between custom software and off-the-shelf software?",
      a: "Off-the-shelf software is built for a market and shaped by the average of everyone in it, so you get years of shared development for a monthly fee and accept the shape it has. Custom software is built for one organisation and shaped by its processes, so it fits exactly and changes when you decide it changes.",
    },
    {
      q: "Is custom software worth it for a small business?",
      a: "Often, but rarely as a full platform. The builds that pay off fastest for small businesses are integrations and automations, such as removing a re-keying step or generating documents from live records. These are usually three to ten week projects with a return you can measure directly.",
    },
    {
      q: "At what point does building become cheaper than subscribing?",
      a: "Multiply your seat count by the monthly licence by thirty-six and compare with a build plus three years of maintenance. Small teams usually do better subscribing, and each new hire tips the balance further towards building.",
    },
    {
      q: "What should I never build myself?",
      a: "Accounting, payroll and tax, because they are regulated and change every year. Email, calendars, file storage and video calls, because they are solved. Inside your own build, use established services for authentication, payments and email delivery instead of writing them yourself.",
    },
    {
      q: "Can I use custom software and off-the-shelf software together?",
      a: "Yes, and most businesses end up doing exactly that. Buy the commodity layers, build the part that is genuinely yours, and connect them with an integration layer that has an owner and an exception queue. The integration is often the highest-return software a business owns.",
    },
    {
      q: "How do I decide between building and buying?",
      a: "Ask it one process at a time, not for the business as a whole: do competitors do it the same way, can you name the hours it consumes, does a product cover 90 percent, what is the three-year licence cost, and is there someone internally who will own the system. The answers usually differ by process, which is why most businesses end up with both.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "vrs-real-invest"],
};
