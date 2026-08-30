# Discovery Recipe — Purchase-to-Pay

Finance ops: parallel gateway, message flows for vendor documents, five lanes.
Lanes: Requester, Procurement, Finance, Receiving, Vendor (external).

## Interview transcript target

1. Actors: Requester (need), Procurement (PO), Finance (invoice, pay), Receiving (goods), Vendor (external).
2. Trigger: purchase request. Done: vendor paid + goods received.
3. Happy path: request → approve → PO → receive → invoice → pay.
4. Gateway: parallel — goods receipt and invoice must both arrive before payment.
5. Exceptions: goods damaged → return/reject; invoice mismatch → dispute.
6. Handoffs: PO and invoice are message flows crossing the vendor boundary.

## IR shape reminders

- Vendor is an `external` lane; document exchanges are message flows across lanes.
- The payment join is a parallel merge: both receipt and invoice arrive first.
- No start event in the vendor lane (all its nodes are fed by cross-lane flows).
