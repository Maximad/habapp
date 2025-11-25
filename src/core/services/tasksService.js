const {
  createTask: createStoredTask,
  completeTask: completeStoredTask,
  deleteTask: deleteStoredTask,
  listTasks,
  createTasksFromTemplates: createTasksFromTemplatesInternal,
  setTaskQuality,
  setTaskEthics,
  getTaskById
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

function setTaskQualityReview(taskId, payload) {
  return setTaskQuality(taskId, payload);
}

function setTaskEthicsReview(taskId, payload) {
  return setTaskEthics(taskId, payload);
}

function getTask(taskId) {
  return getTaskById(taskId);
}

module.exports = {
  addTaskToProject,
  completeTask,
  removeTask,
  listProjectTasks,
  createTasksFromTemplates,
  setTaskQualityReview,
  setTaskEthicsReview,
  getTask
};
