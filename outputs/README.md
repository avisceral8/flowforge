# FlowForge outputs

All rendered artifacts land here and nowhere else. Source IR lives in
`sources/`; every `render` / `compare` / `deliver` target writes into
`outputs/`.

## Conventions

- **One place:** every diagram output goes under `outputs/<type>/`.
- **Filenames:** `<process-name>.html` (drop the `.bpmn-` infix inherited from
  the source file name).
- **Receipts:** `compare` receipts sit beside their HTML as
  `<name>.delta.receipt.json`.
- **Source of truth:** the same-named `.json` IR in `sources/bpmn/` or
  `sources/canvas/`.

## Current outputs

| File | What it shows |
|---|---|
| `bpmn/payment-failure-refund.html` | place order → payment fails → cancel order → refund (9/9 showcase) |