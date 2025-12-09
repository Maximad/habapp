const cfg = require('../../../config.json');
const { resolveChannelKey: resolveDiscordChannel } = require('../utils/channels');
const channelKeyMap = require('../config/channelKeys');
const { getPipelineByKey } = require('../../core/work/units');
const { publishClaimableTasksByFunction } = require('./tasks');
const { formatProjectSummary } = require('../utils/formatters');

const unitMainChannelKey = {
  production: cfg.channels?.production?.crewRosterId,
  media: cfg.channels?.media?.assignmentsId,
  people: null,
  geeks: null
};

function buildUnitPing(unitKey) {
  const roleId = cfg.unitRoleIds && cfg.unitRoleIds[unitKey];
  return roleId ? `<@&${roleId}>` : '';
}

function resolveProjectChannelKey(project, pipeline) {
  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
  if (unitKey && unitMainChannelKey[unitKey]) return unitMainChannelKey[unitKey];
  const defaultKey = pipeline?.defaultChannelKey || null;
  if (defaultKey && channelKeyMap[defaultKey]) return channelKeyMap[defaultKey];
  return defaultKey;
}

async function notifyProjectCreated({ interaction, project, tasks }) {
  const guild = interaction?.guild;
  const pipeline = project?.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
  const channelKey = resolveProjectChannelKey(project, pipeline);
  if (!channelKey || !guild) return null;

  const client = guild?.client || interaction?.client || guild;
  const channel = await resolveDiscordChannel(client, channelKey);
  if (!channel) return null;

  const mentions = Array.from(new Set((tasks || []).map(t => t.ownerId).filter(Boolean)))
    .map(id => `<@${id}>`)
    .join(' ');

  const ping = buildUnitPing((project.units && project.units[0]) || project.unit);

  const summary = formatProjectSummary(project, tasks, { heading: 'تفاصيل المشروع:' });

  const content = `${ping ? `${ping}\n` : ''}` +
    ':rocket:\n' +
    'تم إنشاء مشروع جديد\n' +
    `${summary}${mentions ? `\nتنويه: ${mentions}` : ''}`;

  const message = await postToChannel(guild, channelId, content);

  try {
    await publishClaimableTasksByFunction({ client: guild?.client, project, tasks });
  } catch (err) {
    console.error('[HabApp][project notify] failed to publish claimable tasks', err);
  }

  return message;
}

module.exports = { notifyProjectCreated, resolveChannelKey: resolveProjectChannelKey };
