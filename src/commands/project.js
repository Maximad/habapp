const { SlashCommandBuilder, ChannelType } = require('discord.js');

async function getForumAndTags(guild, cfg) {
  const forumId = cfg.forum.productionForumId;
  const forum = await guild.channels.fetch(forumId);
  if (!forum || forum.type !== ChannelType.GuildForum) {
    throw new Error('قناة المنتدى الخاصة بالإنتاج غير موجودة أو نوعها غير صحيح.');
  }
  const tagMap = {};
  for (const tag of forum.availableTags) {
    tagMap[tag.name] = tag.id;
  }
  return { forum, tagMap };
}

async function postToChannel(guild, channelId, content) {
  if (!channelId) return null;
  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel) return null;
  return channel.send({ content });
}

function stageToArabic(stage) {
  return ({
    planning: 'التخطيط',
    shooting: 'التصوير',
    editing: 'المونتاج',
    review: 'المراجعة',
    archived: 'مؤرشف'
  })[stage] || stage;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('project')
    .setDescription('إنشاء وإدارة مشاريع حبق')
    .addSubcommand(sub =>
      sub
        .setName('create')
        .setDescription('إنشاء مشروع جديد')
        .addStringOption(o =>
          o.setName('name')
            .setDescription('اسم المشروع')
            .setRequired(true)
        )
        .addStringOption(o =>
          o.setName('slug')
            .setDescription('معرّف قصير بالإنكليزية بدون فراغات (مثال: shahba01)')
            .setRequired(true)
        )
        .addStringOption(o =>
          o.setName('unit')
            .setDescription('الوحدة الرئيسية للمشروع')
            .setRequired(true)
            .addChoices(
              { name: 'الإنتاج', value: 'production' },
              { name: 'الإعلام', value: 'media' },
              { name: 'الفكر', value: 'think' },
              { name: 'الجيكس', value: 'geeks' },
              { name: 'الناس', value: 'people' },
              { name: 'الأكاديمية', value: 'academy' },
              { name: 'الإدارة/الحوكمة', value: 'admin' }
            )
        )
        .addStringOption(o =>
          o.setName('template')
            .setDescription('قالب الإنتاج أو العمل')
            .addChoices(
              { name: 'قالب A - بسيط/داخلي', value: 'A' },
              { name: 'قالب B - وثائقي قياسي', value: 'B' },
              { name: 'قالب C - معيار عميل مرتفع', value: 'C' },
              { name: 'بدون قالب محدد', value: 'none' }
            )
        )
        .addStringOption(o =>
          o.setName('client')
            .setDescription('اسم العميل أو الشريك (اختياري)')
        )
        .addStringOption(o =>
          o.setName('parent')
            .setDescription('مبادرة أو مشروع أكبر مرتبط (اختياري)')
        )
        .addStringOption(o =>
          o.setName('due')
            .setDescription('تاريخ أو مهلة تقريبية (نص حر، اختياري)')
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('stage')
        .setDescription('تحديث مرحلة المشروع')
        .addStringOption(o =>
          o.setName('slug')
            .setDescription('معرّف المشروع (slug)')
            .setRequired(true)
        )
        .addStringOption(o =>
          o.setName('stage')
            .setDescription('المرحلة الجديدة')
            .setRequired(true)
            .addChoices(
              { name: 'التخطيط', value: 'planning' },
              { name: 'التصوير', value: 'shooting' },
              { name: 'المونتاج', value: 'editing' },
              { name: 'المراجعة', value: 'review' },
              { name: 'مؤرشف', value: 'archived' }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('عرض قائمة بالمشاريع المسجلة')
    )
    .addSubcommand(sub =>
      sub
        .setName('delete')
        .setDescription('حذف مشروع من سجل HabApp')
        .addStringOption(o =>
          o.setName('slug')
            .setDescription('معرّف المشروع (slug) المراد حذفه')
            .setRequired(true)
        )
    ),
  async execute(interaction, ctx) {
    const { cfg, projectStore, templates } = ctx;
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const name = interaction.options.getString('name', true);
      const slug = interaction.options.getString('slug', true);
      const unit = interaction.options.getString('unit', true);
      const templateId = interaction.options.getString('template') || 'A';
      const clientName = interaction.options.getString('client') || null;
      const parentKey = interaction.options.getString('parent') || null;
      const due = interaction.options.getString('due') || null;

      if (!/^[a-z0-9-_]+$/i.test(slug)) {
        return interaction.reply({
          content: 'الـ slug يجب أن يكون بالإنكليزية بدون فراغات (حروف، أرقام، شرطة، أو شرطة سفلية فقط).',
          ephemeral: true
        });
      }

      if (projectStore.getProject(slug)) {
        return interaction.reply({
          content: 'يوجد مشروع مسجل مسبقاً بهذا الـ slug.',
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      const template = templateId === 'none'
        ? null
        : templates.getTemplate(templateId) || templates.getTemplate('A');

      const { forum, tagMap } = await getForumAndTags(guild, cfg);
      const planningTagId = tagMap['planning'];

      const firstMessageLines = [];
      firstMessageLines.push(`**المشروع:** ${name}`);
      firstMessageLines.push(`**الـ slug:** ${slug}`);
      firstMessageLines.push(`**الوحدة:** ${unit}`);
      if (template) firstMessageLines.push(`**القالب:** ${template.name}`);
      if (clientName) firstMessageLines.push(`**العميل/الشريك:** ${clientName}`);
      if (parentKey) firstMessageLines.push(`**مرتبط بـ:** ${parentKey}`);
      firstMessageLines.push(`**الموعد التقريبي:** ${due || 'غير محدد'}`);
      firstMessageLines.push('**المراحل:** planning -> shooting -> editing -> review -> archived');
      firstMessageLines.push('');
      firstMessageLines.push('المرجو إبقاء كل التحديثات الأساسية داخل هذا الخيط.');

      const thread = await forum.threads.create({
        name: `${slug} • ${name}`,
        message: {
          content: firstMessageLines.join('\n')
        },
        appliedTags: planningTagId ? [planningTagId] : []
      });

      const prodChannels = cfg.channels.production || {};
      await postToChannel(
        guild,
        prodChannels.crewRosterId,
        `**${slug}** - فتح مشروع جديد.\nأدوار الطاقم: منتج، مشرف ما بعد الإنتاج، تصوير، صوت.\nمن فضلكم عيّنوا الأدوار في هذا الخيط.`
      );
      await postToChannel(
        guild,
        prodChannels.gearLogId,
        `**${slug}** - حجز/تجهيز المعدّات.\nأضيفوا التواريخ والعناصر المطلوبة لهذا المشروع.`
      );
      await postToChannel(
        guild,
        prodChannels.postPipelineId,
        `**${slug}** - مسار المونتاج.\nأضيفوا تواريخ المونتاج الأولي والنهائي والقفل (lock).`
      );

      const record = projectStore.createProject({
        slug,
        name,
        unit,
        templateId: template ? template.id : null,
        stage: 'planning',
        due,
        clientName,
        parentKey,
        threadId: thread.id,
        createdBy: interaction.user.id,
        meta: {}
      });

      return interaction.editReply(
        `تم إنشاء المشروع: **${record.name}** (${record.slug})\n` +
        `تم فتح خيط في منتدى الإنتاج وربط القنوات الأساسية.`
      );
    }

    if (sub === 'stage') {
      const slug = interaction.options.getString('slug', true);
      const stage = interaction.options.getString('stage', true);

      const project = projectStore.getProject(slug);
      if (!project) {
        return interaction.reply({
          content: 'لم يتم العثور على مشروع بهذا الـ slug.',
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      const { tagMap } = await getForumAndTags(guild, cfg);

      if (!project.threadId) {
        projectStore.updateProject(slug, { stage });
        await interaction.editReply('تم تحديث المرحلة في السجل فقط. لا يوجد خيط منتدى مرتبط بالمشروع.');
        return;
      }

      const thread = await guild.channels.fetch(project.threadId).catch(() => null);
      if (!thread || !thread.isThread()) {
        projectStore.updateProject(slug, { stage });
        await interaction.editReply('لم أستطع الوصول إلى خيط المنتدى، لكن تم تحديث المرحلة في السجل.');
        return;
      }

      const tagId = tagMap[stage] || null;
      if (tagId) {
        await thread.setAppliedTags([tagId]).catch(() => {});
      }

      if (stage === 'archived') {
        await thread.setLocked(true).catch(() => {});
        await thread.setArchived(true).catch(() => {});
      }

      await thread.send(
        `المرحلة الجديدة للمشروع هي: **${stageToArabic(stage)}** (بواسطة <@${interaction.user.id}>)`
      ).catch(() => {});

      projectStore.updateProject(slug, { stage });

      return interaction.editReply(`تم ضبط مرحلة المشروع إلى: ${stageToArabic(stage)}.`);
    }

    if (sub === 'list') {
      const list = projectStore.getAllProjects();
      if (!list.length) {
        return interaction.reply({
          content: 'لا يوجد أي مشاريع مسجّلة حالياً في HabApp.',
          ephemeral: true
        });
      }

      const lines = [];
      lines.push(`المشاريع المسجّلة (إجمالي: ${list.length}):`);
      lines.push('');
      for (const p of list.slice(-15)) {
        lines.push(
          `• [${p.unit || 'غير محدد'}] ${p.slug} - ${p.name} - المرحلة: ${stageToArabic(p.stage || 'planning')}`
        );
      }

      return interaction.reply({
        content: lines.join('\n'),
        ephemeral: true
      });
    }

    if (sub === 'delete') {
      const slug = interaction.options.getString('slug', true);
      const project = projectStore.getProject(slug);
      if (!project) {
        return interaction.reply({
          content: 'لم يتم العثور على مشروع بهذا الـ slug.',
          ephemeral: true
        });
      }

      const removed = projectStore.deleteProject(slug);

      let extra = '';
      if (removed && removed.threadId) {
        extra = '\nملاحظة: خيط المنتدى المرتبط لم يُحذف تلقائياً. يمكنك أرشفته أو حذفه يدوياً من منتدى الإنتاج.';
      }

      return interaction.reply({
        content: `تم حذف المشروع **${removed.name}** (${removed.slug}) من سجل HabApp.${extra}`,
        ephemeral: true
      });
    }
  }
};
