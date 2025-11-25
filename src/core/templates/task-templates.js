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
 *   pipelines?: string[]         // optional, list of pipelines this template supports
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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.support'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium'],

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
    pipelines: ['production.support'],

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
    pipelines: ['production.support'],

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
// Media unit templates
// ==========================

const mediaTaskTemplates = [
  {
    id: 'media_article_brief_short',
    type: 'task',
    unit: 'media',

    label_ar: 'موجز مقال قصير (سؤال/جواب)',
    description_ar: 'صياغة زوايا الأسئلة وتأكيد المصادر لمقال ٨٠٠–١٢٠٠ كلمة.',

    size: 'S',
    definitionOfDone_ar:
      'موجز منصفحة واحدة يتضمن الفكرة، الأسئلة الرئيسية، المصادر الأولية، والموافقة التحريرية الأولية، منشور في قناة التكليف.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',
    pipelines: ['media.article_short'],

    tags: ['مقال', 'إعلام', 'تخطيط', 'سؤال/جواب']
  },

  {
    id: 'media_article_draft_short',
    type: 'task',
    unit: 'media',

    label_ar: 'مسودة مقال قصير ٨٠٠–١٢٠٠ كلمة',
    description_ar: 'كتابة مسودة أولى لمقال قصير مع روابط المصادر الأساسية.',

    size: 'M',
    definitionOfDone_ar:
      'مسودة كاملة بحد أدنى ٨٠٠ كلمة تتضمن اقتباسات موثقة وروابط المصادر، مرفوعة في قناة التحرير مع ملاحظات رئيسية.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 4,

    pipelineKey: 'media.article_short',
    pipelines: ['media.article_short'],

    tags: ['مقال', 'كتابة', 'تحرير']
  },

  {
    id: 'media_social_cuts_article',
    type: 'task',
    unit: 'media',

    label_ar: 'اقتطاعات اجتماعية لمقال قصير',
    description_ar: 'تحضير مقتطفات ونشرات اجتماعية للمقال مع روابط القراءة.',

    size: 'S',
    definitionOfDone_ar:
      '٣–٥ مقتطفات أو بطاقات جاهزة للنشر مع نصوص مرافقة وروابط المادة الأصلية، مع جدول نشر مقترح.',

    defaultOwnerRole: 'social_editor',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',
    pipelines: ['media.article_short'],

    tags: ['اجتماعي', 'نشر', 'مقتطفات']
  },

  {
    id: 'media_article_brief_long',
    type: 'task',
    unit: 'media',

    label_ar: 'موجز مقال مطوّل',
    description_ar: 'وضع هيكل وأسئلة ومصادر لمقال ١٥٠٠–٢٠٠٠ كلمة.',

    size: 'S',
    definitionOfDone_ar:
      'موجز يتضمن الأطروحة، الفصول أو الأقسام، قائمة المصادر المقترحة، وجداول مقابلات رئيسية، منشور في قناة التكليف.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 3,

    pipelineKey: 'media.article_long',
    pipelines: ['media.article_long'],
    pipelines: ['media.article_long'],

    tags: ['مقال', 'تخطيط', 'بحث']
  },

  {
    id: 'media_article_draft_long',
    type: 'task',
    unit: 'media',

    label_ar: 'مسودة مقال مطوّل',
    description_ar: 'كتابة مسودة مطوّلة تشمل مقدمة، سرد، وخاتمة مدعومة بالمصادر.',

    size: 'L',
    definitionOfDone_ar:
      'مسودة كاملة لا تقل عن ١٥٠٠ كلمة مع استشهادات وروابط، جاهزة لجولة تحرير أولى في قناة التحرير.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 6,

    pipelineKey: 'media.article_long',
    pipelines: ['media.article_long'],

    tags: ['مقال', 'كتابة', 'تحرير', 'بحث']
  },

  {
    id: 'media_deep_edit_pass',
    type: 'task',
    unit: 'media',

    label_ar: 'جولة تحرير عميقة',
    description_ar: 'مراجعة بنيوية ولغوية للمقال المطوّل قبل النشر.',

    size: 'M',
    definitionOfDone_ar:
      'ملاحظات تحريرية واضحة حول البنية واللغة مع نسخة محدثة من النص، منشورة للموافقة النهائية.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 3,

    pipelineKey: 'media.article_long',

    tags: ['تحرير', 'مراجعة', 'إعلام']
  },

  {
    id: 'media_photo_story_brief',
    type: 'task',
    unit: 'media',

    label_ar: 'موجز قصة مصوّرة',
    description_ar: 'تحديد زوايا القصة وأسلوب السرد وعدد الصور المطلوبة.',

    size: 'S',
    definitionOfDone_ar:
      'ملخص يوضح الشخصيات، المواقع، وعدد اللقطات المستهدفة مع جدول زمني وتصاريح ضرورية.',

    defaultOwnerRole: 'photo_editor',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 3,

    pipelineKey: 'media.photo_story',
    pipelines: ['media.photo_story'],

    tags: ['تصوير', 'قصة', 'تخطيط']
  },

  {
    id: 'media_photo_story_selection',
    type: 'task',
    unit: 'media',

    label_ar: 'اختيار صور القصة وتحريرها',
    description_ar: 'اختيار ٦–٨ صور مع تصحيح لوني أساسي وتسميات.',

    size: 'M',
    definitionOfDone_ar:
      'مجموعة نهائية من ٦–٨ صور عالية الجودة مع تسميات عربية ووصف مختصر لكل صورة، جاهزة للنشر.',

    defaultOwnerRole: 'photo_editor',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 4,

    pipelineKey: 'media.photo_story',
    pipelines: ['media.photo_story'],

    tags: ['تصوير', 'تحرير', 'نشر']
  },

  {
    id: 'media_photo_story_captions',
    type: 'task',
    unit: 'media',

    label_ar: 'تسميات وتعليقات القصة المصوّرة',
    description_ar: 'كتابة تسميات ونص بديل للقصة المصورة.',

    size: 'S',
    definitionOfDone_ar:
      'تسميات عربية دقيقة لكل صورة مع نص بديل ووصف مختصر للنشر، منشورة في قناة التحرير.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 2,

    pipelineKey: 'media.photo_story',
    pipelines: ['media.photo_story'],

    tags: ['وصول', 'تعليقات', 'تصوير']
  },

  {
    id: 'media_social_script',
    type: 'task',
    unit: 'media',

    label_ar: 'نص فيديو اجتماعي قصير',
    description_ar: 'كتابة نص أو مخطط لفيديو ٦٠–١٢٠ ثانية.',

    size: 'S',
    definitionOfDone_ar:
      'نص أو مخطط زمني يتضمن المشاهد الرئيسية والنص المقترح مع مصدر أو رابط داعم، منشور للموافقة.',

    defaultOwnerRole: 'producer',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 2,

    pipelineKey: 'media.short_video_social',
    pipelines: ['media.short_video_social'],

    tags: ['فيديو', 'اجتماعي', 'تخطيط']
  },

  {
    id: 'media_social_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'مونتاج فيديو اجتماعي قصير',
    description_ar: 'مونتاج نسخة أولية ونهائية لمقطع اجتماعي.',

    size: 'M',
    definitionOfDone_ar:
      'نسخة أولية ونهائية بطولين ٦٠–١٢٠ ثانية مع موسيقى/رسوم مناسبة، وروابط مرفوعة في قناة الفيديو.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.video',
    defaultDueDays: 4,

    pipelineKey: 'media.short_video_social',
    pipelines: ['media.short_video_social'],

    tags: ['مونتاج', 'فيديو', 'اجتماعي']
  },

  {
    id: 'media_social_cutdowns',
    type: 'task',
    unit: 'media',

    label_ar: 'تقطيعات ونشر اجتماعي للفيديو',
    description_ar: 'إعداد نسخ متعددة للأحجام والمنصات مع نسخ النشر.',

    size: 'S',
    definitionOfDone_ar:
      '٣ نسخ على الأقل بأبعاد ملائمة (١٦:٩، ١:١، ٩:١٦) مع نصوص نشر وروابط الماستر.',

    defaultOwnerRole: 'social_editor',
    defaultChannelKey: 'media.exports',
    defaultDueDays: 2,

    pipelineKey: 'media.short_video_social',
    pipelines: ['media.short_video_social'],

    tags: ['نشر', 'اجتماعي', 'تصدير']
  },

  // ——— Media support / مشتركة ———
  {
    id: 'media_translation',
    type: 'task',
    unit: 'media',

    label_ar: 'ترجمة وتدقيق لغوي للمادة',
    description_ar: 'ترجمة المادة المطلوبة وتدقيقها لغوياً مع مقارنة المصطلحات.',

    size: 'S',
    definitionOfDone_ar:
      'ملف مترجم ومراجع مع جدول مصطلحات رئيسية ومصادرها، منشور في قناة التحرير.',

    defaultOwnerRole: 'translator',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 3,

    pipelineKey: 'media.support',
    pipelines: [
      'media.support',
      'media.article_short',
      'media.article_long',
      'media.photo_story',
      'media.short_video_social'
    ],

    tags: ['ترجمة', 'تحرير', 'مصطلحات']
  },

  {
    id: 'media_fact_check',
    type: 'task',
    unit: 'media',

    label_ar: 'تدقيق حقائق',
    description_ar: 'مراجعة المعلومات والأرقام والمصادر قبل النشر.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة تحقق بالمصادر والتأكيدات مع ملاحظات المخاطر، منشورة في قناة تدقيق الحقائق.',

    defaultOwnerRole: 'fact_checker',
    defaultChannelKey: 'media.fact_check',
    defaultDueDays: 2,

    pipelineKey: 'media.support',
    pipelines: [
      'media.support',
      'media.article_short',
      'media.article_long',
      'media.photo_story',
      'media.short_video_social'
    ],

    tags: ['تحقق', 'مصادر', 'إعلام']
  },

  {
    id: 'media_accessibility_review',
    type: 'task',
    unit: 'media',

    label_ar: 'مراجعة الوصول وإتاحة المحتوى',
    description_ar: 'إضافة نص بديل، تباين، وترجمات/تفريغ حيث يلزم.',

    size: 'S',
    definitionOfDone_ar:
      'ملف نص بديل للصور أو ترجمات/تفريغ للفيديو مع قائمة فحص وصول منشورة قبل النشر.',

    defaultOwnerRole: 'accessibility_editor',
    defaultChannelKey: 'media.exports',
    defaultDueDays: 2,

    pipelineKey: 'media.support',
    pipelines: [
      'media.support',
      'media.article_short',
      'media.article_long',
      'media.photo_story',
      'media.short_video_social'
    ],

    tags: ['وصول', 'ترجمات', 'إتاحة']
  },

  {
    id: 'media_sources_log',
    type: 'task',
    unit: 'media',

    label_ar: 'سجل المصادر والموافقات',
    description_ar: 'توثيق المصادر، التصاريح، والملكية الفكرية للمادة.',

    size: 'S',
    definitionOfDone_ar:
      'جدول مصادر مع بيانات التواصل وروابط الموافقات أو رسائل البريد، محفوظ في مجلد المشروع ومثبت في قناة التكليف.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 2,

    pipelineKey: 'media.support',
    pipelines: [
      'media.support',
      'media.article_short',
      'media.article_long',
      'media.photo_story',
      'media.short_video_social'
    ],

    tags: ['مصادر', 'موافقات', 'توثيق']
  }
];

