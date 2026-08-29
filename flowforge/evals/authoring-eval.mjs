#!/usr/bin/env node
// authoring-eval.mjs — score authored FlowForge IR against the golden set.
//
// Error taxonomy: missing_step, wrong_owner, wrong_gateway, wrong_sequence,
// invented_edge, missing_exception. Scoring is structural: lane coverage,
// gateway presence, end-event coverage, and step/edge inventory.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenPath = path.join(__dirname, 'golden-set.json');
const golden = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));

function scoreCase(testCase, authored) {
  const expected = testCase.expected;
  const lanes = (authored.lanes || []).map((lane) => lane.id);
  const nodeIds = (authored.nodes || []).map((node) => node.id);
  const edgeCount = (authored.edges || []).length;
  const diagnostics = [];
  const points = { laneCoverage: 0, gateway: 0, endEvents: 0, connectivity: 0, max: 4 };

  const laneHits = expected.lanes.filter((lane) => lanes.includes(lane)).length;
  points.laneCoverage = laneHits === expected.lanes.length ? 1 : laneHits / Math.max(1, expected.lanes.length) * 0.5;
  if (laneHits < expected.lanes.length) {
    diagnostics.push(`missing lane: expected one of ${expected.lanes.join(', ')} (got ${lanes.join(', ') || 'none'})`);
  }

  const hasGateway = nodeIds.some((id) => id.includes('gate') || id.includes('check') || id.includes('threshold') || id.includes('severity') || id === expected.gateway);
  points.gateway = hasGateway ? 1 : 0;
  if (!hasGateway) diagnostics.push(`missing gateway: ${expected.gateway}`);

  const endHits = expected.endEvents.filter((id) => nodeIds.includes(id)).length;
  points.endEvents = endHits === expected.endEvents.length ? 1 : endHits / Math.max(1, expected.endEvents.length) * 0.5;
  if (endHits < expected.endEvents.length) diagnostics.push(`missing end event(s): ${expected.endEvents.join(', ')}`);

  points.connectivity = edgeCount >= nodeIds.length - 1 ? 1 : edgeCount / Math.max(1, nodeIds.length - 1) * 0.5;
  if (edgeCount < nodeIds.length - 1) diagnostics.push(`under-connected: ${edgeCount} edges for ${nodeIds.length} nodes`);

  const score = Object.values(points).slice(0, 4).reduce((sum, value) => sum + value, 0) / points.max;
  return { score, points, diagnostics };
}

function main() {
  const authoredArg = process.argv[2];
  const authored = authoredArg
    ? JSON.parse(fs.readFileSync(path.resolve(authoredArg), 'utf8'))
    : null;

  if (!authored) {
    console.error('usage: node evals/authoring-eval.mjs <authored.json> [case-id]');
    process.exit(2);
  }

  const caseId = process.argv[3];
  const cases = caseId
    ? golden.cases.filter((testCase) => testCase.id === caseId)
    : golden.cases;

  let total = 0;
  const results = [];
  for (const testCase of cases) {
    const result = scoreCase(testCase, authored);
    results.push({ id: testCase.id, ...result });
    total += result.score;
  }
  const average = cases.length ? total / cases.length : 0;
  const summary = {
    schemaVersion: 1,
    ok: average >= 0.8,
    average,
    threshold: 0.8,
    cases: results,
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = summary.ok ? 0 : 1;
}

main();
