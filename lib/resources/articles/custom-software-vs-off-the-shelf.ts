import type { Article } from "../types";

/**
 * The decision article — the one that closes the cluster.
 *
 * Written to be genuinely two-sided. A comparison page published by a company
 * that sells one of the two options is worth nothing unless it is willing to
 * recommend the other, so this one does, specifically and by name, in its own
 * section. That is also what makes it credible to the reader who arrives
 * already suspecting the conclusion.
 */
export const article: Article = {
  slug: "custom-software-vs-off-the-shelf",
  title: "Custom Software vs Off-the-Shelf Software",
  metaTitle: "Custom Software vs Off-the-Shelf: How to Decide",
  description:
    "A two-sided comparison of custom software and off-the-shelf products — the real trade-offs, the cost crossover, and a decision test you can apply in an afternoon.",
  eyebrow: "Custom Software Development",
  lead: "Almost every business needs both, and the useful question is not which is better but which one each part of your operation belongs in. This compares custom software and off-the-shelf products on the six things that actually decide it, and ends with a test you can run on your own situation in an afternoon.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "the-real-trade",
      heading: "The real trade-off",
      blocks: [
        {
          kind: "p",
          text: "The comparison is usually framed as cost against quality, and that framing is wrong in both directions: commercial software is often excellent, and a badly-run custom build is worse than either option. The actual trade is between **leverage** and **fit**.",
        },
        {
          kind: "p",
          text: "An off-the-shelf product has thousands of customers sharing its development cost and finding its bugs. You get years of accumulated work for a monthly fee, and in exchange you accept the shape it has — a shape decided by the average of everyone using it, and changed by a roadmap you do not control.",
        },
        {
          kind: "p",
          text: "Custom software has one customer paying for all of it. In exchange it fits your operation exactly, it changes when you decide it changes, and the data sits in a schema you chose. Everything else in this comparison is a consequence of those two sentences.",
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
      heading: "Custom vs off-the-shelf, on the six things that decide it",
      blocks: [
        {
          kind: "table",
          caption:
            "The six dimensions that change a decision. Speed and support genuinely favour buying; fit, control and data genuinely favour building.",
          head: ["", "Off-the-shelf", "Custom"],
          rows: [
            [
              "Speed to value",
              "Days. This advantage is real and frequently decisive.",
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
              "Theirs. A significant and often undervalued benefit.",
              "Yours, whether in-house or contracted.",
            ],
          ],
        },
        {
          kind: "note",
          label: "Two rows deserve more weight than they usually get",
          text: "Speed to value and support burden are the strongest arguments for buying, and they are the two most often waved away in comparisons written by development agencies. A product you can use on Monday, maintained by someone else, is worth a great deal of imperfect fit.",
        },
      ],
    },

    {
      id: "when-to-buy",
      heading: "When to buy — specifically",
      blocks: [
        {
          kind: "p",
          text: "This section exists because a comparison written by a company that builds software is worthless unless it will name the cases where you should not hire them. These are those cases.",
        },
        {
          kind: "list",
          items: [
            "**Accounting, payroll and tax.** Regulated, changing every year, and identical across businesses. Building your own is expensive and creates a compliance liability you now own.",
            "**Email, calendars, file storage, video calls.** Solved to a standard nobody is going to beat with a project budget.",
            "**Standard helpdesk, HR and applicant tracking.** These processes are the same everywhere for good reasons. Configure a product.",
            "**Anything you have not done manually yet.** If the process does not exist, software will not create it — it will fix a guess in place.",
            "**Anything where a product does 90% and the missing 10% is preference.** Preference is not a business case. Advantage is.",
          ],
        },
        {
          kind: "p",
          text: "A useful heuristic: if your competitors do it the same way you do, buy it. The parts of an operation worth building are the parts where doing it differently is the point.",
        },
      ],
    },

    {
      id: "when-to-build",
      heading: "When to build — specifically",
      blocks: [
        {
          kind: "list",
          items: [
            "**The process is a competitive advantage.** How you price, route, schedule or handle exceptions is a reason customers choose you, and a product that normalises it to the industry default deletes the thing you sell.",
            "**Licence spend has passed the crossover.** Seats times monthly price times thirty-six, against a build plus three years of maintenance. The [cost article](/resources/custom-software-development-cost#build-vs-subscribe) works the arithmetic through with a table.",
            "**Nothing joins up.** Where the real system of record is a spreadsheet maintained by hand from three other systems, the integration has already been commissioned — it is just being performed by a person, indefinitely.",
            "**The software is the product.** If customers pay for the application, it cannot be somebody else's application with your logo on it.",
            "**A product's constraint has become a business constraint.** The moment \"we can't do that because the system won't\" is being said about something a customer is asking for, the tool has started making commercial decisions.",
          ],
        },
        {
          kind: "p",
          text: "What each of these looks like in practice — the trigger, the build, the result — is set out in [Custom Software Development Examples](/resources/custom-software-development-examples).",
        },
        {
          kind: "bridge",
          prompt:
            "If the answer is build, the next step is a scope and a number rather than a proposal.",
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
          text: "In practice the mature arrangement is neither pure. You buy the commodity layers, build the thing that is genuinely yours, and connect them — which makes the integration layer the most valuable and least glamorous software most businesses own.",
        },
        {
          kind: "figure",
          diagram: "integration-spine",
          caption:
            "The arrangement most established businesses end up with: bought products at the edges, a custom core for the work that is actually theirs, and an integration layer holding the two in agreement.",
        },
        {
          kind: "p",
          text: "This shape has a practical consequence worth planning for: the boundary between bought and built is where data goes wrong, so it needs an owner and an exception queue rather than a nightly job nobody watches. It is also the cheapest place to start — an integration is usually a four to ten week project, and it is often the one that makes the case for everything after it.",
        },
      ],
    },

    {
      id: "decision-test",
      heading: "A decision test you can run this week",
      blocks: [
        {
          kind: "p",
          text: "Five questions, answered honestly, on one process at a time. Not on the business as a whole — the whole point is that the answer differs by process.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Do your competitors do this the same way?** Yes, and you should almost certainly buy.",
            "**Can you name the hours the current process consumes each week?** If not, measure that first. It is the numerator of every business case you are about to make.",
            "**Does a product do 90% of it?** If the missing 10% is preference, buy and adapt. If it is the reason customers choose you, build.",
            "**What is seats × monthly price × 36?** Compare against a build plus three years of maintenance at 15–20% a year.",
            "**Is there a person inside the business who will own the system next year?** If not, buy — custom software without an internal owner drifts for a year and is then replaced at full cost.",
          ],
        },
        {
          kind: "note",
          label: "What to do with a split result",
          text: "A mixed answer is the most common outcome and usually points at the same thing: buy the product, and build the integration or the one screen that closes the 10% gap. That is a far smaller project than replacing the product, and it is frequently the right first move even when a full build is eventually coming.",
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
      a: "Often, but rarely as a full platform. The builds that pay off fastest for small businesses are integrations and automations — removing a re-keying step or generating documents from live records — which are usually three to ten week projects with a return you can measure directly.",
    },
    {
      q: "At what point does building become cheaper than subscribing?",
      a: "Multiply your seat count by the monthly licence by thirty-six and compare with a build plus three years of maintenance. For a $45 per seat product against a $30,000 build, the crossover is around thirty seats — and it moves further in favour of building each time you hire.",
    },
    {
      q: "What should I never build myself?",
      a: "Accounting, payroll and tax, because they are regulated and change every year. Email, calendars, file storage and video calls, because they are solved. And authentication, payments and email delivery inside your own build — use established services for those rather than writing them.",
    },
    {
      q: "Can I use custom software and off-the-shelf software together?",
      a: "That is the normal end state. Buy the commodity layers, build the part that is genuinely yours, and connect them with an integration layer that has an owner and an exception queue. The integration is often the highest-return software a business owns.",
    },
    {
      q: "How do I decide between building and buying?",
      a: "Ask it one process at a time, not for the business as a whole: do competitors do it the same way, can you name the hours it consumes, does a product cover 90 percent, what is the three-year licence cost, and is there someone internally who will own the system. The answers usually differ by process, which is why most businesses end up with both.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "vrs-real-invest"],
};
