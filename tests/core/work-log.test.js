const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { addBackfillEntry, verifyBackfillEntry, listBackfillEntries } = require('../../src/core/people/work-log');

test('backfill work log add and verify', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-worklog-'));
  const store = createStore({ dataDir: dir });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const entry = addBackfillEntry(
    'user-1',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Archived story',
      description: 'Completed earlier this year',
      completedAt: '2024-01-01',
      links: ['https://example.com/story']
    },
    store
  );

  assert.strictEqual(entry.source, 'backfill');
  assert.strictEqual(entry.verified, false);

  const verified = verifyBackfillEntry(entry.id, 'reviewer-1', true, store);
  assert.strictEqual(verified.verified, true);
  assert.strictEqual(verified.verificationReviewerId, 'reviewer-1');

  const filtered = listBackfillEntries({ userId: 'user-1', verified: true }, store);
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, entry.id);
});
