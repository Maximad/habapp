const cfg = require('../../../config.json');
const { addTaskToProject, completeTask, removeTask, listProjectTasks } = require('../../core/services/tasksService');
const { unitToArabic, statusToArabic } = require('../utils/formatters');
const { postToChannel } = require('../utils/channels');

async function handleTaskAdd(interaction) {
  const slug = interaction.options.getString('slug', true);
  const title = interaction.options.getString('title', true);
  const unit = interaction.options.getString('unit') || 'media';
  const owner = interaction.options.getUser('owner');
  const due = interaction.options.getString('due') || 'غير محدّد';
  const templateId = interaction.options.getString('template_id') || null;

  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true });
  }

  let result;
  try {
    result = addTaskToProject(slug, {
      title,
      unit,
      ownerId: owner ? owner.id : null,
      due,
      templateId
    });
  } catch (err) {
    return interaction.editReply('❌ المشروع غير موجود أو حدث خطأ أثناء إنشاء المهمة.');
  }

  const { project, task } = result;

  const msg = await postToChannel(
    interaction.guild,
    cfg.media.assignmentsId,
    `**[${slug} T-${task.id}]** – ${title}\n` +
      `الوحدة: ${unitToArabic(unit)}\n` +
      `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
      `التسليم: ${due}`
  );

  if (project.threadId) {
    const thread = await interaction.guild.channels.fetch(project.threadId).catch(() => null);
    if (thread && thread.isThread()) {
      await thread
        .send(
          `تم إنشاء مهمة جديدة [T-${task.id}]: **${title}**\n` +
            `الوحدة: ${unitToArabic(unit)}\n` +
            `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
            `التسليم: ${due}` +
            (msg ? `\nالرابط: ${msg.url}` : '')
        )
        .catch(() => {});
    }
  }

  return interaction.editReply(`✅ تم إنشاء المهمة [T-${task.id}] في المشروع **${slug}**.`);
}

async function handleTaskComplete(interaction) {
  const slug = interaction.options.getString('slug', true);
  const taskId = interaction.options.getInteger('task_id', true);

  await interaction.deferReply({ ephemeral: true });

  let result;
  try {
    result = completeTask(slug, taskId);
  } catch (err) {
    return interaction.editReply('❌ المهمة غير موجودة.');
  }

  const { project, task } = result;

  if (project.threadId) {
    const thread = await interaction.guild.channels.fetch(project.threadId).catch(() => null);
    if (thread && thread.isThread()) {
      await thread
        .send(
          `✅ تم تعليم المهمة [T-${task.id}] كمنجزة بواسطة <@${interaction.user.id}>.\n` +
            `العنوان: **${task.title}**`
        )
        .catch(() => {});
    }
  }

  return interaction.editReply(`✅ تم وضع علامة المهمة [T-${task.id}] كمنجزة.`);
}

async function handleTaskDelete(interaction) {
  const slug = interaction.options.getString('slug', true);
  const taskId = interaction.options.getInteger('task_id', true);

  await interaction.deferReply({ ephemeral: true });

  try {
    removeTask(slug, taskId);
  } catch (err) {
    return interaction.editReply('❌ المهمة غير موجودة.');
  }

  return interaction.editReply(`🗑️ تم حذف المهمة [T-${taskId}] من المشروع **${slug}**.`);
}

async function handleTaskList(interaction) {
  const slug = interaction.options.getString('slug', true);
  const status = interaction.options.getString('status') || 'open';

  let tasks;
  try {
    tasks = listProjectTasks(slug, status === 'all' ? 'all' : status);
  } catch (err) {
    return interaction.reply({
      content: 'المشروع غير موجود.',
      ephemeral: true
    });
  }

  if (!tasks || tasks.length === 0) {
    return interaction.reply({ content: 'لا توجد مهام مطابقة لهذا المشروع.', ephemeral: true });
  }

  const lines = tasks.map(t => {
    const owner = t.ownerId ? `<@${t.ownerId}>` : 'غير معيّن';
    return `• [T-${t.id}] (${unitToArabic(t.unit)}) – **${t.title}** – ${statusToArabic(
      t.status
    )} – المالك: ${owner} – التسليم: ${t.due || 'غير محدّد'}`;
  });

  const header = `📋 مهام المشروع **${slug}** (${status === 'all' ? 'الكل' : statusToArabic(status)}):\n`;
  const content = header + lines.join('\n');

  return interaction.reply({ content: content.slice(0, 1900), ephemeral: true });
}

module.exports = {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList
};
