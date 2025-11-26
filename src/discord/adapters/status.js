const { getOverview, getRewards } = require('../../core/people/services/statusService');

async function handleStatusInfo(interaction) {
  const text = getOverview();
  return interaction.reply({
    content: `ℹ️ نظام الحالات في حبق:\n\n${text}`.slice(0, 1900),
    ephemeral: true
  });
}

async function handleStatusRewards(interaction) {
  const text = getRewards();
  return interaction.reply({
    content: `🎁 المنافع والحوافز:\n\n${text}`.slice(0, 1900),
    ephemeral: true
  });
}

module.exports = {
  handleStatusInfo,
  handleStatusRewards
};
