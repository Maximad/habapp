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

  if (type === 'main') {
    await user.send(
      `🔔 عندك مهمة مستحقة قريباً:\n` +
      `• المهمة: ${task.title}\n` +
      `• المشروع: ${projectLabel}\n` +
      `• الموعد: ${dueLabel}\n\n` +
      'إذا احتجت مساعدة أو تغيير المكلّف، يمكنك إخبار الفريق في قناة المشروع أو استخدام أوامر HabApp.'
    ).catch(() => null);
    return true;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`reminder:keep:${task.id}`)
      .setLabel('سأنفّذها في وقتها')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`reminder:handover:${task.id}`)
      .setLabel('أحتاج مساعدة/نقل المهمة')
      .setStyle(ButtonStyle.Secondary)
  );

  await user.send({
    content:
      `⏰ المهمة التالية قريبة جداً من موعدها:\n` +
      `• المهمة: ${task.title}\n` +
      `• المشروع: ${projectLabel}\n` +
      `• الموعد: ${dueLabel}\n\n` +
      'إذا ترى أنك لن تتمكن من إنهائها في الوقت المناسب، اضغط "أحتاج مساعدة/نقل المهمة" حتى نمنح مساحة لشخص آخر.',
    components: [row]
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
