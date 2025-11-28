// src/core/people/members.js
// واجهة متوافقة مع الإصدارات السابقة لإدارة ملفات الأعضاء

const { loadMembers, upsertMember, findMemberByDiscordId, listMembers: listAll } = require('./memberStore');

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function getMemberProfile(userId, store) {
  return findMemberByDiscordId(userId, store);
}

function upsertMemberProfile(userId, patch = {}, store) {
  return upsertMember(
    {
      ...patch,
      discordId: userId,
      id: patch.id || patch.discordId || userId
    },
    store
  );
}

function addSkill(userId, { key, level, examples = [] }, store) {
  if (!key) throw new Error('Skill key is required');
  const member = getMemberProfile(userId, store) || upsertMemberProfile(userId, {}, store);
  const skills = ensureArray(member.skills);
  if (skills.find(s => s && s.key === key)) throw new Error('Skill already exists');

  const nextSkill = { key, level, examples: ensureArray(examples) };
  upsertMemberProfile(userId, { skills: [...skills, nextSkill] }, store);
  return nextSkill;
}

function updateSkill(userId, { key, level, examples = [] }, store) {
  const member = getMemberProfile(userId, store);
  if (!member) throw new Error('Member not found');
  const skills = ensureArray(member.skills);
  const idx = skills.findIndex(s => s && s.key === key);
  if (idx === -1) throw new Error('Skill not found');

  const nextSkills = [...skills];
  nextSkills[idx] = { key, level, examples: ensureArray(examples) };
  const updated = upsertMemberProfile(userId, { skills: nextSkills }, store);
  return updated;
}

function addLearningInterest(userId, { key, notes = null }, store) {
  if (!key) throw new Error('Learning interest key is required');
  const member = getMemberProfile(userId, store) || upsertMemberProfile(userId, {}, store);
  const interests = ensureArray(member.learningInterests);
  const idx = interests.findIndex(li => li && li.key === key);
  const nextInterest = { key, notes: notes || null };

  if (idx >= 0) {
    interests[idx] = nextInterest;
  } else {
    interests.push(nextInterest);
  }

  upsertMemberProfile(userId, { learningInterests: interests }, store);
  return nextInterest;
}

function removeLearningInterest(userId, key, store) {
  const member = getMemberProfile(userId, store);
  if (!member) throw new Error('Member not found');
  const interests = ensureArray(member.learningInterests);
  const filtered = interests.filter(li => li && li.key !== key);
  return upsertMemberProfile(userId, { learningInterests: filtered }, store);
}

function listMembers(filter = {}, store) {
  const members = listAll(store);
  if (!filter) return members;

  return members.filter(profile => {
    if (filter.userId && String(profile.discordId) !== String(filter.userId)) return false;
    if (filter.unit && !(Array.isArray(profile.units) && profile.units.includes(filter.unit))) return false;
    if (filter.role && !(Array.isArray(profile.roles) && profile.roles.includes(filter.role))) return false;
    return true;
  });
}

module.exports = {
  getMemberProfile,
  upsertMemberProfile,
  addSkill,
  updateSkill,
  addLearningInterest,
  removeLearningInterest,
  listMembers,
  loadMembers
};
