const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const projects = require('../../src/core/projects');
const {
  createTask,
  completeTask,
  deleteTask,
  listTasks,
  createTasksFromTemplates,
  setTaskQuality,
  setTaskEthics,
  getTaskById
} = require('../../src/core/tasks');
const { getPipelineByKey } = require('../../src/core/units');

function collectPipelineTemplateIds(key, seen = new Set()) {
  const pipeline = getPipelineByKey(key);
  if (!pipeline) return [];

  (pipeline.defaultTaskTemplateIds || pipeline.defaultTemplateIds || []).forEach(id =>
    seen.add(id)
  );
  (pipeline.supportTemplateIds || []).forEach(id => seen.add(id));
  (pipeline.inheritTemplatePipelineKeys || []).forEach(parent => collectPipelineTemplateIds(parent, seen));

  return Array.from(seen);
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
  const expectedIds = collectPipelineTemplateIds('production.video_basic');

  assert.strictEqual(created.length, expectedIds.length);
  assert.ok(created.every(task => task.status === 'open'));
  assert.ok(expectedIds.includes(created[0].templateId));
  assert.ok(created.every(task => !!task.due));

  const stored = projects.findProject('proj', store);
  assert.strictEqual(stored.tasks.length, expectedIds.length);
});

test('createTasksFromTemplates respects explicit pipeline overrides', async t => {
  const { store, dir } = setupProject('production.video_basic');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const createdSupport = await createTasksFromTemplates(
    { projectSlug: 'proj', pipelineKey: 'production.support' },
    store
  );

  const expectedSupport = collectPipelineTemplateIds('production.support');
  assert.strictEqual(createdSupport.length, expectedSupport.length);
  assert.ok(createdSupport.every(task => task.defaultChannelKey));
});

test('createTasksFromTemplates falls back for production video pipelines', async t => {
  const { store, dir } = setupProject('production.video_doc');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplates = collectPipelineTemplateIds('production.video_doc');

  assert.strictEqual(created.length, expectedTemplates.length);
  assert.ok(created.every(task => task.status === 'open'));
});

test('createTasksFromTemplates scaffolds media pipelines without duplication', async t => {
  const { store, dir } = setupProject('media.article_short');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('media.article_short');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);

  const stored = projects.findProject('proj', store);
  assert.strictEqual(stored.tasks.length, expectedTemplateIds.length);
});

test('createTasksFromTemplates scaffolds people pipelines and dedupes', async t => {
  const { store, dir } = setupProject('people.event_small');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('people.event_small');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);
});

test('createTasksFromTemplates scaffolds geeks pipelines and dedupes', async t => {
  const { store, dir } = setupProject('geeks.app_small');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('geeks.app_small');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);
});

test('createTasksFromTemplates scaffolds geeks automation pipeline and dedupes', async t => {
  const { store, dir } = setupProject('geeks.automation_stack');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('geeks.automation_stack');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);
});

test('setTaskQuality and setTaskEthics update existing tasks', t => {
  const { store, dir } = setupProject();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { task } = createTask('proj', { title: 'Assess me' }, store);
  const updatedQuality = setTaskQuality(task.id, {
    score: 3,
    tags: ['clear'],
    notes: 'Great quality',
    reviewerId: 'user-1'
  }, store);

  assert.strictEqual(updatedQuality.quality.score, 3);
  assert.deepStrictEqual(updatedQuality.quality.tags, ['clear']);
  assert.strictEqual(updatedQuality.quality.reviewerId, 'user-1');
  assert.ok(updatedQuality.quality.updatedAt);

  const updatedEthics = setTaskEthics(task.id, {
    status: 'ok',
    tags: ['balanced'],
    notes: 'No issues',
    reviewerId: 'user-2'
  }, store);

  assert.strictEqual(updatedEthics.ethics.status, 'ok');
  assert.deepStrictEqual(updatedEthics.ethics.tags, ['balanced']);
  assert.strictEqual(updatedEthics.ethics.reviewerId, 'user-2');
  assert.ok(updatedEthics.ethics.updatedAt);

  const fetched = getTaskById(task.id, store);
  assert.strictEqual(fetched.task.quality.score, 3);
  assert.strictEqual(fetched.task.ethics.status, 'ok');
});
