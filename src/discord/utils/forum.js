const { ChannelType } = require('discord.js');

async function getForumAndTags(guild, forumId) {
  const forum = await guild.channels.fetch(forumId);
  if (!forum || forum.type !== ChannelType.GuildForum) {
    throw new Error('لم يتم العثور على قناة المنتدى الخاصة بالتخطيط (#خطط-التصوير)');
  }
  const tagMap = {};
  for (const t of forum.availableTags) {
    tagMap[t.name] = t.id;
  }
  return { forum, tagMap };
}

async function createForumPost(guild, forumId, { name, slug, due, templateSummary = null }) {
  const { forum, tagMap } = await getForumAndTags(guild, forumId);
  const planningId = tagMap['planning'];

  const baseLines = [
    `**مشروع:** ${name}`,
    `**الرمز (slug):** ${slug}`,
    `**تاريخ التسليم:** ${due || 'غير محدّد'}`,
    `**المراحل:** التخطيط → التصوير → المونتاج → المراجعة → مؤرشف`,
    '',
    '⬆️ هذا الخيط هو بيت المشروع. الرجاء إبقاء كل التحديثات والملفات هنا.'
  ];

  if (templateSummary) {
    baseLines.splice(3, 0, `**القالب المختار:**\n${templateSummary}`);
  }

  const post = await forum.threads.create({
    name: `${slug} • ${name}`,
    message: {
      content: baseLines.join('\n')
    },
    appliedTags: planningId ? [planningId] : []
  });

  return { threadId: post.id, tagMap };
}

async function applyStageTag(guild, forumId, threadId, stage) {
  const forum = await guild.channels.fetch(forumId);
  if (!forum || forum.type !== ChannelType.GuildForum) return;
  const tagMap = {};
  for (const t of forum.availableTags) {
    tagMap[t.name] = t.id;
  }
  const thread = await guild.channels.fetch(threadId).catch(() => null);
  if (!thread || !thread.isThread()) return;

  const tagId = tagMap[stage];
  if (tagId) {
    await thread.setAppliedTags([tagId]).catch(() => {});
  }
  if (stage === 'archived') {
    await thread.setLocked(true).catch(() => {});
    await thread.setArchived(true).catch(() => {});
  }
}

module.exports = {
  getForumAndTags,
  createForumPost,
  applyStageTag
};
