#!/usr/bin/env node
// Sync vendored Lenny skills from vendor/lenny-skills into the harness
// directories the fork ships to. Mirrors skill folders verbatim; never edits
// or removes the upstream LICENSE.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const source = path.join(repoRoot, 'vendor', 'lenny-skills', 'skills');
const license = path.join(repoRoot, 'vendor', 'lenny-skills', 'LICENSE');
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

const names = fs.readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const dest of targets) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of names) {
    const from = path.join(source, name);
    const to = path.join(dest, name);
    fs.cpSync(from, to, { recursive: true, force: true });
  }
  fs.copyFileSync(license, path.join(dest, 'LICENSE'));
  console.log(`synced ${names.length} skills -> ${path.relative(repoRoot, dest)}`);
}
console.log('done');
