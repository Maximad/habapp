const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const storeModule = require('../../src/core/store');
const { createStore } = require('../../src/core/store');
const { createProject } = require('../../src/core/work/services/projectsService');
const { findProject, upsertProject } = require('../../src/core/work/projects');
const projectHandlers = require('../../src/discord/commands/project');

function useTempStore(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-project-list-discord-'));
  const tempStore = createStore({ dataDir: dir });
  const original = { ...storeModule.defaultStore };
  Object.assign(storeModule.defaultStore, tempStore);

  t.after(() => {
    Object.assign(storeModule.defaultStore, original);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  return tempStore;
}

function createInteraction({ unit = null, status = null } = {}) {
  const replies = [];
  return {
    options: {
      getSubcommand: () => 'list',
      getString: name => {
        if (name === 'unit') return unit;
        if (name === 'status') return status;
        return null;
      },
    },
    reply: payload => {
      replies.push(payload);
      return Promise.resolve(true);
    },
    getReplies: () => replies,
  };
}

test('project list handler shows empty state when no projects match', async t => {
  useTempStore(t);
  const interaction = createInteraction({ unit: 'ghost' });
  await projectHandlers.handleProject(interaction);

  const [reply] = interaction.getReplies();
  assert.ok(reply);
  assert.equal(
    reply.content,
    'لا توجد مشاريع مطابقة للمعايير الحالية. جرّب إزالة بعض الفلاتر أو إنشاء مشروع جديد بـ /project create.',
  );
  assert.equal(reply.ephemeral, true);
});

test('project list handler shows active projects grouped by unit', async t => {
  useTempStore(t);

  createProject({ name: 'مشروع إعلام', pipelineKey: 'media.article_short', due: '2024-01-10' });
  createProject({ name: 'مشروع ناس', pipelineKey: 'people.event_small', due: '2024-02-10' });
  const { project } = createProject({ name: 'مؤرشف إعلام', pipelineKey: 'media.photo_story', due: '2024-03-10' });
  const archived = findProject(project.slug);
  archived.stage = 'archived';
  upsertProject(archived);

  const interaction = createInteraction();
  await projectHandlers.handleProject(interaction);

  const [reply] = interaction.getReplies();
  assert.ok(reply);
  assert.equal(reply.ephemeral, true);
  assert.ok(reply.content.includes('المشاريع (نشطة) للوحدة: الإعلام'));
  assert.ok(reply.content.includes('مشروع إعلام'));
  assert.ok(reply.content.includes('مشروع ناس'));
  assert.ok(!reply.content.includes('مؤرشف إعلام'));
});

test('project list handler filters by unit and status', async t => {
  useTempStore(t);

  createProject({ name: 'مشروع إعلام', pipelineKey: 'media.article_short', due: '2024-01-10' });
  const { project } = createProject({ name: 'مؤرشف إعلام', pipelineKey: 'media.photo_story', due: '2024-02-10' });
  const archived = findProject(project.slug);
  archived.stage = 'archived';
  upsertProject(archived);

  const interaction = createInteraction({ unit: 'media', status: 'archived' });
  await projectHandlers.handleProject(interaction);

  const [reply] = interaction.getReplies();
  assert.ok(reply);
  assert.equal(reply.ephemeral, true);
  assert.ok(reply.content.includes('مؤرشف إعلام'));
  assert.ok(!reply.content.includes('مشروع إعلام'));
});

