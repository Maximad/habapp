const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { saveProjects } = require('../../src/core/work/projects');
const { listTasksForMemberDueSoon } = require('../../src/core/work/remindService');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-remind-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('listTasksForMemberDueSoon filters by owner, status, and due date', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  saveProjects(
    [
      {
        slug: 'p1',
        name: 'مشروع عاجل',
        tasks: [
          { id: 1, title_ar: 'مهمة قريبة', ownerId: 'u1', due: '2024-05-02', status: 'open' },
          { id: 2, title_ar: 'لاحقة', ownerId: 'u1', due: '2024-05-05', status: 'open' }
        ]
      },
      {
        slug: 'p2',
        name: 'مشروع منجز',
        tasks: [{ id: 1, title_ar: 'مهمة مكتملة', ownerId: 'u1', due: '2024-05-01', status: 'done' }]
      },
      {
        slug: 'p3',
        name: 'مشروع بلا موعد',
        tasks: [{ id: 1, title_ar: 'بدون تاريخ', ownerId: 'u1', status: 'open' }]
      },
      {
        slug: 'p4',
        name: 'مشروع آخر',
        tasks: [{ id: 1, title_ar: 'لعضو آخر', ownerId: 'u2', due: '2024-05-02', status: 'open' }]
      }
    ],
    store
  );

  const now = new Date('2024-05-01T10:00:00Z');
  const results = listTasksForMemberDueSoon({ memberDiscordId: 'u1', days: 3 }, store, now);

  assert.equal(results.length, 1);
  assert.equal(results[0].project.name, 'مشروع عاجل');
  assert.equal(results[0].task.title_ar, 'مهمة قريبة');
});

test('listTasksForMemberDueSoon defaults to 3 days when value is missing or invalid', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  saveProjects(
    [
      {
        slug: 'p1',
        name: 'مشروع ضمن المدى',
        tasks: [{ id: 1, title_ar: 'مهمة قريبة', ownerId: 'm1', due: '2024-05-03', status: 'open' }]
      }
    ],
    store
  );

  const now = new Date('2024-05-01T00:00:00Z');
  const withDefault = listTasksForMemberDueSoon({ memberDiscordId: 'm1' }, store, now);
  const withInvalid = listTasksForMemberDueSoon({ memberDiscordId: 'm1', days: -5 }, store, now);

  assert.equal(withDefault.length, 1);
  assert.equal(withInvalid.length, 1);
});
