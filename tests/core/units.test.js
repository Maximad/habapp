const test = require('node:test');
const assert = require('assert');

const {
  units,
  pipelines,
  getUnitByKey,
  getPipelineByKey,
  listPipelinesByUnit
} = require('../../src/core/work/units');
const { taskTemplates, getTaskTemplateById } = require('../../src/core/work/templates/task-templates');

test('units expose expected keys and Arabic metadata', () => {
  const unitKeys = units.map(u => u.key);
  ['production', 'think', 'media', 'people', 'geeks'].forEach(key => {
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
  assert.ok(pipelineKeys.includes('production.video_doc_interviews'));
  assert.ok(pipelineKeys.includes('think.research_brief'));
  assert.ok(pipelineKeys.includes('think.support_investigation'));
  assert.ok(pipelineKeys.includes('think.forum_design'));
  assert.ok(pipelineKeys.includes('people.event_music_cycle'));
  assert.ok(pipelineKeys.includes('people.event_open_mic'));
  assert.ok(pipelineKeys.includes('people.exhibition_cycle'));
  assert.ok(pipelineKeys.includes('geeks.site_basic'));
  assert.ok(pipelineKeys.includes('geeks.web_story'));
  assert.ok(pipelineKeys.includes('geeks.game_super_khawiye'));
  assert.ok(pipelineKeys.includes('geeks.ads_campaign'));
  assert.ok(pipelineKeys.includes('geeks.support_external_media'));
  assert.ok(pipelineKeys.includes('geeks.automation_stack'));
  assert.ok(pipelineKeys.includes('geeks.discord_infra'));
  assert.ok(pipelineKeys.includes('media.translation_adapt'));
  assert.ok(pipelineKeys.includes('people.volunteer_onboarding'));

  const pipeline = getPipelineByKey('production.video_doc_interviews');
  assert.strictEqual(pipeline.unitKey, 'production');
  assert.ok(Array.isArray(pipeline.templateKeys));

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

test('documentary interview pipeline exposes expected templates', () => {
  const pipeline = getPipelineByKey('production.video_doc_interviews');
  assert.ok(Array.isArray(pipeline.templateKeys));
  ['prod.prep.crew_list', 'prod.post.sound_mix', 'prod.delivery.postmortem_report'].forEach(key => {
    assert.ok(
      pipeline.templateKeys.includes(key),
      `template key ${key} should be in pipeline`
    );
  });

  const crewTemplate = getTaskTemplateById('prod.prep.crew_list');
  assert.ok(crewTemplate);
  assert.strictEqual(crewTemplate.label_ar, 'بناء قائمة الطاقم للمشروع');
  assert.strictEqual(crewTemplate.defaultOwnerFunc, 'producer');
});

test('media lab90 pipeline and templates are exposed with expected metadata', () => {
  const pipeline = getPipelineByKey('media.lab90_cycle');
  assert.ok(pipeline);
  assert.strictEqual(pipeline.unitKey, 'media');
  assert.strictEqual(pipeline.hidden, true);
  ['media.lab90.recruitment_cohort', 'media.lab90.features_desk_quota', 'media.lab90.mel_cycle_report'].forEach(key => {
    assert.ok(pipeline.templateKeys.includes(key), `template key ${key} should be in media pipeline`);
  });

  const template = getTaskTemplateById('media.lab90.recruitment_cohort');
  assert.ok(template);
  assert.strictEqual(template.label_ar, 'استقطاب واختيار مجموعة لاب ٩٠');
  assert.strictEqual(template.defaultOwnerFunc, 'managing_editor');
  assert.strictEqual(template.defaultChannelKey, 'media.tasks');
});

test('media pipelines include publishing, archiving, and cleaned templates', () => {
  const ideaRoundTemplate = taskTemplates.find(t => t.label_ar === 'جولة أفكار نشر ١٠ أفكار واعتماد ٣');
  assert.strictEqual(ideaRoundTemplate, undefined);

  const publishTemplate = getTaskTemplateById('media_corrections_log_entry');
  assert.ok(publishTemplate);
  assert.strictEqual(publishTemplate.label_ar, 'نشر على الموقع');
  assert.strictEqual(publishTemplate.defaultOwnerFunc, 'desk_editor');

  const archiveTemplate = getTaskTemplateById('media_archive_package');
  assert.ok(archiveTemplate);
  assert.strictEqual(archiveTemplate.label_ar, 'أرشفة المادة في الأرشيف المركزي (نصوص، صور، روابط)');
  assert.strictEqual(archiveTemplate.hasDocLink, true);

  [
    'media.article_short',
    'media.article_long',
    'media.photo_story',
    'media.data_brief',
    'media.short_video_social',
    'media.podcast_short',
    'media.translation_adapt'
  ].forEach(key => {
    const pipeline = getPipelineByKey(key);
    assert.ok(pipeline.defaultTemplateIds.includes('media_corrections_log_entry'));
    assert.ok(pipeline.defaultTemplateIds.includes('media_archive_package'));
  });
});

test('think pipelines and templates are exposed with expected metadata', () => {
  const briefPipeline = getPipelineByKey('think.research_brief');
  assert.ok(briefPipeline);
  ['think.brief.intake_question', 'think.brief.analysis_memo', 'think.brief.methods_handoff'].forEach(key => {
    assert.ok(briefPipeline.templateKeys.includes(key), `template key ${key} should be in think research brief pipeline`);
  });

  const supportPipeline = getPipelineByKey('think.support_investigation');
  assert.ok(supportPipeline);
  assert.ok(supportPipeline.templateKeys.includes('think.support.research_sprint'));

  const forumPipeline = getPipelineByKey('think.forum_design');
  assert.ok(forumPipeline);
  assert.ok(forumPipeline.templateKeys.includes('think.forum.question_map'));

  const intakeTemplate = getTaskTemplateById('think.brief.intake_question');
  assert.ok(intakeTemplate);
  assert.strictEqual(intakeTemplate.label_ar, 'استقبال وصياغة السؤال البحثي');
  assert.strictEqual(intakeTemplate.defaultOwnerFunc, 'researcher');
  assert.strictEqual(intakeTemplate.defaultChannelKey, 'think.topics');

  const sprintTemplate = getTaskTemplateById('think.support.research_sprint');
  assert.ok(sprintTemplate);
  assert.strictEqual(sprintTemplate.label_ar, 'سباق جمع معلومات للقصة');
  assert.strictEqual(sprintTemplate.defaultOwnerFunc, 'researcher');
  assert.strictEqual(sprintTemplate.defaultChannelKey, 'think.data_room');

  const forumTemplate = getTaskTemplateById('think.forum.question_map');
  assert.ok(forumTemplate);
  assert.strictEqual(forumTemplate.label_ar, 'خريطة اسئلة المنتدى');
  assert.strictEqual(forumTemplate.defaultOwnerFunc, 'researcher');
  assert.strictEqual(forumTemplate.defaultChannelKey, 'think.topics');
});

test('people pipelines and templates are exposed with expected metadata', () => {
  const musicPipeline = getPipelineByKey('people.event_music_cycle');
  assert.ok(musicPipeline);
  assert.ok(musicPipeline.templateKeys.includes('people.music.concept_and_venue'));

  const openMicPipeline = getPipelineByKey('people.event_open_mic');
  assert.ok(openMicPipeline);
  assert.ok(openMicPipeline.templateKeys.includes('people.openmic.guidelines'));

  const exhibitionPipeline = getPipelineByKey('people.exhibition_cycle');
  assert.ok(exhibitionPipeline);
  assert.ok(exhibitionPipeline.templateKeys.includes('people.exhibit.curatorial_concept'));

  const musicTemplate = getTaskTemplateById('people.music.concept_and_venue');
  assert.ok(musicTemplate);
  assert.strictEqual(musicTemplate.label_ar, 'الفكرة والاتفاق مع المكان');
  assert.strictEqual(musicTemplate.defaultOwnerFunc, 'event_host');
  assert.strictEqual(musicTemplate.defaultChannelKey, 'people.music_events');

  const openMicTemplate = getTaskTemplateById('people.openmic.guidelines');
  assert.ok(openMicTemplate);
  assert.strictEqual(openMicTemplate.label_ar, 'الإطار والقواعد لأمسية الأوبن مايك');
  assert.strictEqual(openMicTemplate.defaultOwnerFunc, 'event_host');
  assert.strictEqual(openMicTemplate.defaultChannelKey, 'people.openmic_events');

  const exhibitTemplate = getTaskTemplateById('people.exhibit.curatorial_concept');
  assert.ok(exhibitTemplate);
  assert.strictEqual(exhibitTemplate.label_ar, 'المفهوم الكوريتوري واختيار الفنانين');
  assert.strictEqual(exhibitTemplate.defaultOwnerFunc, 'producer');
  assert.strictEqual(exhibitTemplate.defaultChannelKey, 'people.exhibitions');
});

test('geeks pipelines and templates are exposed with expected metadata', () => {
  const sitePipeline = getPipelineByKey('geeks.site_basic');
  assert.ok(sitePipeline);
  assert.ok(sitePipeline.defaultTaskTemplateIds.includes('geeks_site_frontend_build'));

  const storyPipeline = getPipelineByKey('geeks.web_story');
  assert.ok(storyPipeline);
  assert.ok(storyPipeline.defaultTaskTemplateIds.includes('geeks_story_frontend_build'));

  const adsPipeline = getPipelineByKey('geeks.ads_campaign');
  assert.ok(adsPipeline);
  assert.ok(adsPipeline.defaultTaskTemplateIds.includes('geeks_ads_tracking'));

  const storyTemplate = getTaskTemplateById('geeks_story_frontend_build');
  assert.ok(storyTemplate);
  assert.strictEqual(storyTemplate.ownerFunction, 'geeks_frontend');
  assert.strictEqual(storyTemplate.stage, 'build');

  const siteDocTemplate = getTaskTemplateById('geeks_site_docs_handover');
  assert.ok(siteDocTemplate);
  assert.strictEqual(siteDocTemplate.ownerFunction, 'geeks_tech_pm');
  assert.strictEqual(siteDocTemplate.stage, 'post');
});
