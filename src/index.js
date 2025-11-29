// src/index.js
const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const cfg = require('../config.json');
const handleProject = require('./discord/commands/project');
const handleRemind = require('./discord/commands/remind');
const {
  handleTaskAdd,
  handleTaskComplete,
  handleTaskDelete,
  handleTaskList
} = require('./discord/adapters/tasks');
const {
  handleStatusInfo,
  handleStatusRewards
} = require('./discord/adapters/status');
const { handleTaskReviewQuality, handleTaskReviewEthics } = require('./discord/adapters/task-review');
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
    if (interaction.isButton() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingButton(interaction);
    }

    if (interaction.isButton() && interaction.customId?.startsWith('reminder:')) {
      return handleReminderButton(interaction);
    }

    if (interaction.isStringSelectMenu() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingSelect(interaction);
    }

    if (interaction.isModalSubmit() && interaction.customId?.startsWith('onboard_')) {
      return handleOnboardingModal(interaction);
    }

    if (!interaction.isChatInputCommand()) return;

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
    if (name === 'project') {
      return handleProject(interaction);
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
    }

    // ───── status ─────
    if (name === 'status') {
      const sub = interaction.options.getSubcommand();
      if (sub === 'overview') return handleStatusInfo(interaction);
      if (sub === 'detail') return handleStatusRewards(interaction);
    }

    // ───── task_review ─────
    if (name === 'task_review') {
      const sub = interaction.options.getSubcommand();
      if (sub === 'quality') return handleTaskReviewQuality(interaction);
      if (sub === 'ethics') return handleTaskReviewEthics(interaction);
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
  })
);

client.login(process.env.DISCORD_TOKEN);
