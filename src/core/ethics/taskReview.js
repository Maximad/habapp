// src/core/ethics/taskReview.js
const { getTaskById } = require('../work/tasks');
const { saveProjects } = require('../work/projects');
const { defaultStore } = require('../store');

function updateTask(taskId, updater, store = defaultStore) {
  const { projects, projectIndex, taskIndex, task } = getTaskById(taskId, store);
  const updatedTask = updater({ ...task });

  projects[projectIndex].tasks[taskIndex] = updatedTask;
  saveProjects(projects, store);

  return updatedTask;
}

function setTaskQuality(taskId, payload, store = defaultStore) {
  return updateTask(
    taskId,
    t => ({
      ...t,
      quality: {
        ...(t.quality || {}),
        score: payload?.score ?? null,
        tags: Array.isArray(payload?.tags) ? payload.tags : [],
        notes: payload?.notes || '',
        reviewerId: payload?.reviewerId || null,
        updatedAt: new Date().toISOString()
      }
    }),
    store
  );
}

function setTaskEthics(taskId, payload, store = defaultStore) {
  return updateTask(
    taskId,
    t => ({
      ...t,
      ethics: {
        ...(t.ethics || {}),
        status: payload?.status || null,
        tags: Array.isArray(payload?.tags) ? payload.tags : [],
        notes: payload?.notes || '',
        reviewerId: payload?.reviewerId || null,
        updatedAt: new Date().toISOString()
      }
    }),
    store
  );
}

module.exports = {
  setTaskQuality,
  setTaskEthics
};
