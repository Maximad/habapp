const test = require('node:test');
const assert = require('node:assert/strict');

const { notifyProjectCreated } = require('../../src/discord/adapters/projectNotifications');

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
  const project = {
    name: 'مبادرة تجريبية',
    units: ['production'],
    pipelineKey: 'production.video_basic',
    dueDate: '2024-06-01'
  };
  const tasks = [
    { title_ar: 'تنظيم الطاقم', ownerId: '222', due: '2024-05-20' },
    { title_ar: 'الخطة التحريرية', ownerId: null, due: null }
  ];

  await notifyProjectCreated({ interaction, project, tasks });

  assert.equal(sent.length, 1, 'should send one message');
  assert.match(sent[0].content, /تفاصيل المشروع/);
  assert.match(sent[0].content, /مبادرة تجريبية/);
  assert.match(sent[0].content, /تنظيم الطاقم/);
  assert.match(sent[0].content, /الخطة التحريرية/);
  assert.match(sent[0].content, /<@222>/);
  assert.match(sent[0].content, /المهمات:/);
});
