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
// Media unit templates
// ==========================

const mediaTaskTemplates = [
  {
    id: 'media_pitch',
    type: 'task',
    unit: 'media',

    label_ar: 'ملخص فكرة المادة التحريرية',
    description_ar: 'صياغة زاوية القصة، الجمهور، وأهداف النشر في فقرة قصيرة.',

    size: 'S',
    definitionOfDone_ar:
      'فقرة أو بطاقة واضحة تتضمن الزاوية، الجمهور، المنصات المقترحة، والمصادر الرئيسية، منشورة في قناة التكليفات.',

    defaultOwnerRole: 'editorial_lead',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['تحرير', 'تكليف', 'فكرة']
  },
  {
    id: 'media_research_notes',
    type: 'task',
    unit: 'media',

    label_ar: 'ملاحظات بحث وروابط موثوقة',
    description_ar: 'جمع المصادر الأساسية والمراجع وروابط البيانات.',

    size: 'S',
    definitionOfDone_ar: 'قائمة روابط وملاحظات منظمة مع تلخيص سريع لكل مصدر، منشورة في خيط أو بطاقة المهمة.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 3,

    pipelineKey: 'media.article_short',

    tags: ['بحث', 'مصادر', 'تحقق']
  },
  {
    id: 'media_interviews',
    type: 'task',
    unit: 'media',

    label_ar: 'جدولة مقابلات أساسية',
    description_ar: 'تنسيق ٢–٣ مقابلات مرتبطة بالمادة التحريرية.',

    size: 'M',
    definitionOfDone_ar: 'مواعيد مؤكدة أو مراسلات مثبتة للمقابلات مع محاور الأسئلة الرئيسية.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.assignments',
    defaultDueDays: 4,

    pipelineKey: 'media.article_long',

    tags: ['مقابلات', 'تنسيق', 'بحث']
  },
  {
    id: 'media_draft',
    type: 'task',
    unit: 'media',

    label_ar: 'مسودة أولية',
    description_ar: 'كتابة المسودة الأولى بالمراجع والاقتباسات.',

    size: 'M',
    definitionOfDone_ar: 'مسودة كاملة مع عناوين فرعية وروابط مصادر، مرفوعة في قناة التحرير أو خيط المشروع.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 5,

    pipelineKey: 'media.article_short',

    tags: ['مسودة', 'تحرير']
  },
  {
    id: 'media_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'تحرير وتدقيق لغوي',
    description_ar: 'مراجعة المسودة، تدقيق لغوي، وضبط العناوين.',

    size: 'S',
    definitionOfDone_ar: 'نسخة محررة مع تعليقات واضحة للمراجعة النهائية، محفوظة في قناة التحرير.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.edits',
    defaultDueDays: 3,

    pipelineKey: 'media.article_short',

    tags: ['تحرير', 'تدقيق']
  },
  {
    id: 'media_fact_check',
    type: 'task',
    unit: 'media',

    label_ar: 'تدقيق حقائق ومطابقة المصادر',
    description_ar: 'التحقق من الأرقام والأسماء والاقتباسات قبل النشر.',

    size: 'S',
    definitionOfDone_ar: 'قائمة فحص موقعة مع مصادر لكل معلومة أساسية، ونتائج التدقيق في قناة الفاكت تشك.',

    defaultOwnerRole: 'fact_checker',
    defaultChannelKey: 'media.factcheck',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['تدقيق', 'حقائق']
  },
  {
    id: 'media_publish_package',
    type: 'task',
    unit: 'media',

    label_ar: 'حزمة النشر والتوزيع',
    description_ar: 'تجهيز العناوين، الملخص، الصور، وروابط النشر.',

    size: 'S',
    definitionOfDone_ar: 'عنوان نهائي، وصف قصير، صورة مميزة، وروابط النشر الداخلية/الخارجية، مع جدول نشر واضح.',

    defaultOwnerRole: 'publishing',
    defaultChannelKey: 'media.exports',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['نشر', 'توزيع']
  },
  {
    id: 'media_photo_brief',
    type: 'task',
    unit: 'media',

    label_ar: 'موجز صور القصة',
    description_ar: 'تحديد اللقطات المطلوبة وزوايا السرد البصري.',

    size: 'S',
    definitionOfDone_ar: 'موجز بصري من ٥ نقاط على الأقل مع أمثلة أو مراجع، منشور في قناة الصور.',

    defaultOwnerRole: 'photo_editor',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 2,

    pipelineKey: 'media.photo_story',

    tags: ['صور', 'موجز']
  },
  {
    id: 'media_photo_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'اختيار ومعالجة الصور',
    description_ar: 'اختيار ٨–١٠ صور ومعالجتها بالألوان والقص.',

    size: 'M',
    definitionOfDone_ar: 'مجلد صور مختارة مع ضبط ألوان أساسي وتسميات الملفات، جاهز للتعليق.',

    defaultOwnerRole: 'photo_editor',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 4,

    pipelineKey: 'media.photo_story',

    tags: ['صور', 'تحرير']
  },
  {
    id: 'media_captions',
    type: 'task',
    unit: 'media',

    label_ar: 'تعليقات وتسويد نصي للصور',
    description_ar: 'كتابة تعليقات واضحة مع أسماء الأشخاص والأماكن والتواريخ.',

    size: 'S',
    definitionOfDone_ar: 'تعليقات دقيقة لكل صورة مع مراجعة لغوية سريعة، محفوظة في ملف مشترك أو بطاقة.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 2,

    pipelineKey: 'media.photo_story',

    tags: ['تعليقات', 'صور']
  },
  {
    id: 'media_social_script',
    type: 'task',
    unit: 'media',

    label_ar: 'سكريبت فيديو قصير',
    description_ar: 'كتابة سكريبت ٦٠–٩٠ ثانية للمنصات الاجتماعية.',

    size: 'S',
    definitionOfDone_ar: 'سكريبت بسيط مع دعوة تفاعل وكلمات مفتاحية، منشور في قناة الفيديو القصير.',

    defaultOwnerRole: 'writer',
    defaultChannelKey: 'media.video',
    defaultDueDays: 2,

    pipelineKey: 'media.short_video_social',

    tags: ['فيديو', 'نص', 'اجتماعي']
  },
  {
    id: 'media_social_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'مونتاج فيديو اجتماعي',
    description_ar: 'مونتاج قصير مع شعارات وتترات مناسبة للمنصات.',

    size: 'M',
    definitionOfDone_ar: 'نسخة جاهزة للنشر بصيغة عمودية أو مربعة مع نصوص على الشاشة وصوت متوازن.',

    defaultOwnerRole: 'video_editor',
    defaultChannelKey: 'media.video',
    defaultDueDays: 4,

    pipelineKey: 'media.short_video_social',

    tags: ['مونتاج', 'فيديو قصير']
  },
  {
    id: 'media_social_graphics',
    type: 'task',
    unit: 'media',

    label_ar: 'جرافيكس وتترات للفيديو',
    description_ar: 'تصميم لوحات بداية/نهاية ونصوص للشاشة.',

    size: 'S',
    definitionOfDone_ar: 'حزمة جرافيكس (لوغو، ألوان، خطوط) ومثال مطبق على الفيديو، جاهزة للاستخدام.',

    defaultOwnerRole: 'designer',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 3,

    pipelineKey: 'media.short_video_social',

    tags: ['جرافيكس', 'فيديو']
  }
];

