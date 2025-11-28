const {
  findProject,
  upsertProject,
  deleteProject,
  applyProjectDefaults,
  listProjects
} = require('../projects');
const { listTasks, createTask } = require('../tasks');
const { getProductionTemplateByCode } = require('../templates/templates.production');
const { getPipelineByKey, getUnitByKey } = require('../units');
const { getTaskTemplateById } = require('../templates/task-templates');
const { listMembers } = require('../../people/memberStore');
const { resolveSlug, validateSlugFormat } = require('../../utils/slug');

const ALLOWED_STAGES = ['planning', 'shooting', 'editing', 'review', 'archived'];

function assertStage(stage) {
  if (!ALLOWED_STAGES.includes(stage)) {
    const error = new Error('INVALID_STAGE');
    error.code = 'INVALID_STAGE';
    throw error;
  }
}

function ensureProjectExists(slug, store) {
  const project = findProject(slug, store);
  if (!project) {
    const error = new Error('PROJECT_NOT_FOUND');
    error.code = 'PROJECT_NOT_FOUND';
    throw error;
  }
  return project;
}

function ensureProjectAvailable(slug, store) {
  const existing = findProject(slug, store);
  if (existing) {
    const error = new Error('PROJECT_EXISTS');
    error.code = 'PROJECT_EXISTS';
    throw error;
  }
}

function normalizeDueDate(due) {
  const invalid = () => {
    const err = new Error('INVALID_DUE_DATE');
    err.code = 'INVALID_DUE_DATE';
    throw err;
  };

  if (!due) invalid();

  if (due instanceof Date) {
    if (Number.isNaN(due.getTime())) invalid();
    return due.toISOString().slice(0, 10);
  }

  const raw = String(due).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) invalid();

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(parsed.getTime())) invalid();

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    invalid();
  }

  return parsed.toISOString().slice(0, 10);
}

function resolveProjectSlug({ name, slug }, store) {
  const existingSlugs = listProjects(store).map(p => p.slug).filter(Boolean);
  return resolveSlug({ name, slug }, existingSlugs);
}

function validateUnitPipeline(unit, pipelineKey) {
  if (!pipelineKey && !unit) return { unit: null, pipeline: null };

  const normalizedInputUnit = typeof unit === 'string' ? unit.toLowerCase() : unit;

  if (!pipelineKey && normalizedInputUnit) {
    const unitMeta = getUnitByKey(unit);
    if (!unitMeta) {
      const err = new Error('UNIT_NOT_FOUND');
      err.code = 'UNIT_NOT_FOUND';
      throw err;
    }
    return { unit: unitMeta.key, pipeline: null };
  }

  const pipeline = pipelineKey ? getPipelineByKey(pipelineKey) : null;
  if (pipelineKey && !pipeline) {
    const err = new Error('PIPELINE_NOT_FOUND');
    err.code = 'PIPELINE_NOT_FOUND';
    throw err;
  }

  const pipelineUnit = pipeline?.unitKey || pipeline?.unit || null;
  if (pipeline && !pipelineUnit) {
    const err = new Error('PIPELINE_UNIT_UNKNOWN');
    err.code = 'PIPELINE_UNIT_UNKNOWN';
    throw err;
  }

  const normalizedUnit = normalizedInputUnit || (pipelineUnit ? pipelineUnit.toLowerCase() : null);
  const unitMeta = normalizedUnit ? getUnitByKey(normalizedUnit) : null;
  if (normalizedUnit && !unitMeta) {
    const err = new Error('UNIT_NOT_FOUND');
    err.code = 'UNIT_NOT_FOUND';
    throw err;
  }

  if (
    pipeline &&
    normalizedUnit &&
    pipelineUnit &&
    pipelineUnit.toLowerCase() !== normalizedUnit
  ) {
    const err = new Error('PIPELINE_UNIT_MISMATCH');
    err.code = 'PIPELINE_UNIT_MISMATCH';
    throw err;
  }

  const unitKey = (pipelineUnit ? pipelineUnit.toLowerCase() : null) || normalizedUnit;
  return { unit: unitKey, pipeline };
}

function getProductionTemplate(code) {
  if (!code) return null;
  const normalized = String(code || '').trim().toUpperCase();
  const tpl = getProductionTemplateByCode(normalized);
  if (!tpl) {
    const error = new Error('TEMPLATE_NOT_FOUND');
    error.code = 'TEMPLATE_NOT_FOUND';
    throw error;
  }
  return tpl;
}

