# FlowForge

The process map that regenerates instead of rotting.

FlowForge turns a plain-language description of a business process into a validated BPMN 2.0 map, built inside your agent chat. Describe order-to-cash in a few sentences. FlowForge asks the follow-up questions, confirms the story back, and compiles a self-contained HTML map you can open, share, or audit.

FlowForge is a fork of Archify (MIT), pointed at business processes instead of codebases. See [NOTICE.md](NOTICE.md) for attribution.

## Why

Process maps rot. The person who knows the process rarely owns a diagramming tool, so maps are drawn by hand, get redrawn for every audit, and go stale within a quarter.

FlowForge fixes the root cause: the map is compiled from validated source, not drawn. When the process changes, you describe the change and regenerate.

## What you get

- BPMN 2.0 notation: events, gateways, typed tasks, pools and lanes, sequence and message flows.
- An interview that runs first: actors, trigger, the last actual run, decision points, exceptions, handoffs. Nothing renders until you confirm the story.
- Validation with receipts: 9/9 artifact checks, 0 errors, 0 warnings, or the map is not produced.
- Process deltas: compare two versions and get exact added, removed, changed, and rerouted facts.
- One file per map: standalone HTML with light and dark themes, plus PNG, SVG, WebM, and 1200x630 share cards.
- Business diagram types beyond BPMN: journey, infoflow, stakeholder map, capability, OKR tree, growth loop, launch plan, feedback pipeline.
- The inherited Archify technical diagrams: architecture, workflow, sequence, dataflow, lifecycle.

## How it works

1. Describe the process in chat. "Map our expense approval process."
2. FlowForge interviews you. Who touches it? What starts it? What did the last actual run look like? Where does it branch? What goes wrong? Where does work change hands?
3. Confirm the numbered story back. This is a hard gate; nothing renders without it.
4. FlowForge compiles the validated map and opens it.

When the process changes, describe the change. FlowForge re-renders and compares against the previous version.

## Quick start

Install FlowForge as an agent skill:

```bash
./install.sh    # macOS / Linux
./install.ps1   # Windows
```

Then ask your agent:

```text
Map our order-to-cash process.
```

Raven is a manual ZIP installation outside the agent switcher: extract `flowforge.zip` into `~/.raven/workspace/skills`, yielding `~/.raven/workspace/skills/flowforge`.

**Current development version:** `v2.16.0-dev.0`.

![version badge](https://img.shields.io/badge/version-2.16.0--dev.0-0891b2?style=flat-square)

### CLI

```bash
npm install
node bin/flowforge.mjs doctor
node bin/flowforge.mjs render bpmn sources/bpmn/order-to-fulfillment.bpmn.json outputs/bpmn/order-to-fulfillment.html --quality showcase
node bin/flowforge.mjs compare bpmn sources/bpmn/order-to-cash.bpmn.json sources/bpmn/order-to-cash-v2.bpmn.json outputs/bpmn/order-to-cash-delta.html --json
```

## Sources and outputs

- `sources/` holds the authoring IR (JSON) for BPMN and canvas diagrams:

  ```
  sources/bpmn/     order-to-fulfillment, order-to-cash, order-to-cash-v2, payment-failure-refund
  sources/canvas/   journey, infoflow, stakeholder-map, capability, okr-tree, north-star, growth-loop, launch-plan, feedback-pipeline
  ```

- `outputs/` is the single home for every rendered artifact. Every `render`
  and `compare` target writes here, grouped by diagram type under
  `outputs/<type>/`. See [`outputs/README.md`](outputs/README.md).

## Not supported

- BPMN execution or simulation engine
- BPMN-XML import and export
- Visual drag-and-drop editor
- Non-English UI
- Codebase analysis (that is Archify's job)
- Hosted service or database

## Credits and license

[MIT](LICENSE). FlowForge is a fork of Archify by tt-a1i (MIT), itself based on Cocoon-AI/architecture-diagram-generator (MIT). Lenny's Product Skills v2.0 by Refound AI (MIT) are vendored under `vendor/lenny-skills/`. See [NOTICE.md](NOTICE.md).