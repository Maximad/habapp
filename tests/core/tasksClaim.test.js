const test = require('node:test');
const assert = require('node:assert/strict');

const { claimTask } = require('../../src/core/work/tasks');

function createMockStore(tasks) {
  return {
    getTaskById: taskId => tasks.find(t => Number(t.id) === Number(taskId)),
    saveTask: updated => {
      const idx = tasks.findIndex(t => Number(t.id) === Number(updated.id));
      if (idx >= 0) {
        tasks[idx] = { ...tasks[idx], ...updated };
      }
    }
  };
}

test('claimTask assigns owner when task is open and member is eligible', () => {
  const tasks = [{ id: 1, unit: 'media', ownerId: null, title: 'Edit clip' }];
  const store = createMockStore(tasks);

  const result = claimTask(store, 1, 'member-1', { units: ['media'] });

  assert.equal(result.ownerId, 'member-1');
  assert.equal(tasks[0].ownerId, 'member-1');
});

test('claimTask prevents a second member from taking an already owned task', () => {
  const tasks = [{ id: 2, unit: 'media', ownerId: 'member-1', title: 'Storyboard' }];
  const store = createMockStore(tasks);

  assert.throws(() => claimTask(store, 2, 'member-2', { units: ['media'] }), err => {
    assert.equal(err.code, 'TASK_ALREADY_TAKEN');
    return true;
  });
});

test('claimTask rejects members outside the task unit', () => {
  const tasks = [{ id: 3, unit: 'production', ownerId: null, title: 'Lighting plan' }];
  const store = createMockStore(tasks);

  assert.throws(() => claimTask(store, 3, 'member-3', { units: ['media'] }), err => {
    assert.equal(err.code, 'TASK_NOT_ELIGIBLE');
    return true;
  });
});

test('claimTask throws a code when the task is missing', () => {
  const tasks = [];
  const store = createMockStore(tasks);

  assert.throws(() => claimTask(store, 99, 'member-9', { units: ['media'] }), err => {
    assert.equal(err.code, 'TASK_NOT_FOUND');
    return true;
  });
});

test('claimTask rejects non-claimable tasks (template metadata)', () => {
  const tasks = [
    { id: 10, unit: 'production', ownerId: null, templateId: 'prod.prep.call_sheet' }
  ];
  const store = createMockStore(tasks);

  assert.throws(
    () => claimTask(store, 10, 'member-10', { units: ['production'] }),
    err => {
      assert.equal(err.code, 'TASK_NOT_CLAIMABLE');
      return true;
    }
  );
});

test('claimTask allows claimable tasks even when claimable is defined in the template', () => {
  const tasks = [
    { id: 11, unit: 'production', ownerId: null, templateId: 'prod.shoot.camera_tests' }
  ];
  const store = createMockStore(tasks);

  const result = claimTask(store, 11, 'member-11', { units: ['production'] });

  assert.equal(result.ownerId, 'member-11');
});

test('claimTask rejects non-claimable geeks tasks', () => {
  const tasks = [
    { id: 20, unit: 'geeks', ownerId: null, templateId: 'geeks_site_brief' }
  ];

  const store = createMockStore(tasks);

  assert.throws(
    () => claimTask(store, 20, 'member-20', { units: ['geeks'] }),
    err => {
      assert.equal(err.code, 'TASK_NOT_CLAIMABLE');
      return true;
    }
  );
});

test('claimTask allows claimable geeks tasks', () => {
  const tasks = [
    { id: 21, unit: 'geeks', ownerId: null, templateId: 'geeks_site_frontend_build' }
  ];

  const store = createMockStore(tasks);

  const result = claimTask(store, 21, 'member-21', { units: ['geeks'] });

  assert.equal(result.ownerId, 'member-21');
});
