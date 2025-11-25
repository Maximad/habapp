const test = require('node:test');
const assert = require('assert');

const {
  units,
  pipelines,
  getUnitByKey,
  getPipelineByKey,
  listPipelinesByUnit
} = require('../../src/core/units');

test('units expose expected keys and Arabic metadata', () => {
  const unitKeys = units.map(u => u.key);
  ['production', 'media', 'people', 'geeks'].forEach(key => {
    assert.ok(unitKeys.includes(key));
    const unit = getUnitByKey(key);
    assert.ok(unit.name_ar.length > 0);
    assert.ok(unit.description_ar.length > 0);
    assert.ok(Array.isArray(unit.pipelines));
  });
});

test('pipelines are linked to units and retrievable by key', () => {
  const pipelineKeys = pipelines.map(p => p.key);
  assert.ok(pipelineKeys.includes('production.video_basic'));
  assert.ok(pipelineKeys.includes('geeks.app_small'));
  assert.ok(pipelineKeys.includes('geeks.automation_stack'));
  assert.ok(pipelineKeys.includes('geeks.discord_infra'));
  assert.ok(pipelineKeys.includes('media.translation_adapt'));
  assert.ok(pipelineKeys.includes('people.volunteer_onboarding'));

  const pipeline = getPipelineByKey('production.video_doc');
  assert.strictEqual(pipeline.unitKey, 'production');
  assert.ok(Array.isArray(pipeline.suggestedStages));

  const mediaPipeline = getPipelineByKey('media.article_short');
  assert.strictEqual(mediaPipeline.unitKey, 'media');
  assert.ok(Array.isArray(mediaPipeline.stages_ar));
  assert.ok(Array.isArray(mediaPipeline.defaultTaskTemplateIds));

  const peoplePipeline = getPipelineByKey('people.event_small');
  assert.strictEqual(peoplePipeline.unitKey, 'people');
  assert.ok(Array.isArray(peoplePipeline.stages_ar));
  assert.ok(Array.isArray(peoplePipeline.defaultTaskTemplateIds));

  const geeksPipeline = getPipelineByKey('geeks.site_basic');
  assert.strictEqual(geeksPipeline.unitKey, 'geeks');
  assert.ok(Array.isArray(geeksPipeline.stages_ar));
  assert.ok(Array.isArray(geeksPipeline.defaultTaskTemplateIds));
});

test('listPipelinesByUnit filters by unit key', () => {
  const prodPipelines = listPipelinesByUnit('production');
  assert.ok(prodPipelines.every(p => p.unitKey === 'production'));

  const unknown = listPipelinesByUnit('unknown');
  assert.deepStrictEqual(unknown, []);
});
