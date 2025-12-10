const test = require('node:test');
const assert = require('node:assert/strict');

const { clampTaskDueDate } = require('../../src/core/work/tasks');

test('clamps past due dates up to today', () => {
  const now = new Date(Date.UTC(2024, 0, 10));
  const result = clampTaskDueDate({ taskDue: '2024-01-05', now });
  assert.equal(result, '2024-01-10');
});

test('clamps beyond project due date down to project due', () => {
  const now = new Date(Date.UTC(2024, 0, 10));
  const result = clampTaskDueDate({ taskDue: '2024-01-25', projectDue: '2024-01-20', now });
  assert.equal(result, '2024-01-20');
});

test('keeps due date within valid window unchanged', () => {
  const now = new Date(Date.UTC(2024, 0, 10));
  const result = clampTaskDueDate({ taskDue: '2024-01-15', projectDue: '2024-01-25', now });
  assert.equal(result, '2024-01-15');
});

test('ignores project clamp when not provided but avoids past dates', () => {
  const now = new Date(Date.UTC(2024, 0, 10));
  const result = clampTaskDueDate({ taskDue: '2023-12-31', projectDue: null, now });
  assert.equal(result, '2024-01-10');
});
