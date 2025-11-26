// src/core/people/members.js
const { defaultStore } = require('../store');

const MEMBERS_KEY = 'members';

function getStore(store = defaultStore) {
  return store || defaultStore;
}

function baseProfile(userId) {
  return {
    userId: String(userId),
    units: [],
    roles: [],
    skills: [],
    learningInterests: []
  };
}

function loadMembers(store = defaultStore) {
  const members = getStore(store).read(MEMBERS_KEY, []);
  return Array.isArray(members) ? members : [];
}

function saveMembers(list, store = defaultStore) {
  const normalized = Array.isArray(list) ? list : [];
  getStore(store).write(MEMBERS_KEY, normalized);
}

function getMemberProfile(userId, store = defaultStore) {
  const members = loadMembers(store);
  const profile = members.find(m => String(m.userId) === String(userId));
  return profile || null;
}

function upsertMemberProfile(userId, patch = {}, store = defaultStore) {
  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.userId) === String(userId));
  const existing = idx >= 0 ? members[idx] : baseProfile(userId);
  const next = {
    ...existing,
    ...patch,
    userId: String(userId),
    units: Array.isArray(patch.units) ? patch.units : existing.units || [],
    roles: Array.isArray(patch.roles) ? patch.roles : existing.roles || [],
    skills: Array.isArray(patch.skills) ? patch.skills : existing.skills || [],
    learningInterests: Array.isArray(patch.learningInterests)
      ? patch.learningInterests
      : existing.learningInterests || []
  };

  if (idx >= 0) {
    members[idx] = next;
  } else {
    members.push(next);
  }

  saveMembers(members, store);
  return next;
}

function addSkill(userId, { key, level, examples = [] }, store = defaultStore) {
  if (!key) throw new Error('Skill key is required');
  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.userId) === String(userId));
  const profile = idx >= 0 ? members[idx] : baseProfile(userId);

  const exists = Array.isArray(profile.skills)
    ? profile.skills.find(s => s && s.key === key)
    : null;
  if (exists) throw new Error('Skill already exists');

  const nextSkill = { key, level, examples: Array.isArray(examples) ? examples : [] };
  const nextProfile = {
    ...profile,
    skills: [...(profile.skills || []), nextSkill]
  };

  if (idx >= 0) {
    members[idx] = nextProfile;
  } else {
    members.push(nextProfile);
  }

  saveMembers(members, store);
  return nextSkill;
}

function updateSkill(userId, { key, level, examples = [] }, store = defaultStore) {
  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.userId) === String(userId));
  if (idx === -1) throw new Error('Member not found');
  const profile = members[idx];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const sIdx = skills.findIndex(s => s && s.key === key);
  if (sIdx === -1) throw new Error('Skill not found');

  const nextSkills = [...skills];
  nextSkills[sIdx] = { key, level, examples: Array.isArray(examples) ? examples : [] };

  members[idx] = { ...profile, skills: nextSkills };
  saveMembers(members, store);
  return members[idx];
}

function addLearningInterest(userId, { key, notes = null }, store = defaultStore) {
  if (!key) throw new Error('Learning interest key is required');
  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.userId) === String(userId));
  const profile = idx >= 0 ? members[idx] : baseProfile(userId);

  const interests = Array.isArray(profile.learningInterests) ? profile.learningInterests : [];
  const existingIdx = interests.findIndex(li => li && li.key === key);
  const nextInterest = { key, notes: notes || null };

  const nextInterests = [...interests];
  if (existingIdx >= 0) {
    nextInterests[existingIdx] = nextInterest;
  } else {
    nextInterests.push(nextInterest);
  }

  const nextProfile = { ...profile, learningInterests: nextInterests };
  if (idx >= 0) {
    members[idx] = nextProfile;
  } else {
    members.push(nextProfile);
  }

  saveMembers(members, store);
  return nextInterest;
}

function removeLearningInterest(userId, key, store = defaultStore) {
  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.userId) === String(userId));
  if (idx === -1) throw new Error('Member not found');

  const profile = members[idx];
  const interests = Array.isArray(profile.learningInterests) ? profile.learningInterests : [];
  const filtered = interests.filter(li => li && li.key !== key);

  members[idx] = { ...profile, learningInterests: filtered };
  saveMembers(members, store);
  return members[idx];
}

function listMembers(filter = {}, store = defaultStore) {
  const members = loadMembers(store);
  if (!filter) return members;

  return members.filter(profile => {
    if (filter.userId && String(profile.userId) !== String(filter.userId)) return false;
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
  listMembers
};