// ==========================
// Public API
// ==========================

const peopleTaskTemplates = [];
const geeksTaskTemplates = [];

const taskTemplates = [
  // قوالب الإنتاج والإعلام حالياً
  ...productionTaskTemplates,
  ...mediaTaskTemplates,
  ...peopleTaskTemplates,
  ...geeksTaskTemplates
  // لاحقاً: نضيف think / academy / admin هنا
];

function matchesPipeline(template, pipelineKey) {
  if (!pipelineKey) return false;
  if (Array.isArray(template.pipelines) && template.pipelines.includes(pipelineKey)) {
    return true;
  }
  if (template.pipelineKey) {
    return template.pipelineKey === pipelineKey;
  }
  return false;
}

function getTaskTemplateById(id) {
  return taskTemplates.find(t => t.id === id) || null;
}

function listTaskTemplatesByUnit(unit) {
  return taskTemplates.filter(t => t.unit === unit);
}

function listTaskTemplatesByPipeline(pipelineKey) {
  return taskTemplates.filter(t => matchesPipeline(t, pipelineKey));
}

function listTaskTemplatesByUnitAndPipeline(unit, pipelineKey) {
  return taskTemplates.filter(t =>
    t.unit === unit && (pipelineKey ? matchesPipeline(t, pipelineKey) : true)
  );
}

module.exports = {
  taskTemplates,
  getTaskTemplateById,
  listTaskTemplatesByUnit,
  listTaskTemplatesByPipeline,
  listTaskTemplatesByUnitAndPipeline
};
