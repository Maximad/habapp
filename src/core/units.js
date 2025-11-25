// src/core/units.js
// Defines HabApp units and their pipelines independent of Discord wiring.

const units = [
  {
    key: 'production',
    name_ar: 'وحدة الإنتاج',
    description_ar: 'مسؤولة عن الفيديوهات، الوثائقيات، والمشاريع المرئية.',
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium']
  },
  {
    key: 'media',
    name_ar: 'وحدة الإعلام',
    description_ar: 'تكتب وتنشر المقالات والقصص المصوّرة والمحتوى الاجتماعي.',
    pipelines: ['media.article_short', 'media.article_long', 'media.photo_story', 'media.short_video_social']
  },
  {
    key: 'people',
    name_ar: 'وحدة الناس',
    description_ar: 'تنظّم الفعاليات والحوارات والسهرات الثقافية.',
    pipelines: ['people.event_small', 'people.event_music', 'people.event_forum']
  },
  {
    key: 'geeks',
    name_ar: 'وحدة الجيكس',
    description_ar: 'تطوّر المواقع والأدوات والتطبيقات الصغيرة.',
    pipelines: ['geeks.site_basic', 'geeks.app_small']
  }
];

const pipelines = [
  {
    key: 'production.video_basic',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو داخلي بسيط',
    description_ar: 'فيديوهات صغيرة داخلية (قالب A) للاستخدام السريع.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_basic',
    defaultTemplateIds: [
      'prod_crew_list',
      'prod_call_sheet',
      'prod_location_package',
      'prod_gear_log_thread',
      'prod_edit_plan',
      'prod_rough_cut_delivery',
      'prod_subtitles',
      'prod_color_grading',
      'prod_sound_mix',
      'prod_final_delivery',
      'prod_archive_metadata',
      'prod_post_shoot_report'
    ],
    supportTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan']
  },
  {
    key: 'production.video_doc',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو مقابلات وثائقية',
    description_ar: 'مقابلات وثائقية قياسية (قالب B) مع مسار مراجعة واضح.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_doc',
    defaultTemplateIds: [
      'prod_crew_list',
      'prod_call_sheet',
      'prod_location_package',
      'prod_gear_log_thread',
      'prod_edit_plan',
      'prod_rough_cut_delivery',
      'prod_subtitles',
      'prod_color_grading',
      'prod_sound_mix',
      'prod_final_delivery',
      'prod_archive_metadata',
      'prod_post_shoot_report'
    ],
    inheritTemplatePipelineKeys: ['production.video_basic'],
    supportTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan']
  },
  {
    key: 'production.video_premium',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو بريميوم بجودة عالية',
    description_ar: 'مقابلات أو إنتاجات بريميوم (قالب C) بمعايير مرجعية.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_premium',
    defaultTemplateIds: [
      'prod_crew_list',
      'prod_call_sheet',
      'prod_location_package',
      'prod_gear_log_thread',
      'prod_edit_plan',
      'prod_rough_cut_delivery',
      'prod_subtitles',
      'prod_color_grading',
      'prod_sound_mix',
      'prod_final_delivery',
      'prod_archive_metadata',
      'prod_post_shoot_report'
    ],
    inheritTemplatePipelineKeys: ['production.video_basic'],
    supportTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan']
  },
  {
    key: 'production.support',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'مهام دعم الإنتاج',
    description_ar: 'مهام البنية التحتية والدعم المتكرر للإنتاج.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'production_support',
    defaultTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan'],
    hidden: true
  },
  {
    key: 'media.article_short',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مقال قصير أو سؤال/جواب',
    description_ar: 'مقالات 800–1200 كلمة بأسلوب Q&A أو قصة قصيرة.',
    suggestedStages: ['idea', 'research', 'draft', 'edit', 'publish'],
    profile: 'article_light',
    defaultTemplateIds: [
      'media_pitch',
      'media_research_notes',
      'media_draft',
      'media_edit',
      'media_fact_check',
      'media_publish_package'
    ]
  },
  {
    key: 'media.article_long',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مقال مطوّل',
    description_ar: 'مقالات 1500–2000 كلمة ببحث وتحرير عميق.',
    suggestedStages: ['idea', 'research', 'draft', 'edit', 'publish'],
    profile: 'article_deep',
    defaultTemplateIds: [
      'media_pitch',
      'media_research_notes',
      'media_interviews',
      'media_draft',
      'media_edit',
      'media_fact_check',
      'media_publish_package'
    ]
  },
  {
    key: 'media.photo_story',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'قصة مصوّرة',
    description_ar: 'قصص مصوّرة من 6–8 صور مع تعليق سردي.',
    suggestedStages: ['idea', 'shoot', 'select', 'caption', 'publish'],
    profile: 'photo_story',
    defaultTemplateIds: [
      'media_pitch',
      'media_photo_brief',
      'media_photo_edit',
      'media_captions',
      'media_publish_package'
    ]
  },
  {
    key: 'media.short_video_social',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'فيديو اجتماعي قصير',
    description_ar: 'مقاطع 60–120 ثانية لمنصات التواصل.',
    suggestedStages: ['idea', 'prep', 'shoot', 'edit', 'publish'],
    profile: 'social_video',
    defaultTemplateIds: [
      'media_pitch',
      'media_social_script',
      'media_social_edit',
      'media_social_graphics',
      'media_publish_package'
    ]
  },
  {
    key: 'people.event_small',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'فعالية صغيرة / أوبن مايك',
    description_ar: 'تجمعات صغيرة أو أمسيات أوبن مايك وخفيفة التنظيم.',
    suggestedStages: ['idea', 'announce', 'execute', 'wrapup'],
    profile: 'event_small',
    defaultTemplateIds: [
      'people_brief',
      'people_announcement',
      'people_checklist',
      'people_feedback'
    ]
  },
  {
    key: 'people.event_music',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'فعالية موسيقية',
    description_ar: 'سهرات موسيقية مثل ليلة مقهى Notes كل خميس.',
    suggestedStages: ['idea', 'announce', 'soundcheck', 'execute', 'wrapup'],
    profile: 'event_music',
    defaultTemplateIds: [
      'people_brief',
      'people_announcement',
      'people_soundcheck',
      'people_checklist',
      'people_feedback'
    ]
  },
  {
    key: 'people.event_forum',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'صالون / منتدى حواري',
    description_ar: 'صالونات وندوات عامة للمناقشات المفتوحة.',
    suggestedStages: ['idea', 'outreach', 'moderation', 'execute', 'wrapup'],
    profile: 'event_forum',
    defaultTemplateIds: [
      'people_brief',
      'people_outreach',
      'people_moderation_plan',
      'people_checklist',
      'people_feedback'
    ]
  },
  {
    key: 'geeks.site_basic',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'موقع بسيط',
    description_ar: 'مواقع ووردبريس أو صفحات بسيطة لنشر المحتوى.',
    suggestedStages: ['idea', 'plan', 'build', 'review', 'launch'],
    profile: 'site_basic',
    defaultTemplateIds: [
      'geeks_brief',
      'geeks_content_inventory',
      'geeks_implementation',
      'geeks_review',
      'geeks_launch'
    ]
  },
  {
    key: 'geeks.app_small',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'أداة أو بوت صغير',
    description_ar: 'أدوات أو بوتات صغيرة (مثل HabApp) لتسهيل العمل.',
    suggestedStages: ['idea', 'spec', 'build', 'test', 'launch'],
    profile: 'app_small',
    defaultTemplateIds: [
      'geeks_brief',
      'geeks_spec',
      'geeks_implementation',
      'geeks_test',
      'geeks_launch'
    ]
  }
];

function getUnitByKey(key) {
  const normalized = String(key || '').toLowerCase();
  return units.find(u => u.key === normalized) || null;
}

function getPipelineByKey(key) {
  const normalized = String(key || '').toLowerCase();
  return pipelines.find(p => p.key === normalized) || null;
}

function listPipelinesByUnit(unitKey) {
  const normalized = String(unitKey || '').toLowerCase();
  return pipelines.filter(p => p.unitKey === normalized);
}

module.exports = {
  units,
  pipelines,
  getUnitByKey,
  getPipelineByKey,
  listPipelinesByUnit
};
