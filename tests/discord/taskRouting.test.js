const test = require('node:test');
const assert = require('assert');

const config = require('../../config.json');
const { publishClaimableTasksByFunction } = require('../../src/discord/adapters/tasks');

test('publishClaimableTasksByFunction routes claimable tasks by function', async () => {
  const originalRouting = config.taskRouting;
  config.taskRouting = {
    media: {
      media_writer: {
        channelId: 'writers-channel',
        roleIds: ['role-writers']
      }
    }
  };

  const sent = [];
  const fetched = [];
  const fakeChannel = {
    send: async payload => {
      sent.push(payload);
      return payload;
    }
  };
  const client = {
    channels: {
      fetch: async channelId => {
        fetched.push(channelId);
        return fakeChannel;
      }
    }
  };

  const project = { unit: 'media', title: 'مشروع تجريبي', slug: 'demo' };
  const tasks = [
    {
      id: 1,
      claimable: true,
      functionKey: 'media_writer',
      unit: 'media',
      size: 'M',
      title_ar: 'مقابلة سريعة',
      dueDate: '2024-01-05'
    },
    {
      id: 2,
      claimable: true,
      functionKey: 'media_social',
      unit: 'media',
      size: 'S',
      title_ar: 'مهمة أخرى',
      dueDate: '2024-01-06'
    }
  ];

  try {
    await publishClaimableTasksByFunction({ client, project, tasks });

    assert.deepStrictEqual(fetched, ['writers-channel']);
    assert.ok(sent[0].content.includes('<@&role-writers>'));
    assert.ok(sent[0].content.includes('مقابلة سريعة'));
  } finally {
    config.taskRouting = originalRouting;
  }
});
