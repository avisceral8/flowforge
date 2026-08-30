# FlowForge Lenny Routing

Vendored Lenny's Product Skills v2.0 (MIT, Refound AI — see `vendor/lenny-skills/LICENSE`).
**Auto-invoked** for every business-process ask: classify, then load 1–2 matching skills
without being asked. They inform the *discovery interview*, not the IR schema.

## When to load which

| Ask / situation | Skill | Use it for |
|---|---|---|
| "Map how X works here" / process discovery from scratch | `continuous-discovery` | Opportunity mapping, interview technique, avoiding leading questions |
| User names specific actors/customers to interview | `customer-interviews` | Question scripts, digging past the first answer |
| User has conflicting accounts of the same process | `analyzing-user-feedback` | Synthesizing contradictory testimony into one flow |
| Scope fights mid-interview ("we could also map…") | `evaluating-trade-offs` | Keeping the map bounded; parking-lot technique |
| Multiple stakeholders must approve the map | `stakeholder-alignment` | Pre-wiring review, deciding who signs off |
| Output will drive a team/project | `writing-prds` | Turning the validated map into next-step actions |
| "Who is this map for?" unclear | `defining-icp` | Audience-first authoring: auditor map vs onboarding map differ |
| Team wants to measure process health over time | `north-star-metrics` | Choosing the metric the map's counters should track |

## Rules

1. **Classify first, automatically** — is this *discovery* (new map), *reconciliation* (conflicting accounts), or *alignment* (review/approval)? Load the matching skill(s) immediately.
2. **Max 2 skills** — the interview script in `references/discovery-flow.md` is the primary tool; Lenny skills sharpen questions, they don't replace the flow.
3. **Cite the framework** when it changes your question — e.g. "Continuous Discovery suggests we ask about the *last time* this happened, not the ideal path."
4. **Don't leak jargon into the diagram** — the map uses the user's words, not framework vocabulary.