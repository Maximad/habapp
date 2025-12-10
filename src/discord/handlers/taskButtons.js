// src/discord/handlers/taskButtons.js
const {
  claimTask,
  getTaskById,
  saveTask,
  completeTask
} = require('../../core/work/tasks');
const { getPipelineByKey, getUnitByKey } = require('../../core/work/units');
const {
  buildTaskOfferPayload,
  postTaskUpdateToProjectThread,
  resolveTaskChannel,
  resolveFallbackChannelKey
} = require('../adapters/tasks');
const memberSyncService = require('../../core/people/memberSyncService');
const membersStore = require('../../core/people/membersStore');

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

const defaultTaskStore = {
  getTaskById: taskId => getTaskById(taskId),
  saveTask: task => saveTask(task)
};

async function handleTaskButton(interaction, deps = {}) {
  if (!interaction.isButton()) return;

  const [prefix, action, contextOrId, maybeId] = (interaction.customId || '').split(':');
  if (prefix !== 'task' || !action) return;

  const origin = contextOrId === 'REMINDER' ? 'REMINDER' : null;
  const taskIdRaw = origin ? maybeId : contextOrId;
  if (!taskIdRaw) return;

  const taskId = Number(taskIdRaw);
  const claimFn = deps.claimTask || claimTask;
  const completeFn = deps.completeTask || completeTask;
  const store = deps.store || defaultTaskStore;
  const getProfile = deps.resolveProfile || resolveMemberProfile;
  const postUpdate = deps.postUpdateToThread || postTaskUpdateToProjectThread;
  const buildOffer = deps.buildOfferPayload || buildTaskOfferPayload;
  const resolveChannel = deps.resolveTaskChannel || resolveTaskChannel;
  const resolveFallback = deps.resolveFallbackChannelKey || resolveFallbackChannelKey;

  try {
    const lookup = store.getTaskById ? store.getTaskById(taskId) : null;
    const taskRef = lookup?.task || lookup;
    const project = lookup?.project || null;
    const projectSlug = project?.slug || null;

    const memberProfile = (await getProfile(interaction)) || {};
    if (action === 'complete') {
      if (!taskRef || !project || (taskRef.status || 'open') === 'done') {
        return interaction.reply({
          content: 'هذه المهمة لم تعد متاحة (مكتملة أو غير موجودة).',
          ephemeral: true
        });
      }

      completeFn(project.slug, taskId, deps.storeRef);
      const title = taskRef.title || taskRef.title_ar || 'مهمة';

      if (interaction.update) {
        await interaction.update({ content: interaction.message?.content, components: [] }).catch(() => null);
      }

      await interaction.reply({
        content: '✅ تم تعليم المهمة كمكتملة. شكرًا!',
        ephemeral: true
      }).catch(() => null);

      await postUpdate(projectSlug, `✅ تم إنجاز المهمة: ${title} — <@${interaction.user.id}>`, {
        client: interaction.client
      });
      return;
    }

    if (action === 'offer' && origin === 'REMINDER') {
      if (!taskRef || !project || (taskRef.status || 'open') === 'done') {
        return interaction.reply({
          content: 'هذه المهمة لم تعد متاحة (مكتملة أو غير موجودة).',
          ephemeral: true
        });
      }

      const updatedTask = { ...taskRef, ownerId: null };
      if (typeof store.saveTask === 'function') {
        await store.saveTask(updatedTask);
      }

      const pipeline = project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
      const fallbackKey = resolveFallback(project, pipeline);
      const channel = await resolveChannel(interaction.client, null, fallbackKey);
      if (!channel) {
        return interaction.reply({
          content: 'لا توجد قناة مهيّأة لنشر هذه المهمة بعد. اطلب من مسؤول HabApp ضبط الإعدادات.',
          ephemeral: true,
        });
      }

      const unitKey =
        project.units?.[0] || project.unit || pipeline?.unitKey || updatedTask?.unit || null;
      const unitMeta = unitKey ? getUnitByKey(unitKey) : null;
      const unitNameAr = unitMeta?.name_ar || unitKey || '—';

      const payload = buildOffer({ project, task: updatedTask, unitNameAr });
      await channel.send(payload);

      await interaction.reply({ content: '↩️ تم عرض المهمة على الفريق من جديد.', ephemeral: true }).catch(() => null);
      await postUpdate(projectSlug, `↩️ تم عرض المهمة من جديد: ${updatedTask.title || 'مهمة'} — بدون صاحب`, {
        client: interaction.client
      });
      return;
    }

    if (action !== 'claim') return;

    const task = claimFn(store, taskId, interaction.user.id, memberProfile);
    const title = task.title || task.title_ar || 'بدون عنوان';
    const due = task.due || task.dueDate || 'غير محدد';
    const updatedContent =
      `مهمة جديدة:\n` +
      `العنوان: ${title}\n` +
      `المالك: <@${interaction.user.id}>\n` +
      `الموعد: ${due}`;

    await interaction.update({ content: updatedContent, components: [] });
    await interaction.followUp({
      content: 'تم تعيين المهمة لك.',
      ephemeral: true
    });

    await postUpdate(projectSlug, `📥 تم استلام المهمة: ${title} — <@${interaction.user.id}>`, {
      client: interaction.client
    });
  } catch (err) {
    if (err.code === 'TASK_NOT_CLAIMABLE') {
      console.info('[HabApp][task claim] task not claimable');
      return interaction.reply({
        content: 'هذه المهمة لا يمكن حجزها عبر الزر. يجب على المنتج او المحرر تعيينها يدويا.',
        ephemeral: true
      });
    }
    if (err.code === 'TASK_ALREADY_TAKEN') {
      return interaction.reply({
        content: 'تم قبول هذه المهمة من قبل شخص آخر.',
        ephemeral: true
      });
    }
    if (err.code === 'TASK_NOT_ELIGIBLE') {
      return interaction.reply({
        content: 'هذه المهمة مخصصة لوحدة أو دور مختلف عنك.',
        ephemeral: true
      });
    }
    if (err.code === 'TASK_NOT_FOUND') {
      return interaction.reply({
        content: 'لم نتمكن من العثور على هذه المهمة. ربما تم حذفها أو تعديلها.',
        ephemeral: true
      });
    }

    console.error('[HabApp][task claim] unexpected error', err);
    return interaction.reply({
      content: 'حدث خطأ غير متوقع أثناء محاولة قبول المهمة.',
      ephemeral: true
    });
  }
}

module.exports = { handleTaskButton };
