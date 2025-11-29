// src/discord/handlers/reminderButtons.js
const { pickTaskOwner } = require('../../core/people/memberAssignment');
const { listMembers } = require('../../core/people/memberStore');
const { getTaskById } = require('../../core/work/tasks');
const { saveProjects } = require('../../core/work/projects');

async function handleReminderButton(interaction) {
  if (!interaction.isButton()) return;

  const [prefix, action, taskId] = (interaction.customId || '').split(':');
  if (prefix !== 'reminder' || !action || !taskId) return;

  if (action === 'keep') {
    await interaction.reply({ content: 'شكراً، تم تسجيل أنك مستمر بالمهمة.', ephemeral: true });
    return;
  }

  if (action !== 'handover') {
    return;
  }

  try {
    const { projects, projectIndex, taskIndex, project, task } = getTaskById(taskId);
    const members = listMembers();
    const candidates = members.filter(m => String(m.discordId) !== String(task.ownerId));

    const nextOwnerId = pickTaskOwner(
      candidates,
      project.unit || (Array.isArray(project.units) ? project.units[0] : null),
      task.defaultOwnerFunc || task.defaultOwnerRole || null
    );

    if (!nextOwnerId) {
      await interaction.reply({
        content: 'لا يوجد شخص واضح لنقل المهمة إليه الآن. من الأفضل فتح النقاش في قناة المشروع.',
        ephemeral: true
      });
      return;
    }

    const updatedTask = {
      ...task,
      ownerId: nextOwnerId
    };

    projects[projectIndex] = {
      ...project,
      tasks: project.tasks.map((t, idx) => (idx === taskIndex ? updatedTask : t))
    };

    saveProjects(projects);

    const newOwnerUser = await interaction.client.users.fetch(nextOwnerId).catch(() => null);
    if (newOwnerUser) {
      await newOwnerUser.send(
        `🔄 تم إسناد مهمة إليك بعد طلب مساعدة من المالك السابق:\n` +
        `• المهمة: ${task.title}\n` +
        `• المشروع: ${project.title || project.name || project.slug}\n` +
        `• الموعد: ${task.dueDate || task.due || 'غير محدد'}`
      ).catch(() => null);
    }

    const newOwnerLabel = newOwnerUser?.displayName || newOwnerUser?.username || `العضو ${nextOwnerId}`;
    await interaction.reply({
      content: `تم تسجيل أنك تحتاج مساعدة، وتم اقتراح نقل المهمة إلى ${newOwnerLabel}.`,
      ephemeral: true
    });
  } catch (err) {
    console.error('[HabApp] Failed to handle reminder handover', err);
    if (!interaction.replied) {
      await interaction.reply({ content: 'حدث خطأ أثناء معالجة الطلب.', ephemeral: true }).catch(() => null);
    }
  }
}

module.exports = { handleReminderButton };
