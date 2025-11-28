const { SlashCommandBuilder } = require('discord.js');
const { syncMemberFromDiscordProfile } = require('../core/people/memberSync');

function formatList(values) {
  if (!values?.length) return '—';
  return values.map(v => `• ${v}`).join('\n');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('إدارة ملفك في حبق')
    .addSubcommand(sub =>
      sub
        .setName('sync')
        .setDescription('مزامنة ملفك تلقائياً من أدوار ديسكورد')
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub !== 'sync') return;

    const guildMember = await interaction.guild.members
      .fetch(interaction.user.id)
      .catch(() => interaction.member);

    const roles = Array.from(guildMember?.roles?.cache?.values() || []).map(r => ({
      id: r.id,
      name: r.name
    }));

    const member = syncMemberFromDiscordProfile({
      user: {
        id: interaction.user.id,
        username: interaction.user.username,
        displayName: guildMember?.displayName || interaction.user.globalName || interaction.user.username
      },
      roles
    });

    const summary =
      `تمت المزامنة ✅\n\n` +
      `الحالة: **${member.state || 'guest'}**\n` +
      `وضع الهوية: **${member.identityMode}**\n\n` +
      `الوحدات المرتبطة:\n${formatList(member.units)}\n\n` +
      `الأدوار الوظيفية:\n${formatList(member.functions)}`;

    return interaction.reply({ content: summary, ephemeral: true });
  }
};
