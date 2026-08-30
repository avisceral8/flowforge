# Discovery Recipe — Expense Approval

Single-team control map for a SOC 2 audit. Lanes: Employee, Manager, Finance.
Trigger: employee submits expense. Outcome(s): approved + paid, or rejected.

## Interview transcript target

1. Actors: Employee (submits), Manager (approves by limit), Finance (pays, audits).
2. Trigger: expense report submitted. Done: paid or rejected.
3. Happy path: submit → manager approves → finance pays.
4. Gateway: amount ≤ threshold? yes → manager; no → finance pre-approval.
5. Exceptions: missing receipt → return to employee; policy violation → reject.
6. Handoffs: report moves employee→manager→finance; payment notification is a message flow.

## IR shape reminders

- Lane per actor; `variant: "exception"` for the rejection lane.
- Gateway node in the manager lane with labeled branches (`yes`/`no`).
- End events: paid, rejected. No orphan branches.
