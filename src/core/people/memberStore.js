// src/core/people/memberStore.js
// تخزين ملفات الأعضاء في JSON مع واجهة موحّدة

const { defaultStore } = require('../store');
const { createEmptyMember, normalizeMember } = require('./memberModel');

const MEMBERS_KEY = 'members';

function ensureStore(store = defaultStore) {
  return store || defaultStore;
}

function loadMembers(store = defaultStore) {
  const list = ensureStore(store).read(MEMBERS_KEY, []);
  if (!Array.isArray(list)) return [];
  return list.map(item => normalizeMember(item));
}

function saveMembers(list, store = defaultStore) {
  ensureStore(store).write(MEMBERS_KEY, Array.isArray(list) ? list : []);
}

function findMemberByDiscordId(discordId, store = defaultStore) {
  if (!discordId) return null;
  const members = loadMembers(store);
  return members.find(m => String(m.discordId) === String(discordId)) || null;
}

function uniqueList(list, fallback = []) {
  return Array.from(new Set(Array.isArray(list) ? list.filter(Boolean) : fallback));
}

function safeIso(now) {
  if (now instanceof Date && !Number.isNaN(now.valueOf())) return now.toISOString();
  const parsed = new Date(now);
  if (Number.isNaN(parsed.valueOf())) return new Date().toISOString();
  return parsed.toISOString();
}

function upsertMember(partial, store = defaultStore, now = new Date()) {
  if (!partial || !partial.discordId) {
    throw new Error('discordId is required to upsert member');
  }

  const members = loadMembers(store);
  const idx = members.findIndex(m => String(m.discordId) === String(partial.discordId));
  const existing = idx >= 0 ? normalizeMember(members[idx]) : createEmptyMember({
    discordId: partial.discordId,
    username: partial.username,
    now
  });

  const timestamp = safeIso(now);
  const next = normalizeMember({
    ...existing,
    ...partial,
    id: partial.id || existing.id || String(partial.discordId),
    discordId: String(partial.discordId),
    username: partial.username || existing.username || '',
    displayName: partial.displayName ?? existing.displayName ?? null,
    units: uniqueList(partial.units, existing.units),
    functions: uniqueList(partial.functions, existing.functions),
    languages: uniqueList(partial.languages, existing.languages),
    identityMode: partial.identityMode || existing.identityMode || 'unknown',
    state: partial.state || existing.state || 'guest',
    bio: partial.bio ?? existing.bio ?? null,
    availability: partial.availability ?? existing.availability ?? null,
    stats: { ...existing.stats, ...(partial.stats || {}) },
    roles: uniqueList(partial.roles, existing.roles),
    skills: Array.isArray(partial.skills) ? partial.skills : existing.skills,
    learningInterests: Array.isArray(partial.learningInterests)
      ? partial.learningInterests
      : existing.learningInterests,
    createdAt: existing.createdAt || timestamp,
    updatedAt: timestamp
  });

  if (idx >= 0) {
    members[idx] = next;
  } else {
    members.push(next);
  }

  saveMembers(members, store);
  return next;
}

function listMembers(store = defaultStore) {
  return loadMembers(store);
}

module.exports = {
  loadMembers,
  saveMembers,
  findMemberByDiscordId,
  upsertMember,
  listMembers
};
