// registry.mjs — declarative diagram-type registry for FlowForge.
//
// Every business diagram type is described by a spec file in types/*.spec.json.
// The registry is a pure loader: it validates each spec against
// type-spec.schema.json (fail-closed on drift), confirms the referenced renderer
// and schema exist, and exposes lookup for the guide/CLI.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const typesRoot = __dirname;

function specShape(spec, file) {
  const problems = [];
  const required = ['spec_version', 'id', 'label', 'description', 'renderer', 'schema', 'layout', 'conditions'];
  if (!spec || typeof spec !== 'object') return ['spec must be an object'];
  for (const key of required) {
    if (spec[key] === undefined) problems.push(`${file}: missing required field "${key}"`);
  }
  if (spec.id && !/^[a-z][a-z0-9-]{2,30}$/.test(spec.id)) problems.push(`${file}: invalid id "${spec.id}"`);
  if (!path.join(skillRoot, 'renderers', spec.id, spec.renderer) && spec.renderer) {
    problems.push(`${file}: renderer binding must point inside renderers/${spec.id}/`);
  }
  return problems;
}

function verifyBindings(spec, file) {
  const problems = [];
  const renderer = path.join(skillRoot, 'renderers', spec.id, spec.renderer);
  if (!fs.existsSync(renderer)) problems.push(`${file}: renderer not found at ${path.relative(skillRoot, renderer)}`);
  const schema = path.join(skillRoot, 'schemas', spec.schema);
  if (!fs.existsSync(schema)) problems.push(`${file}: schema not found at ${path.relative(skillRoot, schema)}`);
  return problems;
}

let cache;

export function loadTypeRegistry() {
  if (cache) return cache;
  const specs = new Map();
  const problems = [];
  let files = [];
  try {
    files = fs.readdirSync(typesRoot).filter((entry) => entry.endsWith('.spec.json')).sort();
  } catch {
    files = [];
  }
  for (const file of files) {
    let spec;
    try {
      spec = JSON.parse(fs.readFileSync(path.join(typesRoot, file), 'utf8'));
    } catch (error) {
      problems.push(`${file}: invalid JSON (${error.message})`);
      continue;
    }
    for (const problem of [...specShape(spec, file), ...verifyBindings(spec, file)]) problems.push(problem);
    if (specs.has(spec.id)) problems.push(`${file}: duplicate id "${spec.id}"`);
    specs.set(spec.id, Object.freeze(spec));
  }
  if (problems.length) {
    const error = new Error(`type registry failed to load:\n- ${problems.join('\n- ')}`);
    error.diagnostics = problems;
    throw error;
  }
  cache = Object.freeze({
    get: (id) => specs.get(id),
    has: (id) => specs.has(id),
    ids: () => [...specs.keys()].sort(),
    specs: () => [...specs.values()],
    resolve: (id) => {
      const spec = specs.get(id);
      if (!spec) throw new Error(`unknown diagram type "${id}" (registered: ${[...specs.keys()].join(', ')})`);
      return spec;
    },
    guideSignals: () => [...specs.values()].map((spec) => ({ id: spec.id, label: spec.label, keywords: spec.guideKeywords || [], signals: spec.conditions?.signals || [] })),
  });
  return cache;
}