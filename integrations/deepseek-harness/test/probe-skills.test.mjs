import assert from 'node:assert/strict';
import test from 'node:test';
import { waitForFlowForge } from './probe-skills.mjs';

test('skill probe waits for a provider that registers during DSH boot', async () => {
  let calls = 0;
  const flowforge = { name: 'flowforge', provider: 'flowforge-plugin' };
  const skills = {
    async list() {
      calls += 1;
      return calls < 3 ? [] : [flowforge];
    },
  };
  const result = await waitForFlowForge(skills, '/workspace', {
    timeoutMs: 1_000,
    sleep: async () => {},
  });
  assert.equal(calls, 3);
  assert.equal(result.flowforge, flowforge);
  assert.deepEqual(result.list, [flowforge]);
});
