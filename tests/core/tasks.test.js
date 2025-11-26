const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { createTasksFromTemplates, getTaskById, createTask } = require('../../src/core/work/tasks');
const { setTaskQuality, setTaskEthics } = require('../../src/core/ethics/taskReview');
const { getPipelineByKey } = require('../../src/core/work/units');

function setupProject(pipelineKey = 'geeks.app_small') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-store-'));
  const store = createStore({ dataDir: dir });
  store.write('projects', [
    {
      slug: 'proj',
      name: 'Proj',
      stage: 'planning',
      pipelineKey,
      tasks: []
    }
  ]);
  return { store, dir };
}

function collectPipelineTemplateIds(pipelineKey) {
  const seen = new Set();

  function gather(key) {
    const pipeline = getPipelineByKey(key);
    if (!pipeline) return [];

    const stacks = [];
    const defaults = pipeline.defaultTaskTemplateIds || pipeline.defaultTemplateIds;
    if (Array.isArray(defaults)) {
      stacks.push(defaults);
    }

    if (Array.isArray(pipeline.inheritTemplatePipelineKeys)) {
      for (const inheritKey of pipeline.inheritTemplatePipelineKeys) {
        stacks.push(gather(inheritKey));
      }
    }

    if (Array.isArray(pipeline.supportTemplateIds)) {
      stacks.push(pipeline.supportTemplateIds);
    }

    const collected = [];
    for (const stack of stacks) {
      for (const id of stack) {
        if (seen.has(id)) continue;
        seen.add(id);
        collected.push(id);
      }
    }

    return collected;
  }

  return gather(pipelineKey);
}

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
  const updatedQuality = setTaskQuality(
    task.id,
    {
      score: 3,
      tags: ['clear'],
      notes: 'Great quality',
      reviewerId: 'user-1'
    },
    store
  );

  assert.strictEqual(updatedQuality.quality.score, 3);
  assert.deepStrictEqual(updatedQuality.quality.tags, ['clear']);
  assert.strictEqual(updatedQuality.quality.reviewerId, 'user-1');
  assert.ok(updatedQuality.quality.updatedAt);

  const updatedEthics = setTaskEthics(
    task.id,
    {
      status: 'ok',
      tags: ['balanced'],
      notes: 'No issues',
      reviewerId: 'user-2'
    },
    store
  );

  assert.strictEqual(updatedEthics.ethics.status, 'ok');
  assert.deepStrictEqual(updatedEthics.ethics.tags, ['balanced']);
  assert.strictEqual(updatedEthics.ethics.reviewerId, 'user-2');
  assert.ok(updatedEthics.ethics.updatedAt);

  const fetched = getTaskById(task.id, store);
  assert.strictEqual(fetched.task.quality.score, 3);
  assert.strictEqual(fetched.task.ethics.status, 'ok');
});
