const { loadProjects } = require('./projects');
const { defaultStore } = require('../store');

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

function listTasksForMemberDueSoon({ memberDiscordId, days = 3 } = {}, store = defaultStore, now = new Date()) {
  if (!memberDiscordId) return [];
  const memberId = String(memberDiscordId);
  const numericDays = Number.isFinite(days) ? Number(days) : 3;
  const rangeDays = numericDays > 0 ? numericDays : 3;

  const base = now instanceof Date && !Number.isNaN(now.valueOf()) ? new Date(now) : new Date();
  const cutoff = new Date(base);
  cutoff.setUTCHours(23, 59, 59, 999);
  cutoff.setUTCDate(cutoff.getUTCDate() + rangeDays);

  const projects = loadProjects(store);
  const matches = [];

  for (const project of projects) {
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];
    for (const task of tasks) {
      if (!task) continue;
    const assignee = task.assignedToDiscordId || task.ownerId;
    if (String(assignee) !== memberId) continue;
      if ((task.status || 'open') === 'done') continue;

      const dueDate = parseDueDate(task.due || task.dueDate);
      if (!dueDate) continue;

      if (dueDate <= cutoff) {
        matches.push({ project, task });
      }
    }
  }

  return matches;
}

module.exports = { listTasksForMemberDueSoon };
