const { ChannelType } = require('discord.js');
const config = require('../../../config.json');
const { buildErrorMessage } = require('../i18n/messages');
const { listProjects, upsertProject, findProject } = require('../../core/work/projects');
const { getUnitByKey, getPipelineByKey } = require('../../core/work/units');
const channelKeyMap = require('../config/channelKeys');
const { resolveChannelKey } = require('../utils/channels');
const {
  resolveProjectByQuery,
  listClaimableTasksForProject,
  searchProjectsByQuery,
} = require('../../core/work/services/projectsService');

async function replyLegacy(interaction) {
  const message = buildErrorMessage('tasks_command_legacy');
  if (interaction.deferred || interaction.replied) {
    return interaction.editReply(message);
  }
  return interaction.reply({ content: message, ephemeral: true });
}

async function handleTaskAdd(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskComplete(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskDelete(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskList(interaction) {
  return replyLegacy(interaction);
}

function resolveFallbackChannelKey(project, pipeline) {
  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;

  const unitMainChannelId = {
    production: config.channels?.production?.crewRosterId,
    media: config.channels?.media?.assignmentsId,
    people: null,
    geeks: null,
  };

  if (unitKey && unitMainChannelId[unitKey]) {
    return unitMainChannelId[unitKey];
  }

  if (pipeline?.defaultChannelKey) {
    return channelKeyMap[pipeline.defaultChannelKey] || pipeline.defaultChannelKey;
  }

  return null;
}

async function resolveTaskChannel(client, routeConfig, fallbackKey) {
  // routeConfig is something like { channelId, roleIds }
  if (routeConfig && routeConfig.channelId) {
    const channel = await resolveChannelKey(client, routeConfig.channelId);
    if (channel) return channel;
  }

  if (fallbackKey) {
    const channel = await resolveChannelKey(client, fallbackKey);
    if (channel) return channel;
  }

  return null;
}

function buildTaskOfferPayload({ project, task, unitNameAr }) {
  const due = task.due || task.dueDate || 'غير محدد';
  const sizeLabel = `[${(task.size || '—').toString().toUpperCase()}]`;
  const title = task.title_ar || task.title || 'بدون عنوان';
  const owner = task.ownerId ? `<@${task.ownerId}>` : 'غير معيّن بعد';

  return {
    content:
      `مهمة جديدة جاهزة للاستلام:\n` +
      `المشروع: ${project.title || project.name || 'المشروع'}\n` +
      `المهمة: ${title} (${sizeLabel})\n` +
      `الموكَّل إلى: ${owner}\n` +
      `الموعد: ${due}`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            custom_id: `task:claim:${task.id}`,
            label: 'قبول المهمة',
          },
        ],
      },
    ],
  };
}

async function ensureProjectThread({ client, project, pipeline, fetchChannel, persistProject = upsertProject }) {
  if (!client || !project) return null;

  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
  const forumId = config.unitForumChannelIds && config.unitForumChannelIds[unitKey];
  if (!forumId) return null;

  const fetcher =
    typeof fetchChannel === 'function'
      ? fetchChannel
      : client?.channels?.fetch
        ? id => client.channels.fetch(id)
        : null;

  if (!fetcher) return null;

  const pipelineMeta = pipeline || (project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null);
  const description = (project.description || '').trim();
  const due = project.dueDate || project.due || '—';

  let forumChannel = await fetcher(forumId).catch(err => {
    console.warn('[HabApp][task forum] failed to fetch forum channel', err?.code || err?.message || err);
    return null;
  });

  if (!forumChannel || forumChannel.type !== ChannelType.GuildForum || !forumChannel.threads?.create) {
    return null;
  }

  if (project.forumThreadId) {
    const existing = await fetcher(project.forumThreadId).catch(() => null);
    if (existing && typeof existing.send === 'function') return existing;
  }

  const title = project.title || project.name || 'مشروع جديد';
  const summary = [
    `الوحدة: ${unitKey || '—'}`,
    pipelineMeta ? `المسار: ${pipelineMeta.name_ar || pipelineMeta.key}` : null,
    description ? `الوصف: ${description}` : null,
    `الاستحقاق: ${due}`,
  ]
    .filter(Boolean)
    .join('\n');

  const thread = await forumChannel.threads
    .create({ name: title, message: { content: summary } })
    .catch(err => {
      console.warn('[HabApp][task forum] failed to create forum thread', err?.code || err?.message || err);
      return null;
    });

  if (thread) {
    const nextProject = {
      ...project,
      forumThreadId: thread.id,
      forumChannelId: forumChannel.id,
      metadata: {
        ...(project.metadata || {}),
        forumThreadId: thread.id,
        forumChannelId: forumChannel.id,
        threadId: thread.id,
      },
    };
    persistProject(nextProject);
    return thread;
  }

  return null;
}