// ==========================
// People unit templates
// ==========================

const peopleTaskTemplates = [
  {
    id: 'people_brief',
    type: 'task',
    unit: 'people',

    label_ar: 'ملخص الفعالية والأهداف',
    description_ar: 'تحديد الهدف، الجمهور، والسعة المتوقعة للفعالية.',

    size: 'S',
    definitionOfDone_ar: 'فقرة موجزة مع التاريخ المقترح، المكان، والسعة، منشورة لفريق التنظيم.',

    defaultOwnerRole: 'event_lead',
    defaultChannelKey: null,
    defaultDueDays: 2,

    pipelineKey: 'people.event_small',

    tags: ['فعالية', 'تنظيم']
  },
  {
    id: 'people_announcement',
    type: 'task',
    unit: 'people',

    label_ar: 'تصميم وإرسال إعلان',
    description_ar: 'إعداد نص الإعلان وتوزيعه على القنوات المناسبة.',

    size: 'S',
    definitionOfDone_ar: 'نص إعلان مع صورة/ملصق، منشور في القنوات المتفق عليها أو وسائل التواصل.',

    defaultOwnerRole: 'communications',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'people.event_small',

    tags: ['إعلان', 'نشر']
  },
  {
    id: 'people_soundcheck',
    type: 'task',
    unit: 'people',

    label_ar: 'ساوند تشيك وتجهيز تقنية',
    description_ar: 'تحضير الصوت/الإضاءة وتجربة قبل الفعالية الموسيقية.',

    size: 'M',
    definitionOfDone_ar: 'قائمة فحص تقنية مكتملة مع صور أو ملاحظات حول الإعدادات الناجحة.',

    defaultOwnerRole: 'av_lead',
    defaultChannelKey: null,
    defaultDueDays: 2,

    pipelineKey: 'people.event_music',

    tags: ['صوت', 'إضاءة', 'فعالية']
  },
  {
    id: 'people_outreach',
    type: 'task',
    unit: 'people',

    label_ar: 'دعوات وضيوف متحدثون',
    description_ar: 'توجيه الدعوات وتأكيد المتحدثين لمنتدى أو صالون.',

    size: 'M',
    definitionOfDone_ar: 'قائمة ضيوف مؤكدة مع أوقات وصول وسيرة قصيرة لكل متحدث.',

    defaultOwnerRole: 'outreach',
    defaultChannelKey: null,
    defaultDueDays: 4,

    pipelineKey: 'people.event_forum',

    tags: ['دعوات', 'منتدى']
  },
  {
    id: 'people_moderation_plan',
    type: 'task',
    unit: 'people',

    label_ar: 'خطة إدارة الجلسة',
    description_ar: 'تحضير أسئلة رئيسية، جدول زمن، وأدوار التيسير.',

    size: 'S',
    definitionOfDone_ar: 'ورقة واحدة بالمحاور والأسئلة والقواعد الأساسية للنقاش، موزعة على الفريق.',

    defaultOwnerRole: 'moderator',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'people.event_forum',

    tags: ['تيسير', 'منتدى']
  },
  {
    id: 'people_checklist',
    type: 'task',
    unit: 'people',

    label_ar: 'قائمة مهام يوم الفعالية',
    description_ar: 'توزيع المسؤوليات ولوجستيات المكان في يوم الحدث.',

    size: 'S',
    definitionOfDone_ar: 'قائمة فحص مقسمة بالأدوار (استقبال، تسجيل، ضيافة، سلامة) مع أسماء المسؤولين.',

    defaultOwnerRole: 'event_ops',
    defaultChannelKey: null,
    defaultDueDays: 1,

    pipelineKey: 'people.event_small',

    tags: ['تنظيم', 'لوجستيات']
  },
  {
    id: 'people_feedback',
    type: 'task',
    unit: 'people',

    label_ar: 'جمع ملاحظات بعد الفعالية',
    description_ar: 'إرسال نموذج قصير وجمع الملاحظات الأساسية.',

    size: 'S',
    definitionOfDone_ar: 'نموذج أو استبيان مع ملخص لأبرز ٥ ملاحظات قابلة للتنفيذ.',

    defaultOwnerRole: 'event_ops',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'people.event_small',

    tags: ['تقييم', 'تعلم']
  }
];

