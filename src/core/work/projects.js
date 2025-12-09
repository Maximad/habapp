// src/core/work/projects.js
const { defaultStore } = require('../store');

const PROJECTS_KEY = 'projects';

function getStore(store = defaultStore) {
  return store || defaultStore;
}

function applyTaskDefaults(task) {
  if (!task) return task;
  const reminders = task.reminders && typeof task.reminders === 'object' ? task.reminders : {};
  return {
    ...task,
    reminders: {
      mainSentAt: reminders.mainSentAt || null,
      handoverSentAt: reminders.handoverSentAt || null
    }
  };
}

function applyProjectDefaults(project) {
  if (!project) return project;
  const units = Array.isArray(project.units) && project.units.length > 0 ? project.units : ['production'];
  const pipelineKey = typeof project.pipelineKey === 'string' && project.pipelineKey.length > 0 ? project.pipelineKey : null;
  const tasks = Array.isArray(project.tasks) ? project.tasks.map(applyTaskDefaults) : project.tasks;
  const metadata = project.metadata && typeof project.metadata === 'object' ? project.metadata : {};
  const driveFolderUrl = project.driveFolderUrl || metadata.driveFolderUrl || null;
  const mainDocUrl = project.mainDocUrl || metadata.mainDocUrl || null;
  const docUrl = project.docUrl || metadata.docUrl || mainDocUrl || null;
  const normalizedMetadata = {
    ...metadata,
    driveFolderUrl,
    mainDocUrl,
    docUrl
  };
  const shootDate = project.shootDate || null;
  return {
    ...project,
    units,
    pipelineKey,
    tasks,
    driveFolderUrl,
    mainDocUrl,
    docUrl,
    shootDate,
    metadata: normalizedMetadata
  };
}

function loadProjects(store = defaultStore) {
  const raw = getStore(store).read(PROJECTS_KEY, []);
  return Array.isArray(raw) ? raw.map(applyProjectDefaults) : [];
}

function saveProjects(list, store = defaultStore) {
  const normalized = Array.isArray(list) ? list.map(applyProjectDefaults) : [];
  getStore(store).write(PROJECTS_KEY, normalized);
}

function findProject(slug, store = defaultStore) {
  const projects = loadProjects(store);
  const s = String(slug || '').toLowerCase();
  return projects.find(p => (p.slug || '').toLowerCase() === s) || null;
}

function upsertProject(project, store = defaultStore) {
  const projects = loadProjects(store);
  const normalized = applyProjectDefaults(project);
  const s = String(normalized.slug || '').toLowerCase();
  const idx = projects.findIndex(p => (p.slug || '').toLowerCase() === s);
  if (idx >= 0) {
    projects[idx] = normalized;
  } else {
    projects.push(normalized);
  }
  saveProjects(projects, store);
  return normalized;
}

function deleteProject(slug, store = defaultStore) {
  const projects = loadProjects(store);
  const s = String(slug || '').toLowerCase();
  const filtered = projects.filter(p => (p.slug || '').toLowerCase() !== s);
  const changed = filtered.length !== projects.length;
  if (changed) saveProjects(filtered, store);
  return changed;
}

function listProjects(store = defaultStore) {
  return loadProjects(store);
}

function ensureProject(slug, store = defaultStore) {
  const projects = loadProjects(store);
  const s = String(slug || '').toLowerCase();
  const idx = projects.findIndex(p => (p.slug || '').toLowerCase() === s);
  if (idx === -1) {
    throw new Error('Project not found');
  }
  return { projects, project: projects[idx], index: idx };
}

module.exports = {
  loadProjects,
  saveProjects,
  findProject,
  upsertProject,
  deleteProject,
  listProjects,
  ensureProject,
  applyProjectDefaults
};
