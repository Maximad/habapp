// src/core/people/memberSyncService.js
// مزامنة ملف العضو من أدوار ديسكورد الحالية

const { mapRolesToMemberFields } = require('./roleMapping');
const { findMemberByDiscordId, upsertMember } = require('./memberStore');

function normalizeRolesList(roles = []) {
  return Array.from(
    new Set(
      (roles || [])
        .map(r => (typeof r === 'string' ? r : r?.name))
        .filter(Boolean)
        .map(name => String(name))
    )
  );
}

async function syncMemberFromRoles({ discordId, username, displayName, roles, store, now }) {
  if (!discordId) throw new Error('discordId is required for member sync');

  const existing = findMemberByDiscordId(discordId, store);
  const mapped = mapRolesToMemberFields(roles);
  const normalizedRoles = normalizeRolesList(roles);

  const payload = {
    ...mapped,
    discordId: String(discordId),
    username: username || existing?.username || '',
    displayName: displayName ?? existing?.displayName ?? null,
    roles: normalizedRoles
  };

  const timestamp = now instanceof Date ? now : now ? new Date(now) : new Date();
  return upsertMember(payload, store, timestamp);
}

module.exports = {
  syncMemberFromRoles
};
