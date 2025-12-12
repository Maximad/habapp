const cfg = require('../../../config.json');
const { resolveChannelKey: resolveDiscordChannel } = require('../utils/channels');
const channelKeyMap = require('../config/channelKeys');
const { getPipelineByKey } = require('../../core/work/units');
const {
  publishClaimableTasksByFunction,
  postTaskUpdateToProjectThread,
  ensureProjectThread,
} = require('./tasks');
const { formatProjectSummary } = require('../utils/formatters');
const { upsertProject } = require('../../core/work/projects');

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

async function createForumThreadForProject({ client, project, pipeline, persistProject = upsertProject, postUpdate = postTaskUpdateToProjectThread }) {
  if (!client || !project) return null;

  const thread = await ensureProjectThread({
    client,
    project,
    pipeline,
    persistProject,
  });

  if (thread) {
    await postUpdate({
      client,
      project,
      content: 'تم إطلاق المشروع وفتح نقاشه هنا للمتابعة.',
    });
  }

  return thread;
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
    'مشروع جديد انطلق\n' +
    `${summary}${mentions ? `\nتنويه: ${mentions}` : ''}`;

  const message = await channel.send({ content });

  try {
    await publishClaimableTasksByFunction({ client: guild?.client, project, tasks });
    const claimable = (tasks || []).filter(t => t && t.claimable);
    for (const task of claimable) {
      const sizeLabel = `[${String(task.size || '—').toUpperCase()}]`;
      const dueLabel = task.due || task.dueDate || 'غير محدد';
      const taskTitle = task.title_ar || task.title || 'مهمة';
      // eslint-disable-next-line no-await-in-loop
      await postTaskUpdateToProjectThread({
        client: guild?.client || interaction?.client,
        project,
        task,
        content:
          'مهمة جاهزة للاستلام ✋\n' +
          `المشروع: ${project.title || project.name || 'المشروع'}\n` +
          `المهمة: ${taskTitle} (${sizeLabel})\n` +
          `الموعد: ${dueLabel}`,
      });
    }
  } catch (err) {
    console.error('[HabApp][project notify] failed to publish claimable tasks', err);
  }

  try {
    await createForumThreadForProject({ client: guild?.client || interaction?.client, project, pipeline });
  } catch (err) {
    console.warn('[HabApp][project notify] forum thread creation skipped', err?.code || err?.message || err);
  }

  return message;
}

module.exports = { notifyProjectCreated, resolveChannelKey: resolveProjectChannelKey, createForumThreadForProject };
