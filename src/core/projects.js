// src/core/projects.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function loadProjects() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveProjects(list) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function findProject(slug) {
  const projects = loadProjects();
  const s = String(slug || '').toLowerCase();
  return projects.find(p => (p.slug || '').toLowerCase() === s) || null;
}

function upsertProject(project) {
  const projects = loadProjects();
  const s = String(project.slug || '').toLowerCase();
  const idx = projects.findIndex(p => (p.slug || '').toLowerCase() === s);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
  return project;
}

function deleteProject(slug) {
  const projects = loadProjects();
  const s = String(slug || '').toLowerCase();
  const filtered = projects.filter(p => (p.slug || '').toLowerCase() !== s);
  const changed = filtered.length !== projects.length;
  if (changed) saveProjects(filtered);
  return changed;
}

function listProjects() {
  return loadProjects();
}

function ensureProject(slug) {
  const projects = loadProjects();
  const s = String(slug || '').toLowerCase();
  const idx = projects.findIndex(p => (p.slug || '').toLowerCase() === s);
  if (idx === -1) {
    throw new Error('Project not found');
  }
  return { projects, project: projects[idx], index: idx };
}

module.exports = {
  DATA_FILE,
  loadProjects,
  saveProjects,
  findProject,
  upsertProject,
  deleteProject,
  listProjects,
  ensureProject
};
