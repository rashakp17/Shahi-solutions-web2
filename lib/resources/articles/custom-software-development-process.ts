import type { Article } from "../types";

/**
 * Process article. Each phase names its deliverable and how it fails;
 * keep the failure modes when editing.
 */
export const article: Article = {
  slug: "custom-software-development-process",
  title: "The Custom Software Development Process",
  metaTitle: "The Custom Software Development Process, Phase by Phase",
  description:
    "The custom software development process in five phases: what each one produces, how long it takes and where projects tend to go wrong.",
  eyebrow: "Custom Software Development",
  lead: "Most agencies publish the same five-box diagram. This version adds the detail that diagram leaves out: what each phase of the custom software development process produces, how much of the project it takes, and how each one typically fails when it is rushed.",
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
          text: "Look at the proportions. Most people picture a project as ninety percent building, but in a healthy engagement the build is closer to forty-five. The rest goes on deciding what to build, proving it works and making sure it survives handover. Projects that go badly have almost never spent too long on those.",
        },
        {
          kind: "note",
          label: "A rule we keep",
          text: "You can shorten any of these phases, but you cannot skip one. A two-week project still goes through all five, with discovery taking a morning and handover an afternoon. Projects get into trouble when a phase is treated as optional instead of small.",
        },
      ],
    },

    {
      id: "discovery",
      heading: "Phase 1: Discovery and scoping",
      blocks: [
        {
          kind: "p",
          text: "Discovery turns an intention into a specification. Somebody sits with the people who will use the system and watches the work happen, because a process described in a meeting room almost never matches the process as it is actually carried out.",
        },
        {
          kind: "list",
          items: [
            "**Sessions with the people doing the work**, as well as with the people commissioning the system. Their workarounds are the real requirement, and only they know them.",
            "**A written scope** covering user roles, the journeys each role takes, the data the system holds, the integrations it needs, and an explicit list of what is *not* in scope.",
            "**A prioritised backlog**, split into what version one has to do and what can wait.",
            "**A fixed estimate**, or a range with the reason for the range named.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Two to four weeks for most projects, or a morning for something genuinely small. **How it fails:** the scope is written from the sponsor's description and the system is built faithfully to it. The people who actually do the job first see it in month four, and everything after that is rework at development rates.",
        },
        {
          kind: "note",
          label: "On paying for discovery",
          text: "Consider commissioning discovery as a separate piece of work with its own deliverable, especially if you are choosing between suppliers. You come away with a specification you can take anywhere, and you see how a team thinks before committing to them for six months.",
        },
      ],
    },

    {
      id: "design",
      heading: "Phase 2: Architecture and interface design",
      blocks: [
        {
          kind: "p",
          text: "Two pieces of work happen in parallel here. Each limits what the other can do, so we treat them as one phase.",
        },
        {
          kind: "p",
          text: "**The data model** comes first and matters most. It is cheap to change now and expensive to change later, because every screen, report and integration depends on how the system represents an order, a customer or a job. An interface mistake takes a week to fix in year two. A data model mistake means a migration.",
        },
        {
          kind: "p",
          text: "**The interface design** runs alongside it: the screens for each role, at full fidelity, with real data in them. We mean a clickable set of the actual screens rather than a mood board, because that is the only thing a future user can usefully react to before anything is built.",
        },
        {
          kind: "list",
          items: [
            "A schema, with the entities and their relationships named.",
            "Interface designs for every screen in scope, responsive from the outset rather than adapted afterwards.",
            "A technology decision, with the reasoning recorded, including what was rejected and why.",
            "An integration plan naming each external system and what it is authoritative for.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Ten to twenty percent of the project. **How it fails:** designs are signed off as pictures without anyone walking a real task through them, so the flow is first tested once it is already code.",
        },
      ],
    },

    {
      id: "build",
      heading: "Phase 3: Build",
      blocks: [
        {
          kind: "p",
          text: "The build runs in short increments of a week or two, each ending with something running on a URL you can open. We work this way for a practical reason: it is how a client gets to change their mind while doing so is still cheap.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**A staging environment from week one**, rather than near the end. The first increment should be deployed and reachable even if all it does is log in.",
            "**A demo every increment**, of working software rather than a progress report. A percentage-complete figure proves nothing.",
            "**Tests written alongside the code**, focused on logic that would be expensive to get wrong: pricing, permissions, anything that touches money or access.",
            "**Code review on everything.** It catches errors, and it also means more than one person understands each part of the system before handover.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Forty to fifty percent of the project. **How it fails:** each demo shows more screens while the integrations, where most of the risk sits, are left to the end. The project then sits at ninety percent for two months.",
        },
        {
          kind: "bridge",
          prompt:
            "Interested in how this process would apply to your build, with a scope and a price attached?",
          label: "Explore Custom Software Development",
          href: "/services/custom-software-development",
        },
      ],
    },

    {
      id: "testing",
      heading: "Phase 4: Testing and acceptance",
      blocks: [
        {
          kind: "p",
          text: "Testing covers four different activities. Treat them as one and you get a system that passes every check and still fails in its first week.",
        },
        {
          kind: "examples",
          items: [
            {
              label: "Automated",
              title: "Does the logic do what it says?",
              text: "Runs on every change and catches regressions nobody would think to re-check by hand. Focused on money, permissions and anything with a rule in it.",
            },
            {
              label: "Acceptance",
              title: "Does it do what was agreed?",
              text: "Walked through against the scope from phase one, by the client, on staging, with real data. This is what the written scope was for.",
            },
            {
              label: "User",
              title: "Can the people who have to use it, use it?",
              text: "The people from discovery do a real day's work in the system without help or prompting. It is usually the most uncomfortable half-day of the project, and the most useful.",
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
          text: "**How long.** Fifteen to twenty percent. **How it fails:** user testing is skipped because acceptance testing passed. The two answer different questions. Acceptance asks whether the system matches the document; user testing asks whether the document was right.",
        },
      ],
    },

    {
      id: "launch",
      heading: "Phase 5: Launch, handover and support",
      blocks: [
        {
          kind: "p",
          text: "Launch day is mostly about data. The software has been working on staging for weeks. Moving years of real records into it has not been rehearsed, and that is where launches go wrong.",
        },
        {
          kind: "list",
          items: [
            "**A rehearsed migration.** Run the import against a copy of production data at least twice before the day, and time it. The dry run is where you find the encoding problem and the nine hundred duplicate records.",
            "**A rollback plan** that someone has actually carried out once.",
            "**Monitoring and error reporting live before launch.** The first week is when you most need to know what is failing.",
            "**Handover of the accounts.** Repository, hosting, domains, third-party services, all in the client's name. See [what you own at the end](/resources/what-is-custom-software-development#what-you-own).",
            "**Documentation written for the next developer** rather than for us: how to run it locally, how it deploys, and where the less obvious decisions are recorded.",
          ],
        },
        {
          kind: "p",
          text: "**How long.** Ten to fifteen percent, plus a support window afterwards. **How it fails:** the migration is attempted for the first time on the day, and the rollback plan is a sentence in an email.",
        },
        {
          kind: "note",
          label: "After launch",
          text: "Like a vehicle, custom software has a running cost. Dependencies need patching, browsers and mobile operating systems change underneath it, and the business changes around it. Budget roughly 15–20% of the build cost per year. The [cost guide](/resources/custom-software-development-cost) breaks down what that pays for.",
        },
      ],
    },

    {
      id: "questions-to-ask",
      heading: "Five questions to ask any development partner",
      blocks: [
        {
          kind: "p",
          text: "These are worth asking whether or not you talk to us. The answers are hard to fake, and they tell you about a supplier's process rather than its sales pitch.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**When will I first see working software on a URL?** Be wary of anything later than week three.",
            "**Who will you talk to during discovery, and for how long?** If the answer is only the sponsor, the workarounds will not be found.",
            "**Whose accounts will the repository and the hosting be in?** The correct answer is yours, from day one.",
            "**How will the data migration be rehearsed?** \"We will export and import\" is not a rehearsal.",
            "**What does the first year after launch cost, and what does it include?** If a supplier has not thought about this, they have probably never maintained anything.",
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
      a: "Two to four weeks for most projects, and a morning for something genuinely small. This phase decides whether the right thing gets built. Cutting it short does not save time; it moves the same work into the build phase at development rates.",
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
      a: "Mostly data migration. The software has been running on staging for weeks, so the new part is moving real records into it. The migration should have been rehearsed against a copy of production data at least twice, and a rollback plan should have been executed once for real.",
    },
    {
      q: "What does support after launch involve?",
      a: "Security and dependency updates, fixes, monitoring, and small changes as the business shifts. Budget roughly 15 to 20 percent of the build cost per year. Software with no maintenance line tends to be abandoned around month fourteen.",
    },
  ],

  caseStudies: ["emarath-erp", "fleet-management", "vrs-real-invest"],
};
