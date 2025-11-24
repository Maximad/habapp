// src/core/tasks.js
const { ensureProject, saveProjects } = require('./projects');

function getNextTaskId(project) {
  if (!Array.isArray(project.tasks) || project.tasks.length === 0) return 1;
  return (
    project.tasks.reduce(
      (max, t) => (t && typeof t.id === 'number' && t.id > max ? t.id : max),
      0
    ) + 1
  );
}

function createTask(slug, fields) {
  const { projects, project, index } = ensureProject(slug);

  if (!Array.isArray(project.tasks)) {
    project.tasks = [];
  }

  const id = getNextTaskId(project);
  const now = new Date().toISOString();

  const task = {
    id,
    title: fields.title,
    unit: fields.unit || null,
    ownerId: fields.ownerId || null,
    due: fields.due || null,
    status: 'open',
    createdAt: now,
    completedAt: null,
    templateId: fields.templateId || null
  };

  project.tasks.push(task);
  projects[index] = project;
  saveProjects(projects);

  return { project, task };
}

function completeTask(slug, taskId) {
  const { projects, project, index } = ensureProject(slug);
  if (!Array.isArray(project.tasks)) {
    throw new Error('No tasks on this project');
  }

  const tid = Number(taskId);
  const task = project.tasks.find(t => t.id === tid);
  if (!task) throw new Error('Task not found');

  task.status = 'done';
  task.completedAt = new Date().toISOString();

  projects[index] = project;
  saveProjects(projects);

  return { project, task };
}

function deleteTask(slug, taskId) {
  const { projects, project, index } = ensureProject(slug);
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
  saveProjects(projects);

  return true;
}

function listTasks(slug, status) {
  const { project } = ensureProject(slug);
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (!status || status === 'all') return tasks;
  return tasks.filter(t => (t.status || 'open') === status);
}

module.exports = {
  createTask,
  completeTask,
  deleteTask,
  listTasks
};
