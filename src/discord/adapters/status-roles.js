// src/discord/adapters/status-roles.js
const cfg = require('../../../config.json');
const { updateMemberStatus } = require('../../core/people/services/membersStatusService');

const STATE_ROLE_MAP = {
  Lead: 'lead',
  Core: 'core',
  Active: 'active',
  Casual: 'casual',
  Trial: 'trial',
  Guest: 'guest',
  Suspended: 'suspended'
};

function getRoleIdForTier(tier) {
  const key = STATE_ROLE_MAP[tier];
  if (!key) return null;
  return cfg.roles?.state?.[key] || null;
}

function getAllStateRoleIds() {
  return Object.values(STATE_ROLE_MAP)
    .map(k => cfg.roles?.state?.[k])
    .filter(Boolean);
}

async function applyStateRole(guild, userId, tier) {
  const roleId = getRoleIdForTier(tier);
  if (!guild || !userId || !roleId) return { applied: null, removed: [] };

  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) return { applied: null, removed: [] };

  const allRoleIds = getAllStateRoleIds();
  const toRemove = allRoleIds.filter(id => id !== roleId && member.roles.cache.has(id));

  if (toRemove.length) {
    await member.roles.remove(toRemove).catch(() => null);
  }

  if (!member.roles.cache.has(roleId)) {
    await member.roles.add(roleId).catch(() => null);
  }

  return { applied: roleId, removed: toRemove };
}

async function refreshMemberStatusAndRoles(guild, userId, store) {
  const profile = updateMemberStatus(userId, store);
  const tier = profile?.status?.tier;
  if (tier) {
    await applyStateRole(guild, userId, tier);
  }
  return profile;
}

module.exports = {
  refreshMemberStatusAndRoles,
  applyStateRole
};
