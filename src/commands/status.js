const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('معلومات عن نظام الحالات في حبق')
    .addSubcommand(sub =>
      sub
        .setName('overview')
        .setDescription('عرض ملخص عن الحالات والمسارات')
    )
    .addSubcommand(sub =>
      sub
        .setName('detail')
        .setDescription('عرض تفاصيل المنافع والحوافز لكل حالة')
  ),
  async execute(interaction, ctx) {
    const { status } = ctx;
    const sub = interaction.options.getSubcommand();

    if (sub === 'overview') {
      const text = status.formatOverview();
      return interaction.reply({
        content: 'ملخص الحالات التشغيلية في حبق:\n\n' + text,
        ephemeral: true
      });
    }

    if (sub === 'detail') {
      const rewardsText = status.rewards ? status.rewards() : status.formatRewards ? status.formatRewards() : status.formatOverview();
      const text = `🎁 المنافع والحوافز:\n\n${rewardsText}`;
      return interaction.reply({
        content: text,
        ephemeral: true
      });
    }
  }
};
