// src/index.js
const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const cfg = require('../config.json');
const { getTemplatesByUnit, getTemplateById } = require('./core/templates');
const { unitToArabic } = require('./discord/utils/formatters');
const {
  handleProjectCreate,
  handleProjectStage,
  handleProjectDelete,
  handleProjectTasks,
  handleProjectScaffold
} = require('./discord/adapters/projects');
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
const { handleProfileSkills, handleProfileLearning } = require('./discord/adapters/profile');

// ───────── client ─────────
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async c => {
  try {
    const g = await client.guilds.fetch(cfg.guildId).then(x => x.fetch());
    console.log(`HabApp ready in ${g.name}`);
  } catch (e) {
    console.error('Startup error. Check cfg.guildId and bot permissions.', e);
  }
});

// ───────── interaction handling ─────────
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guild = interaction.guild;
  if (!guild) return;

  try {
    const name = interaction.commandName;

    // ping
    if (name === 'ping') {
      return interaction.reply({ content: 'HabApp حيّ ويعمل ✅', ephemeral: true });
    }

    // ───── project ─────
    if (name === 'project') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'create') return handleProjectCreate(interaction);
      if (sub === 'stage') return handleProjectStage(interaction);
      if (sub === 'delete') return handleProjectDelete(interaction);
      if (sub === 'scaffold') return handleProjectScaffold(interaction);
      if (sub === 'tasks') return handleProjectTasks(interaction);
    }

    // ───── task ─────
    if (name === 'task') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'add') return handleTaskAdd(interaction);
      if (sub === 'complete') return handleTaskComplete(interaction);
      if (sub === 'delete') return handleTaskDelete(interaction);
      if (sub === 'list') return handleTaskList(interaction);
    }

    // ───── template ─────
    if (name === 'template') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'task-list') {
        const unit = interaction.options.getString('unit') || 'all';
        const list = getTemplatesByUnit(unit);

        if (!list || list.length === 0) {
          return interaction.reply({
            content: 'لا توجد قوالب مطابقة للفلتر الحالي.',
            ephemeral: true
          });
        }

        const lines = list.map(t => {
          return `• \`${t.id}\` – [${unitToArabic(t.unit)}][${t.size}] – ${t.titleAr}`;
        });

        const header =
          '📚 قوالب المهام المتاحة (حسب الوحدة والحجم):\n' +
          'استخدم `/template task-spawn` مع معرّف القالب لاستنساخ مهمة جاهزة.\n\n';

        return interaction.reply({
          content: (header + lines.join('\n')).slice(0, 1900),
          ephemeral: true
        });
      }

      if (sub === 'task-spawn') {
        const slug = interaction.options.getString('slug', true);
        const templateId = interaction.options.getString('template_id', true);
        const owner = interaction.options.getUser('owner');
        const due = interaction.options.getString('due') || 'غير محدّد';

        const tpl = getTemplateById(templateId);
        if (!tpl) {
          return interaction.reply({
            content: '❌ لم يتم العثور على قالب بهذا المعرّف.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        let result;
        try {
          result = await handleTaskAdd(
            Object.assign(Object.create(Object.getPrototypeOf(interaction)), interaction, {
              options: {
                getString: (key, required) => {
                  if (key === 'slug') return slug;
                  if (key === 'title') return tpl.titleAr;
                  if (key === 'unit') return tpl.unit;
                  if (key === 'template_id') return tpl.id;
                  if (key === 'due') return due;
                  return interaction.options.getString(key, required);
                },
                getUser: key => (key === 'owner' ? owner : interaction.options.getUser(key))
              }
            })
          );
        } catch (err) {
          return interaction.editReply('❌ حدث خطأ أثناء إنشاء المهمة من القالب.');
        }

        return result;
      }
    }

    // ───── status ─────
    if (name === 'status') {
      const sub = interaction.options.getSubcommand();
      if (sub === 'info') return handleStatusInfo(interaction);
      if (sub === 'rewards') return handleStatusRewards(interaction);
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
      const sub = interaction.options.getSubcommand();
      if (sub === 'skills') return handleProfileSkills(interaction);
      if (sub === 'learning') return handleProfileLearning(interaction);
    }
  } catch (err) {
    console.error(err);
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply('❌ حدث خطأ: ' + (err.message || 'خطأ غير معروف'));
      } else {
        await interaction.reply({
          content: '❌ حدث خطأ: ' + (err.message || 'خطأ غير معروف'),
          ephemeral: true
        });
      }
    } catch (e2) {
      console.error('Error while sending error reply', e2);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
