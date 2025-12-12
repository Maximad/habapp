const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { saveProjects } = require('../../src/core/work/projects');
const { getDueReminders, markReminderSent } = require('../../src/core/reminders/reminderService');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-reminders-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('getDueReminders finds main and handover windows', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const project = {
    slug: 'demo',
    title: 'مشروع',
    tasks: [
      { id: 1, title: 'مهمة رئيسية', size: 'M', due: '2024-01-11', status: 'open' },
      { id: 2, title: 'مهمة مساعدة', size: 'L', due: '2024-01-20', status: 'open' },
      { id: 3, title: 'تم إرسال التذكير', size: 'S', due: '2024-01-10', status: 'open', reminders: { mainSentAt: '2024-01-09' } },
      { id: 4, title: 'منتهية', size: 'M', due: '2024-01-12', status: 'done' }
    ]
  };

  saveProjects([project], store);

  const now = new Date('2024-01-10T00:00:00Z');
  const due = getDueReminders(now, store);

  const forTask1 = due.filter(r => r.task.id === 1).map(r => r.type);
  const handoverTask = due.find(r => r.task.id === 3);
  assert.strictEqual(due.length, 3);
  assert.ok(forTask1.includes('main'));
  assert.ok(forTask1.includes('handover'));
  assert.strictEqual(handoverTask.type, 'handover');
});

test('getDueReminders handles handover and markReminderSent persists', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const project = {
    slug: 'handover',
    title: 'مشروع تسليم',
    tasks: [
      { id: 5, title: 'قريبة جداً', size: 'M', due: '2024-01-11', status: 'open', ownerId: '11' }
    ]
  };

  saveProjects([project], store);

  const now = new Date('2024-01-10T12:00:00Z');
  const due = getDueReminders(now, store);
  assert.strictEqual(due.length, 2);
  const types = due.map(r => r.type).sort();
  assert.deepStrictEqual(types, ['handover', 'main']);
  assert.strictEqual(due[0].task.reminders.mainSentAt, null);
  assert.strictEqual(due[0].task.reminders.handoverSentAt, null);

  markReminderSent(5, 'handover', now, store);

  const [updatedProject] = store.read('projects', []);
  assert.ok(updatedProject.tasks[0].reminders.handoverSentAt);
});

test('reminders are only returned once per window after being marked sent', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const project = {
    slug: 'repeat-check',
    title: 'مشروع',
    tasks: [{ id: 6, title: 'مرة واحدة', size: 'M', due: '2024-01-11', status: 'open' }]
  };

  saveProjects([project], store);

  const now = new Date('2024-01-10T00:00:00Z');
  const first = getDueReminders(now, store);
  assert.ok(first.some(r => r.task.id === 6 && r.type === 'main'));

  markReminderSent(6, 'main', now, store);

  const second = getDueReminders(now, store);
  assert.ok(!second.some(r => r.task.id === 6 && r.type === 'main'));
});

test('completed or archived projects do not produce reminders', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const projects = [
    {
      slug: 'done-project',
      title: 'مغلق',
      tasks: [{ id: 7, title: 'منتهية', size: 'S', due: '2024-01-10', status: 'done' }]
    },
    {
      slug: 'archived',
      title: 'مؤرشف',
      stage: 'archived',
      tasks: [{ id: 8, title: 'مؤرشف', size: 'S', due: '2024-01-10', status: 'open' }]
    }
  ];

  saveProjects(projects, store);

  const now = new Date('2024-01-09T00:00:00Z');
  const due = getDueReminders(now, store);

  assert.strictEqual(due.length, 0);
});
