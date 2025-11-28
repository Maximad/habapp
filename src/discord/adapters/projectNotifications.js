const { getChannelIdByKey, postToChannel } = require('../utils/channels');
const { getPipelineByKey } = require('../../core/work/units');
const { formatProjectSummary } = require('../utils/formatters');

const unitMainChannelKey = {
  production: 'production.crew_roster',
  media: 'media.assignments',
  people: null,
  geeks: null
};

function resolveChannelKey(project, pipeline) {
  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
  if (unitKey && unitMainChannelKey[unitKey]) return unitMainChannelKey[unitKey];
  return pipeline?.defaultChannelKey || null;
}

async function notifyProjectCreated({ interaction, project, tasks }) {
  const guild = interaction?.guild;
  const pipeline = project?.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
  const channelKey = resolveChannelKey(project, pipeline);
  const channelId = getChannelIdByKey(channelKey);
  if (!channelId || !guild) return null;

  const mentions = Array.from(new Set((tasks || []).map(t => t.ownerId).filter(Boolean)))
    .map(id => `<@${id}>`)
    .join(' ');

  const content = [
    '🚀 تم إنشاء مشروع جديد',
    formatProjectSummary(project, tasks, { heading: 'تفاصيل المشروع:' }),
    mentions ? `تنويه: ${mentions}` : null
  ]
    .filter(Boolean)
    .join('\n');

  return postToChannel(guild, channelId, content);
}

module.exports = { notifyProjectCreated };
