// src/core/reminders/reminderService.js
const { loadProjects, saveProjects } = require('../work/projects');
const { getTaskById } = require('../work/tasks');
const { defaultStore } = require('../store');
const { getReminderWindowsForTask } = require('./reminderRules');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function normalizeReminders(reminders) {
  const data = reminders && typeof reminders === 'object' ? reminders : {};
  return {
    mainSentAt: data.mainSentAt || null,
    handoverSentAt: data.handoverSentAt || null
  };
}

function normalizeTask(task) {
  if (!task) return null;
  return {
    ...task,
    reminders: normalizeReminders(task.reminders)
  };
}

function parseDueDate(due) {
  if (!due) return null;
  const match = String(due)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(date.valueOf())) return null;
  return date;
}

function daysUntilDue(dueDate, now) {
  return (dueDate.getTime() - now.getTime()) / MS_PER_DAY;
}

function getDueReminders(now = new Date(), store = defaultStore) {
  const baseNow = now instanceof Date && !Number.isNaN(now.valueOf()) ? now : new Date();
  const projects = loadProjects(store);
  const due = [];

  for (const project of projects) {
    const stage = String(project.stage || project.status || '').toLowerCase();
    const isArchived = project.archived === true || stage === 'archived';
    if (isArchived) continue;

    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    for (const rawTask of tasks) {
      const task = normalizeTask(rawTask);
      if (!task) continue;
      if ((task.status || 'open') !== 'open') continue;

      const dueDate = parseDueDate(task.due || task.dueDate);
      if (!dueDate) continue;

      const diff = daysUntilDue(dueDate, baseNow);
      if (diff < 0) continue;

      const windows = getReminderWindowsForTask(task);
      const reminders = task.reminders || normalizeReminders();

      if (diff <= windows.mainDays && reminders.mainSentAt == null) {
        due.push({ task, project, type: 'main', projectSlug: project.slug || project.name || null });
      }

      if (diff <= windows.handoverDays && reminders.handoverSentAt == null) {
        due.push({ task, project, type: 'handover', projectSlug: project.slug || project.name || null });
      }
    }
  }

  return due;
}

function markReminderSent(taskId, type, date = new Date(), store = defaultStore) {
  const validType = type === 'main' || type === 'handover';
  if (!validType) {
    throw new Error('INVALID_REMINDER_TYPE');
  }

  const { projects, projectIndex, taskIndex, task, project } = getTaskById(taskId, store);
  const normalizedTask = normalizeTask(task);
  const timestamp = date instanceof Date && !Number.isNaN(date.valueOf())
    ? date.toISOString()
    : new Date().toISOString();

  normalizedTask.reminders = normalizeReminders(normalizedTask.reminders);
  if (type === 'main') {
    normalizedTask.reminders.mainSentAt = timestamp;
  } else {
    normalizedTask.reminders.handoverSentAt = timestamp;
  }

  projects[projectIndex] = {
    ...project,
    tasks: project.tasks.map((t, idx) => (idx === taskIndex ? normalizedTask : normalizeTask(t)))
  };

  saveProjects(projects, store);
  return normalizedTask;
}

module.exports = { getDueReminders, markReminderSent, parseDueDate, normalizeReminders, normalizeTask };
