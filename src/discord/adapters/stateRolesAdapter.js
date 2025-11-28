// src/discord/adapters/stateRolesAdapter.js
// مزامنة أدوار الحالة [STATE] بناءً على حالة العضو في النظام الأساسي

const { getStateRoleName } = require('../../core/people/memberState');

async function syncStateRolesForMember({ guildMember, memberState }) {
  if (!guildMember?.roles?.cache) return;

  const desiredRoleName = getStateRoleName(memberState);
  if (!desiredRoleName) return;

  const guildRoles = guildMember.guild?.roles?.cache ?? guildMember.roles.cache;
  const stateRolesInGuild = Array.from(guildRoles.values()).filter(r => r?.name?.startsWith('[STATE]'));

  const desiredRole = stateRolesInGuild.find(r => r.name === desiredRoleName) || null;
  const memberStateRoles = Array.from(guildMember.roles.cache.values()).filter(r => r?.name?.startsWith('[STATE]'));

  if (!desiredRole) {
    console.warn('[stateRolesAdapter] desired state role not found in guild:', desiredRoleName);
    return;
  }

  if (!guildMember.roles.cache.has(desiredRole.id)) {
    await guildMember.roles.add(desiredRole).catch(() => null);
  }

  const rolesToRemove = memberStateRoles.filter(r => r.id !== desiredRole.id);
  if (rolesToRemove.length) {
    await guildMember.roles.remove(rolesToRemove).catch(() => null);
  }
}

module.exports = {
  syncStateRolesForMember
};
