// src/core/templates/task-templates.js
// قالب موحّد لقوالب المهام في حبق

/**
 * Schema (for reference):
 *
 * {
 *   id: string,                     // internal ID in English, stable
 *   type: 'task',
 *   unit: 'production' | 'media' | 'people' | 'think' | 'geeks' | 'academy' | 'admin',
 *
 *   label_ar: string,               // اسم المهمة بالعربي (قصير)
 *   description_ar: string,         // وصف مختصر بالعربي
 *
 *   size: 'S' | 'M' | 'L',          // حجم/ثقل المهمة
 *   definitionOfDone_ar: string,    // تعريف الإنجاز بالعربي
 *
 *   defaultOwnerRole: string | null,    // دور منطقي مثل 'producer' أو 'editor'
 *   defaultChannelKey: string | null,   // مفتاح منطقي للقناة، سنربطه لاحقاً بـ config
 *   defaultDueDays: number | null,      // عدد الأيام المقترحة لإنجاز المهمة
 *
 *   tags: string[]                    // كلمات مفتاحية حرة
 *
 *   pipelineKey?: string | null  // optional, points to a pipeline key such as 'production.video_basic'
 * }
 */

// ==========================
// Production unit templates
// ==========================

const productionTaskTemplates = [
  {
    id: 'prod_crew_list',
    type: 'task',
    unit: 'production',

    label_ar: 'بناء قائمة الطاقم لمشروع محدد',
    description_ar: 'إعداد قائمة الطاقم الأساسي مع الأدوار ومواعيد النداء ونشرها في قناة الطاقم.',

    size: 'S',
    definitionOfDone_ar:
      'بطاقة واحدة في قناة الطاقم تحتوي على جميع الأدوار الأساسية، مواعيد النداء، ووسائل التواصل، مرتبطة بالمشروع المحدد.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'production.crew_roster',
    defaultDueDays: 2,

    pipelineKey: 'production.video_basic',

    tags: ['طاقم', 'تنسيق', 'تصوير', 'إنتاج']
  },

  {
    id: 'prod_call_sheet',
    type: 'task',
    unit: 'production',

    label_ar: 'ورقة نداء يوم تصوير',
    description_ar: 'تحضير ورقة نداء ليوم تصوير واحد تتضمن جدول اليوم والموقع والسلامة.',

    size: 'S',
    definitionOfDone_ar:
      'ملف PDF أو مستند واحد يحتوي على جدول اليوم، الموقع، خريطة مختصرة، أرقام التواصل، وملاحظات السلامة، منشور في خيط المشروع وقناة الطاقم.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'production.crew_roster',
    defaultDueDays: 2,

    pipelineKey: 'production.video_basic',

    tags: ['نداء', 'تصوير', 'سلامة', 'تنسيق']
  },

  {
    id: 'prod_location_package',
    type: 'task',
    unit: 'production',

    label_ar: 'حزمة الموقع والموافقات',
    description_ar: 'جمع صور ومعلومات وحدود الموقع والموافقات اللازمة للتصوير.',

    size: 'S',
    definitionOfDone_ar:
      'مجلد واحد منظم للموقع (صور، حدود، تعليمات) مع نموذج أو رسالة موافقة محفوظة، ورابط واضح في خيط المشروع.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'production.location',
    defaultDueDays: 3,

    pipelineKey: 'production.video_basic',

    tags: ['موقع', 'موافقات', 'سلامة', 'إنتاج']
  },

  {
    id: 'prod_gear_log_thread',
    type: 'task',
    unit: 'production',

    label_ar: 'خيط حجز المعدّات للمشروع',
    description_ar: 'تنظيم حجز واستلام وإرجاع المعدّات الخاصة بمشروع واحد.',

    size: 'S',
    definitionOfDone_ar:
      'خيط واحد في قناة سجلّ المعدّات يوضح قائمة المعدّات، حالة الحجز، تاريخ الاستلام والإرجاع، مع ربط واضح بالمشروع.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'production.gear_log',
    defaultDueDays: 1,

    pipelineKey: 'production.video_basic',

    tags: ['معدّات', 'حجز', 'لوجستيات']
  },

  {
    id: 'prod_camera_tests',
    type: 'task',
    unit: 'production',

    label_ar: 'اختبارات كاميرا مظهر وترميز',
    description_ar: 'تجربة إعدادات الكاميرا والترميز قبل مشروع أو سلسلة من المشاريع.',

    size: 'S',
    definitionOfDone_ar:
      'مجموعة لقطات اختبار محفوظة مع ملاحظات مكتوبة حول المظهر والترميز وLUT المعتمد، ورابط في خيط المشروع أو في مرجع عام.',

    defaultOwnerRole: 'dp',
    defaultChannelKey: 'production.tests',
    defaultDueDays: 3,

    pipelineKey: 'production.support',

    tags: ['اختبارات', 'كاميرا', 'LUT', 'فيديو']
  },

  {
    id: 'prod_post_shoot_report',
    type: 'task',
    unit: 'production',

    label_ar: 'تقرير ما بعد التصوير',
    description_ar: 'تلخيص ما نجح وما لم ينجح والمخاطر والدروس المستفادة بعد يوم تصوير.',

    size: 'S',
    definitionOfDone_ar:
      'ملاحظة أو مستند من ١٠ نقاط على الأقل يغطي ما نجح، ما تعثّر، المخاطر التي ظهرت، والاقتراحات للدورات القادمة، منشور في خيط المشروع.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'production.post_mortem',
    defaultDueDays: 2,

    pipelineKey: 'production.video_basic',

    tags: ['تقرير', 'تعلم', 'خطر', 'إنتاج']
  },

  {
    id: 'prod_edit_plan',
    type: 'task',
    unit: 'production',

    label_ar: 'خطة المونتاج أولي ثم نهائي ثم قفل',
    description_ar: 'رسم مسار المونتاج من النسخة الأولية إلى القفل مع تواريخ ومالكين.',

    size: 'S',
    definitionOfDone_ar:
      'بطاقة أو جدول في قناة مسار المونتاج يوضح تاريخ المونتاج الأولي، النهائي، والقفل، مع مالك لكل مرحلة ورابط المشروع.',

    defaultOwnerRole: 'post_supervisor',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 3,

    pipelineKey: 'production.video_basic',

    tags: ['مونتاج', 'خطة', 'مواعيد', 'ما بعد الإنتاج']
  },

  {
    id: 'prod_rough_cut_delivery',
    type: 'task',
    unit: 'production',

    label_ar: 'تسليم مونتاج أولي',
    description_ar: 'رفع نسخة مونتاج أولي مع نقاط مراجعة وخطوات تالية.',

    size: 'M',
    definitionOfDone_ar:
      'رابط نسخة مونتاج أولي في خيط المشروع وقناة مسار المونتاج مع قائمة قصيرة من نقاط المراجعة، ووقت تقريبي للفيديو، وملاحظات القيادة/العميل.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 5,

    pipelineKey: 'production.video_basic',

    tags: ['مونتاج', 'فيديو', 'مراجعة']
  },

  {
    id: 'prod_subtitles',
    type: 'task',
    unit: 'production',

    label_ar: 'ترجمة وملف ترجمات مع تدقيق',
    description_ar: 'إعداد ملف ترجمات منسّق مع تدقيق لغوي أساسي.',

    size: 'S',
    definitionOfDone_ar:
      'ملف SRT واحد على الأقل متوافق مع الماستر، مدقق لغوياً، مع قائمة فحص بسيطة (وقت، أسماء، مصطلحات)، ورابط في خيط المشروع.',

    defaultOwnerRole: 'subtitle_editor',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 4,

    pipelineKey: 'production.video_basic',

    tags: ['ترجمة', 'ترجمات', 'وصول', 'فيديو']
  },

  {
    id: 'prod_color_grading',
    type: 'task',
    unit: 'production',

    label_ar: 'تدرّج لوني',
    description_ar: 'إنجاز درجة لونية أساسية للفيديو مع مقارنة قبل/بعد.',

    size: 'M',
    definitionOfDone_ar:
      'لقطات قبل/بعد محفوظة، إعدادات LUT أو مشروع المونتاج محدث، وموافقة بصرية أولية من المخرج أو المنتج في خيط المشروع.',

    defaultOwnerRole: 'colorist',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 4,

    pipelineKey: 'production.video_basic',

    tags: ['لون', 'فيديو', 'مونتاج']
  },

  {
    id: 'prod_sound_mix',
    type: 'task',
    unit: 'production',

    label_ar: 'تنظيف صوت ومكس',
    description_ar: 'معالجة الضوضاء والمكس النهائي للمادة الصوتية/الفيديو.',

    size: 'M',
    definitionOfDone_ar:
      'حِزم WAV نظيفة أو مكس نهائي للفيديو، مع ملاحظات موجزة عن القرارات (إزالة ضوضاء، موازنة مستويات)، ورابط في خيط المشروع.',

    defaultOwnerRole: 'sound_mixer',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 4,

    pipelineKey: 'production.video_basic',

    tags: ['صوت', 'مكس', 'تنظيف', 'فيديو']
  },

  {
    id: 'prod_final_delivery',
    type: 'task',
    unit: 'production',

    label_ar: 'تسليم نهائي بصيغ متعددة',
    description_ar: 'تجهيز الماستر ونسخ الويب والنسخ الاجتماعية وتسليمها.',

    size: 'S',
    definitionOfDone_ar:
      'ماستر عالي الجودة + نسخة ويب + نسخة واحدة على الأقل اجتماعية (مثلاً ٩:١٦)، جميعها مرفوعة بروابط واضحة في قناة التصدير وخيط المشروع.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'media.exports',
    defaultDueDays: 3,

    pipelineKey: 'production.video_basic',

    tags: ['تسليم', 'ماستر', 'تصدير', 'فيديو']
  },

  {
    id: 'prod_archive_metadata',
    type: 'task',
    unit: 'production',

    label_ar: 'أرشفة وبيانات وصفية',
    description_ar: 'تنظيم المجلدات والبيانات الوصفية الأساسية للمشروع بعد التسليم.',

    size: 'S',
    definitionOfDone_ar:
      'بنية مجلدات واضحة (مشروع، صوت، صورة، مخرجات) مع ملف .txt أو مستند يحتوي على وصف المادة، الكلمات المفتاحية، ورابط الماستر.',

    defaultOwnerRole: 'post_supervisor',
    defaultChannelKey: 'production.archive',
    defaultDueDays: 4,

    pipelineKey: 'production.video_basic',

    tags: ['أرشيف', 'بيانات وصفية', 'تنظيم']
  },

  {
    id: 'prod_sound_library',
    type: 'task',
    unit: 'production',

    label_ar: 'مكتبة أصوات/موسيقى مرخّصة',
    description_ar: 'بناء أو تحديث مكتبة أصوات وموسيقى مرخّصة مع توثيق الاستخدام.',

    size: 'S',
    definitionOfDone_ar:
      'مجلد منظم لملفات الصوت/الموسيقى مع جدول تراخيص (مصدر، نوع الترخيص، المشاريع التي استُخدمت فيها)، ورابط مثبت في قناة الإنتاج أو الصوت.',

    defaultOwnerRole: 'sound_mixer',
    defaultChannelKey: 'production.sound_library',
    defaultDueDays: 7,

    pipelineKey: 'production.support',

    tags: ['صوت', 'موسيقى', 'ترخيص', 'أرشيف']
  },

  {
    id: 'prod_export_presets',
    type: 'task',
    unit: 'production',

    label_ar: 'Preset تصدير قياسي',
    description_ar: 'إعداد ملفات إعدادات تصدير قياسية لبرامج المونتاج المستخدمة.',

    size: 'S',
    definitionOfDone_ar:
      'ملفات Preset جاهزة (Premiere / Resolve / Audition أو ما يناسبكم) مع بطاقة مختصرة “كيف تختار الإعداد الصحيح”، منشورة في قناة ما بعد الإنتاج.',

    defaultOwnerRole: 'post_supervisor',
    defaultChannelKey: 'production.post_pipeline',
    defaultDueDays: 5,

    pipelineKey: 'production.support',

    tags: ['تصدير', 'Preset', 'مونتاج']
  },

  {
    id: 'prod_emergency_plan',
    type: 'task',
    unit: 'production',

    label_ar: 'خطة طوارئ للتصوير',
    description_ar: 'تحضير خطة بديلة للموقع أو الطاقم أو المعدّات في حال حدوث طارئ.',

    size: 'S',
    definitionOfDone_ar:
      'وثيقة قصيرة توضح بدائل الموقع/الطاقم/المعدّات، أرقام الاتصال للحالات الطارئة، وخطوات تفعيل الخطة، منشورة في خيط المشروع وقناة #عاجل إن لزم.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'admin.emergency',
    defaultDueDays: 3,

    pipelineKey: 'production.support',

    tags: ['طوارئ', 'سلامة', 'إنتاج']
  }
];

// ==========================
// Public API
// ==========================

const taskTemplates = [
  // حالياً: فقط قوالب الإنتاج
  ...productionTaskTemplates
  // لاحقاً: نضيف media / think / people / geeks / academy / admin هنا
];

function getTaskTemplateById(id) {
  return taskTemplates.find(t => t.id === id) || null;
}

function listTaskTemplatesByUnit(unit) {
  return taskTemplates.filter(t => t.unit === unit);
}

function listTaskTemplatesByPipeline(pipelineKey) {
  return taskTemplates.filter(t => t.pipelineKey === pipelineKey);
}

function listTaskTemplatesByUnitAndPipeline(unit, pipelineKey) {
  return taskTemplates.filter(t =>
    t.unit === unit && (pipelineKey ? t.pipelineKey === pipelineKey : true)
  );
}

module.exports = {
  taskTemplates,
  getTaskTemplateById,
  listTaskTemplatesByUnit,
  listTaskTemplatesByPipeline,
  listTaskTemplatesByUnitAndPipeline
};
