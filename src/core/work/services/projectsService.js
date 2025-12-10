const {
  findProject,
  upsertProject,
  deleteProject,
  applyProjectDefaults,
  listProjects
} = require('../projects');
const { listTasks, createTask, isTaskClaimable } = require('../tasks');
const { getProductionTemplateByCode } = require('../templates/templates.production');
const { getPipelineByKey, getUnitByKey } = require('../units');
const { getTaskTemplateById } = require('../templates/task-templates');
const { pickTaskOwner } = require('../../people/memberAssignment');
const { listMembers } = require('../../people/memberStore');
const { resolveSlug, validateSlugFormat } = require('../../utils/slug');
const { defaultStore } = require('../../store');
const { normalizeReminders } = require('../../reminders/reminderService');

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

function scoreProjectMatch(project, query) {
  if (!project || !query) return 0;
  const slug = String(project.slug || '').toLowerCase();
  const name = String(project.name || project.title || '').toLowerCase();
  const q = String(query || '').toLowerCase();

  if (!q) return 0;

  if (slug === q) return 120;
  if (name === q) return 115;
  if (slug.startsWith(q)) return 105 - Math.min(50, slug.length - q.length);
  if (name.startsWith(q)) return 100 - Math.min(40, name.length - q.length);
  if (slug.includes(q)) return 90 - Math.min(30, slug.indexOf(q));
  if (name.includes(q)) return 85 - Math.min(25, name.indexOf(q));
  return 0;
}

