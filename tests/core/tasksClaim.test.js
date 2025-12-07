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
