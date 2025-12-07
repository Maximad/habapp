// src/index.js
const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const cfg = require('../config.json');
const projectCommand = require('./commands/project');
const taskCommand = require('./commands/task');
const handleRemind = require('./discord/commands/remind');
const {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList,
  handleTaskOffer
} = require('./discord/adapters/tasks');
const {
  handleStatusInfo,
  handleStatusRewards
} = require('./discord/adapters/status');
const handleTaskReview = require('./discord/commands/taskReview');
const { handleWorkBackfillAdd, handleWorkBackfillVerify } = require('./discord/adapters/work-backfill');
const handleProfile = require('./discord/commands/profile');
const { handleProfileSkills, handleProfileLearning } = require('./discord/adapters/profile');
const {
  sendOnboardingMessage,
  handleOnboardingButton,
  handleOnboardingSelect,
  handleOnboardingModal
} = require('./discord/ui/onboarding');
const { handleInteraction } = require('./discord/utils/interactionWrapper');
const { startReminderScheduler } = require('./discord/scheduler/reminders');
const { handleReminderButton } = require('./discord/handlers/reminderButtons');
const { handleTaskButton } = require('./discord/handlers/taskButtons');

// ───────── client ─────────
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async c => {
  try {
    const g = await client.guilds.fetch(cfg.guildId).then(x => x.fetch());
    console.log(`HabApp ready in ${g.name}`);
    startReminderScheduler(client);
  } catch (e) {
    console.error('Startup error. Check cfg.guildId and bot permissions.', e);
  }
});

// ───────── interaction handling ─────────
client.on(Events.InteractionCreate, interaction =>
  handleInteraction(interaction, async () => {
    if (interaction.isChatInputCommand()) {
      const guild = interaction.guild;
      if (!guild) return;

      const name = interaction.commandName;

      if (name === 'ping') {
        return interaction.reply({ content: 'HabApp حيّ ويعمل ✅', ephemeral: true });
      }

      if (name === 'habapp_start') {
        return sendOnboardingMessage(interaction);
      }

      // ───── project ─────
      if (name === 'project' && projectCommand?.execute) {
        return projectCommand.execute(interaction);
      }

      if (name === 'remind') {
        const sub = interaction.options.getSubcommand();
        if (sub === 'tasks') return handleRemind(interaction);
      }

      // ───── task ─────
      if (name === 'task') {
        const sub = interaction.options.getSubcommand();

        if (sub === 'add') return handleTaskAdd(interaction);
        if (sub === 'complete') return handleTaskComplete(interaction);
        if (sub === 'delete') return handleTaskDelete(interaction);
        if (sub === 'list') return handleTaskList(interaction);
        if (sub === 'offer') return handleTaskOffer(interaction);
      }

      // ───── status ─────
      if (name === 'status') {
        const sub = interaction.options.getSubcommand();
        if (sub === 'overview') return handleStatusInfo(interaction);
        if (sub === 'detail') return handleStatusRewards(interaction);
      }

      // ───── task_review ─────
      if (name === 'task_review') {
        return handleTaskReview(interaction);
      }

      // ───── work_backfill ─────
      if (name === 'work_backfill') {
        const sub = interaction.options.getSubcommand();
        if (sub === 'add') return handleWorkBackfillAdd(interaction);
        if (sub === 'verify') return handleWorkBackfillVerify(interaction);
      }

      // ───── profile ─────
      if (name === 'profile') {
        const sub = interaction.options.getSubcommand(false);
        if (!sub || sub === 'summary') return handleProfile(interaction);
        if (sub === 'skills') return handleProfileSkills(interaction);
        if (sub === 'learning') return handleProfileLearning(interaction);
      }

      return;
    }

    if (interaction.isAutocomplete()) {
      const { commandName } = interaction;
      if (commandName === 'project' && projectCommand?.autocomplete) {
        return projectCommand.autocomplete(interaction);
      }
      if (commandName === 'task' && taskCommand?.autocomplete) {
        return taskCommand.autocomplete(interaction);
      }
      return;
    }

    if (interaction.isButton() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingButton(interaction);
    }

    if (interaction.isButton() && interaction.customId?.startsWith('reminder:')) {
      return handleReminderButton(interaction);
    }

    if (interaction.isButton() && interaction.customId?.startsWith('task:')) {
      return handleTaskButton(interaction);
    }

    if (interaction.isStringSelectMenu() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingSelect(interaction);
    }

    if (interaction.isModalSubmit() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingModal(interaction);
    }
  })
);

client.login(process.env.DISCORD_TOKEN);
