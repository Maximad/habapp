const { SlashCommandBuilder } = require('discord.js');
const handleProfile = require('../discord/commands/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('عرض ملفك في حبق بناءً على الأدوار الحالية في ديسكورد'),
  async execute(interaction) {
    return handleProfile(interaction);
  }
};