// ==========================
// Geeks unit templates
// ==========================

const geeksTaskTemplates = [
  {
    id: 'geeks_brief',
    type: 'task',
    unit: 'geeks',

    label_ar: 'ملخص تقني للمشروع',
    description_ar: 'وصف قصير للهدف والنطاق والتقنيات المقترحة.',

    size: 'S',
    definitionOfDone_ar: 'صفحة واحدة توضح المشكلة، الجمهور، والنطاق التقريبي مع التقنيات المرشحة.',

    defaultOwnerRole: 'tech_lead',
    defaultChannelKey: null,
    defaultDueDays: 2,

    pipelineKey: 'geeks.site_basic',

    tags: ['تقني', 'خطة']
  },
  {
    id: 'geeks_content_inventory',
    type: 'task',
    unit: 'geeks',

    label_ar: 'جرد المحتوى والصفحات',
    description_ar: 'تحديد الصفحات/الشاشات المطلوبة ومصادر المحتوى.',

    size: 'S',
    definitionOfDone_ar: 'جدول بالصفحات، البيانات المطلوبة، وأصحاب المحتوى لكل جزء.',

    defaultOwnerRole: 'product',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'geeks.site_basic',

    tags: ['محتوى', 'موقع']
  },
  {
    id: 'geeks_spec',
    type: 'task',
    unit: 'geeks',

    label_ar: 'مواصفات بسيطة للوظائف',
    description_ar: 'كتابة مواصفات مختصرة للشاشات أو الـ API المطلوبة.',

    size: 'S',
    definitionOfDone_ar: 'مستند مواصفات مختصر (user stories أو checklist) متفق عليه مع صاحب المصلحة.',

    defaultOwnerRole: 'product',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'geeks.app_small',

    tags: ['مواصفات', 'تطوير']
  },
  {
    id: 'geeks_implementation',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تنفيذ وبناء أولي',
    description_ar: 'بناء النسخة الأولى من الموقع/الأداة وفق الخطة.',

    size: 'M',
    definitionOfDone_ar: 'نسخة قابلة للتجربة على خادم أو رابط تجريبي مع المزايا المتفق عليها.',

    defaultOwnerRole: 'engineer',
    defaultChannelKey: null,
    defaultDueDays: 7,

    pipelineKey: 'geeks.site_basic',

    tags: ['تطوير', 'تنفيذ']
  },
  {
    id: 'geeks_review',
    type: 'task',
    unit: 'geeks',

    label_ar: 'مراجعة وتحسين',
    description_ar: 'مراجعة مع العميل الداخلي وتطبيق التعديلات الأساسية.',

    size: 'S',
    definitionOfDone_ar: 'قائمة تعديلات منتهية وموافقة مبدئية من صاحب المصلحة.',

    defaultOwnerRole: 'product',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'geeks.site_basic',

    tags: ['مراجعة', 'تحسين']
  },
  {
    id: 'geeks_test',
    type: 'task',
    unit: 'geeks',

    label_ar: 'اختبارات أساسية',
    description_ar: 'تشغيل سيناريوهات اختبار يدوية أو آلية للمزايا الأساسية.',

    size: 'S',
    definitionOfDone_ar: 'قائمة فحص اختبارات مع النتائج والملاحظات الحرجة، مرفوعة في بطاقة المهمة.',

    defaultOwnerRole: 'qa',
    defaultChannelKey: null,
    defaultDueDays: 3,

    pipelineKey: 'geeks.app_small',

    tags: ['اختبار', 'جودة']
  },
  {
    id: 'geeks_launch',
    type: 'task',
    unit: 'geeks',

    label_ar: 'إطلاق وتوثيق مختصر',
    description_ar: 'نشر النسخة النهائية وتوثيق طريقة الاستخدام.',

    size: 'S',
    definitionOfDone_ar: 'رابط إطلاق أو تثبيت نهائي مع ملاحظات تشغيل مختصرة ودليل استخدام قصير.',

    defaultOwnerRole: 'engineer',
    defaultChannelKey: null,
    defaultDueDays: 2,

    pipelineKey: 'geeks.site_basic',

    tags: ['إطلاق', 'توثيق']
  }
];

// ==========================
// Public API
// ==========================

const taskTemplates = [
  // حالياً: فقط قوالب الإنتاج
  ...productionTaskTemplates,
  ...mediaTaskTemplates,
  ...peopleTaskTemplates,
  ...geeksTaskTemplates
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
