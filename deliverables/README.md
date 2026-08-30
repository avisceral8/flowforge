# FlowForge — Final Deliverables

Generated, validated artifacts. Sources of truth live in `flowforge/examples/`
and `flowforge/schemas/`; this folder holds the polished outputs you show,
share, or audit.

## BPMN process maps (primary)

| File | What it shows |
|---|---|
| `bpmn/order-to-fulfillment.html` | Full BPMN 2.0 process: Customer + Company pools, credit gateway, delivery + rejection end events (9/9 showcase) |
| `bpmn/order-to-cash.html` | Linear order-to-cash map (9/9 showcase) |
| `bpmn/order-to-cash-delta.html` | Before/Delta/After of v1 → v2 |
| `bpmn/order-to-cash-delta.receipt.json` | Machine receipt: exact added/removed/changed/rerouted facts |

## Canvas business types

| File | Type |
|---|---|
| `canvas/order-to-cash.journey.html` | journey |
| `canvas/order-to-cash.infoflow.html` | infoflow |
| `canvas/order-to-cash.stakeholder-map.html` | stakeholder-map |
| `canvas/order-to-cash.capability.html` | capability |
| `canvas/order-to-cash.okr-tree.html` | okr-tree |
| `canvas/order-to-cash.north-star.html` | north-star |
| `canvas/order-to-cash.growth-loop.html` | growth-loop |
| `canvas/order-to-cash.launch-plan.html` | launch-plan |
| `canvas/order-to-cash.feedback-pipeline.html` | feedback-pipeline |

## Distribution

- `flowforge.zip` — deterministic skill archive (tracked-only; no node_modules/tests/dev scripts).

## Regenerate

```bash
cd flowforge
node bin/flowforge.mjs render bpmn examples/order-to-fulfillment.bpmn.json ../deliverables/bpmn/order-to-fulfillment.html --quality showcase
node bin/flowforge.mjs compare bpmn examples/order-to-cash.bpmn.json examples/order-to-cash-v2.bpmn.json ../deliverables/bpmn/order-to-cash-delta.html --receipt ../deliverables/bpmn/order-to-cash-delta.receipt.json
# canonical zip (Node 22): scripts/build-zip.sh ../deliverables/flowforge.zip
```
