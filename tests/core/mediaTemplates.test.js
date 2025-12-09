const test = require('node:test');
const assert = require('assert');

const { getPipelineByKey } = require('../../src/core/work/units');
const { taskTemplates, getTaskTemplateById } = require('../../src/core/work/templates/task-templates');

const mediaPipelineKeys = [
  'media.article_short',
  'media.article_long',
  'media.photo_story',
  'media.data_brief',
  'media.short_video_social',
  'media.podcast_short',
  'media.translation_adapt'
];

test('media pipelines visibility, program/series flags, and podcast recurrence', () => {
  const lab90 = getPipelineByKey('media.lab90_cycle');
  assert.ok(lab90);
  assert.strictEqual(lab90.hidden, true);
  assert.strictEqual(lab90.kind, 'program');

  mediaPipelineKeys.forEach(key => {
    const pipeline = getPipelineByKey(key);
    assert.ok(pipeline, `expected pipeline ${key}`);
    assert.notStrictEqual(pipeline.hidden, true);
  });

  const podcast = getPipelineByKey('media.podcast_short');
  assert.strictEqual(podcast.series, true);
  assert.strictEqual(podcast.isSeries, true);
  assert.strictEqual(podcast.kind, 'series');
  assert.deepStrictEqual(podcast.recurrence?.type, 'series');
  assert.ok(podcast.defaultTemplateIds.includes('media_podcast_series_plan'));
});

test('media templates cleaned and memo/prompt tasks removed from defaults', () => {
  const ideaRoundTemplate = taskTemplates.find(t =>
    t.label_ar === 'جولة أفكار نشر ١٠ أفكار واعتماد ٣' || t.label_ar === 'جولة أفكار نشر 10 أفكار واعتماد 3'
  );
  assert.strictEqual(ideaRoundTemplate, undefined);

  mediaPipelineKeys.forEach(key => {
    const pipeline = getPipelineByKey(key);
    const defaults = pipeline.defaultTemplateIds || [];
    assert.ok(!defaults.includes('media_assignment_memo'), `${key} should not auto-spawn assignment memo`);
  });

  const memo = getTaskTemplateById('media_assignment_memo');
  assert.strictEqual(memo, null);
});

test('accessibility, publishing, archiving, and social tasks carry ownership', () => {
  const accessibility = getTaskTemplateById('media_accessibility_check');
  assert.ok(accessibility);
  assert.strictEqual(accessibility.defaultOwnerFunc, 'desk_editor');
  assert.strictEqual(accessibility.stage, 'post');
  assert.ok(accessibility.label_ar.includes('الوصول الرقمي'));

  const publishTemplate = getTaskTemplateById('media_corrections_log_entry');
  assert.ok(publishTemplate);
  assert.strictEqual(publishTemplate.label_ar, 'نشر على الموقع');
  assert.strictEqual(publishTemplate.ownerFunction, 'desk_editor');
  assert.strictEqual(publishTemplate.stage, 'post');
  assert.ok(publishTemplate.description_ar.includes('SEO'));

  const archiveTemplate = getTaskTemplateById('media_archive_package');
  assert.ok(archiveTemplate);
  assert.strictEqual(archiveTemplate.ownerFunction, 'desk_editor');
  assert.strictEqual(archiveTemplate.stage, 'post');
  assert.ok(archiveTemplate.description_ar.includes('Drive'));

  const social = getTaskTemplateById('media_social_package');
  assert.ok(social);
  assert.strictEqual(social.ownerFunction, 'designer');
  assert.strictEqual(social.stage, 'post');
});

test('media pipelines include art direction, social, and archiving tasks', () => {
  const archiveTemplate = getTaskTemplateById('media_archive_package');
  assert.ok(archiveTemplate);
  assert.ok(archiveTemplate.label_ar.length > 0);

  const artKeys = ['media.article_short', 'media.article_long', 'media.photo_story'];
  artKeys.forEach(key => {
    const pipeline = getPipelineByKey(key);
    assert.ok(pipeline.defaultTemplateIds.includes('media_image_selection'));
    assert.ok(pipeline.defaultTemplateIds.includes('media_image_editing'));
    assert.ok(pipeline.defaultTemplateIds.includes('media_visual_direction'));
    const coverTask = getTaskTemplateById('media_cover_selection');
    assert.ok(coverTask);
    assert.ok(coverTask.label_ar.includes('غلاف'));
    assert.strictEqual(coverTask.ownerFunction, 'designer');
  });

  mediaPipelineKeys.forEach(key => {
    const pipeline = getPipelineByKey(key);
    assert.ok(pipeline.defaultTemplateIds.includes('media_corrections_log_entry'));
    assert.ok(pipeline.defaultTemplateIds.includes('media_archive_package'));
  });

  const social = getTaskTemplateById('media_social_package');
  assert.ok(social);
  assert.strictEqual(social.defaultOwnerFunc, 'designer');

  const editing = getTaskTemplateById('media_image_editing');
  assert.strictEqual(editing.size, 'M');
});

test('optional cross-format and series planning tasks are marked', () => {
  const optionalReel = getTaskTemplateById('media_article_long_reel');
  assert.ok(optionalReel);
  assert.strictEqual(optionalReel.optional, true);

  const optionalData = getTaskTemplateById('media_article_long_data_brief');
  assert.ok(optionalData);
  assert.strictEqual(optionalData.optional, true);

  const podcastPlan = getTaskTemplateById('media_podcast_series_plan');
  assert.ok(podcastPlan);
  assert.strictEqual(podcastPlan.pipelineKey, 'media.podcast_short');
});
