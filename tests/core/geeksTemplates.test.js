const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getPipelineByKey,
  listPipelinesByUnit
} = require('../../src/core/work/units');
const {
  getTaskTemplateById
} = require('../../src/core/work/templates/task-templates');

const GEEKS_PIPELINES = [
  'geeks.site_basic',
  'geeks.web_story',
  'geeks.game_super_khawiye',
  'geeks.ads_campaign',
  'geeks.support_external_media'
];

function collectPipelineTemplates(pipelineKey) {
  const pipeline = getPipelineByKey(pipelineKey);
  const templates = [];
  const lists = [pipeline.defaultTaskTemplateIds || pipeline.defaultTemplateIds];
  if (Array.isArray(pipeline.supportTemplateIds)) lists.push(pipeline.supportTemplateIds);
  if (Array.isArray(pipeline.templateKeys)) lists.push(pipeline.templateKeys);
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const id of list) {
      const tpl = getTaskTemplateById(id);
      if (tpl) templates.push(tpl);
    }
  }
  return templates;
}

test('geeks pipelines are exposed with expected categories', () => {
  const pipelines = listPipelinesByUnit('geeks').map(p => p.key);
  GEEKS_PIPELINES.forEach(key => {
    assert.ok(pipelines.includes(key), `${key} should be present for geeks unit`);
    const pipeline = getPipelineByKey(key);
    assert.equal(pipeline.unitKey, 'geeks');
  });
});

test('geeks templates carry ownerFunction, stage, and claimable flags', () => {
  GEEKS_PIPELINES.forEach(key => {
    const templates = collectPipelineTemplates(key);
    assert.ok(templates.length > 0, `${key} should have templates`);
    templates.forEach(tpl => {
      assert.ok(typeof tpl.ownerFunction === 'string' && tpl.ownerFunction.length > 0);
      assert.ok(typeof tpl.stage === 'string' && tpl.stage.length > 0);
      assert.ok(typeof tpl.claimable === 'boolean');
    });
    const ownerPrefixesOk = templates.every(tpl => tpl.ownerFunction.includes('geeks'));
    assert.ok(ownerPrefixesOk, `${key} owner roles should use geeks functions`);
  });
});

test('geeks pipelines include documentation or archive coverage', () => {
  const matcher = /توثيق|أرشفة|archive|docs/i;
  GEEKS_PIPELINES.forEach(key => {
    const templates = collectPipelineTemplates(key);
    const hasDocArchive = templates.some(tpl => matcher.test(tpl.title_ar || tpl.label_ar || tpl.id));
    assert.ok(hasDocArchive, `${key} should contain a doc/archive task`);
  });
});

test('geeks pipelines mix claimable and non-claimable tasks', () => {
  GEEKS_PIPELINES.forEach(key => {
    const templates = collectPipelineTemplates(key);
    const claimableFlags = templates.map(t => t.claimable);
    assert.ok(claimableFlags.some(Boolean), `${key} should have at least one claimable task`);
    assert.ok(claimableFlags.some(flag => flag === false), `${key} should have at least one non-claimable task`);
  });
});
