// src/core/context.js
// سياق موحّد لخدمات النواة بحيث يمكن استهلاكها من أي واجهة (Discord اليوم، واجهات أخرى لاحقاً)

const path = require('path');
const { createStore } = require('./store');
const projects = require('./work/projects');
const tasks = require('./work/tasks');
const templates = require('./work/templates');
const status = require('./people/status');

function createCoreContext(options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, '..', 'data');
  const now = options.now || (() => new Date().toISOString());
  const store = options.store || createStore({ dataDir });

  return {
    dataDir,
    store,
    now,
    projects: {
      find: slug => projects.findProject(slug, store),
      list: () => projects.listProjects(store),
      save: project => projects.upsertProject(project, store),
      remove: slug => projects.deleteProject(slug, store)
    },
    tasks: {
      create: (slug, fields) => tasks.createTask(slug, fields, store),
      complete: (slug, taskId) => tasks.completeTask(slug, taskId, store),
      remove: (slug, taskId) => tasks.deleteTask(slug, taskId, store),
      list: (slug, statusFilter) => tasks.listTasks(slug, statusFilter, store)
    },
    templates: {
      all: templates.templates,
      getByUnit: templates.getTemplatesByUnit,
      getById: templates.getTemplateById
    },
    status: {
      info: status.getStatusInfoArabic,
      rewards: status.getStatusRewardsArabic
    }
  };
}

module.exports = {
  createCoreContext
};
