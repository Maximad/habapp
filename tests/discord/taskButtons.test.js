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

test('task reminder complete button marks task done and posts update', async () => {
  const completeCalls = [];
  const updates = [];
  const interaction = createInteraction('task:complete:REMINDER:7');
  interaction.message = { content: 'original reminder' };

  const fakeStore = {
    getTaskById: () => ({
      project: { slug: 'demo' },
      task: { id: 7, title: 'تجربة', status: 'open' }
    }),
    saveTask: () => {}
  };

  await handleTaskButton(interaction, {
    completeTask: (slug, id) => completeCalls.push({ slug, id }),
    store: fakeStore,
    postUpdateToThread: async (slug, content) => updates.push({ slug, content })
  });

  assert.equal(completeCalls.length, 1);
  assert.deepEqual(completeCalls[0], { slug: 'demo', id: 7 });
  assert.equal(updates.length, 1);
  assert.match(updates[0].content, /تم إنجاز المهمة/);
  assert.equal(interaction.replied.content, '✅ تم تعليم المهمة كمكتملة. شكرًا!');
});

test('task reminder offer button re-offers task and clears owner', async () => {
  const sent = [];
  const updates = [];
  const saved = [];
  const interaction = createInteraction('task:offer:REMINDER:9');

  const fakeStore = {
    getTaskById: () => ({
      project: { slug: 'demo', unit: 'media', pipelineKey: 'media.production' },
      task: { id: 9, title: 'عرض المهمة', status: 'open', ownerId: '123', unit: 'media' }
    }),
    saveTask: task => saved.push(task)
  };

  await handleTaskButton(interaction, {
    store: fakeStore,
    resolveTaskChannel: async () => ({ send: payload => sent.push(payload) }),
    resolveFallbackChannelKey: () => 'channel-id',
    buildOfferPayload: ({ task }) => ({ content: `payload:${task.id}` }),
    postUpdateToThread: async (slug, content) => updates.push({ slug, content })
  });

  assert.equal(saved.length, 1);
  assert.equal(saved[0].ownerId, null);
  assert.equal(sent.length, 1);
  assert.match(sent[0].content, /payload:9/);
  assert.equal(updates.length, 1);
  assert.match(updates[0].content, /تم عرض المهمة/);
  assert.equal(interaction.replied.content, '↩️ تم عرض المهمة على الفريق من جديد.');
});

test('claim button responds gracefully when task is not claimable', async () => {
  const interaction = createInteraction('task:claim:13');

  await handleTaskButton(interaction, {
    claimTask: () => {
      const err = new Error('TASK_NOT_CLAIMABLE');
      err.code = 'TASK_NOT_CLAIMABLE';
      throw err;
    },
    resolveProfile: async () => ({ units: ['media'] }),
    store: {
      getTaskById: () => ({ id: 13, unit: 'media', title: 'مهمة غير قابلة' }),
      saveTask: () => {}
    }
  });

  assert.ok(interaction.replied);
  assert.equal(
    interaction.replied.content,
    'هذه المهمة لا يمكن حجزها عبر الزر. يجب على المنتج او المحرر تعيينها يدويا.'
  );
  assert.equal(interaction.replied.ephemeral, true);
});
