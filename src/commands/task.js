const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('task')
  .setDescription('أوامر المهام المرتبطة بالمشاريع')
  .addSubcommand(sub =>
    sub
      .setName('add')
      .setDescription('إضافة مهمة جديدة لمشروع')
      .addStringOption(opt =>
        opt
          .setName('project')
          .setDescription('اسم المشروع (اختياري)')
          .setRequired(false)
      )
      .addStringOption(opt =>
        opt
          .setName('title')
          .setDescription('عنوان المهمة (اختياري إذا اخترت قالب)')
          .setRequired(false)
      )
      .addUserOption(opt =>
        opt
          .setName('owner')
          .setDescription('الشخص المكلّف بالمهمة (اختياري)')
          .setRequired(false)
      )
      .addStringOption(opt =>
        opt
          .setName('due')
          .setDescription('تاريخ الاستحقاق (مثال 2025-12-01 أو اتركه فارغاً)')
          .setRequired(false)
      )
      .addStringOption(opt =>
        opt
          .setName('template')
          .setDescription('اختيار قالب مهمة (اختياري)')
          .setRequired(false)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('list')
      .setDescription('عرض المهام المرتبطة بمشروع')
      .addStringOption(opt =>
        opt
          .setName('project')
          .setDescription('اسم المشروع المطلوب')
          .setRequired(false)
      )
      .addStringOption(opt =>
        opt
          .setName('status')
          .setDescription('حالة المهام')
          .setRequired(false)
          .addChoices(
            { name: 'مفتوحة', value: 'open' },
            { name: 'منجزة', value: 'done' },
            { name: 'الكل', value: 'all' }
          )
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('complete')
      .setDescription('تعليم مهمة كمكتملة')
      .addIntegerOption(opt =>
        opt
          .setName('task_id')
          .setDescription('رقم المهمة في المشروع')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt
          .setName('project')
          .setDescription('اسم المشروع (اختياري)')
          .setRequired(false)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('delete')
      .setDescription('حذف مهمة من مشروع')
      .addIntegerOption(opt =>
        opt
          .setName('task_id')
          .setDescription('رقم المهمة في المشروع')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt
          .setName('project')
          .setDescription('اسم المشروع (اختياري)')
          .setRequired(false)
      )
  );

async function execute(interaction) {
  const handleTask = require('../discord/adapters/tasks');
  const sub = interaction.options.getSubcommand();

  if (sub === 'add') return handleTask.handleTaskAdd(interaction);
  if (sub === 'list') return handleTask.handleTaskList(interaction);
  if (sub === 'complete') return handleTask.handleTaskComplete(interaction);
  if (sub === 'delete') return handleTask.handleTaskDelete(interaction);

  return interaction.reply({
    content: 'هذا الجزء من أمر المهام غير جاهز حالياً.',
    ephemeral: true
  });
}

module.exports = {
  data,
  execute
};
