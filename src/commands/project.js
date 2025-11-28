const { SlashCommandBuilder } = require('discord.js');
const { pipelines } = require('../core/work/units');
const {
  handleProjectCreate,
  handleProjectStage,
  handleProjectDelete,
  handleProjectTasks,
  handleProjectScaffold
} = require('../discord/adapters/projects');

const pipelineChoices = pipelines
  .filter(p => !p.hidden)
  .map(p => ({ name: p.name_ar, value: p.key }));

const data = new SlashCommandBuilder()
  .setName('project')
  .setDescription('إنشاء أو إدارة مشروع حبق')
  .addSubcommand(sub =>
    sub
      .setName('create')
      .setDescription('إنشاء مشروع جديد مع مسار عمل واضح')
      .addStringOption(o =>
        o
          .setName('name')
          .setDescription('اسم المشروع')
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
          .setName('pipeline')
          .setDescription('مسار العمل (اختياري)')
          .setRequired(false);
        for (const choice of pipelineChoices) {
          o.addChoices(choice);
        }
        return o;
      })
      .addStringOption(o =>
        o
          .setName('unit')
          .setDescription('الوحدة الأساسية في حال لم تفرض القناة وحدة')
          .setRequired(false)
          .addChoices(
            { name: 'الإنتاج', value: 'production' },
            { name: 'الإعلام', value: 'media' },
            { name: 'الناس', value: 'people' },
            { name: 'الجيكس', value: 'geeks' }
          )
      )
      .addStringOption(o =>
        o
          .setName('units')
          .setDescription('وحدات إضافية مفصولة بفواصل (production,media,...)')
          .setRequired(false)
      )
      .addStringOption(o =>
        o
          .setName('template')
          .setDescription('قالب الإنتاج (A/B/C)')
          .setRequired(false)
          .addChoices(
            { name: 'قالب A - بسيط/داخلي', value: 'A' },
            { name: 'قالب B - وثائقي قياسي', value: 'B' },
            { name: 'قالب C - معيار عميل مرتفع', value: 'C' },
            { name: 'بدون قالب محدد', value: 'none' }
          )
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('scaffold')
      .setDescription('توليد المهام الافتراضية لمسار العمل')
      .addStringOption(o => {
        o
          .setName('pipeline')
          .setDescription('مسار العمل (يُستخدم بدل مسار المشروع إن وُجد)')
          .setRequired(false);
        for (const choice of pipelineChoices) {
          o.addChoices(choice);
        }
        return o;
      })
  )
  .addSubcommand(sub =>
    sub
      .setName('stage')
      .setDescription('تحديث مرحلة المشروع')
      .addStringOption(o =>
        o
          .setName('stage')
          .setDescription('المرحلة الجديدة')
          .setRequired(true)
          .addChoices(
            { name: 'التخطيط', value: 'planning' },
            { name: 'التصوير', value: 'shooting' },
            { name: 'المونتاج', value: 'editing' },
            { name: 'المراجعة', value: 'review' },
            { name: 'مؤرشف', value: 'archived' }
          )
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('delete')
      .setDescription('حذف مشروع بالكامل من النظام')
      .addBooleanOption(o =>
        o
          .setName('confirm')
          .setDescription('اكتب true إذا كنت متأكداً من الحذف')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('tasks')
      .setDescription('عرض مهام المشروع مع فلترة')
      .addStringOption(o =>
        o
          .setName('status')
          .setDescription('حالة المهام')
          .setRequired(false)
          .addChoices(
            { name: 'مفتوحة', value: 'open' },
            { name: 'منجزة', value: 'done' },
            { name: 'الكل', value: 'all' }
          )
      )
  );

async function execute(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') return handleProjectCreate(interaction);
  if (sub === 'scaffold') {
    return interaction.reply({
      content: 'هذه الوظيفة قيد التطوير، سيتم إتاحتها لاحقاً بدون الحاجة لإدخال slug.',
      ephemeral: true
    });
  }
  if (sub === 'stage') {
    return interaction.reply({
      content: 'تحديث المرحلة سيعود قريباً مع اختيار المشروع من القائمة بدون إدخال slug.',
      ephemeral: true
    });
  }
  if (sub === 'delete') {
    return interaction.reply({
      content: 'حذف المشاريع من الأمر /project سيُفعّل لاحقاً بعد إلغاء الحاجة للـ slug.',
      ephemeral: true
    });
  }
  if (sub === 'tasks') {
    return interaction.reply({
      content: 'عرض مهام المشروع عبر /project tasks سيعود بعد تفعيل اختيار المشروع بدون slug.',
      ephemeral: true
    });
  }
  return interaction.reply({ content: 'هذا الأمر غير مدعوم حالياً.', ephemeral: true });
}

module.exports = { data, execute };
