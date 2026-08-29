// bpmn-delta.mjs — process-version compare for FlowForge BPMN diagrams.
//
// Deterministic structural diff of two validated bpmn JSON documents:
// added / removed / changed nodes, edges, and lanes, plus rerouted edges
// (same from/to pair changed geometry fields). Emits a machine receipt and a
// self-contained Before / Delta / After HTML page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function key(collection, item) {
  return item.id ?? JSON.stringify(item);
}

function diffCollection(base = [], head = [], fields = []) {
  const baseMap = new Map(base.map((item) => [key(null, item), item]));
  const headMap = new Map(head.map((item) => [key(null, item), item]));
  const added = [];
  const removed = [];
  const changed = [];
  for (const [id, item] of headMap) {
    if (!baseMap.has(id)) {
      added.push(item);
      continue;
    }
    const before = baseMap.get(id);
    const fieldChanges = fields.filter((field) => JSON.stringify(before[field]) !== JSON.stringify(item[field]));
    if (fieldChanges.length) changed.push({ id, fieldChanges, before, after: item });
  }
  for (const [id, item] of baseMap) {
    if (!headMap.has(id)) removed.push(item);
  }
  return { added, removed, changed };
}

function rerouted(base = [], head = []) {
  const baseMap = new Map(base.map((edge) => [edge.id, edge]));
  const reroutedEdges = [];
  for (const edge of head) {
    const before = baseMap.get(edge.id);
    if (!before) continue;
    const sameTerminals = before.from === edge.from && before.to === edge.to;
    const geometryFields = ['fromSide', 'toSide', 'route', 'via', 'labelAt', 'channelX', 'channelY'];
    const geometryChanged = geometryFields.some((field) => JSON.stringify(before[field]) !== JSON.stringify(edge[field]));
    if (sameTerminals && geometryChanged) reroutedEdges.push({ id: edge.id, from: edge.from, to: edge.to, before, after: edge });
  }
  return reroutedEdges;
}

export function compareBpmn(base, head) {
  const nodes = diffCollection(base.nodes || [], head.nodes || [], ['lane', 'col', 'type', 'label', 'sublabel', 'tag', 'width', 'height']);
  const lanes = diffCollection(base.lanes || [], head.lanes || [], ['label', 'variant']);
  const edges = diffCollection(base.edges || [], head.edges || [], ['from', 'to', 'label', 'variant', 'role']);
  const reroutes = rerouted(base.edges || [], head.edges || []);
  return {
    schemaVersion: 1,
    type: 'bpmn-delta',
    base: { title: base.meta?.title ?? 'Base' },
    head: { title: head.meta?.title ?? 'Head' },
    added: { nodes: nodes.added, lanes: lanes.added, edges: edges.added },
    removed: { nodes: nodes.removed, lanes: lanes.removed, edges: edges.removed },
    changed: { nodes: nodes.changed, lanes: lanes.changed, edges: edges.changed },
    rerouted: reroutes,
  };
}

function row(label, count) {
  return count
    ? `<tr><td>${esc(label)}</td><td class="count">${count}</td></tr>`
    : '';
}

export function renderBpmnDeltaHtml(receipt) {
  const added = receipt.added;
  const removed = receipt.removed;
  const changed = receipt.changed;
  const total = added.nodes.length + added.lanes.length + added.edges.length
    + removed.nodes.length + removed.lanes.length + removed.edges.length
    + changed.nodes.length + changed.lanes.length + changed.edges.length
    + receipt.rerouted.length;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FlowForge Delta — ${esc(receipt.base.title)} → ${esc(receipt.head.title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.5 system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1.25rem; color: #0f172a; background: #f8fafc; }
  @media (prefers-color-scheme: dark) { body { color: #e2e8f0; background: #020617; } }
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.1rem; margin-top: 2rem; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #94a3b8; padding: 0.4rem 0.6rem; text-align: left; vertical-align: top; }
  .count { text-align: right; }
  .muted { opacity: 0.65; }
  code { font: 12px/1.4 ui-monospace, monospace; }
</style>
</head>
<body>
<h1>FlowForge — Process Version Delta</h1>
<p><strong>${esc(receipt.base.title)}</strong> → <strong>${esc(receipt.head.title)}</strong></p>
<h2>Summary</h2>
<table>
  ${row('Nodes added', added.nodes.length)}
  ${row('Nodes removed', removed.nodes.length)}
  ${row('Nodes changed', changed.nodes.length)}
  ${row('Lanes added', added.lanes.length)}
  ${row('Lanes removed', removed.lanes.length)}
  ${row('Edges added', added.edges.length)}
  ${row('Edges removed', removed.edges.length)}
  ${row('Edges changed', changed.edges.length)}
  ${row('Edges rerouted', receipt.rerouted.length)}
  <tr><td><strong>Total facts</strong></td><td class="count"><strong>${total}</strong></td></tr>
</table>
${added.nodes.length ? `<h2>Added nodes</h2><ul>${added.nodes.map((n) => `<li><code>${esc(n.id)}</code> — ${esc(n.label)}</li>`).join('')}</ul>` : ''}
${removed.nodes.length ? `<h2>Removed nodes</h2><ul>${removed.nodes.map((n) => `<li><code>${esc(n.id)}</code> — ${esc(n.label)}</li>`).join('')}</ul>` : ''}
${changed.nodes.length ? `<h2>Changed nodes</h2><ul>${changed.nodes.map((n) => `<li><code>${esc(n.id)}</code>: ${n.fieldChanges.map(esc).join(', ')}</li>`).join('')}</ul>` : ''}
${added.edges.length ? `<h2>Added edges</h2><ul>${added.edges.map((e) => `<li><code>${esc(e.from)} → ${esc(e.to)}</code></li>`).join('')}</ul>` : ''}
${removed.edges.length ? `<h2>Removed edges</h2><ul>${removed.edges.map((e) => `<li><code>${esc(e.from)} → ${esc(e.to)}</code></li>`).join('')}</ul>` : ''}
${receipt.rerouted.length ? `<h2>Rerouted edges</h2><ul>${receipt.rerouted.map((e) => `<li><code>${esc(e.id)}</code>: ${esc(e.from)} → ${esc(e.to)} (geometry only)</li>`).join('')}</ul>` : ''}
<p class="muted">Machine receipt: ${esc(JSON.stringify(receipt))}</p>
</body>
</html>`;
}

export function writeBpmnDelta({ baseInput, headInput, outputHtml, receiptPath }) {
  const base = JSON.parse(fs.readFileSync(baseInput, 'utf8'));
  const head = JSON.parse(fs.readFileSync(headInput, 'utf8'));
  if (base.diagram_type !== 'bpmn' || head.diagram_type !== 'bpmn') {
    throw new Error('bpmn-delta requires two validated bpmn inputs');
  }
  const receipt = compareBpmn(base, head);
  fs.mkdirSync(path.dirname(outputHtml), { recursive: true });
  fs.writeFileSync(outputHtml, renderBpmnDeltaHtml(receipt));
  if (receiptPath) {
    fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
  }
  return receipt;
}
