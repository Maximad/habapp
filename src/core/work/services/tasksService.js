const {
  createTask: createStoredTask,
  completeTask: completeStoredTask,
  deleteTask: deleteStoredTask,
  listTasks,
  createTasksFromTemplates: createTasksFromTemplatesInternal
} = require('../tasks');

function addTaskToProject(slug, fields) {
  return createStoredTask(slug, fields);
}

function completeTask(slug, taskId) {
  return completeStoredTask(slug, taskId);
}

function removeTask(slug, taskId) {
  return deleteStoredTask(slug, taskId);
}

function listProjectTasks(slug, status = 'open') {
  return listTasks(slug, status);
}

async function createTasksFromTemplates({ projectSlug, pipelineKey }) {
  return createTasksFromTemplatesInternal({ projectSlug, pipelineKey });
}

module.exports = {
  addTaskToProject,
  completeTask,
  removeTask,
  listProjectTasks,
  createTasksFromTemplates
};
