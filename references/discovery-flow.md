# FlowForge Discovery Flow

The interview script for eliciting a business process in chat. This is the
primary product surface: never start with a blank prompt. Open with Step 1.

## Step 1 — Classify the ask

- **discovery** (new map) → auto-load `continuous-discovery` or `customer-interviews`.
- **reconciliation** (conflicting accounts) → auto-load `analyzing-user-feedback`.
- **alignment** (stakeholders must approve) → auto-load `stakeholder-alignment`.

Auto-load at most 2 matching Lenny skills per session, without the user asking (see `references/lenny-routing.md`).

## Step 2 — Discovery interview

Ask in order, one topic at a time, confirming as you go:

1. **Actors and roles** — "Who touches this process?" Each role becomes a lane.
2. **Trigger and outcome** — "What starts it?" and "What does 'done' look like?"
   Capture all legitimate end events.
3. **Happy path** — "Walk me through the last time this ran, step by step." Ask
   for the *last actual run*, not the ideal path. Each action becomes a node.
4. **Decision points** — "Where does it branch?" Each branch is a gateway with
   labeled outcomes (`yes`/`no`, amount ranges, etc.).
5. **Exceptions** — "What goes wrong, and what happens then?" Capture real
   exception paths, not prose.
6. **Handoffs** — "Where does work cross from one role to another?" Cross-lane
   handoffs are sequence flows; document/payment exchanges are message flows.
7. **Confirm back** — read the process back as a numbered story and require the
   user to say "yes" before any rendering. This is a hard gate.

**Quality gate:** stop when two consecutive answers add no new nodes or flows.
More than 2 structural corrections after delivery means the interview was
incomplete — iterate the script, not just the map.

## Step 3 — Author IR, preview, deliver

1. Author `bpmn` JSON IR from the confirmed story.
2. `node bin/flowforge.mjs validate bpmn <file> --quality showcase --json`
3. Render a **read-only preview** and show it for correction in chat.
4. `node bin/flowforge.mjs deliver bpmn <file> <output.html> --quality showcase --json`
5. A passing final validation freezes the candidate; never edit it afterward.

## Step 4 — Delta on revision

When the process changes, re-interview only the changed part, author a second
IR, and compare Before / Delta / After.
