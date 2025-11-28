// src/core/people/memberSync.js
// مزامنة ملف العضو بناءً على أدوار ديسكورد

const { findMemberByDiscordId, upsertMember } = require('./memberStore');
const { mapRolesToMemberFields } = require('./roleMapping');

function resolveTimestamp(now) {
  if (typeof now === 'function') return resolveTimestamp(now());
  if (now instanceof Date) return now;
  return new Date(now);
}

function syncMemberFromDiscordProfile({ user, roles, store, now }) {
  if (!user?.id) throw new Error('user id is required');

  const existing = findMemberByDiscordId(user.id, store);
  const mapped = mapRolesToMemberFields(roles);

  const username = user.username || existing?.username || '';
  const displayName = user.displayName || user.globalName || existing?.displayName || null;

  const timestamp = resolveTimestamp(now || new Date());

  return upsertMember(
    {
      ...mapped,
      discordId: user.id,
      username,
      displayName
    },
    store,
    timestamp
  );
}

module.exports = {
  syncMemberFromDiscordProfile
};