function searchProjectsByQuery(query, store = defaultStore) {
  if (!query || !String(query).trim()) return [];
  const projects = listProjects(store);
  const matches = projects
    .map(project => ({ project, score: scoreProjectMatch(project, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aDue = a.project?.dueDate || a.project?.due || '';
      const bDue = b.project?.dueDate || b.project?.due || '';
      return String(aDue).localeCompare(String(bDue));
    });

  return matches;
}

function resolveProjectByQuery(query, store = defaultStore) {
  const matches = searchProjectsByQuery(query, store);
  if (!matches.length) return { project: null, matches: [] };

  const top = matches[0];
  const second = matches[1];
  const ambiguous = second && second.score >= top.score - 5;

  return { project: ambiguous ? null : top.project, matches };
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
  pipelineKey = null,
  shootDate = null
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
    unit: resolvedUnit,
    units: finalUnits,
    pipelineKey: pipeline ? pipeline.key : pipelineKey,
    shootDate
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
  const shootDate = project?.shootDate || null;

  const metaOffset =
    template?.meta && typeof template.meta.offsetDays === 'number'
      ? template.meta.offsetDays
      : null;
  if (projectDue && metaOffset !== null) {
    const base = new Date(projectDue);
    if (!Number.isNaN(base.valueOf())) {
      base.setUTCDate(base.getUTCDate() + metaOffset);
      return base.toISOString().slice(0, 10);
    }
  }

  const offset =
    (template.deadlineOffset && typeof template.deadlineOffset.value === 'number'
      ? template.deadlineOffset.value
      : null) ??
    (typeof template.dueOffsetDays === 'number' ? template.dueOffsetDays : null) ??
    (typeof template.defaultDueDays === 'number' ? template.defaultDueDays : null);

  const dueFromRaw = template.dueFrom || template.deadlineOffset?.from || null;
  const dueFrom = dueFromRaw === 'shoot_date' || dueFromRaw === 'shootDate' ? 'shoot_date' : 'project_due';

  const baseDateString =
    dueFrom === 'shoot_date'
      ? shootDate || projectDue || null
      : projectDue || null;

  if (baseDateString) {
    const base = new Date(baseDateString);
    if (!Number.isNaN(base.valueOf())) {
      const offsetValue = typeof offset === 'number' ? offset : 0;
      base.setUTCDate(base.getUTCDate() + offsetValue);
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

function normalizeTaskForView(task) {
  if (!task) return null;
  return {
    ...task,
    reminders: normalizeReminders(task.reminders)
  };
}

function sortTasksByDue(tasks = []) {
  const parsed = task => {
    const raw = task?.due || task?.dueDate || null;
    if (!raw) return null;
    const date = new Date(raw);
    return Number.isNaN(date.valueOf()) ? null : date;
  };

  return [...tasks].sort((a, b) => {
    const aDate = parsed(a);
    const bDate = parsed(b);

    if (aDate && bDate) return aDate - bDate;
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return (a.id || 0) - (b.id || 0);
  });
}

function normalizeProjectUnit(project) {
  if (!project) return null;
  const explicitUnit = project.unit || null;
  if (explicitUnit) return String(explicitUnit).toLowerCase();
  if (Array.isArray(project.units) && project.units.length > 0) {
    return String(project.units[0]).toLowerCase();
  }
  return null;
}

function computeTaskCounts(tasks = []) {
  return tasks.reduce(
    (acc, task) => {
      const status = (task.status || 'open').toLowerCase();
      if (status === 'done') {
        acc.done += 1;
      } else {
        acc.open += 1;
      }
      acc.total += 1;
      return acc;
    },
    { open: 0, done: 0, total: 0 },
  );
}

function buildProjectSnapshot(slug, store = defaultStore) {
  const project = findProject(slug, store);
  if (!project) {
    const err = new Error('PROJECT_NOT_FOUND');
    err.code = 'PROJECT_NOT_FOUND';
    throw err;
  }

  const pipeline = project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
  const unitKey = project.unit || (Array.isArray(project.units) ? project.units[0] : null) || null;
  const unit = unitKey ? getUnitByKey(unitKey) : null;
  const tasks = Array.isArray(project.tasks)
    ? project.tasks.map(t => normalizeTaskForView(t)).filter(Boolean)
    : [];

  const openTasks = sortTasksByDue(tasks.filter(t => (t.status || 'open') === 'open'));
  const doneTasks = sortTasksByDue(tasks.filter(t => (t.status || 'open') === 'done'));

  return { project, pipeline, unit, tasks, openTasks, doneTasks };
}

function listProjectsForView(options = {}, store = defaultStore) {
  const { unitKey = null, status = 'active' } = options || {};

  const normalizedUnit = unitKey ? String(unitKey).toLowerCase() : null;
  const normalizedStatus = status ? String(status).toLowerCase() : 'active';

  const projects = listProjects(store);

  const filtered = projects.filter(project => {
    const projectUnit = normalizeProjectUnit(project);
    if (normalizedUnit && projectUnit !== normalizedUnit) return false;

    const stage = String(project.stage || project.status || '').toLowerCase();
    const isArchived = project.archived === true || stage === 'archived';

    if (normalizedStatus === 'archived') return isArchived;
    if (normalizedStatus === 'active') return !isArchived;
    return true;
  });

  const parseDate = raw => {
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.valueOf()) ? null : d;
  };

  const sorted = [...filtered].sort((a, b) => {
    const aDue = parseDate(a.dueDate || a.due);
    const bDue = parseDate(b.dueDate || b.due);

    if (aDue && bDue) return aDue - bDue;
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    const aCreated = parseDate(a.createdAt);
    const bCreated = parseDate(b.createdAt);
    if (aCreated && bCreated) return aCreated - bCreated;
    if (aCreated && !bCreated) return -1;
    if (!aCreated && bCreated) return 1;

    const aTitle = (a.name || a.title || a.slug || '').toLowerCase();
    const bTitle = (b.name || b.title || b.slug || '').toLowerCase();
    return aTitle.localeCompare(bTitle);
  });

  return sorted.map(project => {
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    const unit = normalizeProjectUnit(project);
    const pipelineKey = project.pipelineKey || null;
    const counts = computeTaskCounts(tasks);
    const stage = project.stage || project.status || null;

    return {
      slug: project.slug,
      title: project.name || project.title || project.slug,
      titleAr: project.title_ar || project.name_ar || null,
      unitKey: unit,
      pipelineKey,
      dueDate: project.dueDate || project.due || null,
      stage,
      stageNormalized: stage ? String(stage).toLowerCase() : null,
      taskCounts: counts,
    };
  });
}

function listClaimableTasksForProject(
  { projectSlug, size = null, status = 'open' } = {},
  store = defaultStore,
) {
  if (!projectSlug) {
    const err = new Error('PROJECT_NOT_FOUND');
    err.code = 'PROJECT_NOT_FOUND';
    throw err;
  }

  const project = findProject(projectSlug, store);
  if (!project) {
    const err = new Error('PROJECT_NOT_FOUND');
    err.code = 'PROJECT_NOT_FOUND';
    throw err;
  }

  const normalizedSize = size ? String(size).toUpperCase() : null;
  const normalizedStatus = status ? String(status).toLowerCase() : 'open';

  const tasks = Array.isArray(project.tasks) ? project.tasks : [];

  return tasks
    .filter(task => {
      const taskStatus = (task.status || 'open').toLowerCase();
      if (normalizedStatus && normalizedStatus !== 'all' && taskStatus !== normalizedStatus) {
        return false;
      }
      if (taskStatus !== 'open') return false;
      if (task.ownerId) return false;
      if (!isTaskClaimable(task)) return false;
      if (normalizedSize && String(task.size || '').toUpperCase() !== normalizedSize) return false;
      return true;
    })
    .map(task => {
      const normalized = normalizeTaskForView(task);
      if (!normalized) return null;
      return { ...normalized, claimable: true };
    })
    .filter(Boolean);
}

function createProjectWithScaffold({
  title,
  unit = null,
  pipelineKey,
  dueDate,
  createdByDiscordId,
  shootDate = null
}, store) {
  const { project } = createProject({
    name: title,
    due: dueDate,
    unit,
    pipelineKey,
    createdBy: createdByDiscordId,
    shootDate
  }, store);

  const pipeline = getPipelineByKey(project.pipelineKey || pipelineKey);
  const templates = resolveTemplateListForPipeline(pipeline);
  const members = listMembers(store);

  const createdTasks = templates.map(t => {
    const templateUnit = resolveTemplateUnit(t, pipeline, unit || (project.units && project.units[0]));
    const skipOwnerAssignment =
      (pipeline?.key === 'media.article_short' || project.pipelineKey === 'media.article_short') &&
      t.pipelineKey === 'media.article_short';
    const ownerId = skipOwnerAssignment
      ? null
      : pickTaskOwner(
        members,
        templateUnit,
        t.defaultOwnerFunc || t.defaultOwnerRole || null
      );
    let due = resolveTaskDueDateFromTemplate(t, project);
    const definitionOfDone = t.definitionOfDone_ar || null;

    const projectDueDate = project?.dueDate || project?.due || null;
    if ((pipeline?.key === 'media.article_short' || project.pipelineKey === 'media.article_short') && projectDueDate) {
      const baseDate = new Date(projectDueDate);
      let dueDateObj = due ? new Date(due) : null;
      const isArchive = t.functionKey === 'media_archive';
      if (!Number.isNaN(baseDate.valueOf())) {
        const clampTarget = isArchive ? null : baseDate;
        if (clampTarget && dueDateObj && !Number.isNaN(dueDateObj.valueOf()) && dueDateObj > clampTarget) {
          const safeDate = new Date(clampTarget);
          dueDateObj.setTime(safeDate.getTime());
        }
        if (!isArchive && !dueDateObj) {
          dueDateObj = new Date(baseDate);
        }
        if (t.functionKey === 'media_web' && (!dueDateObj || dueDateObj > baseDate)) {
          dueDateObj = new Date(baseDate);
        }
        if (dueDateObj && !Number.isNaN(dueDateObj.valueOf())) {
          due = dueDateObj.toISOString().slice(0, 10);
        }
      }
    }

    const { task } = createTask(project.slug, {
      title: t.label_ar,
      title_ar: t.label_ar,
      description: t.description_ar || null,
      description_ar: t.description_ar || null,
      definitionOfDone: definitionOfDone,
      definitionOfDone_ar: definitionOfDone,
      unit: templateUnit || null,
      templateId: t.id,
      defaultOwnerFunc: t.defaultOwnerFunc || t.defaultOwnerRole || null,
      defaultOwnerRole: t.defaultOwnerRole || t.defaultOwnerFunc || null,
      defaultChannelKey: t.defaultChannelKey || null,
      ownerId: ownerId || null,
      ownerFunction: t.ownerFunction || null,
      functionKey: t.functionKey || t.ownerFunction || null,
      stage: t.stage || null,
      dueFrom: t.dueFrom || null,
      size: t.size || null,
      claimable: typeof t.claimable === 'boolean' ? t.claimable : null,
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

function listProjectTasksForView({ projectSlug, status = 'all' } = {}, store = defaultStore) {
  if (!projectSlug) {
    const err = new Error('PROJECT_NOT_FOUND');
    err.code = 'PROJECT_NOT_FOUND';
    throw err;
  }

  const project = findProject(projectSlug, store);
  if (!project) {
    const err = new Error('PROJECT_NOT_FOUND');
    err.code = 'PROJECT_NOT_FOUND';
    throw err;
  }

  const tasks = listTasks(projectSlug, status, store)
    .map(t => normalizeTaskForView(t))
    .filter(Boolean);

  const grouped = {
    open: sortTasksByDue(tasks.filter(t => (t.status || 'open') === 'open')),
    done: sortTasksByDue(tasks.filter(t => (t.status || 'open') === 'done'))
  };

  const pipeline = project.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
  const unitKey = project.unit || (Array.isArray(project.units) ? project.units[0] : null) || null;
  const unit = unitKey ? getUnitByKey(unitKey) : null;

  return { project, pipeline, unit, tasks: grouped, status };
}

module.exports = {
  ALLOWED_STAGES,
  createProject,
  setProjectStage,
  removeProject,
  listProjectTasks,
  listProjectTasksForView,
  resolveProjectByQuery,
  searchProjectsByQuery,
  buildProjectSnapshot,
  ensureProjectExists,
  ensureProjectAvailable,
  getProductionTemplate,
  summarizeProductionTemplate,
  resolveProjectSlug,
  createProjectWithScaffold,
  validateUnitPipeline,
  listProjectsForView,
  listClaimableTasksForProject,
  resolveTaskDueDateFromTemplate
};
