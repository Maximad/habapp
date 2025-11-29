// src/core/reminders/reminderRules.js

const SIZE_WINDOWS = {
  S: { mainDays: 1, handoverDays: 0.25 },
  M: { mainDays: 3, handoverDays: 1 },
  L: { mainDays: 7, handoverDays: 3 }
};

function getReminderWindowsForTask(task) {
  const size = (task?.size || 'M').toUpperCase();
  const defaults = SIZE_WINDOWS[size] || SIZE_WINDOWS.M;
  return {
    mainDays: defaults.mainDays,
    handoverDays: defaults.handoverDays
  };
}

module.exports = { SIZE_WINDOWS, getReminderWindowsForTask };
