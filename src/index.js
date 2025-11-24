// src/index.js
const { Client, GatewayIntentBits, ChannelType, Events } = require('discord.js');
const path = require('path');
require('dotenv').config();

const cfg = require('../config.json');
const {
  findProject,
  upsertProject,
  deleteProject,
  listProjects,
  ensureProject
} = require('./core/projects');
const {
  createTask,
  completeTask,
  deleteTask,
  listTasks
} = require('./core/tasks');
const {
  getTemplatesByUnit,
  getTemplateById
} = require('./core/templates');

// ───────── helpers ─────────

function stageToArabic(s) {
  return (
    {
      planning: 'التخطيط',
      shooting: 'التصوير',
      editing: 'المونتاج',
      review: 'المراجعة',
      archived: 'مؤرشف'
    }[s] || s
  );
}

function unitToArabic(u) {
  return (
    {
      media: 'الإعلام',
      production: 'الإنتاج',
      think: 'فِكر',
      geeks: 'الجيكس',
      people: 'الناس',
      academy: 'الأكاديمية',
      admin: 'الإدارة'
    }[u] || u || 'غير محدّد'
  );
}

function statusToArabic(st) {
  return st === 'done' ? 'منجزة' : 'مفتوحة';
}

async function getForumAndTags(guild) {
  const forum = await guild.channels.fetch(cfg.forum.productionForumId);
  if (!forum || forum.type !== ChannelType.GuildForum) {
    throw new Error('لم يتم العثور على قناة المنتدى الخاصة بالتخطيط (#خطط-التصوير)');
  }
  const tagMap = {};
  for (const t of forum.availableTags) {
    tagMap[t.name] = t.id;
  }
  return { forum, tagMap };
}

async function createForumPost(guild, { name, slug, due }) {
  const { forum, tagMap } = await getForumAndTags(guild);
  const planningId = tagMap['planning'];

  const post = await forum.threads.create({
    name: `${slug} • ${name}`,
    message: {
      content:
        `**مشروع:** ${name}\n` +
        `**الرمز (slug):** ${slug}\n` +
        `**تاريخ التسليم:** ${due || 'غير محدّد'}\n` +
        `**المراحل:** التخطيط → التصوير → المونتاج → المراجعة → مؤرشف\n\n` +
        `⬆️ هذا الخيط هو بيت المشروع. الرجاء إبقاء كل التحديثات والملفات هنا.`
    },
    appliedTags: planningId ? [planningId] : []
  });

  return { threadId: post.id };
}

