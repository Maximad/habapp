const { SlashCommandBuilder } = require('discord.js');
const handleProject = require('../discord/commands/project');
const { units } = require('../core/work/units');

// وحدة الاختيار: عددها قليل فآمن نستخدمها كـ choices
const unitChoices = units.map(u => ({ name: u.name_ar, value: u.key }));

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
          .setName('name') // مهم أن تبقى name لتطابق الكود في الهاندلر/الكور
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
      .addStringOption(option =>
        option
          .setName('pipeline')
          .setDescription('مفتاح مسار العمل (مثلاً production.video_doc_interviews)')
          .setRequired(true)
      )
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
      )
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
