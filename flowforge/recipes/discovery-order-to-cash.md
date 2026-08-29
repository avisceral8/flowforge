# Discovery Recipe — Order-to-Cash

Four-party reconciliation with auditor-readable credit-hold controls.
Lanes: Sales, Fulfillment, Finance, Exceptions.

## Interview transcript target

1. Actors: Sales (order), Fulfillment (ship), Finance (credit, invoice, collect), Exceptions (hold).
2. Trigger: order received. Done: payment collected.
3. Happy path: order → credit check → fulfill → invoice → collect.
4. Gateway: credit approved? yes → fulfill; no → credit hold.
5. Exceptions: hold → release after override/payment → fulfill.
6. Handoffs: order (sales→finance), ship notice (fulfillment→finance), invoice → customer.

## IR shape reminders

- `validate` is a security-typed gateway node with `yes`/`no` labeled edges.
- `hold` and `release` live in an exception lane.
- Keep the happy path ≤ 8 primary nodes; exceptions secondary.
