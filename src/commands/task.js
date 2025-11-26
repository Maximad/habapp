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

function getProject(slug) {
  const list = loadProjects();
  return list.find(
    p => p.slug && p.slug.toLowerCase() === slug.toLowerCase()
  ) || null;
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
          .setName('slug')
          .setDescription('الـ slug الخاص بالمشروع (مثال shahba01)')
          .setRequired(true)
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

  const slug = interaction.options.getString('slug', true);
  const titleInput = interaction.options.getString('title');
  const owner = interaction.options.getUser('owner');
  const due = interaction.options.getString('due') || 'غير محدد';
  const templateId = interaction.options.getString('template');

  const project = getProject(slug);
  if (!project) {
    return interaction.reply({
      content: 'المشروع غير موجود. تأكّد من الـ slug.',
      ephemeral: true
    });
  }

  // نحاول جلب القالب إذا تم اختياره
  const template = templateId ? getTaskTemplateById(templateId) : null;

  // عنوان المهمة النهائي
  let finalTitle;
  if (template && titleInput) {
    // دمج: اسم القالب + العنوان الحر
    finalTitle = `${template.label_ar} — ${titleInput}`;
  } else if (template && !titleInput) {
    finalTitle = template.label_ar;
  } else if (!template && titleInput) {
    finalTitle = titleInput;
  } else {
    finalTitle = 'مهمة بدون عنوان';
  }

  const ownerMention = owner ? `<@${owner.id}>` : 'غير معيّن';

  // نص تعريف الإنجاز من القالب (إن وجد)
  let doneBlock = '';
  if (template && template.definitionOfDone_ar) {
    doneBlock = `\n\n**تعريف الإنجاز (مقترح):**\n${template.definitionOfDone_ar}`;
  }

  await interaction.deferReply({ ephemeral: true });

  // نرسل إلى قناة المهمات (#المهمات) كما هو سابقاً
  const guild = await interaction.client.guilds.fetch(interaction.guildId);
  const assignmentsChannelId = cfg.media?.assignmentsId;

  if (!assignmentsChannelId) {
    await interaction.editReply('خطأ في الإعدادات: لم يتم تعريف قناة المهمات في config.json.');
    return;
  }

  const assignmentsChannel = await guild.channels.fetch(assignmentsChannelId).catch(() => null);
  if (!assignmentsChannel) {
    await interaction.editReply('تعذّر الوصول إلى قناة المهمات. تأكّد من صلاحيات البوت.');
    return;
  }

  const content =
    `**${slug}** – مهمة: ${finalTitle}\n` +
    `المالك: ${ownerMention}\n` +
    `تاريخ الاستحقاق: ${due}` +
    doneBlock;

  const assignMsg = await assignmentsChannel.send({ content });

  // مرآة في خيط المشروع إن كان موجوداً
  if (project.threadId) {
    try {
      const thread = await guild.channels.fetch(project.threadId);
      if (thread && thread.isThread?.()) {
        const linkLine = assignMsg?.url
          ? `\nرابط المهمة في #المهمات: ${assignMsg.url}`
          : '';

        await thread.send(
          `تم إنشاء مهمة جديدة:\n` +
          `**${finalTitle}**\n` +
          `المالك: ${ownerMention}\n` +
          `تاريخ الاستحقاق: ${due}` +
          linkLine +
          doneBlock
        );
      }
    } catch {
      // نتجاهل أي خطأ في الخيط، لكن لا نُسقط الأمر كله
    }
  }

  await interaction.editReply(
    template
      ? `تم إنشاء المهمة باستخدام القالب «${template.label_ar}» على المشروع ${slug}.`
      : `تم إنشاء المهمة على المشروع ${slug}.`
  );
}

module.exports = {
  data,
  execute
};
