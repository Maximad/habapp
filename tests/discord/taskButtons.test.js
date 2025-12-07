const test = require('node:test');
const assert = require('node:assert/strict');

const { handleTaskButton } = require('../../src/discord/handlers/taskButtons');

function createInteraction(customId) {
  const interaction = {
    customId,
    user: { id: 'member-1', username: 'tester' },
    member: { roles: { cache: new Map() } },
    isButton: () => true,
    update: async payload => {
      interaction.updated = payload;
    },
    reply: async payload => {
      interaction.replied = payload;
    },
    followUp: async () => {}
  };
  return interaction;
}

test('handleTaskButton parses task id and calls claimTask', async () => {
  const calls = [];
  const interaction = createInteraction('task:claim:42');

  const fakeStore = {
    getTaskById: () => ({ id: 42, title: 'Demo', unit: 'media' }),
    saveTask: () => {}
  };

  await handleTaskButton(interaction, {
    claimTask: (store, taskId) => {
      calls.push({ store, taskId });
      return { id: taskId, title: 'Demo', unit: 'media' };
    },
    resolveProfile: async () => ({ units: ['media'] }),
    store: fakeStore
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].taskId, 42);
  assert.equal(interaction.updated.content.includes('العنوان: Demo'), true);
});
