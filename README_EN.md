# FlowForge

> **FlowForge fork** — this repository is a fork of [tt-a1i/archify](https://github.com/tt-a1i/archify) (MIT) pointed at **business processes** instead of codebases: chat in, validated BPMN 2.0 process map out. Upstream's technical diagram engine is inherited unchanged. See [`NOTICE.md`](NOTICE.md) for attribution.

**Turn a chat about how your business actually works into a living, verified BPMN 2.0 map.**

FlowForge interviews you about a process — actors, trigger, the last actual run, decision points, exceptions, handoffs — then compiles a typed JSON IR into a self-contained, deterministic interactive HTML artifact. Standard BPMN 2.0 notation: start/intermediate/end events, exclusive/inclusive/parallel gateways, typed tasks, pools and lanes, sequence and message flows.

![version badge](https://img.shields.io/badge/version-2.16.0--dev.0-0891b2?style=flat-square)

**Current development version:** `v2.16.0-dev.0`.

- **Discovery-first, not drawing-first** — the agent asks; you talk; the map appears. Confirm-back is a hard gate before anything renders.
- **Every interaction stays grounded** — search, focus, upstream/downstream reach, exact routes, guided stories; nothing is invented beyond the authored topology.
- **Validation with receipts** — BPMN well-formedness plus the full artifact gate: 9/9 checks, 0 errors, 0 warnings.
- **One file, ready to trust and share** — self-contained HTML plus PNG, SVG, WebM, and 1200×630 share cards, dark/light themes.
- **Process delta** — `flowforge compare bpmn v1.json v2.json` emits exact added / removed / changed / rerouted facts.
- **Vendored Lenny skills** — `vendor/lenny-skills/` (76 skills, MIT) inform the discovery interview.

## Quick start

```bash
git clone <your-fork> && cd flowforge
./install.sh        # macOS / Linux
./install.ps1       # Windows
```

Raven is a manual ZIP installation outside the agent switcher: extract `flowforge.zip` into `~/.raven/workspace/skills`, yielding `~/.raven/workspace/skills/flowforge`.

Then ask your agent:

```text
Map our order-to-cash process.
```

Try the CLI directly:

```bash
cd flowforge
npm install
node bin/flowforge.mjs doctor
node bin/flowforge.mjs render bpmn examples/order-return.bpmn.json examples/order-return.bpmn-rendered.html --quality showcase
node bin/flowforge.mjs compare bpmn examples/order-to-cash.bpmn.json examples/order-to-cash-v2.bpmn.json examples/order-to-cash-delta.html --json
```

## Diagram types

| Type | Use for |
|---|---|
| `bpmn` | **Business processes** — approvals, handoffs, order-to-cash, onboarding, incident handling (primary) |
| `journey` | Customer journeys and service blueprints |
| `infoflow` | Information / document flows and lineage |
| `stakeholder-map` | Who matters and how they relate |
| `capability` | Operating models: teams, capabilities, systems |
| `okr-tree`, `north-star`, `growth-loop`, `launch-plan`, `feedback-pipeline` | Planning / growth canvases |
| `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle` | Inherited upstream technical diagrams |

## Not supported (by design)

- BPMN execution/simulation engine, BPMN-XML import/export
- Visual drag-and-drop editor
- Non-English UI
- Codebase analysis (that's upstream Archify's job)
- Hosted service or database

## Credits & license

[MIT](LICENSE). FlowForge is a fork of [Archify](https://github.com/tt-a1i/archify) by tt-a1i (MIT), itself based on Cocoon-AI/architecture-diagram-generator (MIT). Lenny's Product Skills v2.0 (MIT) by Refound AI are vendored under `vendor/lenny-skills/`. See [`NOTICE.md`](NOTICE.md).