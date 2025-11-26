const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const {
  getMemberProfile,
  upsertMemberProfile,
  addSkill,
  updateSkill,
  addLearningInterest,
  removeLearningInterest,
  listMembers
} = require('../../src/core/people/members');

test('member profile upsert, skills, and learning interests', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-members-'));
  const store = createStore({ dataDir: dir });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const profile = upsertMemberProfile('user-1', { units: ['media'], roles: ['editor'] }, store);
  assert.strictEqual(profile.userId, 'user-1');
  assert.deepStrictEqual(profile.units, ['media']);

  const skill = addSkill('user-1', { key: 'editing', level: 'advanced', examples: ['link1'] }, store);
  assert.strictEqual(skill.key, 'editing');

  const updatedProfile = updateSkill('user-1', { key: 'editing', level: 'advanced', examples: ['link2'] }, store);
  assert.strictEqual(updatedProfile.skills[0].examples[0], 'link2');

  addLearningInterest('user-1', { key: 'osint_basic', notes: 'learn soon' }, store);
  const withRemoved = removeLearningInterest('user-1', 'osint_basic', store);
  assert.deepStrictEqual(withRemoved.learningInterests, []);

  const fetched = getMemberProfile('user-1', store);
  assert.ok(fetched);
  assert.strictEqual(listMembers({ unit: 'media' }, store).length, 1);
});
