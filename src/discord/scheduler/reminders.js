// src/discord/scheduler/reminders.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDueReminders, markReminderSent } = require('../../core/reminders/reminderService');

const REMINDER_INTERVAL_MS = 10 * 60 * 1000;

async function sendReminder(client, reminder) {
  const { task, project, type } = reminder;
  const ownerId = task.ownerId || task.assignedToDiscordId;
  if (!ownerId) return false;

  const user = await client.users.fetch(ownerId).catch(() => null);
  if (!user) return false;

  const projectLabel = project.title || project.name || project.slug || 'المشروع';
  const dueLabel = task.dueDate || task.due || 'بدون موعد محدد';

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
    await user.send({
      content:
        `🔔 تذكير بالمهمة القادمة:\n` +
        `• المهمة: ${task.title}\n` +
        `• المشروع: ${projectLabel}\n` +
        `• الموعد: ${dueLabel}\n\n` +
        'إذا احتجت مساعدة أو تعديل، أخبر الفريق في قناة المشروع مبكراً ليتمكن أحد من الدعم.',
      components: [taskActions]
    }).catch(() => null);
    return true;
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

  await user.send({
    content:
      `⏰ موعد المهمة قريب جداً:\n` +
      `• المهمة: ${task.title}\n` +
      `• المشروع: ${projectLabel}\n` +
      `• الموعد: ${dueLabel}\n\n` +
      'إذا لن تتمكن من إنهائها في الوقت المناسب، اضغط "أحتاج من يستلمها عني" لنمنح الوقت لشخص آخر قبل الموعد.',
    components: [row, taskActions]
  }).catch(() => null);
  return true;
}

function startReminderScheduler(client) {
  setInterval(async () => {
    try {
      const reminders = await getDueReminders(new Date());
      if (!reminders.length) return;

      for (const reminder of reminders) {
        const sent = await sendReminder(client, reminder);
        if (sent) {
          await markReminderSent(reminder.task.id, reminder.type, new Date());
        }
      }
    } catch (err) {
      console.error('[HabApp] Reminder scheduler error', err);
    }
  }, REMINDER_INTERVAL_MS);
}

module.exports = { startReminderScheduler, sendReminder };
