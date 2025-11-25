const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const projects = require('../../src/core/projects');
const { createTask, completeTask, deleteTask, listTasks, createTasksFromTemplates } = require('../../src/core/tasks');
const { listTaskTemplatesByPipeline } = require('../../src/core/templates/task-templates');

function dedupeById(list) {
  const seen = new Set();
  return list.filter(t => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

function setupProject(pipelineKey = null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-store-'));
  const store = createStore({ dataDir: dir });
  projects.upsertProject(
    { slug: 'proj', name: 'Proj', stage: 'planning', tasks: [], pipelineKey },
    store
  );
  return { store, dir };
}

test('tasks create, increment, and persist using injected store', t => {
  const { store, dir } = setupProject();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const first = createTask('proj', { title: 'First' }, store);
  const second = createTask('proj', { title: 'Second' }, store);

  assert.strictEqual(first.task.id, 1);
  assert.strictEqual(second.task.id, 2);

  const stored = projects.findProject('proj', store);
  assert.strictEqual(stored.tasks.length, 2);
});

test('task lifecycle: complete, list filters, delete', t => {
  const { store, dir } = setupProject();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  createTask('proj', { title: 'First' }, store);
  createTask('proj', { title: 'Second' }, store);

  const { task: completed } = completeTask('proj', 1, store);
  assert.strictEqual(completed.status, 'done');
  assert.ok(completed.completedAt);

  const openTasks = listTasks('proj', 'open', store);
  assert.strictEqual(openTasks.length, 1);

  const removed = deleteTask('proj', 2, store);
  assert.strictEqual(removed, true);

  const allTasks = listTasks('proj', 'all', store);
  assert.strictEqual(allTasks.length, 1);
});

test('createTasksFromTemplates seeds tasks for pipeline', async t => {
  const { store, dir } = setupProject('production.video_basic');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplates = dedupeById([
    ...listTaskTemplatesByPipeline('production.video_basic'),
    ...listTaskTemplatesByPipeline('production.support')
  ]);

  assert.strictEqual(created.length, expectedTemplates.length);
  assert.ok(created.every(task => task.status === 'open'));
  assert.strictEqual(created[0].templateId, expectedTemplates[0].id);

  const stored = projects.findProject('proj', store);
  assert.strictEqual(stored.tasks.length, expectedTemplates.length);
});

test('createTasksFromTemplates respects explicit pipeline overrides', async t => {
  const { store, dir } = setupProject('production.video_basic');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const createdSupport = await createTasksFromTemplates(
    { projectSlug: 'proj', pipelineKey: 'production.support' },
    store
  );

  const expectedSupport = listTaskTemplatesByPipeline('production.support');
  assert.strictEqual(createdSupport.length, expectedSupport.length);
  assert.ok(createdSupport.every(task => task.defaultChannelKey));
});

test('createTasksFromTemplates falls back for production video pipelines', async t => {
  const { store, dir } = setupProject('production.video_doc');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplates = dedupeById([
    ...listTaskTemplatesByPipeline('production.video_doc'),
    ...listTaskTemplatesByPipeline('production.video_basic'),
    ...listTaskTemplatesByPipeline('production.support')
  ]);

  assert.strictEqual(created.length, expectedTemplates.length);
  assert.ok(created.every(task => task.status === 'open'));
});

test('createTasksFromTemplates stacks media pipeline templates with support tasks', async t => {
  const { store, dir } = setupProject('media.article_short');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplates = dedupeById([
    ...listTaskTemplatesByPipeline('media.article_short'),
    ...listTaskTemplatesByPipeline('media.support')
  ]);

  assert.strictEqual(created.length, expectedTemplates.length);
  assert.ok(created.every(task => task.status === 'open'));
  assert.strictEqual(created[0].templateId, expectedTemplates[0].id);
});
