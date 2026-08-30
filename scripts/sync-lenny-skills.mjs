#!/usr/bin/env node
// Sync curated Lenny skills from vendor/lenny-skills into the harness
// directories the fork ships to. Mirrors the keep list (KEEP.txt) verbatim;
// never edits or removes the upstream LICENSE.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const vendor = path.join(repoRoot, 'vendor', 'lenny-skills');
const source = path.join(vendor, 'skills');
const license = path.join(vendor, 'LICENSE');
const keepFile = path.join(vendor, 'KEEP.txt');
const targets = [
  path.join(repoRoot, '.pi', 'skills'),
  path.join(repoRoot, '.claude', 'skills'),
  path.join(repoRoot, '.agents', 'skills'),
  path.join(repoRoot, '.codex', 'skills'),
];

if (!fs.existsSync(source)) {
  console.error(`error: ${source} not found — clone refoundai/lenny-skills into vendor/lenny-skills first`);
  process.exit(1);
}
if (!fs.existsSync(license)) {
  console.error(`error: ${license} not found`);
  process.exit(1);
}
if (!fs.existsSync(keepFile)) {
  console.error(`error: ${keepFile} not found`);
  process.exit(1);
}

const keep = fs.readFileSync(keepFile, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

const missing = keep.filter((id) => !fs.existsSync(path.join(source, id)));
if (missing.length) {
  console.error(`error: keep list references missing skills: ${missing.join(', ')}`);
  process.exit(1);
}

for (const dest of targets) {
  fs.mkdirSync(dest, { recursive: true });
  // Remove previous mirrored skills that are no longer kept, so pruning is
  // reproducible across syncs.
  for (const entry of fs.readdirSync(dest, { withFileTypes: true })) {
    if (entry.isDirectory() && !keep.includes(entry.name)) {
      fs.rmSync(path.join(dest, entry.name), { recursive: true, force: true });
    }
  }
  for (const id of keep) {
    fs.cpSync(path.join(source, id), path.join(dest, id), { recursive: true, force: true });
  }
  fs.copyFileSync(license, path.join(dest, 'LICENSE'));
  console.log(`synced ${keep.length} skills -> ${path.relative(repoRoot, dest)}`);
}
console.log('done');