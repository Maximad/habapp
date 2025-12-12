const { ChannelType } = require('discord.js');
const cfg = require('../../../config.json');
const { resolveChannelKey: resolveDiscordChannel } = require('../utils/channels');
const channelKeyMap = require('../config/channelKeys');
const { getPipelineByKey } = require('../../core/work/units');
const { publishClaimableTasksByFunction, postTaskUpdateToProjectThread } = require('./tasks');
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
  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
  const forumId = cfg.unitForumChannelIds && cfg.unitForumChannelIds[unitKey];
  if (!forumId || !client) return null;

  const forumChannel = await client.channels.fetch(forumId).catch(err => {
    console.warn('[HabApp][project notify] failed to fetch forum channel', err?.code || err?.message || err);
    return null;
  });

  if (!forumChannel || forumChannel.type !== ChannelType.GuildForum || !forumChannel.threads?.create) {
    console.warn('[HabApp][project notify] invalid forum channel for unit', { unitKey, forumId });
    return null;
  }

  const title = project.title || project.name || project.slug || 'مشروع جديد';
  const due = project.dueDate || project.due || '—';
  const desc = (project.description || '').trim();
  const summary = [
    `الوحدة: ${unitKey || '—'}`,
    pipeline ? `المسار: ${pipeline.name_ar || pipeline.key}` : null,
    desc ? `الوصف: ${desc}` : null,
    `الاستحقاق: ${due}`,
    `المعرّف: ${project.slug}`
  ].filter(Boolean).join('\n');

  const thread = await forumChannel.threads
    .create({ name: title, message: { content: summary } })
    .catch(err => {
      console.warn('[HabApp][project notify] failed to create forum thread', err?.code || err?.message || err);
      return null;
    });

  if (thread) {
    const nextProject = { ...project, forumThreadId: thread.id, forumChannelId: forumChannel.id };
    persistProject(nextProject);
    await postUpdate(project.slug, 'تم إنشاء المشروع وتم فتح نقاش مخصص له هنا.', {
      client,
      projectOverride: nextProject,
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
    'تم إنشاء مشروع جديد\n' +
    `${summary}${mentions ? `\nتنويه: ${mentions}` : ''}`;

  const message = await channel.send({ content });

  try {
    await publishClaimableTasksByFunction({ client: guild?.client, project, tasks });
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
