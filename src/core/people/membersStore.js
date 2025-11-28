// src/core/people/membersStore.js
// واجهة بسيطة للقراءة والكتابة من مخزن الأعضاء

const { findMemberByDiscordId, listMembers, upsertMember } = require('./memberStore');

async function getMemberByDiscordId(discordId, store) {
  return findMemberByDiscordId(discordId, store);
}

async function saveMember(partial, store, now) {
  return upsertMember(partial, store, now);
}

async function listAllMembers(store) {
  return listMembers(store);
}

module.exports = {
  getMemberByDiscordId,
  saveMember,
  listAllMembers
};
