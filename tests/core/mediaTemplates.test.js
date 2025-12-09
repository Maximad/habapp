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
    if (key !== 'media.article_short') {
      assert.ok(pipeline.defaultTemplateIds.includes('media_image_selection'));
      assert.ok(pipeline.defaultTemplateIds.includes('media_image_editing'));
      assert.ok(pipeline.defaultTemplateIds.includes('media_visual_direction'));
      const coverTask = getTaskTemplateById('media_cover_selection');
      assert.ok(coverTask);
      assert.ok(coverTask.label_ar.includes('غلاف'));
      assert.strictEqual(coverTask.ownerFunction, 'designer');
    }
  });

  mediaPipelineKeys.forEach(key => {
    const pipeline = getPipelineByKey(key);
    if (key === 'media.article_short') {
      assert.ok(pipeline.defaultTemplateIds.includes('media_article_short_publish'));
      assert.ok(pipeline.defaultTemplateIds.includes('media_article_short_archive'));
    } else {
      assert.ok(pipeline.defaultTemplateIds.includes('media_corrections_log_entry'));
      assert.ok(pipeline.defaultTemplateIds.includes('media_archive_package'));
    }
  });

  const social = getTaskTemplateById('media_social_package');
  assert.ok(social);
  assert.strictEqual(social.defaultOwnerFunc, 'designer');

  const editing = getTaskTemplateById('media_image_editing');
  assert.strictEqual(editing.size, 'M');
});

test('media.article_short pipeline tasks reordered with offsets and roles', () => {
  const pipeline = getPipelineByKey('media.article_short');
  assert.ok(pipeline);

  const defaults = (pipeline.defaultTemplateIds || []).map(id => getTaskTemplateById(id));
  assert.strictEqual(defaults.length, 8);

  const titles = defaults.map(t => t.label_ar);
  assert.ok(titles.includes('مقابلة سريعة وجمع المادة'));
  assert.ok(titles.includes('كتابة المقال القصير'));
  assert.ok(titles.includes('اختيار صور المادة وتوثيق الحقوق وصورة الغلاف والمعالجة الأولية'));
  assert.ok(titles.includes('تحرير مجموعة الصور ومعالجة اللون وفق دليل الهوية البصرية'));
  assert.ok(titles.includes('حزمة منصات اجتماعية للمادة (بوست + ستوري + ٣ تقطيعات)'));
  assert.ok(titles.includes('نشر على الموقع'));
  assert.ok(titles.includes('أرشفة المادة والملفات المرافقة'));

  const byFunction = Object.fromEntries(defaults.map(t => [t.functionKey, t.id]));
  assert.ok(byFunction.media_writer);
  assert.ok(byFunction.media_photo);
  assert.ok(byFunction.media_editor);
  assert.ok(byFunction.media_social);
  assert.ok(byFunction.media_web);
  assert.ok(byFunction.media_archive);

  const offsetMap = Object.fromEntries(defaults.map(t => [t.label_ar, t.meta?.offsetDays]));
  assert.strictEqual(offsetMap['مقابلة سريعة وجمع المادة'], -4);
  assert.strictEqual(offsetMap['كتابة المقال القصير'], -3);
  assert.strictEqual(offsetMap['اختيار صور المادة وتوثيق الحقوق وصورة الغلاف والمعالجة الأولية'], -3);
  assert.strictEqual(offsetMap['تحرير مجموعة الصور ومعالجة اللون وفق دليل الهوية البصرية'], -2);
  assert.strictEqual(offsetMap['مراجعة سهولة القراءة والوصول للمادة'], -2);
  assert.strictEqual(offsetMap['حزمة منصات اجتماعية للمادة (بوست + ستوري + ٣ تقطيعات)'], -1);
  assert.strictEqual(offsetMap['نشر على الموقع'], 0);
  assert.strictEqual(offsetMap['أرشفة المادة والملفات المرافقة'], 1);
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
