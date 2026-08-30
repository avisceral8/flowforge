# Discovery Recipe — Support Escalation

The *reconciliation* pattern: two stakeholders, conflicting accounts, one neutral map.
Lanes: Customer, Support, Engineering, Management.

## Interview transcript target

1. Actors: Customer (reports), Support (triage), Engineering (fix), Management (override).
2. Trigger: ticket opened. Done: resolved, or escalated+closed.
3. Happy path: triage → investigate → fix → confirm → close.
4. Gateway: severity high? yes → escalate; no → continue in support.
5. Exceptions: no repro → back to support; customer unhappy → management override.
6. Handoffs: ticket moves support→engineering→support; management only on override.

## Reconciliation note

When two stakeholders describe different paths, interview each separately using
`analyzing-user-feedback`, then present ONE numbered story and ask both to confirm.
Never draw two conflicting maps; the map is the reconciliation artifact.
