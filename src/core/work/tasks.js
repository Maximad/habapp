// src/core/work/tasks.js
const { ensureProject, saveProjects, loadProjects } = require('./projects');
const { getTaskTemplateById } = require('./templates/task-templates');
const { getPipelineByKey } = require('./units');
const { defaultStore } = require('../store');

function getNextTaskId(project) {
  if (!Array.isArray(project.tasks) || project.tasks.length === 0) return 1;
  return (
    project.tasks.reduce(
      (max, t) => (t && typeof t.id === 'number' && t.id > max ? t.id : max),
      0
    ) + 1
  );
}

function addTaskToProject(project, fields) {
  if (!Array.isArray(project.tasks)) {
    project.tasks = [];
  }

  const id = getNextTaskId(project);
  const now = new Date().toISOString();

  const task = {
    id,
    title: fields.title,
    title_ar: fields.title_ar || null,
    description: fields.description || null,
    description_ar: fields.description_ar || null,
    definitionOfDone: fields.definitionOfDone || null,
    definitionOfDone_ar: fields.definitionOfDone_ar || null,
    unit: fields.unit || null,
    ownerId: fields.ownerId || null,
    defaultOwnerFunc: fields.defaultOwnerFunc || fields.defaultOwnerRole || null,
    defaultOwnerRole: fields.defaultOwnerRole || fields.defaultOwnerFunc || null,
    defaultChannelKey: fields.defaultChannelKey || null,
    size: fields.size || null,
    due: fields.due || null,
    reminders: {
      mainSentAt: null,
      handoverSentAt: null
    },
    status: 'open',
    createdAt: now,
    completedAt: null,
    templateId: fields.templateId || null,
    quality: fields.quality || null,
    ethics: fields.ethics || null
  };

  project.tasks.push(task);
  return task;
}

function createTask(slug, fields, store) {
  const { projects, project, index } = ensureProject(slug, store);

  const task = addTaskToProject(project, fields);
  projects[index] = project;
  saveProjects(projects, store);

  return { project, task };
}

function completeTask(slug, taskId, store) {
  const { projects, project, index } = ensureProject(slug, store);
  if (!Array.isArray(project.tasks)) {
    throw new Error('No tasks on this project');
  }

  const tid = Number(taskId);
  const task = project.tasks.find(t => t.id === tid);
  if (!task) throw new Error('Task not found');

  task.status = 'done';
  task.completedAt = new Date().toISOString();

  projects[index] = project;
  saveProjects(projects, store);

  return { project, task };
}

function deleteTask(slug, taskId, store) {
  const { projects, project, index } = ensureProject(slug, store);
  if (!Array.isArray(project.tasks)) {
    throw new Error('No tasks on this project');
  }

  const tid = Number(taskId);
  const before = project.tasks.length;
  project.tasks = project.tasks.filter(t => t.id !== tid);

  if (project.tasks.length === before) {
    throw new Error('Task not found');
  }

  projects[index] = project;
  saveProjects(projects, store);

  return true;
}

function getTaskById(taskId, store = defaultStore) {
  const projects = loadProjects(store);
  const tid = Number(taskId);
  for (let pIndex = 0; pIndex < projects.length; pIndex += 1) {
    const project = projects[pIndex];
    if (!Array.isArray(project.tasks)) continue;
    const tIndex = project.tasks.findIndex(t => t && Number(t.id) === tid);
    if (tIndex !== -1) {
      return { project, task: project.tasks[tIndex], projects, projectIndex: pIndex, taskIndex: tIndex };
    }
  }
  throw new Error('Task not found');
}

function saveTask(task, store = defaultStore) {
  if (!task || typeof task.id === 'undefined') {
    throw new Error('Task not found');
  }

  const { projects, projectIndex, taskIndex, project } = getTaskById(task.id, store);
  const nextTask = { ...project.tasks[taskIndex], ...task };

  projects[projectIndex] = {
    ...project,
    tasks: project.tasks.map((t, idx) => (idx === taskIndex ? nextTask : t))
  };

  saveProjects(projects, store);
  return nextTask;
}

