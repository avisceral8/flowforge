#!/usr/bin/env node
// Build the final FlowForge deliverables into ../deliverables/.
//
// examples/ holds source JSON (authoring inputs); this script renders the
// polished, validated final outputs into the deliverables folder so the
// package ships artifacts in one place.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..', 'flowforge');
const repoRoot = path.resolve(skillRoot, '..');
const deliverables = path.join(repoRoot, 'deliverables');
const cli = path.join(skillRoot, 'bin', 'flowforge.mjs');

const BPMN_EXAMPLES = ['order-to-fulfillment', 'order-to-cash'];
const CANVAS_TYPES = ['journey', 'infoflow', 'stakeholder-map', 'capability', 'okr-tree', 'north-star', 'growth-loop', 'launch-plan', 'feedback-pipeline'];

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(`FAIL: flowforge ${args.join(' ')}\n${result.stderr || result.stdout}\n`);
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

function render(type, input, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  run(['render', type, input, output, '--quality', 'showcase']);
  console.log(`  rendered ${path.relative(repoRoot, output)}`);
}

// Reset only the generated subfolders so the README manifest and built zip
// survive rebuilds.
for (const sub of ['bpmn', 'canvas']) {
  fs.rmSync(path.join(deliverables, sub), { recursive: true, force: true });
}
fs.mkdirSync(path.join(deliverables, 'bpmn'), { recursive: true });
fs.mkdirSync(path.join(deliverables, 'canvas'), { recursive: true });

console.log('BPMN process maps');
for (const name of BPMN_EXAMPLES) {
  render('bpmn', path.join(skillRoot, 'examples', `${name}.bpmn.json`), path.join(deliverables, 'bpmn', `${name}.html`));
}
// Before/Delta/After for order-to-cash v1 -> v2.
run(['compare', 'bpmn', path.join(skillRoot, 'examples', 'order-to-cash.bpmn.json'), path.join(skillRoot, 'examples', 'order-to-cash-v2.bpmn.json'), path.join(deliverables, 'bpmn', 'order-to-cash-delta.html'), '--receipt', path.join(deliverables, 'bpmn', 'order-to-cash-delta.receipt.json'), '--json']);
console.log('  rendered deliverables/bpmn/order-to-cash-delta.html');

console.log('Canvas business types');
for (const type of CANVAS_TYPES) {
  render(type, path.join(skillRoot, 'examples', `order-to-cash.${type}.json`), path.join(deliverables, 'canvas', `order-to-cash.${type}.html`));
}

console.log('\nDeliverables rebuilt in', path.relative(repoRoot, deliverables));