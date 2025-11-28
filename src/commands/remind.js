const { SlashCommandBuilder } = require('discord.js');
const handleRemind = require('../discord/commands/remind');

const data = new SlashCommandBuilder()
  .setName('remind')
  .setDescription('تذكير بالمهام المستعجلة')
  .addSubcommand(sub =>
    sub
      .setName('tasks')
      .setDescription('عرض المهام الموكلة لك والمستحقة قريباً')
      .addIntegerOption(o =>
        o
          .setName('days')
          .setDescription('عدد الأيام القادمة للفحص (افتراضي 3)')
          .setMinValue(1)
      )
  );

async function execute(interaction) {
  return handleRemind(interaction);
}

module.exports = { data, execute };
