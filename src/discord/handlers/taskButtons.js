// src/discord/handlers/taskButtons.js
const {
  claimTask,
  getTaskById,
  saveTask
} = require('../../core/work/tasks');
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
  getTaskById: taskId => {
    const found = getTaskById(taskId);
    return found?.task || found;
  },
  saveTask: task => saveTask(task)
};

async function handleTaskButton(interaction, deps = {}) {
  if (!interaction.isButton()) return;

  const [prefix, action, taskIdRaw] = (interaction.customId || '').split(':');
  if (prefix !== 'task' || action !== 'claim' || !taskIdRaw) return;

  const taskId = Number(taskIdRaw);
  const claimFn = deps.claimTask || claimTask;
  const store = deps.store || defaultTaskStore;
  const getProfile = deps.resolveProfile || resolveMemberProfile;

  try {
    const memberProfile = (await getProfile(interaction)) || {};
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
  } catch (err) {
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
