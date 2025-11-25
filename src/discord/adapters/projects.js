const cfg = require('../../../config.json');
const {
  createProject,
  setProjectStage,
  removeProject,
  listProjectTasks,
  ensureProjectAvailable,
  ALLOWED_STAGES,
  summarizeProductionTemplate,
  getProductionTemplate,
  ensureProjectExists
} = require('../../core/services/projectsService');
const { createTasksFromTemplates } = require('../../core/services/tasksService');
const { getPipelineByKey, getUnitByKey } = require('../../core/units');
const { stageToArabic, unitToArabic, statusToArabic } = require('../utils/formatters');
const { createForumPost, applyStageTag } = require('../utils/forum');
const { postToChannel, getChannelIdByKey } = require('../utils/channels');

async function handleProjectCreate(interaction) {
  const projName = interaction.options.getString('name', true);
  const slug = interaction.options.getString('slug', true);
  const pipelineRaw = interaction.options.getString('pipeline');
  const due = interaction.options.getString('due') || null;
  const templateRaw = interaction.options.getString('template');
  const templateCode = templateRaw && templateRaw !== 'none' ? templateRaw : null;
  const unitsRaw = interaction.options.getString('units');

  let units = unitsRaw
    ? Array.from(
        new Set(
          unitsRaw
            .split(',')
            .map(u => u.trim().toLowerCase())
            .filter(Boolean)
        )
      )
    : ['production'];

  if (units.length === 0) {
    units = ['production'];
  }

  for (const u of units) {
    if (!getUnitByKey(u)) {
      return interaction.reply({
        content: `❌ وحدة غير معروفة: ${u}`,
        ephemeral: true
      });
    }
  }

  const pipeline = pipelineRaw ? getPipelineByKey(pipelineRaw) : null;
  if (pipelineRaw && !pipeline) {
    return interaction.reply({ content: '❌ لم يتم العثور على مسار بهذا المفتاح.', ephemeral: true });
  }

  if (pipeline && !units.includes(pipeline.unitKey)) {
    units = [...units, pipeline.unitKey];
  }

  try {
    ensureProjectAvailable(slug);
  } catch (err) {
    return interaction.reply({
      content: '⚠️ يوجد مشروع بهذا الرمز مسبقاً.',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  let template = null;
  let templateSummary = null;
  if (templateCode) {
    try {
      template = getProductionTemplate(templateCode);
      templateSummary = summarizeProductionTemplate(template);
    } catch (err) {
      if (err.code === 'TEMPLATE_NOT_FOUND') {
        return interaction.editReply('❌ القالب غير معروف. استخدم A أو B أو C أو اتركه فارغاً.');
      }
      throw err;
    }
  }

  const { threadId } = await createForumPost(interaction.guild, cfg.forum.productionForumId, {
    name: projName,
    slug,
    due,
    templateSummary
  });

  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.crew_roster'),
    `**${slug}** – فتح مشروع جديد.\n` +
      `الأدوار المطلوبة: منتج، مشرف مونتاج، كاميرا، صوت.\n` +
      `استخدم هذا الخيط لتثبيت الطاقم والجدول.`
  );
  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.gear_log'),
    `**${slug}** – سجل حجز المعدّات.\n` +
      `سجّل الكاميرات، العدسات، الصوت، الإضاءة، وتواريخ الاستعارة.`
  );
  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.post_pipeline'),
    `**${slug}** – مسار المونتاج.\n` +
      `حدّث هنا: المونتاج الأول، المراجعة، القفل، والتسليم النهائي.`
  );

  const { project, template: storedTemplate } = createProject({
    name: projName,
    slug,
    due,
    createdBy: interaction.user.id,
    threadId,
    templateCode,
    units,
    pipelineKey: pipeline ? pipeline.key : null
  });
  const templateNote = summarizeProductionTemplate(storedTemplate || template);

  return interaction.editReply(
    `✅ تم إنشاء المشروع **${projName}** برمز **${slug}**.\n` +
      `تم فتح خيط في المنتدى مع مرحلة **${stageToArabic('planning')}**.\n` +
      `استخدم /task add لإضافة مهام، و /project stage لتغيير المرحلة، و /template task-spawn لتوليد مهام جاهزة.` +
      (templateNote ? `\n\nملخص القالب:\n${templateNote}` : '')
  );
}