async function postTaskUpdateToProjectThread({ client, guildId, project, task, content, components, fetchChannel, persistProject }) {
  try {
    const baseProject = project || (task?.projectSlug ? findProject(task.projectSlug) : null);
    if (!baseProject || !content) return null;

    if (baseProject.forumThreadId && typeof fetchChannel === 'function') {
      const thread = await fetchChannel(baseProject.forumThreadId).catch(() => null);
      if (thread && typeof thread.send === 'function') {
        await thread.send({ content, components });
        return true;
      }
    }

    const pipeline = baseProject.pipelineKey ? getPipelineByKey(baseProject.pipelineKey) : null;

    if (!client) return null;

    const forumThread = await ensureProjectThread({
      client,
      project: baseProject,
      pipeline,
      fetchChannel,
      persistProject,
    });

    if (!forumThread || typeof forumThread.send !== 'function') return null;

    await forumThread.send({ content, components });
    return true;
  } catch (err) {
    console.warn('[HabApp][task update] failed to post to forum thread', err?.code || err?.message || err);
    return null;
  }
}

async function handleTaskOffer(interaction, options = {}) {
  const {
    resolveProject = resolveProjectByQuery,
    listClaimableTasks = listClaimableTasksForProject,
    findChannelForProject = null,
  } = options;

  try {
    const projectQuery = interaction.options.getString('project');
    const taskQuery = interaction.options.getString('task');

    if (!projectQuery || !projectQuery.trim()) {
      return interaction.reply({
        content: 'يجب اختيار مشروع أولاً لعرض المهام المتاحة.',
        ephemeral: true,
      });
    }

    const { project, matches } = resolveProject(projectQuery);

    if (!project && (!matches || matches.length === 0)) {
      return interaction.reply({
        content: 'ما قدرنا نلاقي مشروع بهذا الوصف. جرّب /project list أو اكتب جزء أوضح من الاسم.',
        ephemeral: true,
      });
    }

    if (!project && matches && matches.length > 0) {
      const list = matches
        .slice(0, 5)
        .map(m => `• ${m.project.name || m.project.title}`)
        .join('\n');
      return interaction.reply({
        content:
          'وجدنا أكثر من مشروع بهذا الاسم. وضّح أكثر:\n' +
          `${list}\n\n` +
          'أعد المحاولة بكتابة كلمة مميزة من العنوان أو اختَر من القائمة.',
        ephemeral: true,
      });
    }

    const claimable = (listClaimableTasks({ projectSlug: project.slug }) || []).filter(
      task => task && task.claimable === true
    );

    if (!claimable.length) {
      return interaction.reply({
        content: 'لا توجد مهام قابلة للاستلام حالياً في هذا المشروع.',
        ephemeral: true,
      });
    }

    let tasksToOffer = claimable;
    if (taskQuery) {
      const parsed = typeof taskQuery === 'string' && taskQuery.includes('::')
        ? taskQuery.split('::')
        : null;

      if (parsed && parsed[1]) {
        const taskId = Number(parsed[1]);
        tasksToOffer = claimable.filter(t => Number(t.id) === taskId);
      } else {
        const q = String(taskQuery || '').toLowerCase();
        tasksToOffer = claimable.filter(t => {
          const titleAr = String(t.title_ar || '').toLowerCase();
          const title = String(t.title || '').toLowerCase();
          return (
            titleAr.includes(q) ||
            title.includes(q) ||
            String(t.id).includes(q)
          );
        });
      }

      if (!tasksToOffer.length) {
        return interaction.reply({
          content: 'لا توجد مهمة مطابقة لهذا الاسم في هذا المشروع.',
          ephemeral: true,
        });
      }
    }

    const pipeline = project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
    const channelResolver = typeof findChannelForProject === 'function'
      ? findChannelForProject
      : async () => {
          const fallbackKey = resolveFallbackChannelKey(project, pipeline);
          return resolveTaskChannel(interaction.client, null, fallbackKey);
        };

    const channel = await channelResolver(project, pipeline);

    if (!channel) {
      console.warn('[HabApp][task offer] No channel configured for route', {
        unit: project.units?.[0] || project.unit,
        pipeline: project.pipelineKey,
        fallbackKey: resolveFallbackChannelKey(project, pipeline),
      });
      return interaction.reply({
        content: 'لا توجد قناة مهيّأة لنشر هذه المهمة بعد. اطلب من مسؤول HabApp ضبط الإعدادات.',
        ephemeral: true,
      });
    }

    const unitKey =
      project.units?.[0] || project.unit || pipeline?.unitKey || tasksToOffer[0]?.unit || null;
    const unit = unitKey ? getUnitByKey(unitKey) : null;
    const unitNameAr = unit?.name_ar || unitKey || '—';

    const payloads = tasksToOffer.slice(0, 10).map(task =>
      buildTaskOfferPayload({ project, task, unitNameAr })
    );

    for (const payload of payloads) {
      // eslint-disable-next-line no-await-in-loop
      await channel.send(payload);
    }

    for (const task of tasksToOffer.slice(0, 10)) {
      const sizeLabel = `[${(task.size || '—').toString().toUpperCase()}]`;
      const dueLabel = task.due || task.dueDate || 'غير محدد';
      const title = task.title_ar || task.title || 'مهمة';
      // eslint-disable-next-line no-await-in-loop
      await postTaskUpdateToProjectThread({
        client: interaction.client,
        project,
        task,
        content:
          'تم عرض المهمة للاستلام من جديد ✋\n' +
          `المشروع: ${project.title || project.name || 'المشروع'}\n` +
          `المهمة: ${title} (${sizeLabel})\n` +
          `الموعد: ${dueLabel}`,
      });
    }

    return interaction.reply({
      content: 'تم نشر المهام المتاحة لهذا المشروع ليتمكن الأعضاء من استلامها.',
      ephemeral: true,
    });
  } catch (err) {
    console.error('[HabApp][task offer]', err);
    return interaction.reply({
      content: 'حدث خطأ أثناء نشر المهمة. حاول مرة أخرى لاحقاً.',
      ephemeral: true,
    });
  }
}