function summarizeProductionTemplate(template) {
  if (!template) return null;
  const stageMap = {
    planning: 'التخطيط',
    shooting: 'التصوير',
    editing: 'المونتاج',
    review: 'المراجعة',
    archived: 'مؤرشف'
  };

  const stages = template.allowedStages
    .map(s => stageMap[s] || s)
    .join(' → ');

  const reviewSteps =
    template.extraReviewSteps && template.extraReviewSteps.length > 0
      ? template.extraReviewSteps.map(s => `• ${s.label_ar}`).join(' / ')
      : 'لا يوجد متطلبات مراجعة إضافية محددة.';

  const crew =
    template.crewRoles && template.crewRoles.length > 0
      ? template.crewRoles
        .map(r => `${r.label_ar} (${r.min}-${r.max})`)
        .join('، ')
      : 'طاقم بسيط حسب الحاجة.';

  const gear = template.gearPackage
    ? `${template.gearPackage.label_ar} — ${template.gearPackage.description_ar}`
    : 'لا توجد حزمة معدّات محددة.';

  const clientLabel = template.clientType === 'internal'
    ? 'عميل داخلي / حبق'
    : template.clientType === 'external'
      ? 'عميل أو شريك خارجي'
      : 'مختلط (داخلي/خارجي)';

  const qualityLabel =
    template.quality === 'premium'
      ? 'جودة عالية'
      : template.quality === 'standard'
        ? 'جودة قياسية'
        : 'جودة بسيطة';

  return (
    `**القالب ${template.code}: ${template.short_ar}**\n` +
    `- نوع العميل: ${clientLabel}\n` +
    `- جودة الإنتاج: ${qualityLabel}\n` +
    `- المراحل المسموح بها: ${stages}\n` +
    `- خطوات مراجعة إضافية: ${reviewSteps}\n` +
    `- عقد رسمي: ${template.needsContract ? 'مطلوب' : 'غير مطلوب'} | موافقة عميل قبل النشر: ${template.needsClientApprovalBeforePublish ? 'نعم' : 'لا'}\n` +
    `- الطاقم المقترح: ${crew}\n` +
    `- حزمة المعدّات: ${gear}`
  );
}

function createProject({
  name,
  slug,
  due = null,
  createdBy,
  threadId = null,
  templateCode = null,
  unit = null,
  units = ['production'],
  pipelineKey = null
}, store) {
  const dueDate = normalizeDueDate(due);
  const resolvedSlug = resolveProjectSlug({ name, slug }, store);

  const template = templateCode ? getProductionTemplate(templateCode) : null;
  if (slug) {
    validateSlugFormat(slug);
  }

  ensureProjectAvailable(resolvedSlug, store);

  const { unit: resolvedUnit, pipeline } = validateUnitPipeline(unit, pipelineKey);
  const unitList = Array.isArray(units)
    ? Array.from(new Set(units.filter(Boolean).map(u => u.toLowerCase())))
    : [];

  if (resolvedUnit && !unitList.includes(resolvedUnit)) {
    unitList.unshift(resolvedUnit);
  }

  const finalUnits = unitList.length > 0 ? unitList : resolvedUnit ? [resolvedUnit] : ['production'];

  const now = new Date().toISOString();
  const project = applyProjectDefaults({
    slug: resolvedSlug,
    name,
    due: dueDate,
    dueDate,
    stage: 'planning',
    threadId,
    createdAt: now,
    createdBy: createdBy || null,
    templateCode: template ? template.code : null,
    tasks: [],
    units: finalUnits,
    pipelineKey: pipeline ? pipeline.key : pipelineKey
  });

  upsertProject(project, store);
  return { project, template };
}

function resolveTemplateListForPipeline(pipeline) {
  if (!pipeline) return [];

  const stacks = [];
  if (Array.isArray(pipeline.templateKeys)) {
    stacks.push(pipeline.templateKeys);
  }

  if (Array.isArray(pipeline.defaultTaskTemplateIds)) {
    stacks.push(pipeline.defaultTaskTemplateIds);
  }

  if (Array.isArray(pipeline.defaultTemplateIds)) {
    stacks.push(pipeline.defaultTemplateIds);
  }

  if (Array.isArray(pipeline.inheritTemplatePipelineKeys)) {
    for (const key of pipeline.inheritTemplatePipelineKeys) {
      const inherited = getPipelineByKey(key);
      if (inherited) {
        stacks.push(resolveTemplateListForPipeline(inherited).map(t => t.id));
      }
    }
  }

  if (Array.isArray(pipeline.supportTemplateIds)) {
    stacks.push(pipeline.supportTemplateIds);
  }

  const seen = new Set();
  return stacks
    .flat()
    .map(id => getTaskTemplateById(id))
    .filter(Boolean)
    .filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
}

