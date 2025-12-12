const test = require('node:test');
const assert = require('node:assert/strict');

const { startReminderScheduler, resolveReminderSettings } = require('../../src/discord/scheduler/reminders');

test('resolveReminderSettings defaults to enabled when missing', () => {
  const { enabled, intervalMinutes } = resolveReminderSettings({});
  assert.equal(enabled, true);
  assert.equal(intervalMinutes > 0, true);
});

test('startReminderScheduler skips setup when reminders are disabled', () => {
  let called = false;

  const timer = startReminderScheduler(
    {},
    {
      config: { reminders: { enabled: false, intervalMinutes: 5 } },
      setIntervalFn: () => {
        called = true;
        return 'timer-id';
      }
    }
  );

  assert.equal(timer, null);
  assert.equal(called, false);
});
