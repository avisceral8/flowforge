// Regression: the node semantic sigil ("logo") must never overlap the primary
// label text. This locks the vertical-offset fix in render-bpmn/render-canvas:
// the label baseline sits below the sigil's bottom edge, so longer labels
// ("Ship order", "Receive goods", ...) stay clear of the corner icon.
//
//   node --test test/bpmn-label-clearance.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'flowforge-label-'));

const SIGIL_APPROX_BOTTOM_PX = 9; // scaled sigil height, conservatively small
const LABEL_CAP_PX = 8; // font-size 11 cap height, conservatively large

function render(type, input, outPath) {
  execFileSync('node', [
    path.join(skillRoot, 'renderers', type, `render-${type}.mjs`),
    input,
    outPath,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
}

function parseNodeGroups(html) {
  const groups = [];
  const pattern = /<g [^>]*data-node-id="[^"]+"/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const start = match.index;
    let depth = 0;
    let cursor = start;
    while (cursor < html.length) {
      const open = html.indexOf('<g', cursor);
      const close = html.indexOf('</g>', cursor);
      if (close === -1) break;
      if (open !== -1 && open < close) {
        depth += 1;
        cursor = open + 2;
      } else {
        depth -= 1;
        cursor = close + 4;
        if (depth === 0) break;
      }
    }
    groups.push(html.slice(start, cursor));
  }
  return groups;
}

function sigilTop(group) {
  const match = group.match(/data-semantic-sigil="[^"]+"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\)/);
  return match ? Number(match[2]) : null;
}

function labelBaseline(group) {
  const textTag = group.match(/<text[^>]*class="t-primary"[^>]*>/);
  if (!textTag) return null;
  const y = textTag[0].match(/y="([-\d.]+)"/);
  return y ? Number(y[1]) : null;
}

test('bpmn node labels clear the semantic sigil vertically', () => {
  const input = path.join(skillRoot, 'examples', 'order-return.bpmn.json');
  const outPath = path.join(tmp, 'order-return.html');
  render('bpmn', input, outPath);
  const html = fs.readFileSync(outPath, 'utf8');
  const groups = parseNodeGroups(html);
  assert.ok(groups.length >= 4, `expected multiple node groups, got ${groups.length}`);

  for (const group of groups) {
    const top = sigilTop(group);
    const baseline = labelBaseline(group);
    assert.ok(top !== null, 'node group is missing a semantic sigil');
    assert.ok(baseline !== null, 'node group is missing a primary label');
    const labelTop = baseline - LABEL_CAP_PX;
    assert.ok(
      labelTop >= top + SIGIL_APPROX_BOTTOM_PX,
      `label overlaps sigil: labelTop=${labelTop} vs sigilBottom=${top + SIGIL_APPROX_BOTTOM_PX}`,
    );
  }
});
