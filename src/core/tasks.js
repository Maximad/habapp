// src/core/tasks.js
const { ensureProject, saveProjects } = require('./projects');
const { listTaskTemplatesByPipeline } = require('./templates/task-templates');

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
    unit: fields.unit || null,
    ownerId: fields.ownerId || null,
    defaultOwnerRole: fields.defaultOwnerRole || null,
    defaultChannelKey: fields.defaultChannelKey || null,
    size: fields.size || null,
    due: fields.due || null,
    status: 'open',
    createdAt: now,
    completedAt: null,
    templateId: fields.templateId || null
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

function listTasks(slug, status, store) {
  const { project } = ensureProject(slug, store);
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (!status || status === 'all') return tasks;
  return tasks.filter(t => (t.status || 'open') === status);
}

function resolveTemplatesForPipeline(effectivePipelineKey) {
  const stacks = [];

  if (effectivePipelineKey) {
    const isProduction = effectivePipelineKey.startsWith('production.');
    const isProductionVideo = effectivePipelineKey.startsWith('production.video_');
    const isMedia = effectivePipelineKey.startsWith('media.');

    stacks.push(listTaskTemplatesByPipeline(effectivePipelineKey));

    if (isProductionVideo && effectivePipelineKey !== 'production.video_basic') {
      stacks.push(listTaskTemplatesByPipeline('production.video_basic'));
    }

    if (isProduction) {
      stacks.push(listTaskTemplatesByPipeline('production.support'));
    }

    if (isMedia) {
      stacks.push(listTaskTemplatesByPipeline('media.support'));
    }
  }

  const seen = new Set();
  return stacks
    .flat()
    .filter(Boolean)
    .filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
}

async function createTasksFromTemplates({ projectSlug, pipelineKey }, store) {
  const { projects, project, index } = ensureProject(projectSlug, store);
  const effectivePipelineKey = pipelineKey || project.pipelineKey || null;
  const templates = resolveTemplatesForPipeline(effectivePipelineKey);

  if (!templates || templates.length === 0) {
    return [];
  }

  const created = templates.map(t =>
    addTaskToProject(project, {
      title: t.label_ar,
      title_ar: t.label_ar,
      unit: t.unit,
      templateId: t.id,
      defaultOwnerRole: t.defaultOwnerRole || null,
      defaultChannelKey: t.defaultChannelKey || null,
      size: t.size || null
    })
  );

  projects[index] = project;
  saveProjects(projects, store);

  return created;
}

module.exports = {
  createTask,
  completeTask,
  deleteTask,
  listTasks,
  createTasksFromTemplates
};