async function handleTaskAutocomplete(interaction, options = {}) {
  const {
    resolveProject = resolveProjectByQuery,
    listClaimableTasks = listClaimableTasksForProject,
    searchProjects = searchProjectsByQuery,
    listAllProjects = listProjects,
  } = options;

  try {
    const sub = interaction.options.getSubcommand();
    const focused = interaction.options.getFocused(true);
    if (sub !== 'offer' || !focused) {
      return interaction.respond([]);
    }

    if (focused.name === 'project') {
      const query = String(focused.value || '').trim().toLowerCase();
      const matches = query
        ? searchProjects(query)
        : (listAllProjects() || []).map(p => ({ project: p, score: 0 }));

      const choices = matches
        .slice(0, 25)
        .map(item => item.project)
        .map(project => {
          const unitKey = project.units?.[0] || project.unit || null;
          const unit = unitKey ? getUnitByKey(unitKey) : null;
          const unitLabel = unit?.name_ar || unitKey || '—';
          const name = `${project.name || project.title || 'مشروع'} – ${unitLabel}`;
          return { name, value: project.slug };
        });

      return interaction.respond(choices);
    }

    if (focused.name === 'task') {
      const projectValue = interaction.options.getString('project');
      if (!projectValue) {
        return interaction.respond([]);
      }

      let project = null;
      if (projectValue.includes('::')) {
        const [slug] = projectValue.split('::');
        project = resolveProject(slug)?.project;
      } else {
        const resolved = resolveProject(projectValue);
        project = resolved?.project;
      }

      if (!project) {
        return interaction.respond([]);
      }

      const claimable = listClaimableTasks({ projectSlug: project.slug }) || [];
      const query = String(focused.value || '').toLowerCase();

      const filtered = claimable.filter(task => {
        if (!query) return true;
        const titleAr = String(task.title_ar || '').toLowerCase();
        const title = String(task.title || '').toLowerCase();
        return titleAr.includes(query) || title.includes(query) || String(task.id).includes(query);
      });

      const choices = filtered.slice(0, 25).map(task => {
        const sizeLabel = task.size ? `[${String(task.size).toUpperCase()}] ` : '';
        const name = `${sizeLabel}${task.title_ar || task.title || 'بدون عنوان'}`;
        return { name, value: `${project.slug}::${task.id}` };
      });

      return interaction.respond(choices);
    }

    return interaction.respond([]);
  } catch (err) {
    console.error('[HabApp][task autocomplete]', err);
    if (interaction.respond) {
      return interaction.respond([]);
    }
    return [];
  }
}

