// src/core/people/memberModel.js
// نموذج موحّد لأعضاء حبق مع قيم افتراضية واضحة

function isoTimestamp(now = new Date()) {
  if (typeof now === 'function') return isoTimestamp(now());
  if (now instanceof Date) return now.toISOString();
  const parsed = new Date(now);
  if (Number.isNaN(parsed.valueOf())) return new Date().toISOString();
  return parsed.toISOString();
}

function uniqueList(list) {
  return Array.from(new Set(Array.isArray(list) ? list.filter(Boolean) : []));
}

function defaultStats(stats = {}) {
  return {
    completedTasks: Number.isFinite(stats.completedTasks) ? stats.completedTasks : 0,
    qualityAvg: stats.qualityAvg ?? null,
    ethicsFlags: Number.isFinite(stats.ethicsFlags) ? stats.ethicsFlags : 0,
    points: Number.isFinite(stats.points) ? stats.points : 0,
    lastActiveAt: stats.lastActiveAt || null
  };
}

function createEmptyMember({ discordId, username, now } = {}) {
  const ts = isoTimestamp(now || new Date());
  const id = discordId ? String(discordId) : null;

  return {
    id,
    discordId: discordId ? String(discordId) : '',
    userId: discordId ? String(discordId) : '',
    username: username || '',
    displayName: null,
    units: [],
    functions: [],
    identityMode: 'unknown',
    state: 'guest',
    languages: [],
    availability: null,
    bio: null,
    stats: defaultStats(),
    status: null,
    createdAt: ts,
    updatedAt: ts,
    // الحقول السابقة في النظام القديم تُترك لدعم التوافق
    roles: [],
    skills: [],
    learningInterests: []
  };
}

function normalizeMember(raw = {}) {
  if (!raw || typeof raw !== 'object') return createEmptyMember({});

  const createdAt = raw.createdAt || isoTimestamp();
  const updatedAt = raw.updatedAt || createdAt;

  return {
    id: raw.id || (raw.discordId ? String(raw.discordId) : null),
    discordId: raw.discordId ? String(raw.discordId) : '',
    userId: raw.userId ? String(raw.userId) : raw.discordId ? String(raw.discordId) : '',
    username: raw.username || '',
    displayName: raw.displayName ?? null,
    units: uniqueList(raw.units),
    functions: uniqueList(raw.functions),
    identityMode: raw.identityMode || 'unknown',
    state: raw.state || 'guest',
    languages: uniqueList(raw.languages),
    availability: raw.availability || null,
    bio: raw.bio || null,
    stats: defaultStats(raw.stats),
    status: raw.status || null,
    createdAt,
    updatedAt,
    roles: uniqueList(raw.roles || []),
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    learningInterests: Array.isArray(raw.learningInterests)
      ? raw.learningInterests
      : []
  };
}

module.exports = {
  createEmptyMember,
  normalizeMember
};
