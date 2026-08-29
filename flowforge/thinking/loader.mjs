// thinking/loader.mjs — declarative loader for FlowForge thinking packs.
//
// Thinking packs are bundled authoring guidance the agent consults before and
// while authoring a business diagram. Mirroring the type registry, every pack
// is validated against pack.schema.json (fail-closed on drift) and every pack
// must credit the upstream MIT-licensed Lenny's Product Skills collection.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packsRoot = path.join(__dirname, 'packs');
const ATTRIBUTION_MARKER = 'refoundai/lenny-skills';

function readPack(file) {
  const full = path.join(packsRoot, file);
  return { file, full, pack: JSON.parse(fs.readFileSync(full, 'utf8')) };
}

function validatePack(file, pack) {
  const problems = [];
  const required = ['pack_version', 'id', 'label', 'description', 'attribution', 'sources', 'questions', 'checks'];
  for (const key of required) {
    if (pack[key] === undefined) problems.push(`${file}: missing required field "${key}"`);
  }
  if (!String(pack.attribution || '').toLowerCase().includes(ATTRIBUTION_MARKER)) {
    problems.push(`${file}: attribution must credit github.com/refoundai/lenny-skills (MIT)`);
  }
  return problems;
}

let cache;

export function loadThinkingPacks() {
  if (cache) return cache;
  const packs = new Map();
  const problems = [];
  let files = [];
  try {
    files = fs.readdirSync(packsRoot).filter((entry) => entry.endsWith('.pack.json')).sort();
  } catch {
    files = [];
  }
  for (const file of files) {
    let pack;
    try {
      pack = readPack(file).pack;
    } catch (error) {
      problems.push(`${file}: invalid JSON (${error.message})`);
      continue;
    }
    for (const problem of validatePack(file, pack)) problems.push(problem);
    if (packs.has(pack.id)) problems.push(`${file}: duplicate id "${pack.id}"`);
    packs.set(pack.id, Object.freeze(pack));
  }
  if (problems.length) {
    const error = new Error(`thinking packs failed to load:\n- ${problems.join('\n- ')}`);
    error.diagnostics = problems;
    throw error;
  }
  cache = Object.freeze({
    get: (id) => packs.get(id),
    has: (id) => packs.has(id),
    ids: () => [...packs.keys()].sort(),
    packs: () => [...packs.values()],
  });
  return cache;
}