async function publishClaimableTasksByFunction({ client, project, tasks } = {}) {
  const routing = config.taskRouting || {};
  if (!client || !project) return null;

  const projectUnit = (project.units && project.units[0]) || project.unit || null;
  if (!projectUnit) return null;

  const normalizedUnit = String(projectUnit).toLowerCase();
  const tasksByGroup = new Map();

  (tasks || []).forEach(task => {
    if (!task || !task.claimable) return;
    if (!task.functionKey) return;
    const taskUnit = (task.unit || projectUnit || '').toString().toLowerCase();
    if (taskUnit !== normalizedUnit) return;

    const key = `${taskUnit}::${task.functionKey}`;
    if (!tasksByGroup.has(key)) {
      tasksByGroup.set(key, { unit: taskUnit, functionKey: task.functionKey, tasks: [] });
    }
    tasksByGroup.get(key).tasks.push(task);
  });

  for (const group of tasksByGroup.values()) {
    const unitRouting = routing[group.unit] || {};
    const destination = unitRouting[group.functionKey];
    if (!destination || !destination.channelId) continue;

    // eslint-disable-next-line no-await-in-loop
    const channel = await client.channels.fetch(destination.channelId).catch(() => null);
    if (!channel || typeof channel.send !== 'function') continue;

    const roleMentions = Array.isArray(destination.roleIds)
      ? destination.roleIds.map(id => `<@&${id}>`).join(' ')
      : '';

    const projectName = project.title || project.name || 'مشروع بدون اسم';
    const lines = group.tasks.map(task => {
      const sizeLabel = `[${String(task.size || '—').toUpperCase()}]`;
      const title = task.title_ar || task.title || 'بدون عنوان';
      const due = task.due || task.dueDate || 'غير محدد';
      return `• ${sizeLabel} ${title} – الموعد: ${due}`;
    });

    const buttons = group.tasks.map(task => ({
      type: 2,
      style: 1,
      custom_id: `task:claim:${task.id}`,
      label: 'استلام المهمة',
    }));

    const components = [];
    for (let i = 0; i < buttons.length; i += 5) {
      components.push({ type: 1, components: buttons.slice(i, i + 5) });
    }

    const content = [
      roleMentions,
      `مهام قابلة للاستلام – المشروع: ${projectName}`,
      `نوع العمل: ${group.functionKey}`,
      lines.join('\n')
    ].filter(Boolean).join('\n');

    // eslint-disable-next-line no-await-in-loop
    await channel.send({ content, components });
  }

  return true;
}

module.exports = {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList,
  handleTaskOffer,
  handleTaskAutocomplete,
  publishClaimableTasksByFunction,
  postTaskUpdateToProjectThread,
  ensureProjectThread,
  buildTaskOfferPayload,
  resolveTaskChannel,
  resolveFallbackChannelKey
};
