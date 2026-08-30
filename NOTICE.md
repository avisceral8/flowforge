# FlowForge — third-party notices

## Archify (fork base)

FlowForge is a fork of Archify by tt-a1i, MIT License.
https://github.com/tt-a1i/archify — the upstream MIT license remains in
`flowforge/LICENSE`. The guiding principle — typed JSON IR in, deterministic
validated artifacts out, no invented topology — is inherited unchanged.
Archify is itself based on Cocoon-AI/architecture-diagram-generator (MIT, v1.0).

## Lenny's Product Skills (vendored)

A curated set of 30 skills relevant to FlowForge is vendored under
`vendor/lenny-skills/` (kept ids in `vendor/lenny-skills/KEEP.txt`) from
Lenny's Product Skills v2.0 © Refound AI, MIT:
https://github.com/RefoundAI/lenny-skills

Harness-facing mirrors live in `.pi/skills/`, `.claude/skills/`,
`.agents/skills/`, and `.codex/skills/`, refreshed by
`node scripts/sync-lenny-skills.mjs`. The upstream LICENSE is preserved in every
mirror. These skills are product/process guidance for agents working in this
repository; they are not runtime dependencies of the FlowForge renderer.

## Sync

```bash
# refresh the vendored tree from a fresh clone, then mirror to harness dirs
gh repo clone refoundai/lenny-skills vendor/lenny-skills -- --depth 1
node scripts/sync-lenny-skills.mjs
```
