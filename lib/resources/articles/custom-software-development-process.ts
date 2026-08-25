import type { Article } from "../types";

/**
 * The process article.
 *
 * Written as the answer to a question a buyer asks defensively — "what will
 * actually happen, and when do I find out it has gone wrong" — so every phase
 * names its deliverable and its failure mode. The failure modes are the part
 * worth keeping: they are what distinguishes this from the identical five-box
 * diagram every agency publishes.
 */
export const article: Article = {
  slug: "custom-software-development-process",
  title: "The Custom Software Development Process",
  metaTitle: "The Custom Software Development Process, Phase by Phase",
  description:
    "What actually happens in a custom software development process — the five phases, what each one produces, how long it takes, and where projects go wrong.",
  eyebrow: "Custom Software Development",
  lead: "Every agency publishes the same five-box diagram. This is the version with the parts that matter left in: what each phase of the custom software development process actually produces, how long it takes as a share of the project, and the specific way each one fails when it is rushed.",
  updated: "2026-08-24",
  cluster: "custom-software-development",

  sections: [
    {
      id: "overview",
      heading: "The five phases at a glance",
      blocks: [
        {
          kind: "figure",
          diagram: "build-process",
          caption:
            "The custom software development process, with the share of a typical engagement each phase takes. Build is the largest single phase but not the majority of the work.",
        },
        {
          kind: "p",
          text: "The proportions are the interesting part. Most people picture a project as ninety percent building, and in a healthy engagement the build is closer to forty-five. The rest is deciding what to build, proving it works, and making sure it survives being handed over — and the projects that go badly are almost never the ones that spent too long on those.",
        },
        {
          kind: "note",
          label: "The one rule",
          text: "Nothing here is skippable, only compressible. A two-week project still does all five phases; discovery is a morning and handover is an afternoon. What sinks projects is treating a phase as optional rather than as small.",
        },
      ],
    },

    {
      id: "discovery",
      heading: "Phase 1 — Discovery and scoping",
      blocks: [
        {
          kind: "p",
          text: "Discovery turns an intention into a specification. It is the phase where somebody sits with the people who will use the system and watches the work happen, because the description of a process given in a meeting room and the process as actually performed are reliably different documents.",
        },
        {
          kind: "list",
          items: [
            "**Sessions with the people doing the work**, not only with the people commissioning the system. The workarounds are the requirement, and only the first group knows them.",
            "**A written scope** — user roles, the journeys each role takes, the data the system holds, the integrations it needs, and an explicit list of what is *not* in scope.",
            "**A prioritised backlog**, split into what version one has to do and what can wait.",
            "**A fixed estimate**, or a range with the reason for the range named.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Two to four weeks for most projects; a morning for something genuinely small. **How it fails:** the scope is written from what the sponsor described, the system is built correctly to that document, and the people who actually do the job see it for the first time in month four. Everything after that is rework at development rates.",
        },
        {
          kind: "note",
          label: "On paying for discovery",
          text: "Discovery is worth commissioning as a standalone piece of work with its own deliverable, particularly if you are choosing between suppliers. You end up owning a specification you can take anywhere, and you find out how a team thinks before you are committed to them for six months.",
        },
      ],
    },

    {
      id: "design",
      heading: "Phase 2 — Architecture and interface design",
      blocks: [
        {
          kind: "p",
          text: "Two things happen in parallel here, and they constrain each other, which is why they are one phase rather than two.",
        },
        {
          kind: "p",
          text: "**The data model** comes first and matters most. It is the decision that is cheapest now and most expensive later: every screen, every report and every integration is downstream of how the system represents an order, a customer or a job. Interface mistakes are a week to fix in year two. Data model mistakes are a migration.",
        },
        {
          kind: "p",
          text: "**The interface design** runs alongside it — the screens for each role, at real fidelity, with real data in them. Not a mood board: a clickable set of the actual screens, because that is the only artefact a future user can meaningfully react to before anything is built.",
        },
        {
          kind: "list",
          items: [
            "A schema, with the entities and their relationships named.",
            "Interface designs for every screen in scope, responsive from the outset rather than adapted afterwards.",
            "A technology decision, with the reasoning recorded — including what was rejected.",
            "An integration plan naming each external system and what it is authoritative for.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Ten to twenty percent of the project. **How it fails:** designs are approved as pictures without anyone walking a real task through them, so the first time the flow is tested is when it is code.",
        },
      ],
    },

    {
      id: "build",
      heading: "Phase 3 — Build",
      blocks: [
        {
          kind: "p",
          text: "The build runs in short increments — a week or two — each ending with something that runs on a URL you can open. That cadence is not a preference about methodology. It is the only mechanism that gives a client the ability to change their mind while changing their mind is still cheap.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**A staging environment from week one.** Not near the end. The first increment should be deployed and reachable even if all it does is log in.",
            "**A demo every increment**, of working software rather than of a progress report. A percentage-complete figure is not evidence.",
            "**Tests written alongside**, concentrated on the logic that would be expensive to get wrong — pricing, permissions, anything that touches money or access.",
            "**Code review on everything.** Not for correctness alone, but so that more than one person understands each part of the system before handover.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Forty to fifty percent of the project. **How it fails:** the increments demo a growing pile of screens while the integrations — which is where the real risk lives — are left to the end, so the project appears to be at ninety percent for two months.",
        },
        {
          kind: "bridge",
          prompt:
            "Want to see how this process would apply to your build, with a scope and a number attached?",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "testing",
      heading: "Phase 4 — Testing and acceptance",
      blocks: [
        {
          kind: "p",
          text: "Testing is not one activity, and conflating the four kinds is how a system passes every check and still fails in its first week.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Automated",
              title: "Does the logic do what it says?",
              text: "Runs on every change and catches the regressions no person would think to re-check. Concentrated on money, permissions and anything with a rule in it.",
            },
            {
              label: "Acceptance",
              title: "Does it do what was agreed?",
              text: "Walked through against the scope from phase one, by the client, on staging, with real data. This is what the written scope was for.",
            },
            {
              label: "User",
              title: "Can the people who have to use it, use it?",
              text: "The people from discovery, doing a real day's work in the system, unassisted and unprompted. The most uncomfortable and most valuable half-day of the project.",
            },
            {
              label: "Load and edge",
              title: "Does it hold up?",
              text: "Realistic volumes, the largest file anyone will upload, the slow connection, the tab left open overnight, the two users editing the same record.",
            },
          ],
        },
        {
          kind: "p",
          text: "**How long.** Fifteen to twenty percent. **How it fails:** user testing is skipped because acceptance testing passed. They answer different questions — one asks whether the system matches the document, the other whether the document was right.",
        },
      ],
    },

    {
      id: "launch",
      heading: "Phase 5 — Launch, handover and support",
      blocks: [
        {
          kind: "p",
          text: "Launch day is mostly a data problem. The software has been working on staging for weeks; what has not been rehearsed is moving years of real records into it, and that is where launches go wrong.",
        },
        {
          kind: "list",
          items: [
            "**A rehearsed migration.** Run the import against a copy of production data at least twice before the day, and time it. The dry run is where you discover the encoding problem and the nine hundred duplicate records.",
            "**A rollback plan** that someone has actually executed once.",
            "**Monitoring and error reporting live before launch**, not after — the first week is when you most need to know what is failing.",
            "**Handover of the accounts.** Repository, hosting, domains, third-party services, all in the client's name. See [what you own at the end](/resources/what-is-custom-software-development#what-you-own).",
            "**Documentation aimed at the next developer**, not at us: how to run it locally, how it deploys, and where the non-obvious decisions are recorded.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Ten to fifteen percent, plus a support window afterwards. **How it fails:** the migration is attempted for the first time on the day, and the rollback plan is a sentence in an email.",
        },
        {
          kind: "note",
          label: "After launch",
          text: "Custom software has a running cost the way a vehicle does. Dependencies need patching, browsers and mobile operating systems shift underneath it, and the business changes around it. Budget roughly 15–20% of the build cost per year; the [cost guide](/resources/custom-software-development-cost) breaks down what that pays for.",
        },
      ],
    },

    {
      id: "questions-to-ask",
      heading: "Five questions to ask any development partner",
      blocks: [
        {
          kind: "p",
          text: "Useful whether or not you talk to us. Each one is chosen because the answer is hard to fake and tells you about the process rather than about the sales pitch.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**When will I first see working software on a URL?** Anything past week three is a warning.",
            "**Who will you talk to during discovery, and for how long?** If the answer is only the sponsor, the workarounds will not be found.",
            "**Whose accounts will the repository and the hosting be in?** The correct answer is yours, from day one.",
            "**How will the data migration be rehearsed?** \"We will export and import\" is not a rehearsal.",
            "**What does the first year after launch cost, and what does it include?** A supplier who has not thought about this has not maintained anything.",
          ],
        },
      ],
    },
  ],

  faqs: [
    {
      q: "What are the stages of the custom software development process?",
      a: "Discovery and scoping, architecture and interface design, build, testing and acceptance, then launch and handover. In a healthy engagement the build is around forty-five percent of the effort and the four phases around it account for the rest.",
    },
    {
      q: "How long does discovery take?",
      a: "Two to four weeks for most projects, and a morning for something genuinely small. It is the phase that decides whether the right thing gets built, so compressing it does not save time — it moves the same work into the build phase at development rates.",
    },
    {
      q: "Can I pay for discovery separately?",
      a: "Yes, and it is often the sensible way to start, particularly if you are choosing between suppliers. You end up owning a specification you can take to anyone, and you learn how a team thinks before committing to six months with them.",
    },
    {
      q: "What is the difference between acceptance testing and user testing?",
      a: "Acceptance testing checks the system against the scope that was agreed. User testing checks whether that scope was right, by putting the people who do the job in front of the system unassisted. Passing one tells you nothing about the other.",
    },
    {
      q: "What happens on launch day?",
      a: "Mostly data migration. The software has been running on staging for weeks; what is new is moving real records into it. The migration should have been rehearsed against a copy of production data at least twice, and a rollback plan should have been executed once for real.",
    },
    {
      q: "What does support after launch involve?",
      a: "Security and dependency updates, fixes, monitoring, and small changes as the business shifts. Budget roughly 15 to 20 percent of the build cost per year. Software with no maintenance line tends to be abandoned around month fourteen.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "vrs-real-invest"],
};
