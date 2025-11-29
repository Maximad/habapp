const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const membersStore = require('../../src/core/people/membersStore');
const {
  applyQualityReviewToMember,
  applyEthicsReviewToMember
} = require('../../src/core/people/memberStatsService');

test('applyQualityReviewToMember updates averages and counts', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-stats-'));
  const store = createStore({ dataDir: dir });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  await membersStore.saveMember({ discordId: 'user-1', username: 'Tester' }, store);

  await applyQualityReviewToMember('user-1', 3, store);
  let member = await membersStore.getMemberByDiscordId('user-1', store);
  assert.strictEqual(member.stats.quality.reviews, 1);
  assert.strictEqual(member.stats.quality.avgScore, 3);

  await applyQualityReviewToMember('user-1', 1, store);
  member = await membersStore.getMemberByDiscordId('user-1', store);
  assert.strictEqual(member.stats.quality.reviews, 2);
  assert.strictEqual(member.stats.quality.avgScore, 2);
});

test('applyEthicsReviewToMember increments counters', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-ethics-'));
  const store = createStore({ dataDir: dir });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  await membersStore.saveMember({ discordId: 'user-2', username: 'Ethics' }, store);

  await applyEthicsReviewToMember('user-2', 'ok', store);
  await applyEthicsReviewToMember('user-2', 'needs_discussion', store);
  await applyEthicsReviewToMember('user-2', 'violation', store);

  const member = await membersStore.getMemberByDiscordId('user-2', store);
  assert.strictEqual(member.stats.ethics.ok, 1);
  assert.strictEqual(member.stats.ethics.needsDiscussion, 1);
  assert.strictEqual(member.stats.ethics.violation, 1);
});
