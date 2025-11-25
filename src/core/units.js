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
    name_ar: 'فيديو داخلي بسيط',
    description_ar: 'فيديوهات صغيرة داخلية (قالب A) للاستخدام السريع.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive']
  },
  {
    key: 'production.video_doc',
    unitKey: 'production',
    name_ar: 'فيديو مقابلات وثائقية',
    description_ar: 'مقابلات وثائقية قياسية (قالب B) مع مسار مراجعة واضح.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive']
  },
  {
    key: 'production.video_premium',
    unitKey: 'production',
    name_ar: 'فيديو بريميوم بجودة عالية',
    description_ar: 'مقابلات أو إنتاجات بريميوم (قالب C) بمعايير مرجعية.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive']
  },
  {
    key: 'media.article_short',
    unitKey: 'media',
    name_ar: 'مقال قصير أو سؤال/جواب',
    description_ar: 'مقالات 800–1200 كلمة بأسلوب Q&A أو قصة قصيرة.',
    suggestedStages: ['idea', 'research', 'draft', 'edit', 'publish']
  },
  {
    key: 'media.article_long',
    unitKey: 'media',
    name_ar: 'مقال مطوّل',
    description_ar: 'مقالات 1500–2000 كلمة ببحث وتحرير عميق.',
    suggestedStages: ['idea', 'research', 'draft', 'edit', 'publish']
  },
  {
    key: 'media.photo_story',
    unitKey: 'media',
    name_ar: 'قصة مصوّرة',
    description_ar: 'قصص مصوّرة من 6–8 صور مع تعليق سردي.',
    suggestedStages: ['idea', 'shoot', 'select', 'caption', 'publish']
  },
  {
    key: 'media.short_video_social',
    unitKey: 'media',
    name_ar: 'فيديو اجتماعي قصير',
    description_ar: 'مقاطع 60–120 ثانية لمنصات التواصل.',
    suggestedStages: ['idea', 'prep', 'shoot', 'edit', 'publish']
  },
  {
    key: 'people.event_small',
    unitKey: 'people',
    name_ar: 'فعالية صغيرة / أوبن مايك',
    description_ar: 'تجمعات صغيرة أو أمسيات أوبن مايك وخفيفة التنظيم.',
    suggestedStages: ['فكرة', 'إعلان', 'تنفيذ', 'ختام'],
    taskTemplates: [] // لاحقاً: مهام تجهيز المكان، التأكد من الوصولية، قائمة حضور، متابعة ما بعد الحدث
  },
  {
    key: 'people.event_music',
    unitKey: 'people',
    name_ar: 'فعالية موسيقية',
    description_ar: 'سهرات موسيقية مثل ليلة مقهى Notes كل خميس.',
    suggestedStages: ['فكرة', 'إعلان', 'بروفة صوت', 'تنفيذ', 'ختام'],
    taskTemplates: [] // لاحقاً: مهام الأصول البصرية، بروفات تقنية، فحص الوصولية، ملخص ما بعد الفعالية
  },
  {
    key: 'people.event_forum',
    unitKey: 'people',
    name_ar: 'صالون / منتدى حواري',
    description_ar: 'صالونات وندوات عامة للمناقشات المفتوحة.',
    suggestedStages: ['فكرة', 'دعوات', 'إدارة حوار', 'تنفيذ', 'ختام'],
    taskTemplates: [] // لاحقاً: مهام الدعوات، ملخص أسئلة، توثيق الحوار، نشر الخلاصة
  },
  {
    key: 'geeks.site_basic',
    unitKey: 'geeks',
    name_ar: 'موقع بسيط',
    description_ar: 'مواقع ووردبريس أو صفحات بسيطة لنشر المحتوى.',
    suggestedStages: ['فكرة', 'تصميم/وايرفريم', 'تطوير', 'مراجعة', 'إطلاق'],
    taskTemplates: [] // لاحقاً: مهام اكتشاف المتطلبات، وايرفريم، تنفيذ، اختبار، تسليم وتدريب
  },
  {
    key: 'geeks.app_small',
    unitKey: 'geeks',
    name_ar: 'أداة أو بوت صغير',
    description_ar: 'أدوات أو بوتات صغيرة (مثل HabApp) لتسهيل العمل.',
    suggestedStages: ['فكرة', 'مواصفات', 'تطوير', 'اختبار', 'إطلاق'],
    taskTemplates: [] // لاحقاً: مهام اكتشاف المستخدم، تصميم تدفق، تنفيذ، اختبار، خطة تشغيل
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
