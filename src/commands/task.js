// src/commands/task.js
// إنشاء مهمة مرتبطة بمشروع، مع دعم قوالب مهام الإنتاج

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const cfg = require('../../config.json');
const { taskTemplates, getTaskTemplateById } = require('../core/work/templates');

// ------------------------
// Project store helpers
// ------------------------

const DATA = path.join(__dirname, '..', '..', 'data', 'projects.json');

function loadProjects() {
  try {
    const raw = fs.readFileSync(DATA, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


// ------------------------
// Template choices (Production only for now)
// ------------------------

const productionTemplateChoices = taskTemplates
  .filter(t => t.unit === 'production')
  .slice(0, 24)                     // Discord max 25 choices; نترك واحدة احتياطاً
  .map(t => ({
    name: t.label_ar,               // يظهر للمستخدم في القائمة
    value: t.id                     // المعرّف الداخلي
  }));

// ------------------------
// Slash command definition
// ------------------------

const data = new SlashCommandBuilder()
  .setName('task')
  .setDescription('إنشاء مهمة مرتبطة بمشروع')
  .addSubcommand(sub =>
    sub
      .setName('add')
      .setDescription('إضافة مهمة جديدة لمشروع')
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
      .addStringOption(opt => {
        opt
          .setName('template')
          .setDescription('اختيار قالب مهمة إنتاج (اختياري)')
          .setRequired(false);

        // نضيف القوالب كخيارات جاهزة
        for (const choice of productionTemplateChoices) {
          opt.addChoices(choice);
        }
        return opt;
      })
  );

// ------------------------
// Command execution
// ------------------------

async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.options.getSubcommand() !== 'add') return;

  return interaction.reply({
    content: 'إضافة مهمات جديدة مباشرة من أمر /task سيتم تفعيلها بعد تحديث نظام اختيار المشاريع.',
    ephemeral: true
  });
}

module.exports = {
  data,
  execute
};
