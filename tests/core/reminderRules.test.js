const test = require('node:test');
const assert = require('assert');

const { getReminderWindowsForTask } = require('../../src/core/reminders/reminderRules');

test('getReminderWindowsForTask returns correct windows per size', () => {
  assert.deepStrictEqual(getReminderWindowsForTask({ size: 'S' }), { mainDays: 1, handoverDays: 0.25 });
  assert.deepStrictEqual(getReminderWindowsForTask({ size: 'M' }), { mainDays: 3, handoverDays: 1 });
  assert.deepStrictEqual(getReminderWindowsForTask({ size: 'L' }), { mainDays: 7, handoverDays: 3 });
});
