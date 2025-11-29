const { createProjectWithScaffold } = require('../../core/work/services/projectsService');
const { getPipelineByKey, getUnitByKey, listPipelinesByUnit } = require('../../core/work/units');
const { notifyProjectCreated } = require('../adapters/projectNotifications');
const { validateDueDate } = require('../utils/validation');
const { buildErrorMessage } = require('../i18n/messages');

function formatPipelineList(unitKey) {
  const list = listPipelinesByUnit(unitKey);
  if (!list.length) return 'لا توجد مسارات معرّفة لهذه الوحدة حتى الآن.';
  return list.map(p => p.key).join('، ');
}

function summarizeSizes(tasks = []) {
  const counts = tasks.reduce(
    (acc, task) => {
      const size = String(task.size || '').toUpperCase();
      if (size === 'S' || size === 'M' || size === 'L') {
        acc[size] += 1;
      }
      return acc;
    },
    { S: 0, M: 0, L: 0 }
  );

  const total = tasks.length;
  if (!total) return 'لم تُولَّد مهام تلقائية لهذا المسار.';
  return `تم توليد ${total} مهمة (S:${counts.S} / M:${counts.M} / L:${counts.L}) وربطها بالقنوات المناسبة.`;
}

function safeEditOrReply(interaction, payload) {
  if (interaction.replied || interaction.deferred) {
    return interaction.editReply(payload);
  }
  return interaction.reply({ ...payload, ephemeral: true });
}

async function handleCreate(interaction) {
  try {
    const title = interaction.options.getString('name');
    const unitKey = interaction.options.getString('unit');
    const pipelineKey = interaction.options.getString('pipeline');
    const due = interaction.options.getString('due');

    if (!title) {
      return interaction.reply({ content: 'عنوان المشروع مطلوب. اكتب اسماً واضحاً للمشروع.', ephemeral: true });
    }

    if (!unitKey) {
      return interaction.reply({ content: 'يجب اختيار الوحدة المسؤولة عن المشروع.', ephemeral: true });
    }

    const unit = getUnitByKey(unitKey);
    if (!unit) {
      return interaction.reply({ content: 'الوحدة المحددة غير معروفة. اختر من القائمه (الإنتاج، الإعلام، فِكر، الناس، الجيكس).', ephemeral: true });
    }

    if (!pipelineKey) {
      return interaction.reply({ content: 'اختر مسار عمل صالح للمشروع.', ephemeral: true });
    }

    const pipeline = getPipelineByKey(pipelineKey);
    if (!pipeline) {
      const valid = formatPipelineList(unit.key);
      return interaction.reply({
        content: `المسار المحدد غير معروف لهذه الوحدة. جرّب أحد المفاتيح التالية: ${valid}`,
        ephemeral: true
      });
    }

    if (pipeline.unitKey && pipeline.unitKey !== unit.key) {
      return interaction.reply({
        content: 'المسار لا يتوافق مع الوحدة المختارة. اختر مساراً يبدأ بنفس الوحدة.',
        ephemeral: true
      });
    }

    const dueValidation = validateDueDate(due);
    if (!dueValidation.ok) {
      return interaction.reply({ content: dueValidation.error, ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const normalizedDue = dueValidation.date.toISOString().slice(0, 10);

    let result;
    try {
      result = createProjectWithScaffold({
        title,
        unit: unit.key,
        pipelineKey: pipeline.key,
        dueDate: normalizedDue,
        createdByDiscordId: interaction.user.id
      });
    } catch (err) {
      if (err.code === 'PROJECT_EXISTS') {
        return interaction.editReply('يوجد مشروع آخر بنفس العنوان. غيّر الاسم أو راجع قائمة المشاريع.');
      }
      if (err.code === 'INVALID_DUE_DATE') {
        return interaction.editReply(dueValidation.error);
      }
      if (err.code === 'PIPELINE_NOT_FOUND') {
        const valid = formatPipelineList(unit.key);
        return interaction.editReply(`المسار المحدد غير معروف. جرّب أحد المفاتيح التالية: ${valid}`);
      }
      if (err.code === 'UNIT_NOT_FOUND' || err.code === 'PIPELINE_UNIT_MISMATCH' || err.code === 'PIPELINE_UNIT_UNKNOWN') {
        return interaction.editReply('المسار لا يتوافق مع الوحدة المختارة. اختر مساراً يبدأ بنفس الوحدة.');
      }
      throw err;
    }

    await notifyProjectCreated({
      interaction,
      project: result.project,
      tasks: result.tasks
    });

    const dueLabel = result?.project?.dueDate || normalizedDue;
    const sizeLine = summarizeSizes(result.tasks);
    const response = [
      '✅ تم إنشاء المشروع:',
      `العنوان: ${title}`,
      `الوحدة: ${unit.name_ar || unit.key}`,
      `المسار: ${pipeline.name_ar || pipeline.key} (${pipeline.key})`,
      `تاريخ التسليم: ${dueLabel}`,
      '',
      sizeLine
    ]
      .filter(Boolean)
      .join('\n');

    return interaction.editReply(response);
  } catch (err) {
    console.error('[HabApp][project]', err);
    const fallback =
      'حدث خطأ غير متوقع أثناء إنشاء المشروع. \nجرّب مرة أخرى، وإذا استمر الخطأ، أرسل لقطة شاشة لفريق HabApp.';
    return safeEditOrReply(interaction, { content: fallback, ephemeral: true });
  }
}

async function handleProject(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') {
    return handleCreate(interaction);
  }

  return interaction.reply({
    content: buildErrorMessage('not_available'),
    ephemeral: true
  });
}

module.exports = handleProject;
