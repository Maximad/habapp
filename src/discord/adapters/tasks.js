const { buildErrorMessage } = require('../i18n/messages');

async function replyLegacy(interaction) {
  const message = buildErrorMessage('tasks_command_legacy');
  if (interaction.deferred || interaction.replied) {
    return interaction.editReply(message);
  }
  return interaction.reply({ content: message, ephemeral: true });
}

async function handleTaskAdd(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskComplete(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskDelete(interaction) {
  return replyLegacy(interaction);
}

async function handleTaskList(interaction) {
  return replyLegacy(interaction);
}

module.exports = {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList
};
