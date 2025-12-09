const test = require('node:test');
const assert = require('assert');

const { pipelines } = require('../../src/core/work/units');
const { taskTemplates, getTaskTemplateById } = require('../../src/core/work/templates/task-templates');
const { resolveTaskDueDateFromTemplate } = require('../../src/core/work/services/projectsService');

const allowedStages = new Set(['planning', 'shoot', 'post']);
const allowedOwnerFunctions = new Set(['producer', 'director', 'dop', 'sound', 'post', 'assistant']);
const allowedDueFrom = new Set(['project_due', 'shoot_date']);

const getTemplateIdsForPipeline = (pipeline) => {
  if (!pipeline) return [];

  const stacks = [];
  if (Array.isArray(pipeline.templateKeys)) stacks.push(pipeline.templateKeys);
  if (Array.isArray(pipeline.defaultTemplateIds)) stacks.push(pipeline.defaultTemplateIds);
  if (Array.isArray(pipeline.defaultTaskTemplateIds)) stacks.push(pipeline.defaultTaskTemplateIds);
  if (Array.isArray(pipeline.inheritTemplatePipelineKeys)) {
    pipeline.inheritTemplatePipelineKeys.forEach((key) => {
      const inherited = pipelines.find((p) => p.key === key);
      stacks.push(getTemplateIdsForPipeline(inherited));
    });
  }
  if (Array.isArray(pipeline.supportTemplateIds)) stacks.push(pipeline.supportTemplateIds);

  return [...new Set(stacks.flat())];
};

test('production pipelines expose owner, stage, and deadline metadata', () => {
  const productionPipelines = pipelines.filter((p) => p.key.startsWith('production.'));
  assert.ok(productionPipelines.length > 0);

  productionPipelines.forEach((pipeline) => {
    const templateIds = getTemplateIdsForPipeline(pipeline);
    assert.ok(templateIds.length > 0, `pipeline ${pipeline.key} should have template ids`);

    const templates = templateIds.map((id) => {
      const tmpl = getTaskTemplateById(id);
      assert.ok(tmpl, `template ${id} should exist`);
      assert.strictEqual(typeof tmpl.ownerFunction, 'string');
      assert.ok(tmpl.ownerFunction.length > 0, `template ${id} should have ownerFunction`);
      assert.ok(
        allowedOwnerFunctions.has(tmpl.ownerFunction),
        `template ${id} ownerFunction should be in allowed set`
      );
      assert.strictEqual(typeof tmpl.stage, 'string');
      assert.ok(allowedStages.has(tmpl.stage), `template ${id} stage should be allowed`);
      assert.strictEqual(typeof tmpl.claimable, 'boolean', `template ${id} claimable should be boolean`);
      assert.ok(allowedDueFrom.has(tmpl.dueFrom), `template ${id} should have allowed dueFrom`);
      return tmpl;
    });

    const stageSet = new Set(templates.map((t) => t.stage));
    assert.ok(stageSet.has('planning'), `${pipeline.key} should include planning tasks`);

    if (pipeline.key.includes('video') || pipeline.key.includes('shihan')) {
      ['shoot', 'post'].forEach((stage) => {
        assert.ok(stageSet.has(stage), `${pipeline.key} should include ${stage} tasks`);
      });
    } else if (pipeline.key.includes('support')) {
      assert.ok(stageSet.has('post'), `${pipeline.key} should include post tasks`);
    }
  });
});

test('shihan production pipelines are hidden if present', () => {
  const shihanPipelines = pipelines.filter((p) => p.key.startsWith('production.shihan'));
  shihanPipelines.forEach((pipeline) => {
    assert.strictEqual(pipeline.hidden, true, `pipeline ${pipeline.key} should be hidden`);
    assert.strictEqual(pipeline.category, 'festival');
    assert.strictEqual(pipeline.multiEvent, true);
  });
});

test('shoot stage tasks use shoot_date base and provide claimable flags', () => {
  const shootStageTasks = taskTemplates.filter(
    (t) => t.unit === 'production' && t.stage === 'shoot'
  );

  shootStageTasks.forEach((task) => {
    assert.strictEqual(task.dueFrom, 'shoot_date');
    assert.strictEqual(typeof task.claimable, 'boolean');
  });
});

test('tasks with shoot_date fallback to project due when shootDate is missing', () => {
  const template = getTaskTemplateById('prod.prep.call_sheet');
  assert.ok(template);

  const dueDate = '2024-01-20';
  const fallbackProject = { slug: 'demo', dueDate, shootDate: null };
  const withFallback = resolveTaskDueDateFromTemplate(template, fallbackProject);
  assert.strictEqual(withFallback, '2024-01-15');

  const shootProject = { slug: 'demo', dueDate, shootDate: '2024-02-01' };
  const shootBased = resolveTaskDueDateFromTemplate(template, shootProject);
  assert.strictEqual(shootBased, '2024-01-27');
});
