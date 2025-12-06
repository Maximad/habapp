const {
  createProjectWithScaffold,
  resolveProjectByQuery,
  buildProjectSnapshot,
  listProjectTasksForView,
  validateUnitPipeline
} = require('../../core/work/services/projectsService');
const { pipelines, getPipelineByKey, getUnitByKey, listPipelinesByUnit } = require('../../core/work/units');
const { notifyProjectCreated } = require('../adapters/projectNotifications');
const { validateDueDate } = require('../utils/validation');
const { unitKeyToArabic } = require('../i18n/profileLabels');

const AUTOCOMPLETE_LIMIT = 25;

function formatPipelineList(unitKey) {
  const list = listPipelinesByUnit(unitKey);
  if (!list.length) return 'لا توجد مسارات معرّفة لهذه الوحدة حتى الآن.';
  return list.map(p => `${p.name_ar || p.key} (${p.key})`).join('\n');
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

function formatStage(stage) {
  const map = {
    planning: 'التخطيط',
    shooting: 'التصوير',
    editing: 'المونتاج',
    review: 'المراجعة',
    archived: 'مؤرشف'
  };
  return map[stage] || stage || 'غير محدد';
}

function formatTaskLine(task) {
  const size = task?.size ? `[${String(task.size).toUpperCase()}]` : '[—]';
  const title = task?.title_ar || task?.title || 'بدون عنوان';
  const owner = task?.ownerId ? `<@${task.ownerId}>` : 'غير معيّن بعد';
  const due = task?.due || task?.dueDate || 'بدون موعد';
  const hasReminder = Boolean(task?.reminders?.mainSentAt || task?.reminders?.handoverSentAt);
  const reminderBadge = hasReminder ? ' 🔔' : '';
  return `${size} ${title} — ${owner} — ${due}${reminderBadge}`;
}

function buildAmbiguousMessage(matches = []) {
  const list = matches.slice(0, 5).map(m => `• ${m.project.name || m.project.title} (${m.project.slug})`);
  return [
    'وجدنا أكثر من مشروع بهذا الاسم. وضّح أكثر:',
    ...list,
    '',
    'أعد المحاولة بكتابة كلمة مميزة من العنوان أو استخدم المعرّف (slug).'
  ]
    .filter(Boolean)
    .join('\n');
}

function formatProjectSummary(snapshot) {
  const { project, pipeline, unit, openTasks } = snapshot;
  const due = project?.dueDate || project?.due || 'بدون موعد محدد';
  const taskPreview = openTasks && openTasks.length > 0
    ? openTasks
      .slice(0, 5)
      .map(t => `• ${formatTaskLine(t)}`)
      .join('\n')
    : 'لا توجد مهام مفتوحة حالياً.';

  return [
    `**${project.name || project.title || project.slug}**`,
    `الوحدة: ${unit?.name_ar || unit?.key || project.unit || 'غير محددة'}`,
    `المسار: ${(pipeline && (pipeline.name_ar || pipeline.key)) || project.pipelineKey || '—'}`,
    `الموعد النهائي: ${due}`,
    `المرحلة: ${formatStage(project.stage)}`,
    `المعرّف: ${project.slug}`,
    '',
    'المهام المفتوحة البارزة:',
    taskPreview
  ]
    .filter(Boolean)
    .join('\n');
}

async function handleProjectAutocomplete(interaction) {
  const focused = interaction.options.getFocused(true);
  if (!focused || focused.name !== 'pipeline') {
    return interaction.respond([]);
  }

  const query = String(focused.value || '').toLowerCase();
  const unitKey = interaction.options.getString('unit');

  const available = pipelines
    .filter(p => !p.hidden)
    .filter(p => (!unitKey ? true : p.unitKey === unitKey));

  const matches = available.filter(p => {
    if (!query) return true;
    const arabicName = String(p.name_ar || '').toLowerCase();
    return p.key.toLowerCase().includes(query) || arabicName.includes(query);
  });

  const choices = matches
    .slice(0, AUTOCOMPLETE_LIMIT)
    .map(p => ({ name: `${p.name_ar || p.key} (${p.key})`, value: p.key }));

  return interaction.respond(choices);
}

async function handleCreate(interaction) {
  try {
    const rawTitle = interaction.options.getString('title');
    const title = rawTitle ? rawTitle.trim() : '';
    const unitKey = interaction.options.getString('unit');
    const pipelineKey = interaction.options.getString('pipeline');
    const due = interaction.options.getString('due');

    if (!title) {
      return interaction.reply({ content: 'عنوان المشروع مطلوب. اكتب اسماً واضحاً للمشروع.', ephemeral: true });
    }

    if (!unitKey) {
      return interaction.reply({ content: 'يجب اختيار الوحدة المسؤولة عن المشروع.', ephemeral: true });
    }

    if (!pipelineKey) {
      return interaction.reply({ content: 'اختر مسار عمل صالح للمشروع.', ephemeral: true });
    }

    const dueValidation = validateDueDate(due);
    if (!dueValidation.ok) {
      return interaction.reply({ content: dueValidation.error, ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const normalizedDue = dueValidation.date.toISOString().slice(0, 10);

    let result;
    let unit = null;
    let pipeline = null;
    try {
      const validation = validateUnitPipeline(unitKey, pipelineKey);
      unit = validation.unit ? getUnitByKey(validation.unit) : null;
      pipeline = validation.pipeline || (pipelineKey ? getPipelineByKey(pipelineKey) : null);

      if (!unit) {
        const validUnits = ['الإنتاج', 'الإعلام', 'فِكر', 'الناس', 'الجيكس'].join('، ');
        return interaction.editReply(`الوحدة المحددة غير معروفة. اختر من القائمة: ${validUnits}`);
      }

      if (!pipeline) {
        const validPipelines = formatPipelineList(unit.key);
        return interaction.editReply(`المسار غير معروف لهذه الوحدة. المسارات المتاحة:\n${validPipelines}`);
      }

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
      if (err.code === 'UNIT_NOT_FOUND') {
        const validUnits = ['الإنتاج', 'الإعلام', 'فِكر', 'الناس', 'الجيكس'].join('، ');
        return interaction.editReply(`الوحدة غير موجودة في النظام. اختر من القائمة: ${validUnits}`);
      }
      if (err.code === 'PIPELINE_NOT_FOUND') {
        const valid = unitKey ? formatPipelineList(unitKey) : 'لا توجد مسارات متاحة.';
        return interaction.editReply(`المسار المحدد غير معروف. المسارات المتاحة للوحدة المختارة:\n${valid}`);
      }
      if (err.code === 'UNIT_NOT_FOUND' || err.code === 'PIPELINE_UNIT_MISMATCH' || err.code === 'PIPELINE_UNIT_UNKNOWN') {
        const valid = unitKey ? formatPipelineList(unitKey) : null;
        const hint = valid ? `المسارات المتاحة لهذه الوحدة:\n${valid}` : 'تأكد من اختيار وحدة صحيحة ثم جرّب مرة أخرى.';
        return interaction.editReply(`المسار لا يتوافق مع الوحدة المختارة. ${hint}`);
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

async function handleOpen(interaction) {
  try {
    const query = interaction.options.getString('project');
    if (!query || !query.trim()) {
      return safeEditOrReply(interaction, {
        content: 'اكتب اسم المشروع أو جزء منه لعرض التفاصيل.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });
    const { project, matches } = resolveProjectByQuery(query);

    if (!project && (!matches || matches.length === 0)) {
      return interaction.editReply('ما قدرنا نلاقي مشروع بهذا الوصف. جرّب /project list أو اكتب جزء أوضح من الاسم.');
    }

    if (!project && matches && matches.length > 0) {
      return interaction.editReply(buildAmbiguousMessage(matches));
    }

    const snapshot = buildProjectSnapshot(project.slug);
    return interaction.editReply(formatProjectSummary(snapshot));
  } catch (err) {
    console.error('[HabApp][project-open]', err);
    const fallback = 'حدث خطأ أثناء جلب بيانات المشروع. حاول مرة ثانية أو تواصل مع فريق HabApp.';
    return safeEditOrReply(interaction, { content: fallback, ephemeral: true });
  }
}

async function handleTasks(interaction) {
  try {
    const query = interaction.options.getString('project');
    const status = interaction.options.getString('status') || 'open';

    if (!query || !query.trim()) {
      return safeEditOrReply(interaction, {
        content: 'اكتب اسم المشروع (أو جزء منه) لعرض المهام المرتبطة به.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });
    const { project, matches } = resolveProjectByQuery(query);

    if (!project && (!matches || matches.length === 0)) {
      return interaction.editReply('ما وجدنا مشروع يطابق النص المدخل. تأكد من الاسم أو استخدم /project list.');
    }

    if (!project && matches && matches.length > 0) {
      return interaction.editReply(buildAmbiguousMessage(matches));
    }

    const view = listProjectTasksForView({ projectSlug: project.slug, status });
    const allowedStatuses = ['open', 'done', 'all'];
    const normalizedStatus = allowedStatuses.includes(status) ? status : 'all';
    const sections = [];

    const header = `المهام للمشروع **${project.name || project.title || project.slug}** (${project.slug})`;
    sections.push(header);

    const groupsToRender = normalizedStatus === 'all'
      ? ['open', 'done']
      : [normalizedStatus];

    for (const key of groupsToRender) {
      const label = key === 'done' ? 'المهام المنجزة' : 'المهام المفتوحة';
      sections.push(`\n${label}:`);
      const tasks = Array.isArray(view.tasks[key]) ? view.tasks[key] : [];
      if (!tasks.length) {
        sections.push('- لا توجد مهام في هذه الفئة حالياً.');
      } else {
        tasks.forEach(t => sections.push(`- ${formatTaskLine(t)}`));
      }
    }

    return interaction.editReply(sections.filter(Boolean).join('\n'));
  } catch (err) {
    console.error('[HabApp][project-tasks]', err);
    const fallback = 'تعذر عرض المهام حالياً. حاول مرة أخرى أو أبلغ فريق HabApp.';
    return safeEditOrReply(interaction, { content: fallback, ephemeral: true });
  }
}

async function handleProject(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') {
    return handleCreate(interaction);
  }

  if (sub === 'open') {
    return handleOpen(interaction);
  }

  if (sub === 'tasks') {
    return handleTasks(interaction);
  }

  return interaction.reply({
    content: 'الأمر غير معروف. تأكد من كتابة subcommand صحيح ضمن /project.',
    ephemeral: true
  });
}
async function handleProjectAutocomplete(interaction) {
  // Temporary no-op autocomplete handler.
  // Once Codex implements real autocomplete, this will be replaced.
  try {
    if (interaction.respond) {
      await interaction.respond([]);
    }
  } catch (err) {
    console.error('[HabApp][autocomplete][project] error:', err);
  }
}

async function handleProjectAutocomplete(interaction) {
  if (typeof interaction.respond === 'function') {
    return interaction.respond([]);
  }
  return [];
}

module.exports = { handleProject, handleProjectAutocomplete };
