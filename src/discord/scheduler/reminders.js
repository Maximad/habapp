// src/discord/scheduler/reminders.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDueReminders, markReminderSent } = require('../../core/reminders/reminderService');
const { postTaskUpdateToProjectThread } = require('../adapters/tasks');
const config = require('../../../config.json');

const DEFAULT_INTERVAL_MINUTES = 10;

async function sendReminder(client, reminder) {
  const { task, project, type } = reminder;
  const ownerId = task.ownerId || task.assignedToDiscordId;
  if (!ownerId) return false;

  const user = await client.users.fetch(ownerId).catch(() => null);
  if (!user) return false;

  const projectLabel = project.title || project.name || 'المشروع';
  const dueLabel = task.dueDate || task.due || 'بدون موعد محدد';
  const sizeLabel = task.size ? `[${String(task.size).toUpperCase()}]` : '[—]';
  const ownerMention = ownerId ? `<@${ownerId}>` : 'غير معيّن بعد';
  const taskTitle = task.title || task.title_ar || 'مهمة';

  const taskActions = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`task:complete:REMINDER:${task.id}`)
      .setLabel('✔️ إنجاز المهمة')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`task:offer:REMINDER:${task.id}`)
      .setLabel('↩️ عرض على الآخرين')
      .setStyle(ButtonStyle.Secondary)
  );

  if (type === 'main') {
    const sent = await user.send({
      content:
        `🔔 بس تذكير بالمهمة الجاية:\n` +
        `• المهمة: ${taskTitle}\n` +
        `• المشروع: ${projectLabel}\n` +
        `• الموعد: ${dueLabel}\n\n` +
        'إذا احتجت مساعدة أو تعديل، أخبر الفريق في قناة المشروع مبكراً ليتمكن أحد من الدعم.',
      components: [taskActions]
    }).catch(() => null);
    if (sent) {
      await postTaskUpdateToProjectThread({
        client,
        project,
        task,
        content:
          '⏰ تذكير لطيف بالمهمة:\n' +
          `المشروع: ${projectLabel}\n` +
          `المهمة: ${taskTitle} (${sizeLabel})\n` +
          `الموكَّل إلى: ${ownerMention}\n` +
          `الموعد: ${dueLabel}`,
      });
    }
    return Boolean(sent);
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`reminder:keep:${task.id}`)
      .setLabel('سأنفّذها في وقتها')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reminder:handover:${task.id}`)
      .setLabel('أحتاج من يستلمها عني')
      .setStyle(ButtonStyle.Secondary)
  );

  const sent = await user.send({
    content:
      `⚠️ تذكير بنقل المهمة (handover):\n` +
      `• المهمة: ${taskTitle}\n` +
      `• المشروع: ${projectLabel}\n` +
      `• الموعد: ${dueLabel}\n\n` +
      'إذا لن تتمكن من إنهائها في الوقت المناسب، اضغط "أحتاج من يستلمها عني" لنمنح الوقت لشخص آخر قبل الموعد.',
    components: [row, taskActions]
  }).catch(() => null);
  if (sent) {
    await postTaskUpdateToProjectThread({
      client,
      project,
      task,
      content:
        '⚠️ تذكير بنقل المهمة (handover):\n' +
        `المشروع: ${projectLabel}\n` +
        `المهمة: ${taskTitle} (${sizeLabel})\n` +
        `الموكَّل إلى: ${ownerMention}\n` +
        `الموعد: ${dueLabel}`,
    });
  }
  return Boolean(sent);
}

function resolveReminderSettings(rawConfig = config) {
  const remindersConfig = rawConfig?.reminders || {};
  const enabled = remindersConfig.enabled !== false;
  const intervalMinutes =
    typeof remindersConfig.intervalMinutes === 'number' && remindersConfig.intervalMinutes > 0
      ? remindersConfig.intervalMinutes
      : DEFAULT_INTERVAL_MINUTES;

  return { enabled, intervalMinutes };
}

function startReminderScheduler(client, options = {}) {
  const { enabled, intervalMinutes } = resolveReminderSettings(options.config || config);
  const setIntervalFn = options.setIntervalFn || setInterval;
  const getDueRemindersFn = options.getDueRemindersFn || getDueReminders;
  const markReminderSentFn = options.markReminderSentFn || markReminderSent;

  if (!enabled) {
    console.log('[HabApp] Reminder scheduler disabled via config.');
    return null;
  }

  const REMINDER_INTERVAL_MS = intervalMinutes * 60 * 1000;

  const timer = setIntervalFn(async () => {
    try {
      const reminders = await getDueRemindersFn(new Date());
      if (!reminders.length) return;

      for (const reminder of reminders) {
        const sent = await sendReminder(client, reminder);
        if (sent) {
          await markReminderSentFn(reminder.task.id, reminder.type, new Date());
        }
      }
    } catch (err) {
      console.error('[HabApp] Reminder scheduler error', err);
    }
  }, REMINDER_INTERVAL_MS);

  return timer;
}

module.exports = { startReminderScheduler, sendReminder, resolveReminderSettings };
