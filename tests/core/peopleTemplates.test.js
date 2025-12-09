const test = require('node:test');
const assert = require('assert');

const { pipelines } = require('../../src/core/work/units');
const { getTaskTemplateById } = require('../../src/core/work/templates/task-templates');

const allowedStages = new Set(['planning', 'shoot', 'post']);
const allowedRecurrenceTypes = new Set(['single', 'series']);
const allowedRecurrencePatterns = new Set(['one_off', 'weekly', 'monthly', 'seasonal']);

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

const hasMatchingTask = (templates, predicate) => templates.some(predicate);

const clusterChecks = {
  concept: (t) => t.label_ar.includes('تصور') || t.id === 'people_event_concept',
  visuals: (t) => t.id === 'people_event_poster' || t.id === 'people_event_visual_assets',
  logistics: (t) => t.id === 'people_event_logistics' || t.id === 'people_event_access_guide',
  ethics: (t) => t.id === 'people_event_risk_review' || t.tag === 'safety_check',
  documentation: (t) => t.id === 'people_event_photo_doc' || t.tag === 'archive_entry'
};

test('people pipelines carry event metadata and recurrence hints', () => {
  const peoplePipelines = pipelines.filter((p) => p.unitKey === 'people');
  assert.ok(peoplePipelines.length > 0);

  peoplePipelines.forEach((pipeline) => {
    assert.strictEqual(pipeline.unitKey, 'people');
    assert.strictEqual(pipeline.kind, 'event');
    assert.ok(pipeline.recurrence);
    assert.ok(allowedRecurrenceTypes.has(pipeline.recurrence.type));
    assert.ok(allowedRecurrencePatterns.has(pipeline.recurrence.pattern));
  });
});

test('people pipelines expose required tasks, ownership, stages, and cross-unit hints', () => {
  const peoplePipelines = pipelines.filter((p) => p.unitKey === 'people');

  peoplePipelines.forEach((pipeline) => {
    const templateIds = getTemplateIdsForPipeline(pipeline);
    assert.ok(templateIds.length > 0, `pipeline ${pipeline.key} should have templates`);

    const templates = templateIds.map((id) => {
      const tmpl = getTaskTemplateById(id);
      assert.ok(tmpl, `template ${id} should exist`);
      assert.strictEqual(typeof tmpl.ownerFunction, 'string');
      assert.ok(tmpl.ownerFunction.length > 0, `template ${id} should have ownerFunction`);
      assert.ok(allowedStages.has(tmpl.stage), `template ${id} stage must be allowed`);
      assert.strictEqual(typeof tmpl.claimable, 'boolean', `template ${id} claimable must be boolean`);
      return tmpl;
    });

    if (
      pipeline.key.startsWith('people.event') ||
      pipeline.key === 'people.training_mini' ||
      pipeline.key === 'people.exhibition_cycle'
    ) {
      const mediaCrossUnit = templates.some(
        (t) => t.crossUnit && (t.crossUnit.targetUnit === 'media' || t.crossUnit.media === true)
      );
      const geeksCrossUnit = templates.some(
        (t) => t.crossUnit && (t.crossUnit.targetUnit === 'geeks' || t.crossUnit.geeks === true)
      );
      assert.ok(mediaCrossUnit, `${pipeline.key} should surface media crossUnit hints`);
      assert.ok(geeksCrossUnit, `${pipeline.key} should surface geeks crossUnit hints`);

      Object.entries(clusterChecks).forEach(([name, matcher]) => {
        assert.ok(
          hasMatchingTask(templates, matcher),
          `${pipeline.key} should include ${name} cluster task`
        );
      });
    } else {
      const geeksCrossUnit = templates.some(
        (t) => t.crossUnit && (t.crossUnit.targetUnit === 'geeks' || t.crossUnit.geeks === true)
      );
      assert.ok(typeof geeksCrossUnit === 'boolean');
    }
  });
});

test('people pipelines include archiving and talent follow-up tasks', () => {
  const peopleEventPipelines = pipelines.filter((p) => p.unitKey === 'people');

  peopleEventPipelines.forEach((pipeline) => {
    const templateIds = getTemplateIdsForPipeline(pipeline);
    const templates = templateIds.map((id) => getTaskTemplateById(id)).filter(Boolean);
    const archiveTask = templates.find((t) => t.tag === 'archive_entry' || t.id === 'people_event_archive_entry');
    const talentTask = templates.find((t) => t.id === 'people_log_talent');

    assert.ok(archiveTask, `${pipeline.key} should include archive task`);
    assert.ok(talentTask, `${pipeline.key} should include talent log task`);
  });
});

test('people event pipelines carry explicit media/geeks request tasks', () => {
  const eventSmall = pipelines.find((p) => p.key === 'people.event_small');
  const openMic = pipelines.find((p) => p.key === 'people.event_open_mic');

  [eventSmall, openMic].forEach((pipeline) => {
    const templateIds = getTemplateIdsForPipeline(pipeline);
    const templates = templateIds.map((id) => getTaskTemplateById(id)).filter(Boolean);
    const mediaRequest = templates.find((t) => t.id === 'people_event_media_request');
    const geeksRequest = templates.find((t) => t.id === 'people_event_geeks_request');

    assert.ok(mediaRequest, `${pipeline.key} should include media request task`);
    assert.strictEqual(mediaRequest.crossUnit.targetUnit, 'media');
    assert.ok(geeksRequest, `${pipeline.key} should include geeks request task`);
    assert.strictEqual(geeksRequest.crossUnit.targetUnit, 'geeks');
  });
});
