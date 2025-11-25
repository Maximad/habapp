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
    id: 'media_ideas_round',
    type: 'task',
    unit: 'media',

    label_ar: 'جولة أفكار نشر ١٠ أفكار واعتماد ٣',
    description_ar: 'جلسة سريعة لجمع ١٠ أفكار ونقاشها واعتماد ٣ منها كبدايات مشاريع.',

    size: 'S',
    definitionOfDone_ar:
      'جدول في قناة أفكار النشر يحتوي على ١٠ أفكار مختصرة، مع تحديد ٣ أفكار معتمدة ومذكور اسم المالك المبدئي لكل فكرة.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.ideas',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['أفكار', 'نشر', 'تخطيط']
  },
  {
    id: 'media_assignment_memo',
    type: 'task',
    unit: 'media',

    label_ar: 'مذكرة تكليف لمادة محددة',
    description_ar: 'كتابة مذكرة تكليف واضحة لمادة واحدة مع تعريف الإنجاز والموعد والمالك.',

    size: 'S',
    definitionOfDone_ar:
      'خيط واحد في #assignment-desk يضم ملخص الفكرة، تعريف الإنجاز، المالك، الموعد، ورابط مشروع HabApp إن وجد.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.assignment_desk',
    defaultDueDays: 1,

    pipelineKey: 'media.article_short',

    tags: ['تكليف', 'تحرير', 'إدارة مهام']
  },
  {
    id: 'media_quick_interview',
    type: 'task',
    unit: 'media',

    label_ar: 'مقابلة سريعة سؤال وجواب',
    description_ar: 'مقابلة من ٨٠٠ إلى ١٢٠٠ كلمة مع شخص واحد وصورة مرافقة.',

    size: 'M',
    definitionOfDone_ar:
      'نص من ٨٠٠ إلى ١٢٠٠ كلمة منظم كسؤال وجواب، مع صورة واحدة على الأقل، وملاحظات تدقيق أساسية، جاهز للتحرير.',

    defaultOwnerRole: 'reporter',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 4,

    pipelineKey: 'media.article_short',

    tags: ['مقابلة', 'سؤال وجواب', 'نص']
  },
  {
    id: 'media_short_article_write',
    type: 'task',
    unit: 'media',

    label_ar: 'كتابة مقال قصير',
    description_ar: 'صياغة مادة من ٨٠٠ إلى ١٢٠٠ كلمة بناء على التكليف والمصادر المتاحة.',

    size: 'M',
    definitionOfDone_ar:
      'مسودة كاملة في خيط المادة، ضمن الطول المطلوب، مع عناوين فرعية مقترحة، واقتباس رئيسي واحد على الأقل.',

    defaultOwnerRole: 'reporter',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 5,

    pipelineKey: 'media.article_short',

    tags: ['مقال', 'نص', 'تحرير']
  },
  {
    id: 'media_long_article_write',
    type: 'task',
    unit: 'media',

    label_ar: 'كتابة مادة مطوّلة',
    description_ar: 'صياغة مادة معمّقة مع خريطة بناء وأقسام واضحة.',

    size: 'L',
    definitionOfDone_ar:
      'مسودة أولى كاملة مع خريطة بناء في رأس المستند، وعناوين فرعية واضحة، وقائمة مراجع أولية.',

    defaultOwnerRole: 'reporter',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 8,

    pipelineKey: 'media.article_long',

    tags: ['تحقيق', 'مادة مطولة', 'بحث']
  },
  {
    id: 'media_research_background',
    type: 'task',
    unit: 'media',

    label_ar: 'مذكرة خلفية موضوع محدد',
    description_ar: 'إعداد مذكرة خلفية من صفحة أو صفحتين عن موضوع المادة مع أهم المصادر.',

    size: 'S',
    definitionOfDone_ar:
      'وثيقة من ١–٢ صفحة تجمع أهم المصادر، المفاهيم، واللاعبين الرئيسيين، مع روابط واضحة، مرفوعة في خيط المشروع.',

    defaultOwnerRole: 'researcher',
    defaultChannelKey: 'media.research',
    defaultDueDays: 4,

    pipelineKey: 'media.article_long',

    tags: ['خلفية', 'بحث', 'تحرير']
  },
  {
    id: 'media_data_brief',
    type: 'task',
    unit: 'media',

    label_ar: 'موجز مدعوم بالبيانات',
    description_ar: 'إعداد ٥ نقاط رئيسية مع رسم بياني أو خريطة ومراجع.',

    size: 'M',
    definitionOfDone_ar:
      'نص من ٥ نقاط واضحة، مع رسم بياني أو خريطة واحدة على الأقل، وقائمة بالمصادر المستخدمة، جاهز للتحرير.',

    defaultOwnerRole: 'reporter',
    defaultChannelKey: 'media.data',
    defaultDueDays: 6,

    pipelineKey: 'media.data_brief',

    tags: ['بيانات', 'إحصاءات', 'موجز']
  },
  {
    id: 'media_photo_story_package',
    type: 'task',
    unit: 'media',

    label_ar: 'مقال بصري مصوّر',
    description_ar: 'تجهيز ٦ إلى ٨ صور مع تسميات ونص مرافِق.',

    size: 'M',
    definitionOfDone_ar:
      'مجموعة من ٦ إلى ٨ صور مختارة ومحررة، مع تسميات واضحة لكل صورة، ونص مرافِق من ٤٠٠ إلى ٨٠٠ كلمة.',

    defaultOwnerRole: 'photo_editor',
    defaultChannelKey: 'media.photo',
    defaultDueDays: 6,

    pipelineKey: 'media.photo_story',

    tags: ['صور', 'قصة', 'بصري']
  },
  {
    id: 'media_illustration',
    type: 'task',
    unit: 'media',

    label_ar: 'رسم توضيحي ١–٢ لوحات',
    description_ar: 'إنجاز رسم أو رسمين توضيحيين لمادة محددة.',

    size: 'S',
    definitionOfDone_ar:
      'ملف PNG نهائي وملف المصدر، مع نص بديل قصير، رابط في خيط المادة، وموافقة تحريرية.',

    defaultOwnerRole: 'illustrator',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 4,

    pipelineKey: 'media.photo_story',

    tags: ['رسم', 'رسومات', 'توضيح']
  },
  {
    id: 'media_factcheck_bundle',
    type: 'task',
    unit: 'media',

    label_ar: 'حزمة تدقيق حقائق لمادة محددة',
    description_ar: 'إعداد قائمة ادعاءات ومصادر ونتائج التحقق لمادة واحدة.',

    size: 'S',
    definitionOfDone_ar:
      'وثيقة أو تعليق واحد يحتوي على قائمة الادعاءات الرئيسة، المصادر المستخدمة، ونتيجة التحقق لكل ادعاء، مثبتة في خيط المادة.',

    defaultOwnerRole: 'fact_checker',
    defaultChannelKey: 'media.fact_check',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['تدقيق', 'حقائق', 'منهجية']
  },
  {
    id: 'media_corrections_log_entry',
    type: 'task',
    unit: 'media',

    label_ar: 'إدخالات تصحيح خلفية',
    description_ar: 'توثيق ٣ إلى ٥ عناصر خلفية أو تصحيحية في سجلّ مستقل.',

    size: 'S',
    definitionOfDone_ar:
      '٣ إلى ٥ إدخالات جديدة في سجلّ التصحيحات أو سجل الخلفية، مع التاريخ، رابط المادة، وسبب التعديل أو التوضيح.',

    defaultOwnerRole: 'corrections_editor',
    defaultChannelKey: 'media.corrections_log',
    defaultDueDays: 3,

    pipelineKey: 'media.article_short',

    tags: ['تصحيحات', 'توثيق', 'شفافية']
  },
  {
    id: 'media_styleguide_update',
    type: 'task',
    unit: 'media',

    label_ar: 'تحديث دليل الأسلوب نسخة ٠٫٢',
    description_ar: 'إضافة أو تعديل نقاط في دليل الأسلوب بناء على أخطاء شائعة أو احتياجات جديدة.',

    size: 'S',
    definitionOfDone_ar:
      'ملف PDF أو مستند محدث لدليل الأسلوب، مع سجل تغييرات مختصر، مثبت في قناة دليل الأسلوب.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.styleguide',
    defaultDueDays: 5,

    pipelineKey: 'media.article_short',

    tags: ['أسلوب', 'لغة', 'تحرير']
  },
  {
    id: 'media_accessibility_check',
    type: 'task',
    unit: 'media',

    label_ar: 'مراجعة الوصول الرقمي',
    description_ar: 'فحص Alt للنصوص البديلة، تباين الألوان، والترجمات قبل النشر.',

    size: 'S',
    definitionOfDone_ar:
      'بطاقة فحص منجزة للمادة تحتوي على حالة النص البديل، تباين الألوان، والترجمات، مع علامة واضحة بأن المادة جاهزة من ناحية الوصول.',

    defaultOwnerRole: 'accessibility_editor',
    defaultChannelKey: 'media.accessibility',
    defaultDueDays: 1,

    pipelineKey: 'media.article_short',

    tags: ['وصول', 'Alt', 'ترجمة', 'تصميم']
  },
  {
    id: 'media_short_video_script',
    type: 'task',
    unit: 'media',

    label_ar: 'سكريبت أو بنية لفيديو قصير',
    description_ar: 'كتابة سكريبت بسيط أو بنية نقاط لفيديو قصير.',

    size: 'S',
    definitionOfDone_ar:
      'سكريبت أو بنية من صفحة واحدة على الأكثر، مع بداية ووسط ونهاية واضحة، وملاحظات بصرية بسيطة.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 2,

    pipelineKey: 'media.short_video_social',

    tags: ['سكريبت', 'فيديو', 'تحرير']
  },
  {
    id: 'media_short_video_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'فيديو قصير ٦٠–١٢٠ ثانية',
    description_ar: 'مونتاج فيديو قصير للنشر على شبكات التواصل.',

    size: 'M',
    definitionOfDone_ar:
      'ملف فيديو نهائي في القياس المطلوب، مع ترجمة مدمجة إن لزم، وعنوان ووصف جاهزان للنشر.',

    defaultOwnerRole: 'video_editor',
    defaultChannelKey: 'media.video',
    defaultDueDays: 5,

    pipelineKey: 'media.short_video_social',

    tags: ['فيديو', 'اجتماعي', 'مونتاج']
  },
  {
    id: 'media_podcast_outline',
    type: 'task',
    unit: 'media',

    label_ar: 'مخطط حلقة بودكاست',
    description_ar: 'إعداد خط تشغيل لملف صوتي قصير.',

    size: 'S',
    definitionOfDone_ar:
      'وثيقة بنقاط رئيسية للحلقة، تتضمن بداية واضحة، محورين أو ثلاثة، وخاتمة، مع وقت تقريبي.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 3,

    pipelineKey: 'media.podcast_short',

    tags: ['بودكاست', 'تخطيط', 'نص']
  },
  {
    id: 'media_podcast_edit',
    type: 'task',
    unit: 'media',

    label_ar: 'مونتاج حلقة بودكاست قصيرة',
    description_ar: 'مونتاج حلقة من ٥ إلى ٨ دقائق مع ملاحظات الحلقة.',

    size: 'M',
    definitionOfDone_ar:
      'ملف WAV أو MP3 نهائي، مع ملاحظات الحلقة (عنوان، وصف، أسماء الضيوف، روابط)، جاهز للنشر.',

    defaultOwnerRole: 'audio_editor',
    defaultChannelKey: 'media.audio',
    defaultDueDays: 7,

    pipelineKey: 'media.podcast_short',

    tags: ['صوت', 'بودكاست', 'مونتاج']
  },
  {
    id: 'media_social_cut_3x',
    type: 'task',
    unit: 'media',

    label_ar: 'تقطيع اجتماعي ٣ نسخ',
    description_ar: 'إعداد نسخ ٩:١٦ و١:١ و١٦:٩ مع ترجمة مدمجة.',

    size: 'S',
    definitionOfDone_ar:
      'ثلاثة ملفات فيديو جاهزة (٩:١٦، ١:١، ١٦:٩) مع ترجمة إذا لزم، وعناوين ووصف مناسب لكل منصة.',

    defaultOwnerRole: 'social_editor',
    defaultChannelKey: 'media.social',
    defaultDueDays: 3,

    pipelineKey: 'media.short_video_social',

    tags: ['اجتماعي', 'فيديو', 'توزيع']
  },
  {
    id: 'media_translation',
    type: 'task',
    unit: 'media',

    label_ar: 'ترجمة أو تكييف عربي/إنجليزي',
    description_ar: 'ترجمة أو تكييف مادة بين العربية والإنجليزية مع مراجعة تحريرية.',

    size: 'M',
    definitionOfDone_ar:
      'نسختان متوازيتان من النص، مع ملاحظات حول الاختلافات الضرورية في التكييف، ومراجعة محرر واحد على الأقل.',

    defaultOwnerRole: 'translator',
    defaultChannelKey: 'media.translation',
    defaultDueDays: 4,

    pipelineKey: 'media.translation_adapt',

    tags: ['ترجمة', 'تكييف', 'عربي', 'إنجليزي']
  },
  {
    id: 'media_editor_review',
    type: 'task',
    unit: 'media',

    label_ar: 'مراجعة محرر نهائية',
    description_ar: 'مراجعة تحريرية نهائية قبل النشر، خاصة للترجمة أو المواد الحساسة.',

    size: 'S',
    definitionOfDone_ar:
      'تعليقات المحرر موثقة في الخيط، مع موافقة صريحة على النشر أو قائمة تعديلات محددة.',

    defaultOwnerRole: 'editor',
    defaultChannelKey: 'media.drafts',
    defaultDueDays: 2,

    pipelineKey: 'media.translation_adapt',

    tags: ['تحرير', 'مراجعة', 'نشر']
  },
  {
    id: 'media_risk_ethics_review',
    type: 'task',
    unit: 'media',

    label_ar: 'مراجعة مخاطر وأخلاقيات لمشروع',
    description_ar: 'مراجعة سريعة للمخاطر الأخلاقية والأمنية لمادة أو مشروع قبل النشر.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة فحص قصيرة للمخاطر مع توصيات واضحة، مثبتة في خيط المشروع، ومذكور فيها قرار المضي أو التعديل.',

    defaultOwnerRole: 'safety_editor',
    defaultChannelKey: 'media.risk_review',
    defaultDueDays: 3,

    pipelineKey: 'media.article_long',

    tags: ['مخاطر', 'أخلاقيات', 'سلامة']
  },
  {
    id: 'media_method_memo',
    type: 'task',
    unit: 'media',

    label_ar: 'مذكرة منهج «كيف تحققنا من كذا»',
    description_ar: 'كتابة مذكرة منهج توضّح خطوات التحقق للمادة.',

    size: 'S',
    definitionOfDone_ar:
      'نص مختصر يشرح كيف تم جمع البيانات والتحقق منها، مع خطوات واضحة وروابط المصادر، يمكن مشاركته مع القراء أو الاحتفاظ به داخلياً.',

    defaultOwnerRole: 'researcher',
    defaultChannelKey: 'media.method',
    defaultDueDays: 4,

    pipelineKey: 'media.data_brief',

    tags: ['منهج', 'تحقق', 'بحث']
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
  },
  {
    id: 'people_volunteer_intake_match',
    type: 'task',
    unit: 'people',

    label_ar: 'استقبال المتطوعين والمواءمة',
    description_ar:
      'استقبال المتطوعين الجدد، جمع معلوماتهم الأساسية، ومواءمة مهاراتهم مع مسارات ومشاريع حبق.',

    size: 'M',
    definitionOfDone_ar:
      'جدول واحد محدث يحتوي على بيانات المتطوعين الجدد، مهاراتهم، وتوصية مبدئية لمسار أو مشروع لكل شخص، مع ربط بالخيوط المناسبة في ديسكورد.',

    defaultOwnerRole: 'volunteer_coordinator',
    defaultChannelKey: 'people.volunteers',
    defaultDueDays: 5,

    tags: ['متطوعون', 'مواءمة', 'موارد بشرية']
  },
  {
    id: 'people_partner_directory_10',
    type: 'task',
    unit: 'people',

    label_ar: 'دليل الشركاء ١٠ جهات',
    description_ar: 'إعداد قائمة أولية بالشركاء أو الداعمين المحتملين (١٠ جهات على الأقل).',

    size: 'M',
    definitionOfDone_ar:
      'قائمة أولية من ١٠ شركاء محتملين على الأقل مع اسم الجهة، نوعها، طريقة التواصل، وما يمكن أن تقدمه أو تحتاجه من حبق.',

    defaultOwnerRole: 'partnerships_lead',
    defaultChannelKey: 'people.partners',
    defaultDueDays: 7,

    tags: ['شركاء', 'تمويل', 'شبكات']
  },
  {
    id: 'people_partner_book_20',
    type: 'task',
    unit: 'people',

    label_ar: 'دفتر شركاء محليين/شتات (٢٠ جهة)',
    description_ar: 'توسيع دليل الشركاء إلى دفتر يحتوي على ٢٠ جهة على الأقل مع حالة العلاقة.',

    size: 'M',
    definitionOfDone_ar:
      'دفتر شركاء يتضمن ٢٠ جهة على الأقل مع حالة العلاقة، مسؤول التواصل داخلياً، وآخر تواصل موثّق، محفوظ في مرجع واضح ومربوط في خيط المشروع.',

    defaultOwnerRole: 'partnerships_lead',
    defaultChannelKey: 'people.partners',
    defaultDueDays: 14,

    tags: ['شركاء', 'شبكات', 'توثيق']
  },
  {
    id: 'people_mini_training_30min',
    type: 'task',
    unit: 'people',

    label_ar: 'جلسة تدريب قصيرة ٣٠ دقيقة',
    description_ar: 'تحضير وتنفيذ جلسة تدريب قصيرة داخلية أو لمتطوعين.',

    size: 'S',
    definitionOfDone_ar:
      'تدريب مسجّل مدته ٣٠ دقيقة تقريباً أو جلسة مباشرة مع تسجيل أو ملخص، إضافة إلى رابط الشرائح أو المواد المساندة، منشور في القناة المناسبة.',

    defaultOwnerRole: 'trainer',
    defaultChannelKey: 'people.training',
    defaultDueDays: 7,

    tags: ['تدريب', 'تعلم', 'مجتمع']
  },
  {
    id: 'people_welcome_calls_5',
    type: 'task',
    unit: 'people',

    label_ar: 'مكالمات ترحيب مع ٥ أعضاء جدد',
    description_ar: 'إجراء مكالمات أو لقاءات ترحيبية مع خمسة أعضاء جدد وتوثيق الملاحظات.',

    size: 'S',
    definitionOfDone_ar:
      'ملاحظات مكتوبة لخمس مكالمات ترحيب على الأقل، مع اسم الشخص، ما يهتم به، وواحدة من المهام الصغيرة المقترحة لكل عضو، موثّقة في خيط واحد.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.onboarding_log',
    defaultDueDays: 3,

    tags: ['ترحيب', 'متطوعون', 'مجتمع']
  },
  {
    id: 'people_weekly_appreciation_post',
    type: 'task',
    unit: 'people',

    label_ar: 'منشور تقدير أسبوعي',
    description_ar: 'إعداد ونشر منشور أسبوعي يسلّط الضوء على شخص أو فريق من حبق.',

    size: 'S',
    definitionOfDone_ar:
      'منشور واحد في #announcements-org أو القناة المعتمدة يسلّط الضوء على مساهمة شخص أو فريق، مع حفظ الرابط في سجل داخلي بسيط.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.announcements_org',
    defaultDueDays: 7,

    tags: ['تقدير', 'مجتمع', 'إعلان']
  },
  {
    id: 'people_benefit_activation',
    type: 'task',
    unit: 'people',

    label_ar: 'تفعيل منفعة للأعضاء المستحقين',
    description_ar: 'تحديد وتفعيل منافع محددة (مثل دعم الإنترنت أو مزايا أخرى) لأعضاء نواة/قيادة مستحقين.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة محدثة بأسماء الأعضاء المستحقين لمنفعة معينة، مع فترة التغطية المتفق عليها، منشورة في قناة داخلية للعمليات.',

    defaultOwnerRole: 'ops_coordinator',
    defaultChannelKey: 'admin.benefits',
    defaultDueDays: 5,

    tags: ['منافع', 'دعم', 'عمليات']
  },
  {
    id: 'people_mentoring_pairs',
    type: 'task',
    unit: 'people',

    label_ar: 'إقران إرشادي قيادة إلى نواة',
    description_ar: 'إعداد أزواج إرشاد بين أعضاء القيادة/النواة والأعضاء الجدد أو النشطين.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة أزواج إرشاد (مرشد + عضو) مع هدف واحد واضح لكل زوج وفترة مراجعة أولى، مثبتة في قناة الإرشاد أو خيط المشروع.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.mentoring',
    defaultDueDays: 7,

    tags: ['إرشاد', 'متطوعون', 'تنمية']
  },
  {
    id: 'people_volunteer_onboarding_path',
    type: 'task',
    unit: 'people',

    label_ar: 'مسار اندماج المتطوع خلال ٧ أيام',
    description_ar: 'تصميم مسار اندماج من ٣ مهام صغيرة لمتطوع جديد مع مُرشِد وتاريخ مراجعة.',

    size: 'S',
    definitionOfDone_ar:
      'مسار اندماج من ٣ مهام صغيرة موثّقة لكل متطوع جديد، مع مُرشِد محدد، وتاريخ مراجعة بعد ٧ أيام، مرتبطة بخيوط المهام أو المشروع.',

    defaultOwnerRole: 'volunteer_coordinator',
    defaultChannelKey: 'people.onboarding',
    defaultDueDays: 7,

    tags: ['اندماج', 'متطوعون', 'مسار']
  },
  {
    id: 'people_recognition_system',
    type: 'task',
    unit: 'people',

    label_ar: 'نظام الاعتراف الأسبوعي',
    description_ar: 'تصميم وتفعيل نظام اعتراف أسبوعي بالمساهمات داخل حبق.',

    size: 'S',
    definitionOfDone_ar:
      'وصف مختصر لنظام الاعتراف الأسبوعي، قالب ثابت للمنشورات، وأرشيف بسيط يحتوي على إدخالات الأسابيع الثلاثة الأولى على الأقل.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.recognition',
    defaultDueDays: 10,

    tags: ['اعتراف', 'مجتمع', 'تحفيز']
  },
  {
    id: 'people_speakers_roster',
    type: 'task',
    unit: 'people',

    label_ar: 'لوحة المتحدثين المحليين',
    description_ar: 'إعداد قائمة بالمتحدثين المحليين المحتملين ومواضيعهم وتوافرهم.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة من ٢٠ متحدثاً محلياً على الأقل مع المواضيع المفضلة، درجة الجاهزية، وطرق التواصل، محفوظة في ملف واحد ورابطه مثبت في قناة الفعاليات.',

    defaultOwnerRole: 'events_lead',
    defaultChannelKey: 'people.speakers',
    defaultDueDays: 10,

    tags: ['متحدثون', 'فعاليات', 'شبكات']
  },
  {
    id: 'people_event_access_guide',
    type: 'task',
    unit: 'people',

    label_ar: 'دليل الوصول للفعالية',
    description_ar: 'إعداد دليل وصول للفعالية يغطي المكان، المسارات، الصوتيات، والترجمة عند الإمكان.',

    size: 'S',
    definitionOfDone_ar:
      'دليل وصول فعالية واحدة يوضح مكان التجمع، المداخل، مسارات ذوي الإعاقة، الصوتيات، وخيارات الترجمة، منشور في خيط الفعالية ومشارك مع الفريق.',

    defaultOwnerRole: 'accessibility_coordinator',
    defaultChannelKey: 'people.accessibility',
    defaultDueDays: 3,

    tags: ['وصول', 'فعالية', 'سلامة']
  },
  {
    id: 'people_event_feedback_form',
    type: 'task',
    unit: 'people',

    label_ar: 'نموذج تغذية راجعة للحضور',
    description_ar: 'تصميم نموذج تغذية راجعة للفعالية وجمع النتائج الأساسية.',

    size: 'S',
    definitionOfDone_ar:
      'نموذج تغذية راجعة جاهز مع ٥ إلى ٨ أسئلة، وعدد مشاركات لا يقل عن ٢٠، مع ملخص نقاط قابلة للتنفيذ منشور في خيط الفعالية.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.feedback',
    defaultDueDays: 5,

    tags: ['تغذية راجعة', 'فعالية', 'تقييم']
  },
  {
    id: 'people_salon_topic_planning',
    type: 'task',
    unit: 'people',

    label_ar: 'تخطيط موضوع الصالون والمتحدثين/الفنانين',
    description_ar: 'إعداد خط تشغيل ومحور وأسئلة ومتحدثين أو فنانين لصالون أو فعالية صغيرة.',

    size: 'M',
    definitionOfDone_ar:
      'خط تشغيل بسيط للصالون أو الجلسة يتضمن المحور، الأسئلة الرئيسية، المتحدثين أو الفنانين، وتوزيع الوقت، منشور في خيط الفعالية.',

    defaultOwnerRole: 'events_lead',
    defaultChannelKey: 'people.events_planning',
    defaultDueDays: 5,

    tags: ['صالون', 'برنامج', 'فعاليات']
  },
  {
    id: 'people_tech_rehearsal',
    type: 'task',
    unit: 'people',

    label_ar: 'بروفة تقنية ومنصة',
    description_ar: 'إجراء بروفة تقنية للفعالية تشمل الصوت، الإضاءة، والمنصة أو البث.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة فحص منجزة لبروفة تقنية تشمل الصوت، الإضاءة، البث أو التسجيل إن وجد، مع تحديد مسؤول احتياطي للمنصة أو التقديم.',

    defaultOwnerRole: 'tech_lead',
    defaultChannelKey: 'people.events_logistics',
    defaultDueDays: 2,

    tags: ['بروفة', 'تقنية', 'فعاليات']
  },
  {
    id: 'people_event_visual_assets',
    type: 'task',
    unit: 'people',

    label_ar: 'مواد بصرية للفعالية',
    description_ar: 'تحضير غلاف ومنشورات بصرية للفعالية بصيغ متعددة.',

    size: 'S',
    definitionOfDone_ar:
      'ثلاثة قياسات على الأقل من المواد البصرية (مثلاً ١:١، ٩:١٦، ١٦:٩) مع نص بديل وجدولة نشر واضحة، وروابطها محفوظة في خيط الفعالية.',

    defaultOwnerRole: 'designer',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 4,

    tags: ['فعالية', 'تصميم', 'بصري']
  },
  {
    id: 'people_listening_session',
    type: 'task',
    unit: 'people',

    label_ar: 'جلسة إصغاء مجتمعي',
    description_ar: 'تنظيم جلسة إصغاء مجتمعي وتوثيق أهم الملاحظات والخطوات العملية.',

    size: 'M',
    definitionOfDone_ar:
      'ملخص مكتوب لجلسة إصغاء واحدة يتضمن على الأقل ٥ ملاحظات أو اقتباسات محورية، وثلاث خطوات عملية مقترحة، منشور في خيط المشروع أو الفعالية.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.listening_sessions',
    defaultDueDays: 5,

    tags: ['إصغاء', 'مجتمع', 'ملاحظات']
  },
  {
    id: 'people_event_debrief',
    type: 'task',
    unit: 'people',

    label_ar: 'ملخص ما بعد الفعالية',
    description_ar: 'كتابة ملخص قصير لما نجح وما تعثر في الفعالية وما الذي سيتحسن لاحقاً.',

    size: 'S',
    definitionOfDone_ar:
      'ملخص ما بعد الفعالية من ٥ نقاط رئيسية مع صورتين على الأقل أو لقطات، يغطي ما نجح وما لم ينجح وماذا نفعل لاحقاً، منشور في خيط الفعالية.',

    defaultOwnerRole: 'events_lead',
    defaultChannelKey: 'people.events_reports',
    defaultDueDays: 3,

    tags: ['تقييم', 'ملخص', 'فعاليات']
  },
  {
    id: 'people_coc_reminder_pack',
    type: 'task',
    unit: 'people',

    label_ar: 'حزمة تذكير بمدونة السلوك',
    description_ar: 'إعداد حزمة مختصرة لتذكير المشاركين بمدونة السلوك قبل الفعالية.',

    size: 'S',
    definitionOfDone_ar:
      'حزمة مختصرة لمدونة السلوك تشمل رسم أو بطاقة بصيغة صورة، نص قصير، ورسالة جاهزة للنشر قبل الفعالية، مثبتة في القناة المعتمدة.',

    defaultOwnerRole: 'safety_coordinator',
    defaultChannelKey: 'people.code_of_conduct',
    defaultDueDays: 4,

    tags: ['مدونة السلوك', 'سلامة', 'مجتمع']
  },
  {
    id: 'people_accessibility_checklist_event',
    type: 'task',
    unit: 'people',

    label_ar: 'قائمة فحص الوصول الشامل للفعاليات',
    description_ar: 'إعداد قائمة فحص لتغطية الوصول المكاني والصوتي واللغوي للفعالية.',

    size: 'S',
    definitionOfDone_ar:
      'وثيقة فحص واحدة للفعالية تغطي المكان والصوت والترجمة واللوحات، مع خانة نعم/لا وتعليقات، ومؤشر نهائي بأن الفعالية مناسبة أو تحتاج تعديلات.',

    defaultOwnerRole: 'accessibility_coordinator',
    defaultChannelKey: 'people.accessibility',
    defaultDueDays: 3,

    tags: ['وصول', 'فعاليات', 'سلامة']
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