async function handleProjectScaffold(interaction) {
  const slug = interaction.options.getString('slug', true);
  const pipelineRaw = interaction.options.getString('pipeline');
  const pipeline = pipelineRaw ? getPipelineByKey(pipelineRaw) : null;

  if (pipelineRaw && !pipeline) {
    return interaction.reply({ content: '❌ لم يتم العثور على مسار بهذا المفتاح.', ephemeral: true });
  }

  let project;
  try {
    project = ensureProjectExists(slug);
  } catch (err) {
    return interaction.reply({ content: '❌ لم يتم العثور على مشروع بهذا الرمز.', ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  const effectivePipelineKey = pipeline ? pipeline.key : project.pipelineKey;
  const resolvedPipeline = effectivePipelineKey ? getPipelineByKey(effectivePipelineKey) : null;
  if (effectivePipelineKey && !resolvedPipeline) {
    return interaction.editReply('❌ لم يتم العثور على مسار بهذا المفتاح.');
  }

  const created = await createTasksFromTemplates({ projectSlug: slug, pipelineKey: effectivePipelineKey });
  if (!created || created.length === 0) {
    return interaction.editReply('⚠️ لا توجد قوالب معرفة لهذا المسار.');
  }

  for (const task of created) {
    const channelId = getChannelIdByKey(task.defaultChannelKey);
    const unitMeta = getUnitByKey(task.unit);
    const unitLabel = unitMeta?.name_ar || unitToArabic(task.unit) || task.unit;
    const title = task.title_ar || task.title;

    await postToChannel(
      interaction.guild,
      channelId,
      `مهمة جديدة للمشروع ${slug}: ${title} (الوحدة: ${unitLabel})`
    ).catch(() => null);
  }

  const pipelineLabel = resolvedPipeline?.name_ar || 'مسار غير محدد';
  return interaction.editReply(`✅ تم توليد ${created.length} مهمة تلقائياً لمسار ${pipelineLabel}.`);
}

async function handleProjectStage(interaction) {
  const slug = interaction.options.getString('slug', true);
  const stage = interaction.options.getString('stage', true).toLowerCase();

  if (!ALLOWED_STAGES.includes(stage)) {
    return interaction.reply({ content: '❌ مرحلة غير صحيحة.', ephemeral: true });
  }

  let project;
  try {
    project = setProjectStage(slug, stage);
  } catch (err) {
    return interaction.reply({
      content: 'لم يتم العثور على مشروع بهذا الرمز.',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const guildFull = await interaction.client.guilds
    .fetch(cfg.guildId)
    .then(g => g.fetch());

  if (project.threadId) {
    await applyStageTag(guildFull, cfg.forum.productionForumId, project.threadId, stage);
    const thread = await guildFull.channels.fetch(project.threadId).catch(() => null);
    if (thread && thread.isThread()) {
      await thread
        .send(`تم تحديث المرحلة إلى **${stageToArabic(stage)}** بواسطة <@${interaction.user.id}>.`)
        .catch(() => {});
    }
  }

  return interaction.editReply(`✅ تم تعيين المرحلة إلى **${stageToArabic(stage)}**.`);
}

async function handleProjectDelete(interaction) {
  const slug = interaction.options.getString('slug', true);
  const confirm = interaction.options.getBoolean('confirm', true);

  if (!confirm) {
    return interaction.reply({
      content: 'تم إلغاء الحذف لأنّ خيار التأكيد لم يُضبط على قيمة true.',
      ephemeral: true
    });
  }

  let project;
  try {
    project = removeProject(slug);
  } catch (err) {
    return interaction.reply({
      content: 'لم يتم العثور على مشروع بهذا الرمز.',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  if (project.threadId) {
    const thread = await interaction.guild.channels.fetch(project.threadId).catch(() => null);
    if (thread && thread.isThread()) {
      await thread
        .send('⚠️ هذا المشروع تم حذفه من نظام HabApp بواسطة الإدارة.')
        .catch(() => {});
      await thread.setLocked(true).catch(() => {});
      await thread.setArchived(true).catch(() => {});
    }
  }

  return interaction.editReply(`🗑️ تم حذف المشروع **${slug}** من قاعدة البيانات.`);
}

async function handleProjectTasks(interaction) {
  const slug = interaction.options.getString('slug', true);
  const status = interaction.options.getString('status') || 'open';

  let tasks;
  try {
    tasks = listProjectTasks(slug, status === 'all' ? 'all' : status);
  } catch (err) {
    return interaction.reply({
      content: 'لم يتم العثور على مشروع بهذا الرمز.',
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
  handleProjectCreate,
  handleProjectStage,
  handleProjectDelete,
  handleProjectTasks,
  handleProjectScaffold
};
