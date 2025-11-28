const { SlashCommandBuilder } = require('discord.js');
const handleProject = require('../discord/commands/project');
const { units, pipelines } = require('../core/work/units');

const unitChoices = units.map(u => ({ name: u.name_ar, value: u.key }));
const pipelineChoices = pipelines
  .filter(p => !p.hidden)
  .map(p => ({ name: p.name_ar, value: p.key }));

const data = new SlashCommandBuilder()
  .setName('project')
  .setDescription('أوامر إدارة المشاريع في حبق')
  .addSubcommand(sub =>
    sub
      .setName('create')
      .setDescription('إنشاء مشروع وتوليد المهام الافتراضية')
      .addStringOption(o =>
        o
          .setName('title')
          .setDescription('عنوان المشروع')
          .setRequired(true)
      )
      .addStringOption(o =>
        o
          .setName('due')
          .setDescription('تاريخ التسليم (YYYY-MM-DD)')
          .setRequired(true)
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
          .setDescription('مسار العمل المناسب للمشروع')
          .setRequired(true);
        for (const choice of pipelineChoices) {
          o.addChoices(choice);
        }
        return o;
      })
  )
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
  )
  .addSubcommand(sub =>
    sub
      .setName('open')
      .setDescription('فتح نظرة سريعة على مشروع محدد')
      .addStringOption(o =>
        o
          .setName('project')
          .setDescription('اسم المشروع أو جزء منه')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('tasks')
      .setDescription('عرض مهام مشروع محدد')
      .addStringOption(o =>
        o
          .setName('project')
          .setDescription('اسم المشروع أو آخر مشروع للوحدة عند تركه فارغاً')
          .setRequired(false)
      )
      .addStringOption(o =>
        o
          .setName('status')
          .setDescription('حالة المهام المطلوبة (اختياري)')
          .addChoices(
            { name: 'مفتوحة', value: 'open' },
            { name: 'منجزة', value: 'done' },
            { name: 'الكل', value: 'all' }
          )
      )
  );

async function execute(interaction) {
  return handleProject(interaction);
}

module.exports = { data, execute };