async function postToChannel(guild, channelId, content) {
  if (!channelId) return null;
  const ch = await guild.channels.fetch(channelId).catch(() => null);
  if (!ch) return null;
  return ch.send({ content });
}

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

      // create
      if (sub === 'create') {
        const projName = interaction.options.getString('name', true);
        const slug = interaction.options.getString('slug', true);
        const due = interaction.options.getString('due') || null;

        if (findProject(slug)) {
          return interaction.reply({
            content: '⚠️ يوجد مشروع بهذا الرمز مسبقاً.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const { threadId } = await createForumPost(guild, { name: projName, slug, due });

        // scaffold production channels (مثل السابق)
        await postToChannel(
          guild,
          cfg.production.crewRosterId,
          `**${slug}** – فتح مشروع جديد.\n` +
            `أدوار مطلوبة: منتج، مشرف مونتاج، كاميرا، صوت.\n` +
            `استخدم هذا الخيط لتحديد الطاقم.`
        );
        await postToChannel(
          guild,
          cfg.production.gearLogId,
          `**${slug}** – حجز المعدّات.\n` +
            `رجاء تسجيل الكاميرات، العدسات، الصوت، الإضاءة، وتواريخ الحجز.`
        );
        await postToChannel(
          guild,
          cfg.production.postPipelineId,
          `**${slug}** – مسار المونتاج.\n` +
            `سجّل هنا: المونتاج الأول، المراجعة، القفل، والتسليم النهائي.`
        );

        const project = {
          slug,
          name: projName,
          due,
          stage: 'planning',
          threadId,
          createdAt: new Date().toISOString(),
          createdBy: interaction.user.id,
          tasks: []
        };
        upsertProject(project);

        return interaction.editReply(
          `✅ تم إنشاء المشروع **${projName}** برمز **${slug}**.\n` +
            `تم فتح خيط في المنتدى مع مرحلة **${stageToArabic('planning')}**.\n` +
            `استخدم /task add لإضافة مهام، و /project stage لتغيير المرحلة.`
        );
      }

      // stage
      if (sub === 'stage') {
        const slug = interaction.options.getString('slug', true);
        const stage = interaction.options.getString('stage', true).toLowerCase();
        const allowed = ['planning', 'shooting', 'editing', 'review', 'archived'];
        if (!allowed.includes(stage)) {
          return interaction.reply({
            content: '❌ مرحلة غير صحيحة.',
            ephemeral: true
          });
        }

        const p = findProject(slug);
        if (!p) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const guildFull = await interaction.client.guilds
          .fetch(cfg.guildId)
          .then(g => g.fetch());
        const { tagMap } = await getForumAndTags(guildFull);

        const thread = await guildFull.channels.fetch(p.threadId).catch(() => null);
        if (thread && thread.isThread()) {
          const tagId = tagMap[stage];
          if (tagId) {
            await thread.setAppliedTags([tagId]).catch(() => {});
          }
          if (stage === 'archived') {
            await thread.setLocked(true).catch(() => {});
            await thread.setArchived(true).catch(() => {});
          }
          await thread
            .send(`تم تحديث المرحلة إلى **${stageToArabic(stage)}** بواسطة <@${interaction.user.id}>.`)
            .catch(() => {});
        }

        p.stage = stage;
        upsertProject(p);

        return interaction.editReply(`✅ تم تعيين المرحلة إلى **${stageToArabic(stage)}**.`);
      }

      // delete
      if (sub === 'delete') {
        const slug = interaction.options.getString('slug', true);
        const confirm = interaction.options.getBoolean('confirm', true);

        if (!confirm) {
          return interaction.reply({
            content: 'تم إلغاء الحذف لأنّ خيار التأكيد ليس true.',
            ephemeral: true
          });
        }

        const p = findProject(slug);
        if (!p) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        if (p.threadId) {
          const thread = await guild.channels.fetch(p.threadId).catch(() => null);
          if (thread && thread.isThread()) {
            await thread
              .send('⚠️ هذا المشروع تم حذفه من نظام HabApp بواسطة الإدارة.')
              .catch(() => {});
            await thread.setLocked(true).catch(() => {});
            await thread.setArchived(true).catch(() => {});
          }
        }

        deleteProject(slug);
        return interaction.editReply(`🗑️ تم حذف المشروع **${slug}** من قاعدة البيانات.`);
      }

      // tasks view
      if (sub === 'tasks') {
        const slug = interaction.options.getString('slug', true);
        const status = interaction.options.getString('status') || 'open';

        let tasks;
        try {
          tasks = listTasks(slug, status === 'all' ? 'all' : status);
        } catch (e) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        if (!tasks || tasks.length === 0) {
          return interaction.reply({
            content: 'لا توجد مهام مطابقة لهذا المشروع.',
            ephemeral: true
          });
        }

        const lines = tasks.map(t => {
          const owner = t.ownerId ? `<@${t.ownerId}>` : 'غير معيّن';
          return `• [T-${t.id}] (${unitToArabic(t.unit)}) – **${t.title}** – ${statusToArabic(
            t.status
          )} – المالك: ${owner} – التسليم: ${t.due || 'غير محدّد'}`;
        });

        const header =
          `📋 مهام المشروع **${slug}** (${status === 'all' ? 'الكل' : statusToArabic(status)}):\n`;
        const content = header + lines.join('\n');

        return interaction.reply({
          content: content.slice(0, 1900),
          ephemeral: true
        });
      }
    }

    // ───── task ─────
    if (name === 'task') {
      const sub = interaction.options.getSubcommand();

      // add
      if (sub === 'add') {
        const slug = interaction.options.getString('slug', true);
        const title = interaction.options.getString('title', true);
        const unit = interaction.options.getString('unit') || 'media';
        const owner = interaction.options.getUser('owner');
        const due = interaction.options.getString('due') || 'غير محدّد';
        const templateId = interaction.options.getString('template_id') || null;

        const p = findProject(slug);
        if (!p) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const { project, task } = createTask(slug, {
          title,
          unit,
          ownerId: owner ? owner.id : null,
          due,
          templateId
        });

        // route إلى قناة المهمات (الإعلام) حالياً
        const msg = await postToChannel(
          guild,
          cfg.media.assignmentsId,
          `**[${slug} T-${task.id}]** – ${title}\n` +
            `الوحدة: ${unitToArabic(unit)}\n` +
            `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
            `التسليم: ${due}`
        );

        // mirror إلى خيط المشروع
        if (project.threadId) {
          const thread = await guild.channels.fetch(project.threadId).catch(() => null);
          if (thread && thread.isThread()) {
            await thread
              .send(
                `تم إنشاء مهمة جديدة [T-${task.id}]: **${title}**\n` +
                  `الوحدة: ${unitToArabic(unit)}\n` +
                  `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
                  `التسليم: ${due}` +
                  (msg ? `\nالرابط: ${msg.url}` : '')
              )
              .catch(() => {});
          }
        }

        return interaction.editReply(
          `✅ تم إنشاء المهمة [T-${task.id}] في المشروع **${slug}**.`
        );
      }

      // complete
      if (sub === 'complete') {
        const slug = interaction.options.getString('slug', true);
        const taskId = interaction.options.getInteger('task_id', true);

        await interaction.deferReply({ ephemeral: true });

        let result;
        try {
          result = completeTask(slug, taskId);
        } catch (e) {
          return interaction.editReply('❌ لم يتم العثور على المهمة أو المشروع.');
        }

        const { project, task } = result;

        // تحديث في خيط المشروع
        if (project.threadId) {
          const thread = await guild.channels.fetch(project.threadId).catch(() => null);
          if (thread && thread.isThread()) {
            await thread
              .send(
                `✅ تم تعليم المهمة [T-${task.id}] كمنجزة بواسطة <@${interaction.user.id}>.\n` +
                  `العنوان: **${task.title}**`
              )
              .catch(() => {});
          }
        }

        return interaction.editReply(`✅ تمت علامة المهمة [T-${task.id}] كمنجزة.`);
      }

      // delete
      if (sub === 'delete') {
        const slug = interaction.options.getString('slug', true);
        const taskId = interaction.options.getInteger('task_id', true);

        await interaction.deferReply({ ephemeral: true });

        try {
          deleteTask(slug, taskId);
        } catch (e) {
          return interaction.editReply('❌ لم يتم العثور على المهمة أو المشروع.');
        }

        // يمكن لاحقاً إرسال رسالة في الخيط، الآن كفاية الإشعار الخاص
        return interaction.editReply(`🗑️ تم حذف المهمة [T-${taskId}] من المشروع ${slug}.`);
      }

      // list
      if (sub === 'list') {
        const slug = interaction.options.getString('slug', true);
        const status = interaction.options.getString('status') || 'open';

        let tasks;
        try {
          tasks = listTasks(slug, status === 'all' ? 'all' : status);
        } catch (e) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        if (!tasks || tasks.length === 0) {
          return interaction.reply({
            content: 'لا توجد مهام مطابقة لهذا المشروع.',
            ephemeral: true
          });
        }

        const lines = tasks.map(t => {
          const owner = t.ownerId ? `<@${t.ownerId}>` : 'غير معيّن';
          return `• [T-${t.id}] (${unitToArabic(t.unit)}) – **${t.title}** – ${statusToArabic(
            t.status
          )} – المالك: ${owner} – التسليم: ${t.due || 'غير محدّد'}`;
        });

        const header =
          `📋 مهام المشروع **${slug}** (${status === 'all' ? 'الكل' : statusToArabic(status)}):\n`;
        const content = header + lines.join('\n');

        return interaction.reply({
          content: content.slice(0, 1900),
          ephemeral: true
        });
      }
    }

    // ───── template ─────
    if (name === 'template') {
      const sub = interaction.options.getSubcommand();

      // task-list
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
          '📚 قائمة القوالب المتاحة للمهام:\n' +
          'استخدم `/template task-spawn` مع معرّف القالب.\n\n';

        return interaction.reply({
          content: (header + lines.join('\n')).slice(0, 1900),
          ephemeral: true
        });
      }

      // task-spawn
      if (sub === 'task-spawn') {
        const slug = interaction.options.getString('slug', true);
        const templateId = interaction.options.getString('template_id', true);
        const owner = interaction.options.getUser('owner');
        const due = interaction.options.getString('due') || 'غير محدّد';

        const p = findProject(slug);
        if (!p) {
          return interaction.reply({
            content: 'لم يتم العثور على مشروع بهذا الرمز.',
            ephemeral: true
          });
        }

        const tpl = getTemplateById(templateId);
        if (!tpl) {
          return interaction.reply({
            content: '❌ لم يتم العثور على قالب بهذا المعرّف.',
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const { project, task } = createTask(slug, {
          title: tpl.titleAr,
          unit: tpl.unit,
          ownerId: owner ? owner.id : null,
          due,
          templateId: tpl.id
        });

        const msg = await postToChannel(
          guild,
          cfg.media.assignmentsId,
          `**[${slug} T-${task.id}]** – ${tpl.titleAr}\n` +
            `الوحدة: ${unitToArabic(tpl.unit)}\n` +
            `الحجم: ${tpl.size}\n` +
            `تعريف الإنجاز: ${tpl.definitionAr}\n` +
            `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
            `التسليم: ${due}`
        );

        if (project.threadId) {
          const thread = await guild.channels.fetch(project.threadId).catch(() => null);
          if (thread && thread.isThread()) {
            await thread
              .send(
                `تم إنشاء مهمة من قالب \`${tpl.id}\` [T-${task.id}]: **${tpl.titleAr}**\n` +
                  `الوحدة: ${unitToArabic(tpl.unit)} | الحجم: ${tpl.size}\n` +
                  `تعريف الإنجاز: ${tpl.definitionAr}\n` +
                  `المنفّذ: ${owner ? `<@${owner.id}>` : 'غير معيّن'}\n` +
                  `التسليم: ${due}` +
                  (msg ? `\nالرابط: ${msg.url}` : '')
              )
              .catch(() => {});
          }
        }

        return interaction.editReply(
          `✅ تم إنشاء مهمة من القالب \`${tpl.id}\` برقم [T-${task.id}] للمشروع **${slug}**.`
        );
      }
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
