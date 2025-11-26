const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { addBackfillEntry, verifyBackfillEntry } = require('../../src/core/people/work-log');
const { updateMemberStatus, STATUS_TIERS } = require('../../src/core/people/services/membersStatusService');
const { upsertMemberProfile } = require('../../src/core/people/members');

function makeTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-status-'));
  const store = createStore({ dataDir: dir });
  return { dir, store };
}

test('member status is derived from verified work log activity', t => {
  const { dir, store } = makeTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const now = new Date('2024-05-15T12:00:00Z');

  const e1 = addBackfillEntry(
    'user-1',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Story draft',
      description: 'First draft done',
      completedAt: '2024-05-13',
      links: []
    },
    store
  );

  const e2 = addBackfillEntry(
    'user-1',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Photo pass',
      description: 'Selected assets',
      completedAt: '2024-05-10',
      links: []
    },
    store
  );

  // Mark only the first two entries as verified; a third unverified should be ignored.
  verifyBackfillEntry(e1.id, 'reviewer', true, store);
  verifyBackfillEntry(e2.id, 'reviewer', true, store);

  addBackfillEntry(
    'user-1',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Unverified log',
      description: 'Pending review',
      completedAt: '2024-05-12',
      links: []
    },
    store
  );

  const profile = updateMemberStatus('user-1', store, now);

  assert.strictEqual(profile.status.tier, STATUS_TIERS.Core);
  assert.strictEqual(profile.status.workLogStats.totalVerified, 2);
  assert.strictEqual(profile.status.workLogStats.last7Days, 2);
  assert.strictEqual(profile.status.workLogStats.last14Days, 2);
});

test('status downgrades from active to guest when activity drops', t => {
  const { dir, store } = makeTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const midMonth = new Date('2024-05-20T12:00:00Z');
  const lateMonth = new Date('2024-06-25T12:00:00Z');

  const entry = addBackfillEntry(
    'user-2',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Mid-May task',
      description: 'Finished editing',
      completedAt: '2024-05-18',
      links: []
    },
    store
  );

  verifyBackfillEntry(entry.id, 'reviewer', true, store);

  const active = updateMemberStatus('user-2', store, midMonth);
  assert.strictEqual(active.status.tier, STATUS_TIERS.Active);

  const guest = updateMemberStatus('user-2', store, lateMonth);
  assert.strictEqual(guest.status.tier, STATUS_TIERS.Guest);
});

test('suspended members keep their tier regardless of activity', t => {
  const { dir, store } = makeTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const now = new Date('2024-05-15T12:00:00Z');
  const entry = addBackfillEntry(
    'user-3',
    {
      unit: 'media',
      pipelineKey: 'media.article_short',
      title: 'Suspended work',
      description: 'Completed',
      completedAt: '2024-05-13',
      links: []
    },
    store
  );
  verifyBackfillEntry(entry.id, 'reviewer', true, store);

  // Seed a suspended status manually then persist it.
  const first = updateMemberStatus('user-3', store, now);
  first.status = {
    ...first.status,
    tier: STATUS_TIERS.Suspended,
    updatedAt: now.toISOString(),
    workLogStats: { ...first.status.workLogStats, totalVerified: 0 }
  };

  upsertMemberProfile('user-3', first, store);

  updateMemberStatus('user-3', store, now);

  const frozen = updateMemberStatus('user-3', store, now);
  assert.strictEqual(frozen.status.tier, STATUS_TIERS.Suspended);
});

test('members with no verified work log entries default to guest status', t => {
  const { dir, store } = makeTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const now = new Date('2024-05-15T12:00:00Z');

  const profile = updateMemberStatus('user-blank', store, now);

  assert.strictEqual(profile.status.tier, STATUS_TIERS.Guest);
  assert.deepStrictEqual(profile.status.workLogStats, {
    totalVerified: 0,
    last7Days: 0,
    last14Days: 0,
    last30Days: 0,
    lastCompletedAt: null
  });
});

test('trial status persists when no recent activity is present', t => {
  const { dir, store } = makeTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const seeded = upsertMemberProfile(
    'user-trial',
    {
      id: 'user-trial',
      status: {
        tier: STATUS_TIERS.Trial,
        updatedAt: '2024-05-01T00:00:00Z',
        workLogStats: {
          totalVerified: 0,
          last7Days: 0,
          last14Days: 0,
          last30Days: 0,
          lastCompletedAt: null
        }
      }
    },
    store
  );

  const refreshed = updateMemberStatus('user-trial', store, new Date('2024-06-01T00:00:00Z'));

  assert.strictEqual(seeded.status.tier, STATUS_TIERS.Trial);
  assert.strictEqual(refreshed.status.tier, STATUS_TIERS.Trial);
});
