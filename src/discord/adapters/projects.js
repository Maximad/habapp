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
  ensureProjectExists,
  resolveProjectSlug
} = require('../../core/work/services/projectsService');
const { createTasksFromTemplates } = require('../../core/work/services/tasksService');
const { getPipelineByKey, getUnitByKey } = require('../../core/work/units');
const { stageToArabic, unitToArabic, statusToArabic } = require('../utils/formatters');
const { createForumPost, applyStageTag } = require('../utils/forum');
const { postToChannel, getChannelIdByKey } = require('../utils/channels');

async function handleProjectCreate(interaction) {
  const projName = interaction.options.getString('name', true);
  const pipelineRaw = interaction.options.getString('pipeline');
  const due = interaction.options.getString('due', true);
  const templateRaw = interaction.options.getString('template');
  const templateCode = templateRaw && templateRaw !== 'none' ? templateRaw : null;
  const unitOption = interaction.options.getString('unit');
  const unitsRaw = interaction.options.getString('units');

  const channelParentId = interaction.channel?.parentId || null;
  const unitCategoryMap = cfg.categories?.unitMap || {};
  const forcedUnit = channelParentId ? unitCategoryMap[channelParentId] || null : null;
  const managementCategoryId = cfg.categories?.managementId || null;

  let requestedUnits = unitsRaw
    ? Array.from(
        new Set(
          unitsRaw
            .split(',')
            .map(u => u.trim().toLowerCase())
            .filter(Boolean)
        )
      )
    : [];

  if (unitOption) {
    requestedUnits.unshift(unitOption.toLowerCase());
  }

  let chosenUnit = forcedUnit || requestedUnits[0] || null;
  if (chosenUnit && !getUnitByKey(chosenUnit)) {
    return interaction.reply({
      content: `❌ وحدة غير معروفة: ${chosenUnit}`,
      ephemeral: true
    });
  }

  const pipeline = pipelineRaw ? getPipelineByKey(pipelineRaw) : null;
  if (pipelineRaw && !pipeline) {
    return interaction.reply({ content: '❌ لم يتم العثور على مسار بهذا المفتاح.', ephemeral: true });
  }

  if (forcedUnit) {
    chosenUnit = forcedUnit;
  }

  if (pipeline && chosenUnit && pipeline.unitKey !== chosenUnit) {
    return interaction.reply({
      content: '⚠️ لا يمكن استخدام هذا المسار في هذه الوحدة/الفئة.',
      ephemeral: true
    });
  }

  if (pipeline && !chosenUnit) {
    chosenUnit = pipeline.unitKey;
  }

  const units = chosenUnit ? [chosenUnit] : requestedUnits.length > 0 ? requestedUnits : ['production'];

  const finalSlug = resolveProjectSlug({ name: projName });

  try {
    ensureProjectAvailable(finalSlug);
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
    slug: finalSlug,
    due,
    templateSummary
  });

  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.crew_roster'),
    `**${finalSlug}** – فتح مشروع جديد.\n` +
      `الأدوار المطلوبة: منتج، مشرف مونتاج، كاميرا، صوت.\n` +
      `استخدم هذا الخيط لتثبيت الطاقم والجدول.`
  );
  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.gear_log'),
    `**${finalSlug}** – سجل حجز المعدّات.\n` +
      `سجّل الكاميرات، العدسات، الصوت، الإضاءة، وتواريخ الاستعارة.`
  );
  await postToChannel(
    interaction.guild,
    getChannelIdByKey('production.post_pipeline'),
    `**${finalSlug}** – مسار المونتاج.\n` +
      `حدّث هنا: المونتاج الأول، المراجعة، القفل، والتسليم النهائي.`
  );

  let project;
  let storedTemplate;
  try {
    const result = createProject({
      name: projName,
      slug: finalSlug,
      due,
      createdBy: interaction.user.id,
      threadId,
      templateCode,
      unit: chosenUnit,
      units,
      pipelineKey: pipeline ? pipeline.key : null
    });
    project = result.project;
    storedTemplate = result.template;
  } catch (err) {
    if (err.code === 'INVALID_SLUG') {
      return interaction.editReply('❌ الـ slug يجب أن يكون حروف/أرقام بدون فراغات.');
    }
    if (err.code === 'INVALID_DUE_DATE') {
      return interaction.editReply('❌ تاريخ التسليم غير صالح. الرجاء استخدام تاريخ صحيح (YYYY-MM-DD).');
    }
    if (err.code === 'PIPELINE_NOT_FOUND') {
      return interaction.editReply('❌ مسار العمل غير معروف.');
    }
    if (err.code === 'PIPELINE_UNIT_MISMATCH') {
      return interaction.editReply('❌ المسار المختار لا يتوافق مع الوحدة.');
    }
    if (err.code === 'PIPELINE_UNIT_UNKNOWN') {
      return interaction.editReply('❌ المسار المختار لا يحدد وحدة صالحة.');
    }
    throw err;
  }
  const templateNote = summarizeProductionTemplate(storedTemplate || template);

  return interaction.editReply(
    `✅ تم إنشاء المشروع **${projName}** برمز **${project.slug}**.\n` +
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
  if (!effectivePipelineKey) {
    return interaction.editReply('⚠️ لا يوجد مسار محدد لهذا المشروع. استخدم خيار pipeline لتحديد المسار.');
  }

  const resolvedPipeline = getPipelineByKey(effectivePipelineKey);
  if (!resolvedPipeline) {
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
  const previewLines = created.slice(0, 5).map(t => `• ${t.title_ar || t.title}`);
  const previewText = previewLines.length ? `\n\nالمهام المنشأة:\n${previewLines.join('\n')}` : '';

  return interaction.editReply(
    `✅ تم إنشاء ${created.length} مهمة افتراضية وفق المسار ${pipelineLabel}.${previewText}`
  );
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
