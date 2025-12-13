const test = require('node:test');
const assert = require('node:assert/strict');

const { ChannelType } = require('discord.js');
const { notifyProjectCreated, createForumThreadForProject } = require('../../src/discord/adapters/projectNotifications');
const { postTaskUpdateToProjectThread } = require('../../src/discord/adapters/tasks');
const cfg = require('../../config.json');

function createMockGuild(sentMessages) {
  return {
    channels: {
      fetch: async channelId => ({
        send: async ({ content }) => {
          sentMessages.push({ channelId, content });
          return true;
        }
      })
    }
  };
}

test('notifyProjectCreated posts summary to the unit main channel', async () => {
  const sent = [];
  const guild = createMockGuild(sent);
  const interaction = { guild };
  const originalRole = cfg.unitRoleIds.media;
  cfg.unitRoleIds.media = 'MEDIA_ROLE_ID';
  const project = {
    name: 'مبادرة تجريبية',
    units: ['media'],
    pipelineKey: 'media.production_kit',
    dueDate: '2024-06-01'
  };
  const tasks = [
    { title_ar: 'تنظيم الطاقم', ownerId: '222', due: '2024-05-20' },
    { title_ar: 'الخطة التحريرية', ownerId: null, due: null }
  ];

  await notifyProjectCreated({ interaction, project, tasks });
  cfg.unitRoleIds.media = originalRole;

  assert.equal(sent.length, 1, 'should send one message');
  assert.match(sent[0].content, /<@&MEDIA_ROLE_ID>/);
  assert.match(sent[0].content, /تفاصيل المشروع/);
  assert.match(sent[0].content, /مبادرة تجريبية/);
  assert.match(sent[0].content, /تنظيم الطاقم/);
  assert.match(sent[0].content, /الخطة التحريرية/);
  assert.match(sent[0].content, /<@222>/);
  assert.match(sent[0].content, /المهمات:/);
});

test('createForumThreadForProject opens forum thread when configured', async () => {
  const created = [];
  const persisted = [];
  const posted = [];
  const client = {
    channels: {
      fetch: async id => ({
        id,
        type: ChannelType.GuildForum,
        threads: {
          create: async ({ name, message }) => {
            created.push({ name, message });
            return { id: 'thread-99' };
          }
        }
      })
    }
  };

  const project = { slug: 'demo', unit: 'media', title: 'مشروع المنتدى', dueDate: '2024-10-10' };
  await createForumThreadForProject({
    client,
    project,
    pipeline: { key: 'media.production', name_ar: 'إعلام' },
    persistProject: p => persisted.push(p),
    postUpdate: async payload => posted.push(payload)
  });

  assert.equal(created.length, 1);
  assert.equal(created[0].name, 'مشروع المنتدى');
  assert.equal(persisted[0].forumThreadId, 'thread-99');
  assert.equal(posted.length, 1);
  assert.match(posted[0].content, /تم إطلاق المشروع/);
});

test('postTaskUpdateToProjectThread sends when thread exists and no-ops without', async () => {
  const sent = [];
  await postTaskUpdateToProjectThread({
    project: { slug: 'demo', forumThreadId: '123' },
    content: 'hello',
    fetchChannel: async id => ({ send: async payload => sent.push({ id, payload }) })
  });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].id, '123');

  const noop = await postTaskUpdateToProjectThread({
    project: { slug: 'demo' },
    content: 'ignored'
  });
  assert.equal(noop, null);
});
