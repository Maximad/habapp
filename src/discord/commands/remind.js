const remindService = require('../../core/work/remindService');
const { formatTaskList } = require('../utils/formatters');
const { errorMessage, successMessage } = require('../i18n/messages');

async function handleRemind(interaction) {
  const days = interaction.options.getInteger('days') ?? 3;
  const tasks = remindService.listTasksForMemberDueSoon({
    memberDiscordId: interaction.user.id,
    days
  });

  if (!tasks.length) {
    return interaction.reply({ content: errorMessage('no_tasks_due'), ephemeral: true });
  }

  const content = formatTaskList(tasks, {
    heading: successMessage('reminders_listed'),
    includeProject: true,
    showOwner: false
  });

  return interaction.reply({ content, ephemeral: true });
}

module.exports = handleRemind;
