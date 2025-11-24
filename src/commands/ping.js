const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('فحص سريع: هل HabApp شغال؟'),
  async execute(interaction) {
    await interaction.reply({ content: 'pong ✅ HabApp شغال.', ephemeral: true });
  }
};
