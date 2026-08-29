// Regression: the node semantic glyph ("logo") must never overlap the primary
// label text. Locks the vertical-offset fix in render-bpmn: for task nodes the
// glyph sits at the top-left corner and the label baseline sits far enough below
// that long labels ("Validate credit", "Fulfill order", ...) never collide.
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

const LABEL_CAP_PX = 8; // font-size 11 cap height, conservative
const MIN_CLEARANCE_PX = 2;

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

function taskGlyphBottom(group) {
  const match = group.match(/<rect[^>]*class="semantic-sigil s-frontend"[^>]*/);
  if (!match) return null;
  const tag = match[0];
  const y = Number((tag.match(/y="([-\d.]+)"/) || [])[1]);
  const h = Number((tag.match(/height="([-\d.]+)"/) || [])[1]);
  return Number.isFinite(y) && Number.isFinite(h) ? y + h : null;
}

function labelBaseline(group) {
  const textTag = group.match(/<text[^>]*data-node-label=""[^>]*>/);
  if (!textTag) return null;
  const y = textTag[0].match(/y="([-\d.]+)"/);
  return y ? Number(y[1]) : null;
}

test('bpmn task labels clear the semantic glyph vertically', () => {
  const input = path.join(skillRoot, 'examples', 'order-to-fulfillment.bpmn.json');
  const outPath = path.join(tmp, 'order-to-fulfillment.html');
  render('bpmn', input, outPath);
  const html = fs.readFileSync(outPath, 'utf8');
  const groups = parseNodeGroups(html);
  assert.ok(groups.length >= 4, `expected multiple node groups, got ${groups.length}`);

  let checked = 0;
  for (const group of groups) {
    const glyphBottom = taskGlyphBottom(group);
    const baseline = labelBaseline(group);
    if (glyphBottom === null) continue; // events/gateways render labels below the shape
    assert.ok(baseline !== null, 'task node group is missing a primary label');
    const labelTop = baseline - LABEL_CAP_PX;
    assert.ok(
      labelTop >= glyphBottom + MIN_CLEARANCE_PX,
      `label overlaps glyph: labelTop=${labelTop} vs glyphBottom=${glyphBottom} (needs ${MIN_CLEARANCE_PX}px)`,
    );
    checked += 1;
  }
  assert.ok(checked >= 2, `expected at least 2 task nodes with glyphs, got ${checked}`);
});