function resolveTaskDueDateFromTemplate(template, project) {
  const projectDue = project?.dueDate || project?.due || null;

  if (typeof template.dueOffsetDays === 'number' && projectDue) {
    const base = new Date(projectDue);
    if (!Number.isNaN(base.valueOf())) {
      base.setUTCDate(base.getUTCDate() + template.dueOffsetDays);
      return base.toISOString().slice(0, 10);
    }
  }

  if (projectDue) return projectDue.toString();

  if (typeof template.defaultDueDays === 'number') {
    const base = new Date();
    base.setUTCDate(base.getUTCDate() + template.defaultDueDays);
    return base.toISOString().slice(0, 10);
  }

  return null;
}

function resolveTemplateUnit(template, pipeline, fallbackUnit) {
  return (template.unit || pipeline?.unitKey || pipeline?.unit || fallbackUnit || '').toLowerCase();
}

function findDefaultOwnerForTemplate(template, pipeline, fallbackUnit, store) {
  const members = listMembers(store);
  if (!members || members.length === 0) return null;

  const allowedStates = new Set(['active', 'core', 'lead']);
  const unitKey = resolveTemplateUnit(template, pipeline, fallbackUnit);
  const func = (template.defaultOwnerFunc || template.defaultOwnerRole || '').toLowerCase();
  if (!func || !unitKey) return null;

  const match = members.find(m => {
    if (!allowedStates.has((m.state || '').toLowerCase())) return false;
    const unitMatch = Array.isArray(m.units)
      ? m.units.some(u => (u || '').toLowerCase() === unitKey)
      : false;
    const funcMatch = Array.isArray(m.functions)
      ? m.functions.some(f => (f || '').toLowerCase() === func)
      : false;
    return unitMatch && funcMatch;
  });

  if (!match) return null;
  return match.discordId || match.id || null;
}

function createProjectWithScaffold({
  title,
  unit = null,
  pipelineKey,
  dueDate,
  createdByDiscordId
}, store) {
  const { project } = createProject({
    name: title,
    due: dueDate,
    unit,
    pipelineKey,
    createdBy: createdByDiscordId
  }, store);

  const pipeline = getPipelineByKey(project.pipelineKey || pipelineKey);
  const templates = resolveTemplateListForPipeline(pipeline);

  const createdTasks = templates.map(t => {
    const ownerId = findDefaultOwnerForTemplate(t, pipeline, unit, store);
    const due = resolveTaskDueDateFromTemplate(t, project);
    const definitionOfDone = t.definitionOfDone_ar || null;

    const { task } = createTask(project.slug, {
      title: t.label_ar,
      title_ar: t.label_ar,
      description: t.description_ar || null,
      description_ar: t.description_ar || null,
      definitionOfDone: definitionOfDone,
      definitionOfDone_ar: definitionOfDone,
      unit: resolveTemplateUnit(t, pipeline, unit) || null,
      templateId: t.id,
      defaultOwnerFunc: t.defaultOwnerFunc || t.defaultOwnerRole || null,
      defaultOwnerRole: t.defaultOwnerRole || t.defaultOwnerFunc || null,
      defaultChannelKey: t.defaultChannelKey || null,
      ownerId,
      size: t.size || null,
      due
    }, store);

    return task;
  });

  const savedProject = findProject(project.slug, store);

  return { project: savedProject, tasks: createdTasks };
}

function setProjectStage(slug, stage) {
  assertStage(stage);
  const project = ensureProjectExists(slug);

  project.stage = stage;
  upsertProject(project);
  return project;
}

function removeProject(slug) {
  const project = ensureProjectExists(slug);
  deleteProject(slug);
  return project;
}

function listProjectTasks(slug, status = 'open') {
  return listTasks(slug, status);
}

module.exports = {
  ALLOWED_STAGES,
  createProject,
  setProjectStage,
  removeProject,
  listProjectTasks,
  ensureProjectExists,
  ensureProjectAvailable,
  getProductionTemplate,
  summarizeProductionTemplate,
  resolveProjectSlug,
  createProjectWithScaffold
};
