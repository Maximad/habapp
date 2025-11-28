const test = require('node:test');
const assert = require('node:assert/strict');

const remindService = require('../../src/core/work/remindService');
const handleRemind = require('../../src/discord/commands/remind');

function createInteraction({ days = null, userId = 'abc' } = {}) {
  const responses = [];
  return {
    user: { id: userId },
    options: {
      getSubcommand: () => 'tasks',
      getInteger: () => days
    },
    reply: async payload => {
      responses.push(payload);
      return true;
    },
    getResponses() {
      return responses;
    }
  };
}

test('handleRemind replies with Arabic empty state when no tasks', async () => {
  const original = remindService.listTasksForMemberDueSoon;
  remindService.listTasksForMemberDueSoon = () => [];
  const interaction = createInteraction();

  try {
    await handleRemind(interaction);
  } finally {
    remindService.listTasksForMemberDueSoon = original;
  }

  const [response] = interaction.getResponses();
  assert.ok(response.ephemeral);
  assert.match(response.content, /لا توجد مهمات مستعجلة حالياً/);
});

test('handleRemind formats task lines with project and due date', async () => {
  const original = remindService.listTasksForMemberDueSoon;
  remindService.listTasksForMemberDueSoon = () => [
    { project: { name: 'مشروع تجريبي' }, task: { title_ar: 'مهمة أولى', due: '2024-05-02' } },
    { project: { name: 'مشروع آخر' }, task: { title_ar: 'مهمة ثانية', due: '2024-05-03' } }
  ];
  const interaction = createInteraction({ days: 5 });

  try {
    await handleRemind(interaction);
  } finally {
    remindService.listTasksForMemberDueSoon = original;
  }

  const [response] = interaction.getResponses();
  assert.ok(response.ephemeral);
  assert.match(response.content, /مهامك المستعجلة/);
  assert.match(response.content, /مشروع تجريبي/);
  assert.match(response.content, /مهمة أولى/);
  assert.match(response.content, /2024-05-02/);
  assert.match(response.content, /مشروع آخر/);
});