function listTasks(slug, status, store) {
  const { project } = ensureProject(slug, store);
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (!status || status === 'all') return tasks;
  return tasks.filter(t => (t.status || 'open') === status);
}

function resolveTemplatesForPipeline(effectivePipelineKey) {
  if (!effectivePipelineKey) return [];
  const pipeline = getPipelineByKey(effectivePipelineKey);
  if (!pipeline) return [];

  const stacks = [];
  const defaults = pipeline.defaultTaskTemplateIds || pipeline.defaultTemplateIds;
  if (Array.isArray(defaults)) {
    stacks.push(defaults);
  }

  if (Array.isArray(pipeline.inheritTemplatePipelineKeys)) {
    for (const key of pipeline.inheritTemplatePipelineKeys) {
      const inherited = resolveTemplatesForPipeline(key);
      stacks.push(inherited.map(t => t.id));
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

function resolveTaskDueDate(template, project) {
  if (typeof template.defaultDueDays === 'number') {
    const base = new Date();
    base.setDate(base.getDate() + template.defaultDueDays);
    return base.toISOString().slice(0, 10);
  }

  if (project?.dueDate || project?.due) {
    return (project.dueDate || project.due).toString();
  }

  return null;
}

async function createTasksFromTemplates({ projectSlug, pipelineKey }, store) {
  const { projects, project, index } = ensureProject(projectSlug, store);
  const effectivePipelineKey = pipelineKey || project.pipelineKey || null;
  const templates = resolveTemplatesForPipeline(effectivePipelineKey);

  if (!templates || templates.length === 0) {
    return [];
  }

  const existingTemplateIds = new Set(
    Array.isArray(project.tasks)
      ? project.tasks.map(t => t && t.templateId).filter(Boolean)
      : []
  );

  const created = templates
    .filter(t => {
      if (existingTemplateIds.has(t.id)) return false;
      existingTemplateIds.add(t.id);
      return true;
    })
    .map(t =>
      addTaskToProject(project, {
        title: t.label_ar,
        title_ar: t.label_ar,
        description: t.description_ar || null,
        description_ar: t.description_ar || null,
        definitionOfDone: t.definitionOfDone_ar || null,
        definitionOfDone_ar: t.definitionOfDone_ar || null,
        unit: t.unit,
        templateId: t.id,
        defaultOwnerFunc: t.defaultOwnerFunc || t.defaultOwnerRole || null,
        defaultOwnerRole: t.defaultOwnerRole || t.defaultOwnerFunc || null,
        defaultChannelKey: t.defaultChannelKey || null,
        size: t.size || null,
        due: resolveTaskDueDate(t, project)
      })
    );

  projects[index] = project;
  saveProjects(projects, store);

  return created;
}

function canMemberTakeTask(task, memberProfile) {
  const units = memberProfile.units || [];
  if (task.unit && !units.includes(task.unit)) {
    return false;
  }
  return true;
}

function claimTask(store, taskId, memberId, memberProfile) {
  let task;
  try {
    const found = store.getTaskById(taskId);
    task = found && found.task ? found.task : found;
  } catch (err) {
    const error = new Error('TASK_NOT_FOUND');
    error.code = 'TASK_NOT_FOUND';
    throw error;
  }

  if (!task) {
    const error = new Error('TASK_NOT_FOUND');
    error.code = 'TASK_NOT_FOUND';
    throw error;
  }

  if (task.ownerId && task.ownerId !== memberId) {
    const error = new Error('TASK_ALREADY_TAKEN');
    error.code = 'TASK_ALREADY_TAKEN';
    throw error;
  }

  if (!canMemberTakeTask(task, memberProfile || {})) {
    const error = new Error('TASK_NOT_ELIGIBLE');
    error.code = 'TASK_NOT_ELIGIBLE';
    throw error;
  }

  task.ownerId = memberId;
  if (typeof store.saveTask === 'function') {
    store.saveTask(task);
  }

  return task;
}

module.exports = {
  createTask,
  completeTask,
  deleteTask,
  listTasks,
  getTaskById,
  saveTask,
  createTasksFromTemplates,
  canMemberTakeTask,
  claimTask
};
