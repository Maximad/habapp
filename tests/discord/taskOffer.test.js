const test = require('node:test');
const assert = require('node:assert/strict');

const { handleTaskOffer, handleTaskAutocomplete } = require('../../src/discord/adapters/tasks');

function createInteraction({ project = null, task = null, focused = null } = {}) {
  const replies = [];
  const responses = [];
  const sentMessages = [];

  return {
    options: {
      getSubcommand: () => 'offer',
      getString: name => {
        if (name === 'project') return project;
        if (name === 'task') return task;
        return null;
      },
      getFocused: () => focused,
    },
    guild: {
      channels: {
        fetch: async () => ({ send: async payload => sentMessages.push(payload) }),
      },
    },
    reply: payload => {
      replies.push(payload);
      return Promise.resolve();
    },
    respond: payload => {
      responses.push(payload);
      return Promise.resolve();
    },
    getReplies: () => replies,
    getResponses: () => responses,
    getSentMessages: () => sentMessages,
  };
}

test('task offer publishes claimable tasks for a project', async () => {
  const interaction = createInteraction({ project: 'demo-project' });

  const fakeProject = {
    slug: 'demo-project',
    title: 'مشروع تجريبي',
    pipelineKey: 'media.article_short',
    units: ['media'],
  };

  await handleTaskOffer(interaction, {
    resolveProject: () => ({ project: fakeProject, matches: [{ project: fakeProject, score: 100 }] }),
    listClaimableTasks: () => [
      { id: 1, title: 'مهمة ١', size: 's' },
      { id: 2, title: 'مهمة ٢', size: 'm' },
    ],
    findChannelForProject: async () => ({
      send: async payload => interaction.getSentMessages().push(payload),
    }),
  });

  const replies = interaction.getReplies();
  assert.equal(replies.length, 1);
  assert.equal(replies[0].ephemeral, true);
  assert.ok(replies[0].content.includes('تم نشر المهام المتاحة'));

  const messages = interaction.getSentMessages();
  assert.equal(messages.length, 2);
  assert.ok(messages[0].content.includes('مهمة جديدة'));
});

test('task offer shows empty state when no claimable tasks exist', async () => {
  const interaction = createInteraction({ project: 'demo-project' });
  const fakeProject = { slug: 'demo-project', title: 'Project', units: ['media'] };

  await handleTaskOffer(interaction, {
    resolveProject: () => ({ project: fakeProject, matches: [{ project: fakeProject, score: 100 }] }),
    listClaimableTasks: () => [],
    findChannelForProject: async () => ({ send: async () => {} }),
  });

  const [reply] = interaction.getReplies();
  assert.equal(reply.content, 'لا توجد مهام قابلة للاستلام حالياً في هذا المشروع.');
  assert.equal(reply.ephemeral, true);
});

test('project autocomplete returns matching projects', async () => {
  const interaction = createInteraction({
    focused: { name: 'project', value: 'demo' },
  });

  await handleTaskAutocomplete(interaction, {
    searchProjects: () => [
      { project: { slug: 'demo-1', name: 'Demo واحد', units: ['media'] }, score: 100 },
    ],
    listAllProjects: () => [],
  });

  const [choices] = interaction.getResponses();
  assert.ok(Array.isArray(choices));
  assert.ok(choices[0].value.includes('demo-1'));
});

test('task autocomplete returns claimable tasks for a project', async () => {
  const interaction = createInteraction({
    project: 'demo-1',
    focused: { name: 'task', value: 'مهمة' },
  });

  const fakeProject = { slug: 'demo-1', name: 'Demo Project', units: ['media'] };

  await handleTaskAutocomplete(interaction, {
    resolveProject: () => ({ project: fakeProject, matches: [{ project: fakeProject, score: 100 }] }),
    listClaimableTasks: () => [
      { id: 7, title_ar: 'مهمة قصيرة', size: 's' },
      { id: 8, title: 'اختبار', size: 'm' },
    ],
  });

  const [choices] = interaction.getResponses();
  assert.ok(Array.isArray(choices));
  assert.ok(choices.some(choice => choice.value.includes('::7')));
});
