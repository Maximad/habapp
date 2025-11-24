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
        .setDescription('عرض تفاصيل حالة محددة')
        .addStringOption(o =>
          o.setName('id')
            .setDescription('معرف الحالة (lead/core/active/friend/on_call/founding/trial/guest/suspended)')
            .setRequired(true)
        )
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
      const id = interaction.options.getString('id', true);
      const st = status.getState(id);
      if (!st) {
        return interaction.reply({
          content: 'لم يتم العثور على حالة بهذا المعرف.',
          ephemeral: true
        });
      }

      const text =
        `**${st.name}**\n` +
        `${st.short}\n\n` +
        `*تلميح حول المنافع والمكافآت:* ${st.rewardsHint}`;

      return interaction.reply({
        content: text,
        ephemeral: true
      });
    }
  }
};
