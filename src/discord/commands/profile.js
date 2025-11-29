// src/discord/commands/profile.js
const membersStore = require('../../core/people/membersStore');
const memberSyncService = require('../../core/people/memberSyncService');
const { computeRecommendedState } = require('../../core/people/memberState');
const { syncStateRolesForMember } = require('../adapters/stateRolesAdapter');
const {
  unitKeyToArabic,
  functionKeyToArabic,
  stateKeyToArabic,
  identityModeToArabic
} = require('../i18n/profileLabels');
const { buildErrorMessage, buildSuccessMessage } = require('../i18n/messages');

function resolveDisplayName(interaction) {
  return (
    interaction.member?.displayName ||
    interaction.member?.nickname ||
    interaction.user.globalName ||
    interaction.user.username
  );
}

function getRoleNames(interaction) {
  const cache = interaction.member?.roles?.cache;
  return Array.from(cache?.values?.() || [])
    .map(r => r?.name)
    .filter(Boolean);
}

function formatList(values = [], mapper = x => x) {
  const labels = (values || [])
    .map(mapper)
    .filter(Boolean);
  if (!labels.length) return '- —';
  return labels.map(label => `- ${label}`).join('\n');
}

function formatProfileSummary(member) {
  const notes = member.notes || member.bio || null;
  const recommended = computeRecommendedState(member.stats || {});
  const parts = [
    'ملفك في حبق 🧩',
    '',
    'الوحدات:',
    formatList(member.units, unitKeyToArabic),
    '',
    'المهام:',
    formatList(member.functions, functionKeyToArabic),
    '',
    'الحالة:',
    `- الحالية (حسب الرتب): ${stateKeyToArabic(member.state) || '—'}`,
    `- المقترحة (حسب العمل وجودته): ${stateKeyToArabic(recommended) || '—'}`,
    '',
    'وضع الهوية:',
    `- ${identityModeToArabic(member.identityMode) || '—'}`
  ];

  if (notes) {
    parts.push('', 'ملاحظات:', `- ${notes}`);
  }

  return parts.join('\n');
}

async function handleProfile(interaction) {
  const discordId = interaction.user.id;
  const username = interaction.user.username;
  const displayName = resolveDisplayName(interaction);
  const roles = getRoleNames(interaction);

  await memberSyncService.syncMemberFromRoles({
    discordId,
    username,
    displayName,
    roles
  });

  const member = await membersStore.getMemberByDiscordId(discordId);
  if (!member) {
    return interaction.reply({
      content: buildErrorMessage('profile_missing'),
      ephemeral: true
    });
  }

  await syncStateRolesForMember({ guildMember: interaction.member, memberState: member.state });

  const summary = formatProfileSummary(member);

  return interaction.reply({
    content: `${buildSuccessMessage('profile_synced')}\n\n${summary}`,
    ephemeral: true
  });
}

module.exports = handleProfile;
