// src/commands/project.js
const { SlashCommandBuilder } = require('discord.js');
const projectHandlers = require('../discord/commands/project');
const { units, pipelines } = require('../core/work/units');

// Discord hard limit: max 25 choices per option
const MAX_CHOICES = 25;

// Units (few) – full dropdown
const unitChoices = units.map(u => ({
  name: u.name_ar,
  value: u.key,
}));

// Pipelines – we’ll show up to 25 as a helper list,
// but still allow typing any valid key.
const pipelineChoices = pipelines
  .filter(p => !p.hidden)
  .slice(0, MAX_CHOICES)
  .map(p => ({
    name: `${p.name_ar} (${p.key})`,
    value: p.key,
  }));

const data = new SlashCommandBuilder()
  .setName('project')
  .setDescription('أوامر إدارة المشاريع في حبق')

  // /project create
  .addSubcommand(sub =>
    sub
      .setName('create')
      .setDescription('إنشاء مشروع وتوليد المهام الافتراضية')
      .addStringOption(o =>
        o
          .setName('title')
          .setDescription('عنوان المشروع')
          .setRequired(true),
      )
      .addStringOption(o =>
        o
          .setName('description')
          .setDescription('نبذة مختصرة عن المشروع (اختياري)'),
      )
      .addStringOption(o =>
        o
          .setName('due')
          .setDescription('تاريخ التسليم (YYYY-MM-DD)')
          .setRequired(true),
      )
      .addStringOption(o => {
        o
          .setName('unit')
          .setDescription('الوحدة المسؤولة عن المشروع')
          .setRequired(true);

        for (const choice of unitChoices) {
          o.addChoices(choice);
        }
        return o;
      })
      .addStringOption(o => {
        o
          .setName('pipeline')
          .setDescription(
            'اختر مسار العمل من القائمة أو اكتب المفتاح يدوياً (مثل production.video_doc_interviews)',
          )
          .setRequired(true);

        for (const choice of pipelineChoices) {
          o.addChoices(choice);
        }
        return o;
      }),
  )

  // /project list
  .addSubcommand(sub =>
    sub
      .setName('list')
      .setDescription('عرض المشاريع النشطة حسب الوحدة')
      .addStringOption(o => {
        o
          .setName('unit')
          .setDescription('تصفية المشاريع حسب الوحدة (اختياري)');
        for (const choice of unitChoices) {
          o.addChoices(choice);
        }
        return o;
      })
      .addStringOption(o => {
        o
          .setName('status')
          .setDescription('حالة المشروع (اختياري)')
          .addChoices(
            { name: 'نشط', value: 'active' },
            { name: 'مؤرشف', value: 'archived' },
            { name: 'الكل', value: 'all' },
          );
        return o;
      }),
  )

  // /project open
  .addSubcommand(sub =>
    sub
      .setName('open')
      .setDescription('فتح نظرة سريعة على مشروع محدد')
      .addStringOption(o =>
        o
          .setName('project')
          .setDescription('اسم المشروع أو جزء منه')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  )

  // /project tasks
  .addSubcommand(sub =>
    sub
      .setName('tasks')
      .setDescription('عرض مهام مشروع محدد')
      .addStringOption(o =>
        o
          .setName('project')
          .setDescription('اسم المشروع أو آخر مشروع للوحدة عند تركه فارغاً')
          .setAutocomplete(true),
      )
      .addStringOption(o =>
        o
          .setName('status')
          .setDescription('حالة المهام المطلوبة (اختياري)')
          .addChoices(
            { name: 'مفتوحة', value: 'open' },
            { name: 'منجزة', value: 'done' },
            { name: 'الكل', value: 'all' },
          ),
      ),
  );

async function execute(interaction) {
  return projectHandlers.handleProject(interaction);
}

async function autocomplete(interaction) {
  return projectHandlers.handleProjectAutocomplete(interaction);
}

module.exports = { data, execute, autocomplete };
