const cfg = require('../../../config.json');
const { buildErrorMessage } = require('../i18n/messages');
const memberSyncService = require('../../core/people/memberSyncService');
const membersStore = require('../../core/people/membersStore');
const { listProjects } = require('../../core/work/projects');
const { getTaskById } = require('../../core/work/tasks');
const { getUnitByKey, getPipelineByKey } = require('../../core/work/units');
const { resolveChannelKey } = require('./projectNotifications');
const { getChannelIdByKey } = require('../utils/channels');

function getTaskFunctionKey(task) {
  return task.functionKey || null;
}

function buildMentions(task) {
  const unitKey = task.unit;
  const functionKey = getTaskFunctionKey(task);
  const mentions = [];

  if (functionKey && cfg.functionRoleIds && cfg.functionRoleIds[functionKey]) {
    mentions.push(`<@&${cfg.functionRoleIds[functionKey]}>`);
  }

  if (unitKey && cfg.unitRoleIds && cfg.unitRoleIds[unitKey]) {
    mentions.push(`<@&${cfg.unitRoleIds[unitKey]}>`);
  }

  return mentions.join(' ');
}

function getRoleNames(interaction) {
  const cache = interaction.member?.roles?.cache;
  return Array.from(cache?.values?.() || [])
    .map(r => r?.name)
    .filter(Boolean);
}

async function resolveMemberProfile(interaction) {
  const discordId = interaction.user?.id;
  const username = interaction.user?.username || '';
  const displayName =
    interaction.member?.displayName ||
    interaction.member?.nickname ||
    interaction.user?.globalName ||
    interaction.user?.username ||
    null;
  const roles = getRoleNames(interaction);

  await memberSyncService.syncMemberFromRoles({
    discordId,
    username,
    displayName,
    roles
  });

  return membersStore.getMemberByDiscordId(discordId);
}

function collectOpenTasksForOffer(profile) {
  const projects = listProjects();
  const units = profile?.units || [];
  const results = [];

  projects.forEach(project => {
    (project.tasks || []).forEach(task => {
      const status = task?.status || 'open';
      if (status !== 'open') return;
      const unitMatch = task.unit ? units.includes(task.unit) : true;
      const unowned = !task.ownerId;
      if (!unitMatch && !unowned) return;

      results.push({ project, task });
    });
  });

  return results;
}

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

async function handleTaskOffer(interaction) {
  try {
    const taskId = interaction.options.getString('task_id');
    if (!taskId) {
      return interaction.reply({
        content: 'يجب تحديد المهمة المراد نشرها.',
        ephemeral: true
      });
    }

    const { project, task } = getTaskById(taskId);
    if (!project || !task) {
      return interaction.reply({
        content: 'لم نتمكن من العثور على هذه المهمة.',
        ephemeral: true
      });
    }

    const pipeline = project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
    const channelKey = resolveChannelKey(project, pipeline);
    const channelId = channelKey ? getChannelIdByKey(channelKey) : null;
    const channel = channelId ? await interaction.guild.channels.fetch(channelId).catch(() => null) : null;
    if (!channel) {
      return interaction.reply({
        content: 'تعذر نشر المهمة لعدم وجود قناة مفعّلة لهذه الوحدة.',
        ephemeral: true
      });
    }

    const unitKey = task.unit || (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
    const unit = unitKey ? getUnitByKey(unitKey) : null;
    const unitNameAr = unit?.name_ar || unitKey || '—';
    const due = task.due || task.dueDate || 'غير محدد';
    const sizeLabel = `[${(task.size || '—').toString().toUpperCase()}]`;
    const functionKey = getTaskFunctionKey(task) || '—';
    const mentions = buildMentions({ ...task, unit: unitKey });

    const title = task.title || task.title_ar || 'بدون عنوان';

    await channel.send({
      content:
        `${mentions ? `${mentions}\n` : ''}` +
        `مهمة جديدة:\n` +
        `العنوان: ${title}\n` +
        `المشروع: ${project.title || project.name || project.slug}\n` +
        `الوحدة: ${unitNameAr}\n` +
        `التخصص: ${functionKey}\n` +
        `الموعد: ${due}\n` +
        `الحجم: ${sizeLabel}`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              custom_id: `task:claim:${task.id}`,
              label: 'قبول المهمة'
            }
          ]
        }
      ]
    });

    return interaction.reply({
      content: 'تم نشر المهمة في قناة الوحدة مع زر قبول.',
      ephemeral: true
    });
  } catch (err) {
    console.error('[HabApp][task offer]', err);
    return interaction.reply({
      content: 'حدث خطأ أثناء نشر المهمة. حاول مرة أخرى لاحقاً.',
      ephemeral: true
    });
  }
}

async function handleTaskAutocomplete(interaction) {
  try {
    const sub = interaction.options.getSubcommand();
    const focused = interaction.options.getFocused(true);
    if (sub !== 'offer' || focused?.name !== 'task_id') {
      return interaction.respond([]);
    }

    const profile = (await resolveMemberProfile(interaction)) || {};
    const query = String(focused.value || '').toLowerCase();
    const tasks = collectOpenTasksForOffer(profile);

    const filtered = tasks.filter(({ task }) => {
      if (!query) return true;
      const label = `${task.title_ar || task.title || ''}`.toLowerCase();
      return label.includes(query) || String(task.id).includes(query);
    });

    const choices = filtered.slice(0, 25).map(({ project, task }) => {
      const dueLabel = task.due || task.dueDate || 'بدون موعد';
      return {
        name: `[${project.name || project.title || project.slug}] ${
          task.title || task.title_ar || 'بدون عنوان'
        } — ${dueLabel}`,
        value: String(task.id)
      };
    });

    return interaction.respond(choices);
  } catch (err) {
    console.error('[HabApp][task autocomplete]', err);
    if (interaction.respond) {
      return interaction.respond([]);
    }
    return [];
  }
}

module.exports = {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList,
  handleTaskOffer,
  handleTaskAutocomplete
};
