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
    id: 'prod.research.editorial_brief',
    key: 'prod.research.editorial_brief',
    type: 'task',
    unit: 'production',

    label_ar: 'ورقة تحريرية مختصرة للمشروع',
    description_ar: 'تحديد الهدف والجمهور والنبرة والأسئلة الأساسية للفيلم أو سلسلة المقابلات.',
    definitionOfDone_ar:
      'مستند من صفحة واحدة على الأقل، متفق عليه بين التحرير والإنتاج، ومحفوظ في مكان مشترك.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -20,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -20 },
    claimable: false
  },
  {
    id: 'prod.research.risk_check',
    key: 'prod.research.risk_check',
    type: 'task',
    unit: 'production',

    label_ar: 'تقييم مخاطر وموافقات أساسية',
    description_ar: 'تحديد الحساسية السياسية/الأمنية، نوع الموافقات المطلوبة، وأي خطوط حمراء أو شروط نشر.',
    definitionOfDone_ar:
      'قائمة مخاطر وأسئلة جاهزة، مع قرار واضح: نمشي/ما نمشي/نؤجل، وملاحظات للحماية.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -18,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -18 },
    claimable: false
  },

  {
    id: 'prod.prep.crew_list',
    key: 'prod.prep.crew_list',
    type: 'task',
    unit: 'production',

    label_ar: 'بناء قائمة الطاقم للمشروع',
    description_ar: 'تحديد الأدوار الأساسية والبديلة (منتج، تصوير، صوت، مساعدين، نقل...).',
    definitionOfDone_ar:
      'قائمة طاقم مؤكدة بالأسماء وأرقام التواصل، منشورة في قناة فرق العمل.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.crews',
    dueOffsetDays: -15,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -15 },
    claimable: false
  },
  {
    id: 'prod.prep.call_sheet',
    key: 'prod.prep.call_sheet',
    type: 'task',
    unit: 'production',

    label_ar: 'ورقة نداء لكل يوم تصوير',
    description_ar: 'إعداد Call Sheet بأوقات التجمع، الموقع، الطاقم، الضيوف، وأرقام الطوارئ.',
    definitionOfDone_ar:
      'Call Sheet نهائي لكل يوم تصوير، مشارك في القناة ومتاح للطباعة أو المشاركة.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -5,

    ownerFunction: 'producer',
    stage: 'shoot',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -5 },
    claimable: false
  },
  {
    id: 'prod.prep.location_permits',
    key: 'prod.prep.location_permits',
    type: 'task',
    unit: 'production',

    label_ar: 'حزمة الموقع والموافقات',
    description_ar: 'تجميع عناوين المواقع، خرائط مختصرة، وموافقات خطية أو شفهية حسب الحاجة.',
    definitionOfDone_ar:
      'ملف واحد يحتوي تفاصيل المواقع ونسخ من أي موافقات أو رسائل مهمة.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -7,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -7 },
    claimable: false
  },
  {
    id: 'prod.prep.gear_thread',
    key: 'prod.prep.gear_thread',
    type: 'task',
    unit: 'production',

    label_ar: 'خيط حجز المعدّات للمشروع',
    description_ar: 'فتح خيط واضح في قناة سجل المعدات لحجز الكاميرات، الصوت، الإضاءة، والسيارات.',
    definitionOfDone_ar:
      'قائمة معدّات مؤرّخة، مع حالة كل قطعة (محجوز/متاح) وتواريخ الخروج والعودة.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.gear_log',
    dueOffsetDays: -10,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -10 },
    claimable: true
  },
  {
    id: 'prod.prep.emergency_plan',
    key: 'prod.prep.emergency_plan',
    type: 'task',
    unit: 'production',

    label_ar: 'خطة طوارئ للتصوير',
    description_ar: 'تحديد سيناريوهات الخطر وخطوات الانسحاب أو تغيير الخطة أثناء التصوير.',
    definitionOfDone_ar:
      'نص بسيط يشرح ما العمل في حالة المشكلة الأمنية أو التقنية، مشارك مع الطاقم.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -5,

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -5 },
    claimable: false
  },

  {
    id: 'prod.shoot.camera_tests',
    key: 'prod.shoot.camera_tests',
    type: 'task',
    unit: 'production',

    label_ar: 'اختبارات كاميرا ومظهر وترميز',
    description_ar: 'اختبار إعدادات الكاميرا، الكودك، المظهر اللوني، وصلاحية الكروت قبل اليوم الأول.',
    definitionOfDone_ar:
      'عدة لقطات تجريبية محفوظة، مع قرار نهائي حول الإعدادات، وملاحظات في القناة.',

    size: 'S',
    defaultOwnerFunc: 'video',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: -3,

    ownerFunction: 'dop',
    stage: 'shoot',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -3 },
    claimable: true
  },
  {
    id: 'prod.shoot.daily_log',
    key: 'prod.shoot.daily_log',
    type: 'task',
    unit: 'production',

    label_ar: 'سجل يومي للتصوير',
    description_ar: 'توثيق ما تم تصويره، ما تم إلغاؤه، والملاحظات الميدانية لكل يوم تصوير.',
    definitionOfDone_ar:
      'ملف أو رسالة مجمّعة لكل يوم تصوير، مرتبطة بالمشروع، فيها أبرز اللقطات والملاحظات.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'production.shot_plans',
    dueOffsetDays: 0,

    ownerFunction: 'assistant',
    stage: 'shoot',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: 0 },
    claimable: true
  },

  {
    id: 'prod.edit.plan',
    key: 'prod.edit.plan',
    type: 'task',
    unit: 'production',

    label_ar: 'خطة المونتاج (أولي ونهائي)',
    description_ar: 'رسم هيكل الفيلم: الفصول، الترتيب، المدة التقريبية، وأنواع المشاهد.',
    definitionOfDone_ar:
      'Outline واضح للمونتاج، متفق عليه بين المنتج والمونتير، ومشارَك في قناة مسار المونتاج.',

    size: 'M',
    defaultOwnerFunc: 'editor',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -10,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -10 },
    claimable: false
  },
  {
    id: 'prod.edit.rough_cut',
    key: 'prod.edit.rough_cut',
    type: 'task',
    unit: 'production',

    label_ar: 'تسليم مونتاج أولي (Rough Cut)',
    description_ar: 'إنتاج نسخة أولى لمراجعة النبرة والهيكل والإيقاع.',
    definitionOfDone_ar:
      'رابط نسخة مونتاج أولي، مع ملاحظات مفتوحة واستعداد لجلسة مراجعة.',

    size: 'M',
    defaultOwnerFunc: 'editor',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -7,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -7 },
    claimable: false
  },

  {
    id: 'prod.post.subtitles',
    key: 'prod.post.subtitles',
    type: 'task',
    unit: 'production',

    label_ar: 'ترجمة وملف ترجمات مع تدقيق',
    description_ar: 'إعداد ملف ترجمة (SRT أو غيره) مع تدقيق لغوي وصوتي.',
    definitionOfDone_ar:
      'ملف ترجمة متطابق مع النسخة النهائية، بدون أخطاء إملائية واضحة، ومرفوع مع المشروع.',

    size: 'S',
    defaultOwnerFunc: 'editor',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -3,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -3 },
    claimable: true
  },
  {
    id: 'prod.post.color_grade',
    key: 'prod.post.color_grade',
    type: 'task',
    unit: 'production',

    label_ar: 'تدرّج لوني',
    description_ar: 'تصحيح الألوان وتوحيد المظهر البصري للفيلم.',
    definitionOfDone_ar:
      'نسخة ملوّنة مكتملة، بدون فريمات غير مصححة، ومراجَعة على شاشة واحدة موثوقة على الأقل.',

    size: 'M',
    defaultOwnerFunc: 'video',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -2,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -2 },
    claimable: false
  },
  {
    id: 'prod.post.sound_mix',
    key: 'prod.post.sound_mix',
    type: 'task',
    unit: 'production',

    label_ar: 'تنظيف صوت ومكس',
    description_ar: 'إزالة التشويش، موازنة الأصوات، وضبط المستويات للعرض والنشر.',
    definitionOfDone_ar:
      'ميكس نهائي بمستوى ثابت وواضح، بدون قطع مفاجئ أو تشويش مزعج.',

    size: 'M',
    defaultOwnerFunc: 'sound',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -2,

    ownerFunction: 'sound',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -2 },
    claimable: true
  },

  {
    id: 'prod.delivery.export_presets',
    key: 'prod.delivery.export_presets',
    type: 'task',
    unit: 'production',

    label_ar: 'Preset تصدير قياسي للمشروع',
    description_ar: 'اختيار وحفظ إعدادات التصدير (دقة، كودك، بيت ريت) للاستخدام المتكرر.',
    definitionOfDone_ar:
      'Preset محفوظ في برنامج المونتاج ومكتوب في رسالة واضحة مع تاريخ المشروع.',

    size: 'S',
    defaultOwnerFunc: 'post_supervisor',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: -3,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -3 },
    claimable: true
  },
  {
    id: 'prod.delivery.final_exports',
    key: 'prod.delivery.final_exports',
    type: 'task',
    unit: 'production',

    label_ar: 'تسليم نهائي بصيغ متعددة',
    description_ar: 'تصدير نسخة Master ونسخ للأرشيف والسوشيال والمنصات.',
    definitionOfDone_ar:
      'روابط أو ملفات مرفوعة للنسخة الرئيسية ونسخ النشر، موثقة في قناة التصدير.',

    size: 'S',
    defaultOwnerFunc: 'post_supervisor',
    defaultChannelKey: 'production.exports',
    dueOffsetDays: 0,

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 0 },
    claimable: false
  },
  {
    id: 'prod.delivery.archive_metadata',
    key: 'prod.delivery.archive_metadata',
    type: 'task',
    unit: 'production',

    label_ar: 'أرشفة وبيانات وصفية',
    description_ar: 'تسجيل كل ما يخص المشروع في الأرشيف (تاريخ، أماكن، أسماء، حقوق، روابط).',
    definitionOfDone_ar:
      'ملف أرشيف شامل أو بطاقة بيانات مكتملة، مرتبطة برابط الفيلم والنسخة النهائية.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.edit_pipeline',
    dueOffsetDays: 1,

    ownerFunction: 'producer',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 1 },
    claimable: false
  },
  {
    id: 'prod.delivery.postmortem_report',
    key: 'prod.delivery.postmortem_report',
    type: 'task',
    unit: 'production',

    label_ar: 'تقرير ما بعد التصوير',
    description_ar: 'تلخيص ما نجح وما لم ينجح، والدروس المستفادة للمشاريع القادمة.',
    definitionOfDone_ar:
      'تقرير قصير (نقاط) منشور في قناة فرق العمل، مع اقتراحات عملية للمرة القادمة.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'production.crews',
    dueOffsetDays: 3,

    ownerFunction: 'producer',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 3 },
    claimable: false
  },

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

    tags: ['طاقم', 'تنسيق', 'تصوير', 'إنتاج'],

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -14 },
    claimable: false
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

    tags: ['نداء', 'تصوير', 'سلامة', 'تنسيق'],

    ownerFunction: 'producer',
    stage: 'shoot',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -2 },
    claimable: false
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

    tags: ['موقع', 'موافقات', 'سلامة', 'إنتاج'],

    ownerFunction: 'assistant',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -7 },
    claimable: true
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

    tags: ['معدّات', 'حجز', 'لوجستيات'],

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -10 },
    claimable: true
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

    tags: ['اختبارات', 'كاميرا', 'LUT', 'فيديو'],

    ownerFunction: 'dop',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -5 },
    claimable: true
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

    tags: ['تقرير', 'تعلم', 'خطر', 'إنتاج'],

    ownerFunction: 'producer',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 2 },
    claimable: false
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

    tags: ['مونتاج', 'خطة', 'مواعيد', 'ما بعد الإنتاج'],

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -7 },
    claimable: false
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

    tags: ['مونتاج', 'فيديو', 'مراجعة'],

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -5 },
    claimable: false
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

    tags: ['ترجمة', 'ترجمات', 'وصول', 'فيديو'],

    ownerFunction: 'assistant',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -4 },
    claimable: true
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

    tags: ['لون', 'فيديو', 'مونتاج'],

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -3 },
    claimable: true
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

    tags: ['صوت', 'مكس', 'تنظيف', 'فيديو'],

    ownerFunction: 'sound',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -2 },
    claimable: true
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

    tags: ['تسليم', 'ماستر', 'تصدير', 'فيديو'],

    ownerFunction: 'producer',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 0 },
    claimable: false
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

    tags: ['أرشيف', 'بيانات وصفية', 'تنظيم'],

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 1 },
    claimable: false
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

    tags: ['صوت', 'موسيقى', 'ترخيص', 'أرشيف'],

    ownerFunction: 'sound',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: 5 },
    claimable: true
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

    tags: ['تصدير', 'Preset', 'مونتاج'],

    ownerFunction: 'post',
    stage: 'post',
    dueFrom: 'project_due',
    deadlineOffset: { from: 'projectDue', unit: 'days', value: -3 },
    claimable: true
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

    tags: ['طوارئ', 'سلامة', 'إنتاج'],

    ownerFunction: 'producer',
    stage: 'planning',
    dueFrom: 'shoot_date',
    deadlineOffset: { from: 'shootDate', unit: 'days', value: -3 },
    claimable: false
  }
];

// ==========================
// Think unit templates
// ==========================

const thinkTaskTemplates = [
  {
    id: 'think.brief.intake_question',
    key: 'think.brief.intake_question',
    type: 'task',
    unit: 'think',

    label_ar: 'استقبال وصياغة السؤال البحثي',
    description_ar:
      'تسجل السؤال كما جاء من الواقع او من وحدة اخرى، وتعيد صياغته بصيغة بحثية واضحة مع الجمهور المستهدف.',
    definitionOfDone_ar:
      'سؤال مكتوب بصيغة واحدة واضحة، مع جملة عن الجمهور المقصود ولماذا يهمه هذا السؤال.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.topics',
    dueOffsetDays: -20
  },
  {
    id: 'think.brief.scope_note',
    key: 'think.brief.scope_note',
    type: 'task',
    unit: 'think',

    label_ar: 'مذكرة نطاق البحث (ما يشمله وما لا يشمله)',
    description_ar: 'تحدد حدود السؤال، الزمن والجغرافيا وما الذي لن يغطيه البحث بوضوح.',
    definitionOfDone_ar:
      'مذكرة قصيرة تضبط النطاق وحدود المسألة لتفادي الوقوع في الاستنتاجات المبالغ فيها.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.research_queue',
    dueOffsetDays: -18
  },
  {
    id: 'think.brief.sources_map',
    key: 'think.brief.sources_map',
    type: 'task',
    unit: 'think',

    label_ar: 'خريطة المصادر والبيانات',
    description_ar:
      'قائمة بالمصادر المحتملة: بيانات، تقارير، شهود، خرائط، ارشيف، وما الذي سنحاول الوصول اليه.',
    definitionOfDone_ar:
      'جدول او قائمة مصنفة للمصادر مع ملاحظات عن درجة الثقة والمخاطر لكل مصدر.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.research_queue',
    dueOffsetDays: -15
  },
  {
    id: 'think.brief.data_collection',
    key: 'think.brief.data_collection',
    type: 'task',
    unit: 'think',

    label_ar: 'جمع البيانات والملاحظات',
    description_ar: 'جمع الروابط، الاقتباسات، الارقام، والملاحظات الخام المرتبطة بالسؤال ضمن مكان واحد.',
    definitionOfDone_ar:
      'ملف واحد او سلسلة رسائل منظمة تحتوي اهم ما تم جمعه، مرتبطة بالسؤال الاصلي.',

    size: 'M',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.data_room',
    dueOffsetDays: -10
  },
  {
    id: 'think.brief.analysis_memo',
    key: 'think.brief.analysis_memo',
    type: 'task',
    unit: 'think',

    label_ar: 'مذكرة تحليل وفرضيات',
    description_ar: 'تلخيص ما تقوله البيانات فعلا، صياغة الفرضيات، والاشياء التي ما زالت غير معروفة.',
    definitionOfDone_ar:
      'مذكرة تحليلية من صفحة او صفحتين تلخص اهم ما فهمناه وما الذي لم نفهمه بعد.',

    size: 'M',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -7
  },
  {
    id: 'think.brief.peer_review',
    key: 'think.brief.peer_review',
    type: 'task',
    unit: 'think',

    label_ar: 'جلسة مراجعة أقران',
    description_ar:
      'عرض المذكرة على ٢-٣ اشخاص من الفريق لطرح الاسئلة والتحديات قبل تسليمها للوحدة المنفذة.',
    definitionOfDone_ar:
      'ملاحظات مراجعة اقران مسجلة، مع قرارات واضحة حول التعديلات او التحفظات.',

    size: 'S',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'think.peer_review',
    dueOffsetDays: -5
  },
  {
    id: 'think.brief.methods_handoff',
    key: 'think.brief.methods_handoff',
    type: 'task',
    unit: 'think',

    label_ar: 'ملاحظة منهجية وتسليم للوحدة المنفذة',
    description_ar:
      'وثيقة قصيرة تشرح كيف تم جمع وتحليل المعلومات، وماذا يجب الانتباه له في النشر او التصوير.',
    definitionOfDone_ar:
      'ملاحظة منهجية مرفقة بالمذكرة، مرسلة الى وحدة الميديا او الانتاج، ومؤرشفة في method-notes.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -3
  },
  {
    id: 'think.support.brief_sync',
    key: 'think.support.brief_sync',
    type: 'task',
    unit: 'think',

    label_ar: 'مواءمة مع التحرير حول التحقيق',
    description_ar: 'جلسة سريعة مع المحرر او المنتج لفهم احتياج القصة، زاويتها، وسقف المخاطر المقبول.',
    definitionOfDone_ar:
      'مذكرة داخلية قصيرة تلخص ما تحتاجه القصة من دعم بحثي وما ليس مطلوباً الآن.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.briefs_drafts',
    dueOffsetDays: -15
  },
  {
    id: 'think.support.research_sprint',
    key: 'think.support.research_sprint',
    type: 'task',
    unit: 'think',

    label_ar: 'سباق جمع معلومات للقصة',
    description_ar: 'جمع سريع ومركز للروابط والبيانات التي تدعم فرضية القصة او تتحداها.',
    definitionOfDone_ar:
      'مجموعة مصادر وملحوظات منظمة في data-room مرتبطة بعنوان القصة.',

    size: 'M',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.data_room',
    dueOffsetDays: -12
  },
  {
    id: 'think.support.risk_bias_check',
    key: 'think.support.risk_bias_check',
    type: 'task',
    unit: 'think',

    label_ar: 'مراجعة المخاطر والانحياز',
    description_ar: 'تفحص النص او الخطة بحثاً عن مخاطر امنية او انحيازات غير مبررة او تعميمات.',
    definitionOfDone_ar:
      'ملاحظات مراجعة مكتوبة تشير الى المقاطع الحساسة واقتراحات تعديل او تعتيم.',

    size: 'S',
    defaultOwnerFunc: 'legal_ethics',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -8
  },
  {
    id: 'think.support.factcheck_round',
    key: 'think.support.factcheck_round',
    type: 'task',
    unit: 'think',

    label_ar: 'جولة تدقيق معلومات قبل النشر',
    description_ar: 'تدقيق الاقتباسات والارقام والادعاءات الاساسية في المادة قبل نشرها.',
    definitionOfDone_ar:
      'قائمة ادعاءات مع حالة كل منها (موثق، متنازع عليه، بحاجة توضيح) ومصادرها.',

    size: 'M',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'think.peer_review',
    dueOffsetDays: -5
  },
  {
    id: 'think.support.methods_note',
    key: 'think.support.methods_note',
    type: 'task',
    unit: 'think',

    label_ar: 'ملاحظة منهجية مرافقة للتحقيق',
    description_ar: 'توضيح مختصر للطريقة والقيود، ليدمج في transparency box او صفحة المنهجية.',
    definitionOfDone_ar:
      'فقرة او اثنتان يمكن استخدامها كما هي في صندوق الشفافية او صفحة المنهجية.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -3
  },
  {
    id: 'think.forum.question_map',
    key: 'think.forum.question_map',
    type: 'task',
    unit: 'think',

    label_ar: 'خريطة اسئلة المنتدى',
    description_ar:
      'تحديد السؤال الرئيسي وعدة اسئلة فرعية تساعد على فتح النقاش بدون توجيهه بشكل ايديولوجي.',
    definitionOfDone_ar:
      'خريطة اسئلة مكتوبة يمكن لوحدة الناس استخدامها اساساً لتصميم النقاش.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.topics',
    dueOffsetDays: -20
  },
  {
    id: 'think.forum.stakeholder_scan',
    key: 'think.forum.stakeholder_scan',
    type: 'task',
    unit: 'think',

    label_ar: 'مسح الاطراف والجمهور المحتمل',
    description_ar: 'تحديد من يجب ان يكون ممثلاً في الحوار، ومن يمكن ان يتأذى او يُقصى لو غاب.',
    definitionOfDone_ar:
      'قائمة قصيرة بالاطراف والجماهير المستهدفة، مع ملاحظات تمثيل وشمول.',

    size: 'S',
    defaultOwnerFunc: 'researcher',
    defaultChannelKey: 'think.research_queue',
    dueOffsetDays: -18
  },
  {
    id: 'think.forum.format_design',
    key: 'think.forum.format_design',
    type: 'task',
    unit: 'think',

    label_ar: 'تصميم شكل المنتدى',
    description_ar:
      'اختيار شكل النقاش (دائرة، مجموعات صغيرة، عروض قصيرة تليها نقاشات) بما يناسب السؤال والجمهور.',
    definitionOfDone_ar:
      'مخطط بسيط يشرح خطوات الجلسة من الدخول الى الخروج، مع زمن تقريبي لكل جزء.',

    size: 'S',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'think.briefs_drafts',
    dueOffsetDays: -15
  },
  {
    id: 'think.forum.materials_pack',
    key: 'think.forum.materials_pack',
    type: 'task',
    unit: 'think',

    label_ar: 'حزمة المواد والاسئلة الافتتاحية',
    description_ar:
      'تحضير ورقة واحدة للجمهور او للميسرين تتضمن خلفية بسيطة واسئلة افتتاحية ونقاط حساسة.',
    definitionOfDone_ar:
      'حزمة مواد جاهزة للطباعة او العرض، متاحة لوحدة الناس قبل تنفيذ المنتدى.',

    size: 'S',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -10
  },
  {
    id: 'think.forum.debrief_templates',
    key: 'think.forum.debrief_templates',
    type: 'task',
    unit: 'think',

    label_ar: 'قوالب استخلاص التعلّم من الجلسات',
    description_ar:
      'إنشاء نموذج او اسئلة ثابتة تستخدم بعد كل منتدى لاستخلاص ما تعلمناه وما يجب تعديله.',
    definitionOfDone_ar:
      'نموذج تعلّم قصير يمكن تطبيقه بعد كل جلسة، ومخزن في method-notes لاستخدامه المتكرر.',

    size: 'S',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'think.method_notes',
    dueOffsetDays: -5
  }
];

// ==========================
// Media unit templates
// ==========================

const mediaTaskTemplates = [
  {
    id: 'media.lab90.recruitment_cohort',
    key: 'media.lab90.recruitment_cohort',
    type: 'task',
    unit: 'media',

    label_ar: 'استقطاب واختيار مجموعة لاب ٩٠',
    description_ar: 'تصميم نموذج التقديم، الإعلان عن الدعوة، فرز الطلبات، واختيار المشاركين النهائيين.',
    definitionOfDone_ar:
      'قائمة نهائية بأسماء المشاركين المختارين مع بيانات التواصل، وملاحظات عن معايير الاختيار.',

    size: 'M',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'media.tasks',
    dueOffsetDays: -75
  },
  {
    id: 'media.lab90.onboarding_code_of_conduct',
    key: 'media.lab90.onboarding_code_of_conduct',
    type: 'task',
    unit: 'media',

    label_ar: 'جلسة تعريف وشرح مدونة السلوك',
    description_ar: 'جلسة تعريفية للمشاركين، شرح قواعد السلامة، مدونة السلوك، وآليات حماية المشاركين والمصادر.',
    definitionOfDone_ar:
      'عقد جلسة تعارف وتوقيع المشاركين على مدونة السلوك، مع توثيق أي أسئلة أو ملاحظات.',

    size: 'S',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'media.tasks',
    dueOffsetDays: -70
  },
  {
    id: 'media.lab90.baseline_assessment',
    key: 'media.lab90.baseline_assessment',
    type: 'task',
    unit: 'media',

    label_ar: 'اختبار خط أساس للأخلاقيات والتحقق',
    description_ar: 'إجراء اختبار أولي للمشاركين حول التحقق من المعلومات، الأخلاقيات، والصور الحساسة.',
    definitionOfDone_ar:
      'تخزين نتائج الاختبار لكل مشارك في ملف واحد، يمكن مقارنته باختبار نهاية البرنامج.',

    size: 'S',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'media.tasks',
    dueOffsetDays: -68
  },
  {
    id: 'media.lab90.clinics_schedule',
    key: 'media.lab90.clinics_schedule',
    type: 'task',
    unit: 'media',

    label_ar: 'خطة عيادات النزاهة والمهارات',
    description_ar: 'وضع جدول ١٢ جلسة حول الأخلاقيات، التحقق، حق الرد، حماية المصادر، والصور الحساسة.',
    definitionOfDone_ar:
      'جدول واضح لكل جلسة مع الموضوع، المدرب، والمواد المرافقة، منشور للمشاركين.',

    size: 'M',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'media.training',
    dueOffsetDays: -65
  },
  {
    id: 'media.lab90.tool_labs_schedule',
    key: 'media.lab90.tool_labs_schedule',
    type: 'task',
    unit: 'media',

    label_ar: 'خطة مختبرات الأدوات',
    description_ar: 'تخطيط مختبرات الصوت الميداني، الفيديو بالموبايل، تعديل الصور، والنشر على نظام إدارة المحتوى.',
    definitionOfDone_ar:
      'جدول مختبرات الأدوات مع أهداف واضحة لكل جلسة، وروابط للمواد التدريبية.',

    size: 'M',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'media.training',
    dueOffsetDays: -60
  },
  {
    id: 'media.lab90.daily_desk_quota',
    key: 'media.lab90.daily_desk_quota',
    type: 'task',
    unit: 'media',

    label_ar: 'تشغيل Desk اليوميات وتحديد الحصص',
    description_ar: 'إعداد نظام عمل لليوميات (60-90 ثانية + موجز 120 كلمة)، وتقسيم الحصص بين المشاركين.',
    definitionOfDone_ar:
      'قائمة حصص واضحة توضح عدد اليوميات المطلوبة لكل مشارك، وآلية مراجعة سريعة قبل النشر.',

    size: 'M',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'media.editing',
    dueOffsetDays: -40
  },
  {
    id: 'media.lab90.features_desk_quota',
    key: 'media.lab90.features_desk_quota',
    type: 'task',
    unit: 'media',

    label_ar: 'تشغيل Desk التحقيقات والتقارير المطوّلة',
    description_ar: 'تحديد عدد التحقيقات أو المقالات المطوّلة والـ photo essays مع تسلسل المراحل لكل قصة.',
    definitionOfDone_ar:
      'جدول قصص يوضح موضوع كل قصة، المسؤول الرئيسي، ومواعيد التسليم لكل مرحلة.',

    size: 'L',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'media.editing',
    dueOffsetDays: -40
  },
  {
    id: 'media.lab90.explainers_desk_quota',
    key: 'media.lab90.explainers_desk_quota',
    type: 'task',
    unit: 'media',

    label_ar: 'تشغيل Desk الشروحات والإنفوغرافيك',
    description_ar: 'تصميم خط إنتاج للفيديوهات الشارحة أو بطاقات الكاروسيل مع توزيع المهام بين النص، التصميم، والمونتاج.',
    definitionOfDone_ar:
      'قائمة مواضيع الشروحات، مسؤول النص، مسؤول التصميم، ومسؤول المونتاج لكل قطعة.',

    size: 'L',
    defaultOwnerFunc: 'desk_editor',
    defaultChannelKey: 'media.editing',
    dueOffsetDays: -40
  },
  {
    id: 'media.lab90.forums_plan',
    key: 'media.lab90.forums_plan',
    type: 'task',
    unit: 'media',

    label_ar: 'خطة سلسلة الحوارات المدنية',
    description_ar: 'تحديد أربعة لقاءات عامة لعرض المنتجات ومناقشة القضايا المطروحة مع الجمهور.',
    definitionOfDone_ar:
      'وثيقة تحدد عناوين الجلسات، الجمهور المستهدف، الشركاء المحليين، ومكان وزمن كل لقاء.',

    size: 'M',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'media.forums',
    dueOffsetDays: -35
  },
  {
    id: 'media.lab90.forums_delivery',
    key: 'media.lab90.forums_delivery',
    type: 'task',
    unit: 'media',

    label_ar: 'تنفيذ أربع جلسات حوارية مدنية',
    description_ar: 'تنظيم وإدارة أربع جلسات حوارية باستخدام منتجات اللاب كنقطة انطلاق للنقاش.',
    definitionOfDone_ar:
      'تقرير قصير لكل جلسة يذكر الحضور التقريبي، الأفكار الرئيسية، وأي توصيات أو متابعة مطلوبة.',

    size: 'L',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'media.forums',
    dueOffsetDays: -10
  },
  {
    id: 'media.lab90.methods_and_corrections',
    key: 'media.lab90.methods_and_corrections',
    type: 'task',
    unit: 'media',

    label_ar: 'صفحة المنهجية وسجل التصحيحات',
    description_ar: 'إعداد صفحة عامة تشرح طريقة العمل، مع سجل تصحيحات حي يرافق كافة المواد المنشورة.',
    definitionOfDone_ar:
      'صفحة منشورة تشرح المنهجية، وسجل تصحيحات مفعّل ومستخدم مع أول موجة من المواد.',

    size: 'M',
    defaultOwnerFunc: 'corrections_editor',
    defaultChannelKey: 'media.corrections_log',
    dueOffsetDays: -15
  },
  {
    id: 'media.lab90.visual_sensitivity_standard',
    key: 'media.lab90.visual_sensitivity_standard',
    type: 'task',
    unit: 'media',

    label_ar: 'معيار الصور الحساسة والضعفاء',
    description_ar:
      'صياغة معيار واضح لكيفية التعامل مع الصور الحساسة والضحايا والمجموعات الضعيفة وتطبيقه على المواد.',
    definitionOfDone_ar:
      'وثيقة معيارية مختصرة منشورة داخلياً، مع إشارة علنية في صفحة المنهجية، ويتم تطبيقها على كل المخرجات.',

    size: 'S',
    defaultOwnerFunc: 'legal_ethics',
    defaultChannelKey: 'media.factcheck',
    dueOffsetDays: -15
  },
  {
    id: 'media.lab90.mel_cycle_report',
    key: 'media.lab90.mel_cycle_report',
    type: 'task',
    unit: 'media',

    label_ar: 'تقرير التعلّم ونهاية الدورة',
    description_ar: 'جمع نتائج الاختبارات، الملاحظات، وتحليلات الوصول في تقرير تعلّم قابل لإعادة الاستخدام.',
    definitionOfDone_ar:
      'تقرير تعلّم نهائي يتضمن ما نجح وما فشل، الدروس المستفادة، وروابط حزمة الأدوات التدريبية.',

    size: 'M',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'media.tasks',
    dueOffsetDays: 0
  },
  {
    id: 'media_assignment_memo',
    type: 'task',
    unit: 'media',

    label_ar: 'ملف تكليف / Brief للمادة (سياق، أهداف، روابط مرجعية)',
    description_ar: 'كتابة موجز تكليف واضح للمادة يشمل السياق، الأهداف، الروابط المرجعية، وتعريف الإنجاز.',

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
    id: 'media_visual_direction',
    type: 'task',
    unit: 'media',

    label_ar: 'توجيه بصري للمادة واختيار نمط الصور',
    description_ar: 'تحديد أسلوب بصري للمادة مع مراجع أو moodboard وتوجيهات للصور أو اللقطات المطلوبة.',

    size: 'M',
    definitionOfDone_ar:
      'مذكرة أو لوحة مرئية تحدد النمط والألوان والعدسات أو زوايا التصوير المقترحة، متفق عليها مع الفريق.',

    defaultOwnerFunc: 'design_lead',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['تصميم', 'صور', 'توجيه']
  },
  {
    id: 'media_cover_selection',
    type: 'task',
    unit: 'media',

    label_ar: 'اختيار صور الغلاف والصور المرافقة مع metadata',
    description_ar: 'تجهيز صور الغلاف والمرافقة مع بيانات وصفية ونص بديل وتعليمات النشر.',

    size: 'S',
    definitionOfDone_ar:
      'مجموعة صور مختارة مع نصوص بديلة وتسميات واضحة، وروابط أو مسارات ملفات جاهزة للنشر.',

    defaultOwnerFunc: 'photo_editor',
    defaultChannelKey: 'media.photo_selection',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['صور', 'غلاف', 'بيانات وصفية']
  },
  {
    id: 'media_color_consistency',
    type: 'task',
    unit: 'media',

    label_ar: 'معالجة لونية موحدة (presets / style guide)',
    description_ar: 'تطبيق معالجة لونية متسقة وفق دليل الأسلوب أو إعدادات مسبقة للصور أو الفيديو.',

    size: 'S',
    definitionOfDone_ar:
      'ملفات معالجة أو Presets مطبقة على المادة مع عينات قبل/بعد وروابط للملفات الأصلية.',

    defaultOwnerFunc: 'colorist',
    defaultChannelKey: 'media.graphics',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['لون', 'تصميم', 'اتساق']
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

    label_ar: 'نشر على الموقع',
    description_ar: 'نشر المادة على الموقع مع التأكد من العناوين والوصلات والنصوص المصاحبة.',

    size: 'S',
    definitionOfDone_ar:
      'المادة منشورة على الموقع مع روابط سليمة، صور مناسبة، ونصوص مساعدة (Alt/Caption) وفق المعايير التحريرية.',

    defaultOwnerFunc: 'desk_editor',
    defaultOwnerRole: 'desk_editor',
    defaultChannelKey: 'media.corrections_log',
    defaultDueDays: 3,

    pipelineKey: 'media.article_short',

    tags: ['تصحيحات', 'توثيق', 'شفافية']
  },
  {
    id: 'media_social_package',
    type: 'task',
    unit: 'media',

    label_ar: 'حزمة منصّات اجتماعية (بوست + ستوري)',
    description_ar: 'تصميم نسخة نشر اجتماعية للمنصات الرئيسية مع نصوص بديلة وروابط.',

    size: 'S',
    definitionOfDone_ar:
      'ملفات وصياغات جاهزة للنشر على فيسبوك/إنستغرام أو تويتر، مع نصوص وصفيّة وروابط متابعة.',

    defaultOwnerFunc: 'designer_social',
    defaultChannelKey: 'media.social',
    defaultDueDays: 2,

    pipelineKey: 'media.article_short',

    tags: ['سوشال', 'تصميم', 'نشر']
  },
  {
    id: 'media_archive_package',
    type: 'task',
    unit: 'media',

    label_ar: 'أرشفة المادة في الأرشيف المركزي (نصوص، صور، روابط)',
    description_ar: 'تجميع ملفات المادة وروابطها في مجلد أو رابط موحد مع بيانات وصفية قصيرة.',

    size: 'S',
    definitionOfDone_ar:
      'مجلد أو رابط مركزي يحتوي على النص النهائي، الصور، الروابط الخارجية، وأي تراخيص أو ملاحظات وصول.',

    defaultOwnerFunc: 'archives',
    defaultChannelKey: 'media.archive',
    defaultDueDays: 2,
    hasDocLink: true,

    pipelineKey: 'media.article_short',

    tags: ['أرشفة', 'حفظ', 'توثيق']
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
    description_ar:
      'فحص الوصول الرقمي بما يشمل نصوص بديلة وصور ذات تباين مناسب، تخطيط مقروء على الموبايل، وروابط موصوفة بوضوح قبل النشر.',

    size: 'S',
    definitionOfDone_ar:
      'بطاقة فحص منجزة للمادة تحتوي على حالة النص البديل، تباين الألوان، الترجمات، وتجربة القراءة على الموبايل مع رابط للتوثيق.',

    defaultOwnerRole: 'accessibility_editor',
    defaultOwnerFunc: 'accessibility',
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
    id: 'media_podcast_series_plan',
    type: 'task',
    unit: 'media',

    label_ar: 'خطة السلسلة وجدول المواضيع',
    description_ar: 'تحديد موضوعات الحلقات، الضيوف المحتملين، وهيكل السلسلة على مدى الموسم.',

    size: 'S',
    definitionOfDone_ar:
      'مستند أو بطاقة تتضمن ٣–٦ حلقات مقترحة، الضيوف المحتملين، والمواعيد المبدئية لكل حلقة.',

    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'media.audio',
    defaultDueDays: 4,

    pipelineKey: 'media.podcast_short',

    tags: ['سلسلة', 'تخطيط', 'صوت']
  },
  {
    id: 'media_podcast_publish_schedule',
    type: 'task',
    unit: 'media',

    label_ar: 'جدول نشر الحلقات وتوزيعها',
    description_ar: 'تثبيت مواعيد النشر وقنوات التوزيع للحلقات المتتالية في السلسلة.',

    size: 'S',
    definitionOfDone_ar:
      'جدول يحدد تواريخ النشر لكل حلقة، القنوات الأساسية والبديلة، ومسؤول النشر والمتابعة.',

    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'media.audio',
    defaultDueDays: 5,

    pipelineKey: 'media.podcast_short',

    tags: ['جدولة', 'بودكاست', 'نشر']
  },
  {
    id: 'media_podcast_episode_template',
    type: 'task',
    unit: 'media',

    label_ar: 'قالب الحلقة والبطاقات الوصفية',
    description_ar: 'إعداد قالب نصي أو بنية متكررة للحلقات مع بطاقات وصفية جاهزة للتعبئة.',

    size: 'S',
    definitionOfDone_ar:
      'قالب موحد للحلقة (مقدمة، محاور، خاتمة) مع قسم لبطاقة وصف الحلقة والعناوين والهاشتاغات.',

    defaultOwnerFunc: 'editor',
    defaultChannelKey: 'media.audio',
    defaultDueDays: 3,

    pipelineKey: 'media.podcast_short',

    tags: ['قالب', 'بودكاست', 'وصف']
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
    defaultOwnerFunc: 'designer',
    ownerFunction: 'designer',
    stage: 'post',
    defaultChannelKey: 'media.social',
    defaultDueDays: 3,
    crossUnit: { people: true },

    pipelineKey: 'media.short_video_social',

    tags: ['اجتماعي', 'فيديو', 'توزيع']
  },
  {
    id: 'media_optional_reel',
    type: 'task',
    unit: 'media',

    label_ar: 'اقتراح/إنتاج ريل قصير داعم للمادة',
    description_ar: 'اقتراح ريل أو تنفيذ مونتاج خفيف يدعم المادة الطويلة أو الموجز.',

    size: 'S',
    definitionOfDone_ar:
      'مقترح واضح أو ملف ريل جاهز للنشر مع نص ووصف مختصر وروابط للمادة الأصلية.',

    defaultOwnerFunc: 'video',
    defaultChannelKey: 'media.video',
    defaultDueDays: 3,
    optional: true,

    pipelineKey: 'media.article_long',

    tags: ['ريل', 'فيديو', 'توزيع']
  },
  {
    id: 'media_article_long_reel',
    type: 'task',
    unit: 'media',

    label_ar: 'اقتراح وإعداد ريل قصير مستوحى من المادة',
    description_ar: 'مقترح أو تنفيذ ريل يختصر المادة الطويلة مع نص ووصف مناسب للنشر.',

    size: 'S',
    definitionOfDone_ar:
      'مقترح واضح أو ملف ريل جاهز مع نص النشر وروابط للمادة الأصلية، ومخطط واضح للمنصات المستهدفة.',

    defaultOwnerFunc: 'video',
    ownerFunction: 'video',
    stage: 'post',
    defaultChannelKey: 'media.video',
    defaultDueDays: 3,
    optional: true,

    pipelineKey: 'media.article_long',

    tags: ['ريل', 'فيديو', 'مادة طويلة']
  },
  {
    id: 'media_article_long_data_brief',
    type: 'task',
    unit: 'media',

    label_ar: 'اقتراح موجز بيانات (Data Brief) مرتبط بالمادة',
    description_ar: 'تلخيص بيانات المادة وتحويلها إلى موجز بصري صغير مع رسم بياني أو خريطة.',

    size: 'S',
    definitionOfDone_ar:
      'نص مختصر ونموذج رسم بياني أو خريطة مع روابط مصادر واضحة يمكن نشرها كقطعة مستقلة مرافقة للمادة الطويلة.',

    defaultOwnerFunc: 'data',
    ownerFunction: 'data',
    stage: 'post',
    defaultChannelKey: 'media.data',
    defaultDueDays: 4,
    optional: true,

    pipelineKey: 'media.article_long',

    tags: ['بيانات', 'موجز', 'مادة طويلة']
  },
  {
    id: 'media_optional_data_brief',
    type: 'task',
    unit: 'media',

    label_ar: 'اقتراح/إنتاج موجز بيانات بصري من المادة',
    description_ar: 'تلخيص أبرز بيانات المادة وتحويلها إلى موجز بصري مختصر.',

    size: 'S',
    definitionOfDone_ar:
      'مخطط أو نص موجز مع رسم بياني أو خريطة واحدة على الأقل وروابط مصادر واضحة يمكن نشرها كقطعة مستقلة.',

    defaultOwnerFunc: 'data',
    defaultChannelKey: 'media.data',
    defaultDueDays: 4,
    optional: true,

    pipelineKey: 'media.article_long',

    tags: ['بيانات', 'موجز', 'بصري']
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
    id: 'people_event_concept',
    type: 'task',
    unit: 'people',

    label_ar: 'تصور الفعالية ووصفها للنشر',
    description_ar: 'صياغة وصف واضح بالعربية للفعالية، الجمهور المستهدف، والسعة الأساسية كمسودة إعلان.',

    size: 'M',
    definitionOfDone_ar: 'فقرة أو صفحتان تشمل الفكرة والمحور، الجمهور، المكان المقترح، وتاريخ مبدئي، منشورة لفريق التنظيم.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'people_programmer',
    stage: 'planning',
    claimable: false,
    crossUnit: { media: true, geeks: false }
  },
  {
    id: 'people_event_budget_check',
    type: 'task',
    unit: 'people',

    label_ar: 'ميزانية سريعة ولوازم المكان',
    description_ar: 'تقدير الاحتياجات الأساسية (مكان، صوت، ضيافة، متطوعون) مع تكاليف تقريبية.',

    size: 'M',
    definitionOfDone_ar: 'قائمة موارد مع تقدير تكاليف وحد أدنى من البنود الأساسية، منشورة في خيط الفعالية.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'people_coordination',
    stage: 'planning',
    claimable: false
  },
  {
    id: 'people_event_invite_list',
    type: 'task',
    unit: 'people',

    label_ar: 'قائمة الدعوات والجمهور المستهدف',
    description_ar: 'إعداد قائمة مختصرة للمدعوين أو الفئات المستهدفة وخطة الوصول إليهم.',

    size: 'S',
    definitionOfDone_ar: 'قائمة أسماء/قنوات دعوة مع مسؤول لكل دفعة ودليل زمني للإرسال.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'people_coordination',
    stage: 'planning',
    claimable: false
  },
  {
    id: 'people_event_poster',
    type: 'task',
    unit: 'people',

    label_ar: 'بوستر وهوية بصرية للفعالية',
    description_ar: 'تصميم ملصق وبوست أساسي للفعالية أو السلسلة.',

    size: 'S',
    definitionOfDone_ar: 'نسخة PNG/Story جاهزة للنشر مع نصوص رئيسية، مرفقة بخيط الفعالية.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'designer',
    stage: 'planning',
    claimable: true,
    crossUnit: { media: true, geeks: false }
  },
  {
    id: 'people_event_social_launch',
    type: 'task',
    unit: 'people',

    label_ar: 'إعلان السوشال ميديا (بوست + ستوري)',
    description_ar: 'نشر إعلان الفعالية على السوشال ميديا مع روابط التسجيل أو الدعوة.',

    size: 'S',
    definitionOfDone_ar: 'بوست وستوري منشوران مع روابط واضحة ووسوم مناسبة.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'designer',
    stage: 'planning',
    claimable: true,
    crossUnit: { media: true, geeks: false }
  },
  {
    id: 'people_event_social_reminder',
    type: 'task',
    unit: 'people',

    label_ar: 'تذكير قبل الفعالية (سوشال)',
    description_ar: 'نشر تذكير سريع بالوقت والمكان قبل الفعالية بساعات أو يوم.',

    size: 'S',
    definitionOfDone_ar: 'ستوري/بوست تذكيري مع خريطة/رابط، مجدول أو منشور قبل الحدث.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'designer',
    stage: 'planning',
    claimable: true,
    crossUnit: { media: true, geeks: false }
  },
  {
    id: 'people_event_logistics',
    type: 'task',
    unit: 'people',

    label_ar: 'لوجستيات المكان والسلامة الأساسية',
    description_ar: 'تأكيد الموقع، الكهرباء، الجلوس، الوصول، ومسؤولية الباب والضيافة.',

    size: 'M',
    definitionOfDone_ar: 'قائمة فحص مكان مفصّلة بأسماء المسؤولين وأرقامهم، منشورة للفريق.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'people_coordination',
    stage: 'planning',
    claimable: false
  },
  {
    id: 'people_event_risk_review',
    type: 'task',
    unit: 'people',

    label_ar: 'مراجعة مخاطر وسلامة مختصرة',
    description_ar: 'تقييم سريع للمخاطر (سلامة، تحرش، خروج طوارئ، موافقات تصوير).',

    size: 'S',
    definitionOfDone_ar: 'ملاحظة سلامة مختصرة مع قرارات واضحة حول التصوير، الخروج، ودور الطوارئ.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'ethics',
    stage: 'planning',
    claimable: false,
    tag: 'safety_check'
  },
  {
    id: 'people_event_recording_policy',
    type: 'task',
    unit: 'people',

    label_ar: 'سياسة التسجيل والتصوير',
    description_ar: 'تحديد إن كان التصوير أو التسجيل مسموحاً وكيفية إعلام الحضور.',

    size: 'S',
    definitionOfDone_ar: 'قرار مكتوب حول التصوير/التسجيل ولافتة أو تنويه للحضور، مع مسؤول تطبيق.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'ethics',
    stage: 'planning',
    claimable: false
  },
  {
    id: 'people_event_photo_doc',
    type: 'task',
    unit: 'people',

    label_ar: 'توثيق صور/فيديو للفعالية',
    description_ar: 'التقاط صور أو فيديو قصير أثناء الفعالية مع تنظيم الملفات.',

    size: 'M',
    definitionOfDone_ar: 'مجلد صور/فيديو منظم مع تسميات واضحة وروابط محفوظة في خيط المشروع.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'media_documentation',
    stage: 'shoot',
    claimable: true,
    crossUnit: { media: true, geeks: false }
  },
  {
    id: 'people_event_archive_entry',
    type: 'task',
    unit: 'people',

    label_ar: 'أرشفة الفعالية والملفات',
    description_ar: 'تنظيم مجلد الأرشيف (صور، ملفات، روابط) مع وصف بسيط.',

    size: 'S',
    definitionOfDone_ar: 'مجلد منظم مع نص قصير يشرح المحتوى وروابطه، مذكور في خيط المشروع.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'archive',
    stage: 'post',
    claimable: false,
    tag: 'archive_entry'
  },
  {
    id: 'people_log_talent',
    type: 'task',
    unit: 'people',

    label_ar: 'تسجيل الأسماء والطاقات المميزة لمتابعتها لاحقاً',
    description_ar: 'تدوين المشاركين البارزين أو الضيوف المحتملين لمتابعات أو قصص مستقبلية.',

    size: 'S',
    definitionOfDone_ar: 'قائمة مختصرة بـ ٣ أسماء أو أكثر مع طريقة تواصل وملاحظة سبب الاهتمام.',

    pipelineKey: 'people.event_generic',

    ownerFunction: 'people_coordination',
    stage: 'post',
    claimable: true,
    crossUnit: { media: true, geeks: false }
  },
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
    id: 'people_live_notes_brief',
    type: 'task',
    unit: 'people',

    label_ar: 'تحضير خيط ملاحظات مباشرة',
    description_ar: 'فتح خيط/مستند للملاحظات المباشرة مع تقسيم الأدوار، الأسئلة، والرموز المستخدمة أثناء الفعالية.',

    size: 'S',
    definitionOfDone_ar:
      'رابط خيط أو مستند مهيأ للملاحظات مع جدول زمني مختصر، قائمة المتحدثين، منسق الملاحظات، ومشارَك مع الفريق قبل الفعالية.',

    defaultOwnerRole: 'events_lead',
    defaultChannelKey: 'people.events',
    defaultDueDays: 2,

    pipelineKey: 'people.event_live_notes',

    tags: ['فعاليات', 'توثيق', 'ملاحظات']
  },
  {
    id: 'people_live_notes_capture',
    type: 'task',
    unit: 'people',

    label_ar: 'تسجيل الملاحظات أثناء الفعالية',
    description_ar: 'كتابة المداخلات الرئيسية والأسئلة والإشارات اللوجستية أثناء الحدث مع ذكر المتحدث والوقت.',

    size: 'M',
    definitionOfDone_ar:
      'ملاحظات مباشرة تغطي كل المتحدثين والأسئلة، مع طوابع زمنية تقريبية ووسوم للمواضيع، محفوظة في الخيط أو المستند المتفق عليه.',

    defaultOwnerRole: 'reporter',
    defaultChannelKey: 'people.events',
    defaultDueDays: 0,

    pipelineKey: 'people.event_live_notes',

    tags: ['فعاليات', 'توثيق', 'ملاحظات']
  },
  {
    id: 'people_live_notes_summary',
    type: 'task',
    unit: 'people',

    label_ar: 'تنظيف ونشر ملخص ما بعد الفعالية',
    description_ar: 'تنظيف الملاحظات، إضافة روابط/شرائح، وإرسال ملخص واضح للحضور والفريق الداخلي.',

    size: 'S',
    definitionOfDone_ar:
      'ملخص من فقرتين إلى ثلاث فقرات يتضمن أهم الأفكار، الروابط، والمهام اللاحقة، منشور في قناة الفعالية ومرفق بالخيط الأصلي.',

    defaultOwnerRole: 'community_coordinator',
    defaultChannelKey: 'people.announcements_org',
    defaultDueDays: 2,

    pipelineKey: 'people.event_live_notes',

    tags: ['فعاليات', 'ملخص', 'ملاحظات']
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
  },
  {
    id: 'people.music.concept_and_venue',
    key: 'people.music.concept_and_venue',
    type: 'task',
    unit: 'people',

    label_ar: 'الفكرة والاتفاق مع المكان',
    description_ar:
      'تحديد هوية الدورة (الموسيقى، الجمهور، المزاج) والاتفاق الأساسي مع المكان على التواريخ والإيرادات.',
    definitionOfDone_ar:
      'نص قصير يصف هوية الدورة، والتواريخ المبدئية، واتفاق واضح مع المكان حول النسب والمسؤوليات.',

    size: 'M',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: -60
  },
  {
    id: 'people.music.artist_booking',
    key: 'people.music.artist_booking',
    type: 'task',
    unit: 'people',

    label_ar: 'حجوزات الفنانين والطاقم',
    description_ar:
      'اختيار الفنانين والاتفاق على الأجور والبرمجة الزمنية، وتحديد الطاقم التقني الأساسي لكل أمسية.',
    definitionOfDone_ar:
      'قائمة بكل الفنانين والطاقم مع التواريخ، الأجور المتفق عليها، ووسائل التواصل.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: -55
  },
  {
    id: 'people.music.tech_and_safety_plan',
    key: 'people.music.tech_and_safety_plan',
    type: 'task',
    unit: 'people',

    label_ar: 'خطة الصوت والإضاءة والسلامة',
    description_ar:
      'تنسيق احتياجات الصوت والإضاءة والسعة القصوى وخطة الطوارئ بالتعاون مع المكان ووحدة الإنتاج/الجيكس عند الحاجة.',
    definitionOfDone_ar:
      'خطة مكتوبة تبين إعدادات الصوت والإضاءة، السعة، نقاط الخروج، وإجراءات التعامل مع أي طارئ.',

    size: 'M',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: -30
  },
  {
    id: 'people.music.comms_and_ticketing',
    key: 'people.music.comms_and_ticketing',
    type: 'task',
    unit: 'people',

    label_ar: 'الإعلان والتذاكر',
    description_ar:
      'إعداد نصوص ومواد الإعلان بالتعاون مع الميديا، وتحديد سعر التذكرة وطريقة الحجز أو الدفع على الباب.',
    definitionOfDone_ar:
      'خطة نشر بسيطة (متى وأين)، وسعر تذكرة واضح، وطريقة حجز أو دفع مفهومة للجمهور.',

    size: 'M',
    defaultOwnerFunc: 'managing_editor',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: -21
  },
  {
    id: 'people.music.run_sheet_cycle',
    key: 'people.music.run_sheet_cycle',
    type: 'task',
    unit: 'people',

    label_ar: 'ورقة تشغيل لكل أمسية في الدورة',
    description_ar:
      'إعداد Run Sheet يوضّح مواعيد الساوند تشِك، بداية الأمسية، الفواصل، ونهاية البرنامج لكل أمسية.',
    definitionOfDone_ar:
      'Run Sheet واحد على الأقل لكل أمسية، متفق عليه مع الفنانين والطاقم التقني ومتاح للجميع.',

    size: 'S',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: -5
  },
  {
    id: 'people.music.revenue_split_report',
    key: 'people.music.revenue_split_report',
    type: 'task',
    unit: 'people',

    label_ar: 'تقرير التسوية وتوزيع الإيرادات',
    description_ar:
      'جمع أرقام الحضور والإيرادات، وتطبيق نموذج توزيع الدخل بين حبق والفنانين والتقنيين.',
    definitionOfDone_ar:
      'تقرير نهائي يوضح كم دخل، كيف توزّع المبلغ، وما هي الملاحظات للدورة القادمة.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.music_events',
    dueOffsetDays: 3
  },
  {
    id: 'people.openmic.guidelines',
    key: 'people.openmic.guidelines',
    type: 'task',
    unit: 'people',

    label_ar: 'الإطار والقواعد لأمسية الأوبن مايك',
    description_ar:
      'صياغة قواعد بسيطة وواضحة لوقت المشاركة، نوع المحتوى المقبول، وكيفية التعامل مع الخطاب المؤذي أو الإقصائي.',
    definitionOfDone_ar:
      'نص قواعد مختصر منشور للجمهور والمشاركين، ويُذكَر في بداية كل أمسية.',

    size: 'S',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'people.openmic_events',
    dueOffsetDays: -30
  },
  {
    id: 'people.openmic.signup_system',
    key: 'people.openmic.signup_system',
    type: 'task',
    unit: 'people',

    label_ar: 'نظام التسجيل للمشاركة',
    description_ar: 'اختيار طريقة التسجيل (نموذج، رسالة، ورقة في المكان)، وتحديد آلية ترتيب الدور.',
    definitionOfDone_ar:
      'نموذج أو آلية تسجيل تعمل بسلاسة، مع طريقة واضحة لترتيب المشاركات واحترام الوقت.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'people.openmic_events',
    dueOffsetDays: -25
  },
  {
    id: 'people.openmic.safety_roles',
    key: 'people.openmic.safety_roles',
    type: 'task',
    unit: 'people',

    label_ar: 'أدوار الدعم والسلامة في الأمسية',
    description_ar: 'تعيين شخص أو اثنين ليكونوا نقطة رجوع في حال المضايقات أو المشاكل، وتوضيح حدودهم.',
    definitionOfDone_ar:
      'أسماء واضحة لأشخاص السلامة في كل أمسية، وشرح موجز لدورهم للفريق.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'people.openmic_events',
    dueOffsetDays: -20
  },
  {
    id: 'people.openmic.event_log',
    key: 'people.openmic.event_log',
    type: 'task',
    unit: 'people',

    label_ar: 'سجل الأمسيات والمشاركات',
    description_ar:
      'توثيق بسيط لكل أمسية: من شارك، نوع المشاركة، وأي ملاحظات مهمة.',
    definitionOfDone_ar:
      'سجل نصي أو جدولي لكل أمسية في الموسم، يمكن الرجوع إليه لاختيار مواهب لأمسيات أكبر.',

    size: 'M',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'people.openmic_events',
    dueOffsetDays: -5
  },
  {
    id: 'people.openmic.talent_followup',
    key: 'people.openmic.talent_followup',
    type: 'task',
    unit: 'people',

    label_ar: 'متابعة المواهب للترقي أو الدعم',
    description_ar:
      'اختيار بعض المشاركين الواعدين واقتراح خطوات دعمهم (دعوة لـ Thursday Live Notes، تسجيل، تدريب...).',
    definitionOfDone_ar:
      'قائمة صغيرة بالمواهب التي تستحق متابعة، مع أفكار عملية لدعمهم في دورات لاحقة.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.openmic_events',
    dueOffsetDays: 5
  },
  {
    id: 'people.exhibit.curatorial_concept',
    key: 'people.exhibit.curatorial_concept',
    type: 'task',
    unit: 'people',

    label_ar: 'المفهوم الكوريتوري واختيار الفنانين',
    description_ar: 'صياغة الثيمة العامة للمعرض، واختيار الفنانين المشاركين وحدود ما سيتم عرضه.',
    definitionOfDone_ar:
      'نص كوريتوري أولي، وقائمة الفنانين المدعوين، مع ملاحظات حول ما ينسجم وما لا ينسجم مع الثيمة.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: -60
  },
  {
    id: 'people.exhibit.artist_intake',
    key: 'people.exhibit.artist_intake',
    type: 'task',
    unit: 'people',

    label_ar: 'استلام الأعمال والبيانات من الفنانين',
    description_ar: 'جمع صور الأعمال، القياسات، النصوص المرافقة، وسياسات البيع أو الطباعة لكل فنان.',
    definitionOfDone_ar:
      'ملف بيانات لكل فنان يضم الأعمال، النصوص، الأسعار (إن وجدت)، وملاحظات الحقوق.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: -50
  },
  {
    id: 'people.exhibit.space_and_flow',
    key: 'people.exhibit.space_and_flow',
    type: 'task',
    unit: 'people',

    label_ar: 'تصميم الفضاء ومسار الزائر',
    description_ar:
      'توزيع الأعمال في المكان بطريقة تخدم الثيمة، مع الانتباه لتدفق الزوار ونقاط التفاعل.',
    definitionOfDone_ar:
      'مخطط بسيط يوضح أماكن الأعمال، الاتجاه العام لحركة الزوار، وأي محطات تفاعلية.',

    size: 'M',
    defaultOwnerFunc: 'designer',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: -30
  },
  {
    id: 'people.exhibit.program_schedule',
    key: 'people.exhibit.program_schedule',
    type: 'task',
    unit: 'people',

    label_ar: 'البرنامج الموازي (ندوات، موسيقى، نقاشات)',
    description_ar:
      'تحديد جلسات النقاش أو العروض الموسيقية المرتبطة بالمعرض، ومن يدير أو يشارك فيها.',
    definitionOfDone_ar:
      'جدول بالجلسات الموازية مع التواريخ، المتحدثين أو الموسيقيين، وهدف كل جلسة.',

    size: 'M',
    defaultOwnerFunc: 'event_host',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: -20
  },
  {
    id: 'people.exhibit.digital_coordination',
    key: 'people.exhibit.digital_coordination',
    type: 'task',
    unit: 'people',

    label_ar: 'تنسيق الطبقة التفاعلية والبيع أونلاين',
    description_ar:
      'الاتفاق مع وحدة الجيكس على شكل المعرض التفاعلي على الويب، وآلية حجز أو شراء الأعمال.',
    definitionOfDone_ar:
      'مذكرة مشتركة بين People و Geeks تشرح شكل المعرض الرقمي، وكيفية إدخال البيانات، ومسار تجربة الزائر أونلاين.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: -15
  },
  {
    id: 'people.exhibit.wrap_report',
    key: 'people.exhibit.wrap_report',
    type: 'task',
    unit: 'people',

    label_ar: 'تقرير المعرض والتعلّم للدورات القادمة',
    description_ar:
      'تلخيص ما حدث في المعرض: الحضور، المبيعات، ردود فعل الفنانين والجمهور، وما يجب تحسينه.',
    definitionOfDone_ar:
      'تقرير مختصر يشمل أرقاماً أساسية، أبرز الملاحظات، وصوراً أو روابط توثيقية، محفوظ في أرشيف حبق.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'people.exhibitions',
    dueOffsetDays: 7
  },
  {
    id: 'people.shihan.curatorial_brief',
    type: 'task',
    unit: 'people',

    label_ar: 'ورقة مفهوم مهرجان شيحان / Black HALL',
    description_ar: 'تثبيت مفهوم المهرجان، ما نريده وما لا نريده، وخطوط عدم التنازل للسلامة والأصالة.',

    size: 'M',
    definitionOfDone_ar:
      'ورقة واضحة تتضمن الموضوعات، الجمهور، أنواع العروض المسموحة والمرفوضة، وحدود السلامة والقيم، منشورة في قناة المهرجان.',

    defaultOwnerRole: 'func.event_host',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['مفهوم', 'مهرجان', 'برمجة']
  },
  {
    id: 'people.shihan.partner_matrix',
    type: 'task',
    unit: 'people',

    label_ar: 'مصفوفة الشركاء والدعم',
    description_ar: 'توثيق الجهات الرسمية وغير الرسمية، أنواع الدعم العيني والمالي، وما يقابله من التزامات.',

    size: 'M',
    definitionOfDone_ar:
      'جدول واحد يضم الشركاء المحتملين والمؤكدين، نوع الدعم، حالة التصاريح/الموافقات، ومسؤول المتابعة وتاريخ التواصل الأخير.',

    defaultOwnerRole: 'func.producer',
    defaultChannelKey: 'production.shihan_ops',

    tags: ['شركاء', 'دعم', 'تصاريح']
  },
  {
    id: 'people.shihan.artist_contracts',
    type: 'task',
    unit: 'people',

    label_ar: 'عقود الفنانين والفرق',
    description_ar: 'تجميع كل عروض الفنانين مع الأجور، النقل، الإقامة، وشروط السلامة وخطط الإلغاء.',

    size: 'L',
    definitionOfDone_ar:
      'ملف واحد لكل فنان/فرقة يتضمن الأجر المتفق عليه، تذاكر السفر أو النقل، الإقامة، الشرط الفني، والتوقيع أو الموافقة البريدية.',

    defaultOwnerRole: 'func.producer',
    defaultChannelKey: 'production.shihan_ops',

    tags: ['عقود', 'فنانين', 'لوجستيات']
  },
  {
    id: 'people.shihan.site_plan_quarry',
    type: 'task',
    unit: 'people',

    label_ar: 'مخطط موقع مقلع شيحان',
    description_ar: 'رسم توزيع المسرح، الجمهور، نقاط الدخول والطوارئ في المقلع مع مراعاة العتمة والتضاريس.',

    size: 'M',
    definitionOfDone_ar:
      'خريطة أو مخطط واضح يحدد المسرح، الكواليس، مسارات الجمهور، المخارج، ونقاط الإسعاف والإضاءة، مع صور مرجعية وحدود الصوت.',

    defaultOwnerRole: 'func.field_ops',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['موقع', 'سلامة', 'مسار']
  },
  {
    id: 'people.shihan.site_plan_hall',
    type: 'task',
    unit: 'people',

    label_ar: 'مخطط موقع Black HALL',
    description_ar: 'تخطيط قاعة بلاك هول: المسرح، المقاعد، مسارات الوصول، وخطة الإخلاء.',

    size: 'M',
    definitionOfDone_ar:
      'مخطط مبسّط للقاعة يبين المنصة، أماكن الجمهور، ممرات الكراسي المتحركة، مخارج الطوارئ، ونقاط الإطفاء، مثبت في خيط المهرجان.',

    defaultOwnerRole: 'func.field_ops',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['قاعة', 'سلامة', 'موقع']
  },
  {
    id: 'people.shihan.safety_plan',
    type: 'task',
    unit: 'people',

    label_ar: 'خطة سلامة وإخلاء للمهرجان',
    description_ar: 'تقييم المخاطر في المقلع والقاعة، تحديد نقاط التجمع، أرقام الطوارئ، وخطة طقس سيئ.',

    size: 'L',
    definitionOfDone_ar:
      'وثيقة مختصرة تغطي المخاطر الرئيسية، أرقام الطوارئ، فرق المناوبة، مسارات الإخلاء، خطة طقس سيئ، وموافقة مسؤول السلامة.',

    defaultOwnerRole: 'func.field_ops',
    defaultChannelKey: 'production.shihan_ops',

    tags: ['سلامة', 'طوارئ', 'خطة']
  },
  {
    id: 'people.shihan.tech_rider_master',
    type: 'task',
    unit: 'people',

    label_ar: 'ماستر رايدر تقني للمهرجان',
    description_ar: 'تجميع كل متطلبات الصوت والإضاءة والكهرباء للفرق وربطها بمسار التنفيذ.',

    size: 'L',
    definitionOfDone_ar:
      'جدول موحد للرودرات التقنية يشمل القنوات الصوتية، الإضاءة، الكهرباء الاحتياطية، مسؤول كل شيفت، وتوافقه مع موقع المقلع والقاعة.',

    defaultOwnerRole: 'func.developer',
    defaultChannelKey: 'geeks.shihan_acoustics',

    tags: ['تقني', 'صوت', 'إضاءة']
  },
  {
    id: 'people.shihan.schedule_run_sheet',
    type: 'task',
    unit: 'people',

    label_ar: 'جدول تشغيل وأوقات النداء',
    description_ar: 'تفصيل البرنامج اليومي لكل يوم مهرجان مع أوقات النداء والمسؤولين.',

    size: 'M',
    definitionOfDone_ar:
      'شيت تشغيل لكل يوم يذكر مواعيد الإعداد، الساوند تشيك، الصعود على المسرح، الإطفاء، ومسؤول كل خانة، منشور في قناة التشغيل.',

    defaultOwnerRole: 'func.producer',
    defaultChannelKey: 'production.shihan_ops',

    tags: ['جدول', 'تشغيل', 'مهرجان']
  },
  {
    id: 'people.shihan.comms_campaign',
    type: 'task',
    unit: 'people',

    label_ar: 'حملة تواصل المهرجان',
    description_ar: 'خطة نشر، رسائل أساسية، لغات، ومواعيد فيديوهات أو مواد بصرية.',

    size: 'M',
    definitionOfDone_ar:
      'تقويم نشر أسبوعي مع الرسائل الرئيسية، اللغات المستخدمة، روابط المواد البصرية، ومسؤول الردود والتذاكر.',

    defaultOwnerRole: 'func.designer',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['تواصل', 'حملة', 'مهرجان']
  },
  {
    id: 'people.shihan.ticketing_and_entry',
    type: 'task',
    unit: 'people',

    label_ar: 'تذاكر ودخول المهرجان',
    description_ar: 'تحديد أسعار التذاكر، نقاط البيع، سياسات التذاكر المجانية، وتدفق الدخول.',

    size: 'M',
    definitionOfDone_ar:
      'سياسة تذاكر مكتوبة تشمل الأسعار، الشرائح المجانية/الداعمة، آلية التحقق على الباب، فريق الدخول، وخطة الطوابير والنقدي/الدفع الرقمي.',

    defaultOwnerRole: 'func.event_host',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['تذاكر', 'دخول', 'تنظيم']
  },
  {
    id: 'people.shihan.documentation_plan',
    type: 'task',
    unit: 'people',

    label_ar: 'خطة التوثيق (صوت/صورة)',
    description_ar: 'توزيع المصورين، خطة التسجيل الصوتي، وترخيص استخدام المواد بعد المهرجان.',

    size: 'M',
    definitionOfDone_ar:
      'جدول واضح لتغطية كل يوم مع توزيع المصورين/مسجلي الصوت، نقاط تسليم الملفات يومياً، وسياسة الاستخدام والموافقة بعد المهرجان.',

    defaultOwnerRole: 'func.researcher',
    defaultChannelKey: 'media.shihan_docs',

    tags: ['توثيق', 'صوت', 'صورة']
  },
  {
    id: 'people.shihan.post_report',
    type: 'task',
    unit: 'people',

    label_ar: 'تقرير ما بعد مهرجان شيحان / Black HALL',
    description_ar: 'تلخيص الأرقام، ما نجح وما تعثر، وتوصيات الدورة القادمة.',

    size: 'S',
    definitionOfDone_ar:
      'تقرير مختصر من ١٠ نقاط على الأقل يتضمن الحضور، التذاكر، الداعمين، أبرز المخاطر وما تعلمناه، مع توصيات واضحة للدورة التالية.',

    defaultOwnerRole: 'func.event_host',
    defaultChannelKey: 'people.shihan_black_hall',

    tags: ['تقرير', 'دروس', 'مهرجان']
  }
];

// ==========================
// Geeks unit templates
// ==========================

const geeksTaskTemplates = [
  {
    id: 'geeks_site_brief',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ملخص احتياج لموقع بسيط',
    description_ar:
      'ملخص احتياج يحدد الجمهور، أهداف الموقع، الصفحات الأساسية، اللغات، والقيود التقنية (استضافة/دومين/ووردبريس).',

    size: 'M',
    definitionOfDone_ar:
      'وثيقة واضحة للجمهور والأهداف وهيكل أولي، مع رابط للهوية البصرية أو أي قيود تقنية، منشورة في خيط المشروع.',

    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_site_access_setup',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ضبط الوصول والحسابات (استضافة، دومين، CMS)',
    description_ar: 'تجميع أو طلب الوصولات (دومين، استضافة، ووردبريس/CMS، بريد إرسال)، وحفظها بشكل آمن.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_site_structure',
    type: 'task',
    unit: 'geeks',

    title_ar: 'هيكل الصفحات والمحتوى (IA + wireframes)',
    description_ar: 'رسم IA وwireframes أساسية للقائمة، الصفحات، ومناطق المحتوى المطلوبة.',

    size: 'M',
    definitionOfDone_ar:
      'مخطط للـIA مع wireframes أساسية وروابط أمثلة، منشورة في خيط المشروع مع ملاحظات المحتوى.',

    ownerFunction: 'geeks_uiux',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_site_visual_design',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تصميم بصري للشاشات الرئيسية (UI kit مختصر)',
    description_ar: 'تصميم الهوية البصرية والـUI الأساسي (ألوان، خطوط، مكوّنات رئيسية، نماذج شاشات).',

    size: 'M',
    ownerFunction: 'geeks_uiux',
    stage: 'planning',
    claimable: true,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_site_setup',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ضبط القالب/النظام الأساسي للموقع',
    description_ar: 'تهيئة الاستضافة، النطاق، والثيم أو إطار العمل المستخدم، مع ضبط الإضافات الأساسية.',

    size: 'M',
    definitionOfDone_ar:
      'موقع يعمل على رابط تجريبي مع الثيم/القالب مهيأ، وإضافات أساسية منصبة، وتسجيل الإعدادات.',

    ownerFunction: 'geeks_backend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_site_frontend_build',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تنفيذ الواجهة الأمامية والصفحات',
    description_ar: 'تكويد الصفحات بناء على الـIA والتصميم، وضبط المكوّنات التفاعلية.',

    size: 'M',
    ownerFunction: 'geeks_frontend',
    stage: 'build',
    claimable: true,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_site_backend_setup',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ضبط الـCMS / النماذج الخلفية',
    description_ar: 'إعداد حقول المحتوى، النماذج، والأذونات داخل الـCMS أو الخلفية المستخدمة.',

    size: 'M',
    ownerFunction: 'geeks_backend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_site_qc',
    type: 'task',
    unit: 'geeks',

    title_ar: 'اختبارات وظيفية (روابط، نماذج، متصفحات)',
    description_ar: 'اختبار الموقع على عدة أجهزة/متصفحات والتحقق من الروابط والنماذج.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة فحص مكتملة تغطي الروابط والنماذج من الموبايل والكمبيوتر مع إصلاحات للأخطاء الحرجة.',

    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_site_responsive_test',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تجربة استجابة وتصميم متجاوب',
    description_ar: 'مراجعة الواجهة على شاشات وأجهزة مختلفة لضبط المتجاوب (responsive).',

    size: 'S',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_site_performance_check',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تحسين أداء بسيط (سرعة، صور، كاش)',
    description_ar: 'تشغيل فحص أداء بسيط (Lighthouse/شبكة) وضبط الصور والكاش/ضغط الملفات.',

    size: 'S',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_site_staging_launch',
    type: 'task',
    unit: 'geeks',

    title_ar: 'نشر نسخة تجريبية (staging) وتأكيد الوصول',
    description_ar: 'رفع النسخة إلى staging أو رابط مغلق، مشاركة بيانات الدخول للتجربة.',

    size: 'S',
    ownerFunction: 'geeks_frontend',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_site_launch_monitor',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إطلاق الموقع ومراقبة أولية',
    description_ar: 'تحويل الدومين للإطلاق، مراقبة الأخطاء الأساسية والـuptime في أول أيام.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_site_docs_handover',
    type: 'task',
    unit: 'geeks',

    title_ar: 'توثيق سريع + إرشادات تعديل المحتوى',
    description_ar: 'كتابة خطوات الدخول، الروابط، وكيفية تعديل المحتوى الأساسية، مع لقطات شاشة.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_site_archive_snapshots',
    type: 'task',
    unit: 'geeks',

    title_ar: 'أرشفة لقطات وروابط النسخة النهائية',
    description_ar: 'تجهيز لقطات شاشة/فيديو قصير وروابط نهائية + repo/حزمة تسليم، ووضعها في مجلد مشترك.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_site_launch_doc',
    type: 'task',
    unit: 'geeks',

    label_ar: 'ورقة إطلاق وتوثيق الموقع',
    description_ar: 'توثيق طريقة الدخول، الصلاحيات، وأهم الإعدادات بعد إطلاق الموقع.',

    size: 'S',
    definitionOfDone_ar:
      'ورقة أو مستند واحد يحتوي على الروابط، حسابات الإدارة، قواعد الأمان الأساسية، وخطوات الدعم الأولى، منشور في خيط المشروع وقناة العمليات.',

    defaultOwnerRole: 'web_lead',
    defaultChannelKey: 'admin.docs',
    defaultDueDays: 3,

    tags: ['توثيق', 'إطلاق', 'ويب']
  },
  {
    id: 'geeks.app.discovery',
    key: 'geeks.app.discovery',
    type: 'task',
    unit: 'geeks',

    label_ar: 'فهم الحاجة والتأكد منها',
    description_ar:
      'جلسة سريعة مع أصحاب المصلحة لفهم المشكلة التي يحاول التطبيق حلها، ومن سيستخدمه، وما البدائل الموجودة الآن.',
    definitionOfDone_ar:
      'مذكرة قصيرة تشرح المشكلة، المستخدمين الأساسيين، وسيناريوهات الاستخدام الثلاثة الأهم.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -30
  },
  {
    id: 'geeks.app.spec',
    key: 'geeks.app.spec',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تصميم بسيط للتجربة والمواصفات',
    description_ar:
      'رسم شاشات تقريبية وكتابة قائمة بالوظائف الأساسية للتطبيق وما لن يقوم به في هذه النسخة.',
    definitionOfDone_ar:
      'مستند او صور تصميم توضح تدفق المستخدم، مع قائمة "يجب ان يفعل" و"لن يفعل الآن".',

    size: 'M',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -25
  },
  {
    id: 'geeks.app.milestone_mvp',
    key: 'geeks.app.milestone_mvp',
    type: 'task',
    unit: 'geeks',

    label_ar: 'بناء النسخة الأولى (MVP)',
    description_ar:
      'تنفيذ الحد الأدنى من الوظائف التي تثبت الفكرة وتسمح للاختبار مع مستخدمين حقيقيين.',
    definitionOfDone_ar:
      'نسخة عاملة يمكن الدخول اليها وتجربتها، حتى لو كانت خشنة بصرياً، مع تعليمات تسجيل الدخول او الاستخدام.',

    size: 'L',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -15
  },
  {
    id: 'geeks.app.field_test',
    key: 'geeks.app.field_test',
    type: 'task',
    unit: 'geeks',

    label_ar: 'اختبار ميداني مع مستخدمين حقيقيين',
    description_ar:
      'تجربة النسخة الأولى مع عدد صغير من المستخدمين وتسجيل الملاحظات والأخطاء والاقتراحات.',
    definitionOfDone_ar:
      'قائمة منظمة بالملاحظات والاخطاء من الاختبار، مقسمة الى "حرج"، "مهم"، "تحسين لاحق".',

    size: 'M',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'geeks.integrations',
    dueOffsetDays: -10
  },
  {
    id: 'geeks.app.deploy',
    key: 'geeks.app.deploy',
    type: 'task',
    unit: 'geeks',

    label_ar: 'النشر الأولي للتطبيق',
    description_ar:
      'رفع التطبيق على بيئة استضافة مستقرة، وضبط الاعدادات الأساسية للأمان والنسخ الاحتياطي إن أمكن.',
    definitionOfDone_ar:
      'رابط تطبيق يعمل من بيئة الإنتاج، مع حسابات وصول أساسية، ووثيقة قصيرة تشرح الاعتماديات.',

    size: 'M',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.integrations',
    dueOffsetDays: -5
  },
  {
    id: 'geeks.app.handover_maintain',
    key: 'geeks.app.handover_maintain',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تسليم او ترتيب صيانة التطبيق',
    description_ar:
      'توضيح من سيهتم بالتطبيق بعد الإطلاق، وما الذي يجب فعله عند حدوث مشكلة او تغيير كبير.',
    definitionOfDone_ar:
      'مذكرة تسليم توضح المسؤول التقني، وكيفية الإبلاغ عن الأعطال، وما هو مستوى الدعم المتوقع.',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: 0
  },
  {
    id: 'geeks.stack.intake_prioritize',
    key: 'geeks.stack.intake_prioritize',
    type: 'task',
    unit: 'geeks',

    label_ar: 'استقبال طلب الأتمتة وتحديد الأولوية',
    description_ar:
      'فهم المشكلة التي يريد الفريق حلها بالأتمتة، وتقدير الوقت الذي ستوفره، وترتيبها مقابل طلبات أخرى.',
    definitionOfDone_ar:
      'وصف واضح للمشكلة، الادوات المعنية، وتقييم مبدئي للفائدة مقابل الجهد، مع قرار "نعمل الآن" او "نؤجل".',

    size: 'S',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -30
  },
  {
    id: 'geeks.stack.flow_design',
    key: 'geeks.stack.flow_design',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تصميم تدفق الأتمتة',
    description_ar:
      'رسم مخطط بسيط يوضح من أين تأتي البيانات، ما هي الأحداث، وما النتيجة المتوقعة في كل حالة.',
    definitionOfDone_ar:
      'رسم او مستند يوضح خطوات التدفق، الاخطار المحتملة، وكيفية ايقاف الأتمتة عند الحاجة.',

    size: 'M',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -25
  },
  {
    id: 'geeks.stack.implementation',
    key: 'geeks.stack.implementation',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تنفيذ الأتمتة',
    description_ar:
      'بناء السكربتات او ربط أدوات الـ no-code حسب التصميم، مع تعليقات كافية في الكود.',
    definitionOfDone_ar:
      'كود او سيناريو أتمتة يعمل في بيئة تجريبية، مع شرح مختصر لما يفعله وأين تم نشره.',

    size: 'L',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -15
  },
  {
    id: 'geeks.stack.sandbox_test',
    key: 'geeks.stack.sandbox_test',
    type: 'task',
    unit: 'geeks',

    label_ar: 'اختبار في بيئة تجريبية',
    description_ar:
      'تشغيل الأتمتة على بيانات تجريبية او قناة اختبار في ديسكورد للتأكد من عدم إزعاج المستخدمين.',
    definitionOfDone_ar:
      'سيناريوهات اختبار مجرّبة مع نتيجة واضحة لكل واحدة، وتأكيد أن الأتمتة لا تكتب في اماكن خاطئة.',

    size: 'M',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -10
  },
  {
    id: 'geeks.stack.rollout',
    key: 'geeks.stack.rollout',
    type: 'task',
    unit: 'geeks',

    label_ar: 'إطلاق تدريجي للأتمتة',
    description_ar:
      'تشغيل الأتمتة مع مجموعة صغيرة من المستخدمين او في أوقات محدودة، ثم توسيعها بناء على ردود الفعل.',
    definitionOfDone_ar:
      'رسالة إعلان داخلية قصيرة تشرح الأتمتة، ومن يستفيد منها، وكيف يمكن إيقافها عند الضرورة.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: -5
  },
  {
    id: 'geeks.stack.docs',
    key: 'geeks.stack.docs',
    type: 'task',
    unit: 'geeks',

    label_ar: 'توثيق الأتمتة للمستخدمين',
    description_ar: 'كتابة دليل بسيط يشرح ماذا تفعل الأتمتة، وكيفية استخدامها، وما هي حدودها.',
    definitionOfDone_ar:
      'صفحة او رسالة مثبّتة تحتوي شرحاً مبسطاً للأتمتة ولمن صممت، وموجودة في مكان معروف للفريق.',

    size: 'S',
    defaultOwnerFunc: 'data_analyst',
    defaultChannelKey: 'geeks.automation',
    dueOffsetDays: 0
  },
  {
    id: 'geeks.discord.audit_current',
    key: 'geeks.discord.audit_current',
    type: 'task',
    unit: 'geeks',

    label_ar: 'مراجعة بنية ديسكورد الحالية',
    description_ar:
      'فحص القنوات، الرتب، الصلاحيات، والبوتات لمعرفة ما يعمل وما يربك الاعضاء.',
    definitionOfDone_ar:
      'قائمة ملاحظات تبين نقاط القوة والارباك في الخادم الحالي، مع بعض الاقتراحات السريعة.',

    size: 'M',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -30
  },
  {
    id: 'geeks.discord.new_structure_design',
    key: 'geeks.discord.new_structure_design',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تصميم البنية الجديدة للقنوات والرتب',
    description_ar:
      'اقتراح هيكل قنوات ووحدات وحالات يعكس طريقة عمل حبق، مع قواعد عامة لتسمية القنوات.',
    definitionOfDone_ar:
      'مخطط بنية جديد يوضح الفئات، القنوات، والرتب، ومشروح بلغة بسيطة يمكن مشاركتها مع الفريق.',

    size: 'L',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -25
  },
  {
    id: 'geeks.discord.staging_setup',
    key: 'geeks.discord.staging_setup',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تجهيز سيرفر تجريبي للتطبيق',
    description_ar:
      'إنشاء او تحديث سيرفر تجريبي يعكس البنية المقترحة لتجريب الصلاحيات والأونبوردنغ.',
    definitionOfDone_ar:
      'سيرفر تجريبي يحتوي على البنية الجديدة، مع صلاحيات مجربة لعدة أدوار مختلفة.',

    size: 'M',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -20
  },
  {
    id: 'geeks.discord.migration_plan',
    key: 'geeks.discord.migration_plan',
    type: 'task',
    unit: 'geeks',

    label_ar: 'خطة نقل التعديلات للسيرفر الأساسي',
    description_ar:
      'تفصيل خطوات نقل القنوات، تحديث الصلاحيات، وضبط البوتات بدون تعطيل العمل.',
    definitionOfDone_ar:
      'خطة مكتوبة بخطوات مرقمة توضح ماذا سيتغير، متى، ومن المسؤول عن كل خطوة.',

    size: 'M',
    defaultOwnerFunc: 'producer',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -15
  },
  {
    id: 'geeks.discord.habapp_integration',
    key: 'geeks.discord.habapp_integration',
    type: 'task',
    unit: 'geeks',

    label_ar: 'دمج HabApp وباقي البوتات في البنية الجديدة',
    description_ar:
      'تحديث اوامر HabApp وقنواته الافتراضية، وضبط صلاحيات البوتات الأخرى لتناسب البنية الجديدة.',
    definitionOfDone_ar:
      'قائمة بالقنوات التي يتفاعل فيها HabApp والبوتات الأخرى، مع تأكد من أن الصلاحيات سليمة وعدم وجود تضارب.',

    size: 'M',
    defaultOwnerFunc: 'developer',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -10
  },
  {
    id: 'geeks.discord.moderator_guide',
    key: 'geeks.discord.moderator_guide',
    type: 'task',
    unit: 'geeks',

    label_ar: 'دليل مبسط للمشرفين والفريق',
    description_ar:
      'كتابة دليل قصير يشرح البنية الجديدة، الأدوار، ومسؤوليات كل فئة من المشرفين.',
    definitionOfDone_ar:
      'دليل منشور في قناة داخلية يوضح كيف نستخدم الخادم، وكيف نتعامل مع الحالات الشائعة.',

    size: 'S',
    defaultOwnerFunc: 'field_ops',
    defaultChannelKey: 'geeks.bot_audit',
    dueOffsetDays: -5
  },
  {
    id: 'geeks_app_brief',
    type: 'task',
    unit: 'geeks',

    label_ar: 'ملخص احتياج لتطبيق/أداة صغيرة',
    description_ar: 'تعريف المشكلة التي يحلّها التطبيق أو الأداة، والمستخدمين الأساسيين، والناتج المتوقع.',

    size: 'S',
    definitionOfDone_ar:
      'ملخص مكتوب يحدد المشكلة، من سيتعامل مع الأداة، وما هو الناتج المتوقع، مع ٣ حالات استخدام على الأقل، منشور في خيط المشروع.',

    defaultOwnerRole: 'geeks_lead',
    defaultChannelKey: 'geeks.apps',
    defaultDueDays: 3,

    tags: ['تطبيق', 'أداة', 'تحليل']
  },
  {
    id: 'geeks_app_architecture_note',
    type: 'task',
    unit: 'geeks',

    label_ar: 'مذكرة بنية بسيطة للتطبيق',
    description_ar: 'وصف بسيط لبنية التطبيق أو الأداة والتقنيات المستخدمة والتكاملات المطلوبة.',

    size: 'S',
    definitionOfDone_ar:
      'مذكرة من صفحة واحدة توضح التقنية الأساسية، مصادر البيانات، نقاط التكامل (مثل Discord, Drive, WordPress)، وخطوات النشر المبدئية.',

    defaultOwnerRole: 'geeks_lead',
    defaultChannelKey: 'geeks.apps',
    defaultDueDays: 4,

    tags: ['معمارية', 'تطبيق', 'تكامل']
  },
  {
    id: 'geeks_app_prototype',
    type: 'task',
    unit: 'geeks',

    label_ar: 'نموذج أولي للتطبيق',
    description_ar: 'بناء نموذج أولي للتطبيق للاختبار الداخلي.',

    size: 'M',
    definitionOfDone_ar:
      'نموذج أولي يعمل يغطي المسار الأساسي، مع تعليمات قصيرة لكيفية تجربته من قبل الفريق الداخلي، ورابط في خيط المشروع.',

    defaultOwnerRole: 'geeks_dev',
    defaultChannelKey: 'geeks.apps',
    defaultDueDays: 7,

    tags: ['نموذج أولي', 'تطبيق', 'تطوير']
  },
  {
    id: 'geeks_app_internal_test',
    type: 'task',
    unit: 'geeks',

    label_ar: 'اختبار داخلي للتطبيق',
    description_ar: 'تنظيم جولة اختبار داخلية للتطبيق وتوثيق الملاحظات الأساسية.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة ملاحظات من ٥ أشخاص على الأقل، تتضمن ما يعمل جيداً وما لا يعمل، مع قرارات مبدئية لما سيتم إصلاحه قبل الإطلاق التجريبي.',

    defaultOwnerRole: 'qa_tester',
    defaultChannelKey: 'geeks.qa',
    defaultDueDays: 5,

    tags: ['اختبار', 'تطبيق', 'ملاحظات']
  },
  {
    id: 'geeks_app_launch_note',
    type: 'task',
    unit: 'geeks',

    label_ar: 'مذكرة إطلاق التطبيق',
    description_ar: 'كتابة مذكرة قصيرة توضح كيفية استخدام التطبيق وحدود استخدامه في المرحلة الأولى.',

    size: 'S',
    definitionOfDone_ar:
      'نص موجز يشرح الغرض من الأداة، لمن هي، وكيفية استخدامها، وما الذي لا تفعله، منشور في القناة المناسبة ومرتبط بخيط المشروع.',

    defaultOwnerRole: 'geeks_lead',
    defaultChannelKey: 'admin.docs',
    defaultDueDays: 3,

    tags: ['إطلاق', 'تطبيق', 'توثيق']
  },
  {
    id: 'geeks_app_maintenance_log',
    type: 'task',
    unit: 'geeks',

    label_ar: 'سجل صيانة للتطبيق',
    description_ar: 'إعداد سجل بسيط لتحديثات التطبيق وإصلاح الأعطال.',

    size: 'S',
    definitionOfDone_ar:
      'سجل محدث يضم أول ٣ تحديثات أو إصلاحات على الأقل، مع تواريخها وما تغيّر، محفوظ في مكان ثابت ومرتبط بالمشروع.',

    defaultOwnerRole: 'geeks_dev',
    defaultChannelKey: 'geeks.logs',
    defaultDueDays: 10,

    tags: ['صيانة', 'تطبيق', 'سجل']
  },
  {
    id: 'geeks_accessibility_audit',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تقييم وصول لتطبيق/أداة قائمة',
    description_ar:
      'تشغيل فحص وصول أساسي (لوحة مفاتيح، تباين، تسميات، قارئ شاشة) مع تلخيص النقاط الحرجة بخطوات إصلاح مقترحة.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة فحص مبنية على WCAG تشمل: (١) صور/مقاطع قصيرة لثلاث مشكلات حرجة على الأقل، (٢) توصيات مختصرة لكل مشكلة، (٣) نشر الخلاصة في خيط المشروع.',

    defaultOwnerRole: 'qa_tester',
    defaultChannelKey: 'geeks.qa',
    defaultDueDays: 4,

    pipelineKey: 'geeks.app_accessibility',

    tags: ['وصول', 'اختبار', 'جودة']
  },
  {
    id: 'geeks_accessibility_fix_plan',
    type: 'task',
    unit: 'geeks',

    label_ar: 'خطة إصلاح وصول وقياس أثر',
    description_ar: 'تجميع مشكلات الوصول حسب الأولوية مع حلول سريعة ومؤشرات واضحة لقياس التحسّن.',

    size: 'S',
    definitionOfDone_ar:
      'جدول إصلاح مرتب حسب الأولوية يوضح: (١) مالك كل إصلاح، (٢) موعده المتوقع، (٣) أداة أو طريقة إعادة الفحص بعد التنفيذ، منشور في خيط المشروع ومثبت في قناة العمل.',

    defaultOwnerRole: 'geeks_lead',
    defaultChannelKey: 'geeks.apps',
    defaultDueDays: 3,

    pipelineKey: 'geeks.app_accessibility',

    tags: ['وصول', 'تخطيط', 'منتج']
  },
  {
    id: 'geeks_accessibility_fix_round',
    type: 'task',
    unit: 'geeks',

    label_ar: 'جولة إصلاح وصول موثّقة',
    description_ar: 'تنفيذ الإصلاحات ذات الأولوية مع توثيق قبل/بعد والتأكد من سلامة المسار الأساسي.',

    size: 'M',
    definitionOfDone_ar:
      'تنفيذ ٥ إصلاحات وصول على الأقل مع: (١) صور قبل/بعد أو روابط PR لكل إصلاح، (٢) فحص يدوي سريع يؤكد أن المسار الأساسي يعمل، (٣) ملاحظة موجزة في خيط المشروع.',

    defaultOwnerRole: 'geeks_dev',
    defaultChannelKey: 'geeks.apps',
    defaultDueDays: 7,

    pipelineKey: 'geeks.app_accessibility',

    tags: ['وصول', 'تطوير', 'تحسين']
  },
  {
    id: 'geeks_accessibility_user_test',
    type: 'task',
    unit: 'geeks',

    label_ar: 'اختبار مستخدمين/قارئ شاشة بعد الإصلاح',
    description_ar: 'تنظيم اختبار وصول سريع مع مستخدم حقيقي أو تشغيل قارئ شاشة وتوثيق الملاحظات بوضوح.',

    size: 'S',
    definitionOfDone_ar:
      'ملاحظات اختبار تشمل: (١) توثيق ٣ سيناريوهات على الأقل (لوحة مفاتيح + قارئ شاشة)، (٢) ما تم حله وما تبقى، (٣) رسالة مختصرة للقناة تشرح الثغرات والخطوة التالية.',

    defaultOwnerRole: 'qa_tester',
    defaultChannelKey: 'people.feedback',
    defaultDueDays: 5,

    pipelineKey: 'geeks.app_accessibility',

    tags: ['وصول', 'اختبار', 'مستخدمون']
  },
  {
    id: 'geeks_formsbot_to_onboarding',
    type: 'task',
    unit: 'geeks',

    label_ar: 'توجيه FormsBot إلى #onboarding-log',
    description_ar: 'ربط الردود من FormsBot بقناة سجل الانضمام أو الان onboarding-log مع ملخص نظيف.',

    size: 'S',
    definitionOfDone_ar:
      'رسائل ملخصة في قناة #onboarding-log لكل استمارة جديدة، بدون ضوضاء غير ضرورية، مع توثيق الخطوات في خيط داخلي.',

    defaultOwnerRole: 'automation_dev',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 4,

    tags: ['FormsBot', 'تكامل', 'أتمتة']
  },
  {
    id: 'geeks_carl_roles_audit',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تدقيق أدوار ردود Carl-bot',
    description_ar: 'مراجعة ردود Carl-bot والتأكد من أن الأدوار الممنوحة صحيحة وآمنة.',

    size: 'S',
    definitionOfDone_ar:
      'تقرير قصير يوضح كيف تُمنح الأدوار عبر Carl-bot، وما هي الثغرات أو الأخطاء المكتشفة، وما التعديلات التي تم تنفيذها.',

    defaultOwnerRole: 'security_reviewer',
    defaultChannelKey: 'geeks.security',
    defaultDueDays: 5,

    tags: ['Carl-bot', 'أدوار', 'أمان']
  },
  {
    id: 'geeks_monthly_backup_routine',
    type: 'task',
    unit: 'geeks',

    label_ar: 'روتين نسخ احتياطي وتصدير شهري',
    description_ar: 'إعداد وتنفيذ روتين شهري للنسخ الاحتياطي والتصدير للوسائط والبيانات المهمة.',

    size: 'M',
    definitionOfDone_ar:
      'جدول زمني واضح للنسخ الاحتياطي، مع مجلد محدث على Drive وملف سجل يوضح آخر ثلاث عمليات نسخ احتياطي على الأقل.',

    defaultOwnerRole: 'ops_engineer',
    defaultChannelKey: 'geeks.backup',
    defaultDueDays: 10,

    tags: ['نسخ احتياطي', 'Drive', 'أمان']
  },
  {
    id: 'geeks_drive_delivery_automation',
    type: 'task',
    unit: 'geeks',

    label_ar: 'نموذج «تسليم» إلى Drive تلقائي',
    description_ar: 'إنشاء نموذج أو سكربت يرسل تسليمات الوسائط إلى Drive مع تسمية منضبطة.',

    size: 'M',
    definitionOfDone_ar:
      'نموذج أو سكربت يعمل يرسل الملفات تلقائياً إلى مجلدات مناسبة على Drive بأسماء قياسية، مع مثالين صحيح/خطأ موثقين.',

    defaultOwnerRole: 'automation_dev',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 10,

    tags: ['Drive', 'أتمتة', 'تسليم']
  },
  {
    id: 'geeks_filename_alert_bot',
    type: 'task',
    unit: 'geeks',

    label_ar: 'روبوت تنبيه أسماء ملفات غير منضبطة',
    description_ar: 'برمجة روبوت ينبه عند رفع ملفات بأسماء غير منضبطة في قنوات معينة.',

    size: 'M',
    definitionOfDone_ar:
      'بوت يعمل في قناة التصدير أو قنوات الإعلام، يرسل تنبيهاً مع مثال لاسم صحيح عندما يكون الاسم غير منضبط، مع توثيق للاستخدام.',

    defaultOwnerRole: 'automation_dev',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 7,

    tags: ['أسماء ملفات', 'بوت', 'تدقيق']
  },
  {
    id: 'geeks_wp_webhook_bridge',
    type: 'task',
    unit: 'geeks',

    label_ar: 'جسر ووردبريس Webhook إلى ديسكورد',
    description_ar: 'ربط ووردبريس بديسكورد عبر Webhook لإرسال تحديثات محددة إلى قنوات معينة.',

    size: 'M',
    definitionOfDone_ar:
      'Webhook واحد على الأقل يعمل يرسل إشعارات عند حدث محدد (نشر مقال، تحديث صفحة)، مع ضبط القناة والرسالة بصورة نظيفة.',

    defaultOwnerRole: 'web_engineer',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 7,

    tags: ['ووردبريس', 'Webhook', 'Discord']
  },
  {
    id: 'geeks_pins_update_script',
    type: 'task',
    unit: 'geeks',

    label_ar: 'سكربت تحديث الرسائل المثبتة',
    description_ar: 'كتابة سكربت يساعد على تحديث الرسائل المثبتة في قنوات محددة من مصدر موحد.',

    size: 'S',
    definitionOfDone_ar:
      'سكربت أو أداة يمكن تشغيلها لتحديث محتوى الرسائل المثبتة في قناتين على الأقل، مع توثيق كيفية التشغيل والقيود.',

    defaultOwnerRole: 'automation_dev',
    defaultChannelKey: 'geeks.tools',
    defaultDueDays: 5,

    tags: ['مثبت', 'سكربت', 'أتمتة']
  },
  {
    id: 'geeks_permissions_audit_script',
    type: 'task',
    unit: 'geeks',

    label_ar: 'سكربت مراجعة الصلاحيات «من يرى ماذا»',
    description_ar: 'سكربت أو أداة لتوليد تقرير بالصلاحيات على القنوات والأدوار.',

    size: 'S',
    definitionOfDone_ar:
      'تقرير CSV أو مستند يوضح من يرى ماذا في ديسكورد، مع قائمة مقترحة بتعديلات الصلاحيات، لمرة واحدة على الأقل.',

    defaultOwnerRole: 'security_reviewer',
    defaultChannelKey: 'geeks.security',
    defaultDueDays: 7,

    tags: ['صلاحيات', 'أمان', 'تدقيق']
  },
  {
    id: 'geeks_transcription_toolchain',
    type: 'task',
    unit: 'geeks',

    label_ar: 'سلسلة أدوات تفريغ صوتي مفتوحة المصدر',
    description_ar: 'تجميع وإعداد سلسلة أدوات لتفريغ الصوت إلى نص بطريقة قابلة للاستخدام في حبق.',

    size: 'M',
    definitionOfDone_ar:
      'README واضح يشرح كيفية استخدام أدوات التفريغ، مثال تجربة واحدة على مادة حقيقية، وتقدير بسيط لدقة التفريغ.',

    defaultOwnerRole: 'geeks_dev',
    defaultChannelKey: 'geeks.tools',
    defaultDueDays: 10,

    tags: ['تفريغ صوتي', 'أدوات', 'مفتوح المصدر']
  },
  {
    id: 'geeks_media_compression_presets',
    type: 'task',
    unit: 'geeks',

    label_ar: 'إعدادات ضغط وسائط',
    description_ar: 'إعداد ملفات presets لضغط الوسائط بطريقة مناسبة للنشر والأرشفة.',

    size: 'S',
    definitionOfDone_ar:
      'ملفات .ffpreset أو ما يعادلها، مع دليل استخدام بسيط يشرح متى نستخدم كل إعداد، محفوظ في مرجع التقنيين.',

    defaultOwnerRole: 'ops_engineer',
    defaultChannelKey: 'geeks.tools',
    defaultDueDays: 7,

    tags: ['ضغط', 'وسائط', 'إعدادات']
  },
  {
    id: 'geeks_security_audit_tokens',
    type: 'task',
    unit: 'geeks',

    label_ar: 'تدقيق أمان رموز وصلاحيات',
    description_ar: 'مراجعة الرموز (tokens) والصلاحيات المستخدمة في البوتات والتكاملات والتأكد من سلامتها.',

    size: 'S',
    definitionOfDone_ar:
      'قائمة محدثة بالرموز المستخدمة ومكان تخزينها، مع ملاحظات حول المخاطر والإجراءات التصحيحية التي تم تنفيذها على الأقل في مشروع أو تكامل واحد.',

    defaultOwnerRole: 'security_reviewer',
    defaultChannelKey: 'geeks.security',
    defaultDueDays: 7,

    tags: ['أمان', 'Tokens', 'تدقيق']
  },
  {
    id: 'geeks_filename_naming_bot',
    type: 'task',
    unit: 'geeks',

    label_ar: 'روبوت تسمية الملفات',
    description_ar: 'برمجة روبوت يقترح أسماء قياسية للملفات عند رفعها أو عند الطلب.',

    size: 'M',
    definitionOfDone_ar:
      'بوت يعمل يمكنه اقتراح اسم قياسي لملف واحد على الأقل عند رفعه أو عند مناداته، مع مثالين صحيح/خطأ موثقين في خيط داخلي.',

    defaultOwnerRole: 'automation_dev',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 10,

    tags: ['أسماء ملفات', 'بوت', 'معايير']
  },
  {
    id: 'geeks_wp_to_announcements_webhook',
    type: 'task',
    unit: 'geeks',

    label_ar: 'Webhook ووردبريس → #announcements-org (مراجعة فقط)',
    description_ar:
      'إعداد Webhook يرسل إشعاراً إلى قناة الإعلانات التنظيمية عند نشر أو تعديل مواد محددة في ووردبريس.',

    size: 'S',
    definitionOfDone_ar:
      'Webhook يعمل يرسل إشعاراً منظماً في #announcements-org عند حدث محدد، مع حقل واضح للمسؤول التحريري لمراجعة المحتوى قبل إعادة النشر الخارجي.',

    defaultOwnerRole: 'web_engineer',
    defaultChannelKey: 'geeks.integrations',
    defaultDueDays: 7,

    tags: ['ووردبريس', 'إعلانات', 'Webhook']
  },
  {
    id: 'geeks_attachments_backup',
    type: 'task',
    unit: 'geeks',

    label_ar: 'نسخ احتياطي تلقائي للمرفقات',
    description_ar: 'إعداد نظام لنسخ المرفقات تلقائياً إلى مجلد أرشيف على Drive أو تخزين آخر.',

    size: 'M',
    definitionOfDone_ar:
      'نظام يعمل ينسخ المرفقات الجديدة من قناة أو قناتين على الأقل إلى مجلد أرشيف، مع سجل أسبوعي بسيط يوضح ما تمت أرشفته.',

    defaultOwnerRole: 'ops_engineer',
    defaultChannelKey: 'geeks.backup',
    defaultDueDays: 10,

    tags: ['مرفقات', 'نسخ احتياطي', 'Drive']
  },
  // Legacy/simple templates kept for compatibility
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

    tags: ['تطوير', 'تنفيذ']
  },
  {
    id: 'geeks_story_brief',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ملخص قصة/تجربة رقمية تفاعلية',
    description_ar: 'متطلبات التجربة، الجمهور، القصة، الوسائط المطلوبة، والقيود التقنية أو الزمنية.',

    size: 'M',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_story_access',
    type: 'task',
    unit: 'geeks',

    title_ar: 'الوصول إلى البيانات/الوسائط والتصاريح',
    description_ar: 'تجميع مصادر البيانات والوسائط، وضبط التصاريح لاستخدام الصور/الفيديو/الخرائط.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_story_user_flow',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تدفق المستخدم وتجربة التفاعل',
    description_ar: 'خرائط التدفق للمستخدم، النقاط التفاعلية، وأين تظهر الوسائط.',

    size: 'M',
    ownerFunction: 'geeks_uiux',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_story_visual_system',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تصميم بصري وتجهيز عناصر الواجهة للتجربة',
    description_ar: 'تصميم الواجهة والخرائط/المخططات التفاعلية والـUI kit المخصص للتجربة.',

    size: 'M',
    ownerFunction: 'geeks_uiux',
    stage: 'planning',
    claimable: true,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_story_frontend_build',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تنفيذ الواجهة التفاعلية',
    description_ar: 'بناء الواجهة التفاعلية والتأثيرات المطلوبة (scroll, map, timelines).',

    size: 'L',
    ownerFunction: 'geeks_frontend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.web'
  },
  {
    id: 'geeks_story_backend_cms',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ضبط محتوى البيانات/المقالات للتجربة',
    description_ar: 'هيكلة بيانات المحتوى في CMS أو JSON، وضبط نقاط الإدخال والتحديث.',

    size: 'M',
    ownerFunction: 'geeks_backend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_story_integration',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تكامل البيانات والوسائط (خرائط/فيديو/صوت)',
    description_ar: 'ربط التجربة بالبيانات والوسائط والواجهات المطلوبة مثل الخرائط أو الفيديو.',

    size: 'M',
    ownerFunction: 'geeks_fullstack',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.integrations'
  },
  {
    id: 'geeks_story_qa',
    type: 'task',
    unit: 'geeks',

    title_ar: 'اختبارات تفاعلية (نقرات، سكرول، أجهزة مختلفة)',
    description_ar: 'تشغيل سيناريوهات الاستخدام على أجهزة ومتصفحات متعددة للتأكد من التجربة.',

    size: 'S',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_story_performance',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تحسين أداء بسيط للتجربة (حجم ملفات، lazy load)',
    description_ar: 'مراجعة أداء الموارد الثقيلة وتطبيق تحسينات تحميل وتحسين الصور.',

    size: 'S',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_story_accessibility',
    type: 'task',
    unit: 'geeks',

    title_ar: 'مراجعة وصول/تفاعل (كيبورد، قارئ شاشة، تباين)',
    description_ar: 'تطبيق فحص وصول أساسي للتجربة التفاعلية (كيبورد، تباين، نصوص بديلة).',

    size: 'S',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_story_staging',
    type: 'task',
    unit: 'geeks',

    title_ar: 'نشر نسخة تفاعلية على staging/preview',
    description_ar: 'إعداد نسخة preview ومشاركة بيانات الدخول مع الفريق للتجربة.',

    size: 'S',
    ownerFunction: 'geeks_frontend',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_story_launch',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إطلاق التجربة ومراقبة أولية',
    description_ar: 'نشر النسخة النهائية ومراقبة الأخطاء والـuptime والتحميلات في أول أيام.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_story_docs',
    type: 'task',
    unit: 'geeks',

    title_ar: 'توثيق التجربة (روابط + كيفية التحديث)',
    description_ar: 'مستند يشرح أين توجد البيانات وكيفية تحديثها وما هي الحزم أو الإعدادات الأساسية.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_story_archive',
    type: 'task',
    unit: 'geeks',

    title_ar: 'أرشفة نسخة التجربة (screenshots + repo + فيديو قصير)',
    description_ar: 'حفظ لقطات شاشة/فيديو قصير وروابط الريبو أو الحزمة النهائية في مجلد مشترك.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_game_concept',
    type: 'task',
    unit: 'geeks',

    title_ar: 'فكرة اللعبة وسيناريو بسيط',
    description_ar: 'موجز اللعبة، الجمهور المستهدف، أسلوب اللعب، والمرجعيات البصرية/الصوتية.',

    size: 'M',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_requirements',
    type: 'task',
    unit: 'geeks',

    title_ar: 'متطلبات تقنية وبنية مختصرة للعبة',
    description_ar: 'تحديد المحرك/الإطار، المنصات المستهدفة، وأصول التصميم/الصوت المطلوبة.',

    size: 'M',
    ownerFunction: 'geeks_backend',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_prototype',
    type: 'task',
    unit: 'geeks',

    title_ar: 'بناء نموذج لعب قابل للتجربة',
    description_ar: 'إخراج نسخة أولية قابلة للعب لاختبار الميكانيكيات الأساسية.',

    size: 'L',
    ownerFunction: 'geeks_frontend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_playdev',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تطوير ميكانيكيات اللعب والمستويات',
    description_ar: 'تنفيذ التفاصيل التفاعلية والمستويات أو التحديات الأساسية.',

    size: 'L',
    ownerFunction: 'geeks_frontend',
    stage: 'build',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_art_audio',
    type: 'task',
    unit: 'geeks',

    title_ar: 'دمج العناصر البصرية والصوتية',
    description_ar: 'إضافة الأصول البصرية والصوتية وضبطها لتجربة اللعب.',

    size: 'M',
    ownerFunction: 'geeks_uiux',
    stage: 'build',
    claimable: true,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_playtest',
    type: 'task',
    unit: 'geeks',

    title_ar: 'اختبار لعب مع مجموعة صغيرة',
    description_ar: 'جلسة لعب مع مشاركين وتسجيل الملاحظات حول التوازن والسهولة.',

    size: 'M',
    ownerFunction: 'geeks_qa',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.qa'
  },
  {
    id: 'geeks_game_bugfix',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إصلاحات وتحسين بعد اختبار اللعب',
    description_ar: 'إغلاق الأخطاء وموازنة اللعب بناء على ملاحظات الاختبار.',

    size: 'M',
    ownerFunction: 'geeks_frontend',
    stage: 'test',
    claimable: true,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_game_deploy',
    type: 'task',
    unit: 'geeks',

    title_ar: 'نشر اللعبة (ويب/موبايل) ومراقبة',
    description_ar: 'رفع النسخة النهائية على المنصة المستهدفة ومراقبة الأخطاء الأولية.',

    size: 'M',
    ownerFunction: 'geeks_frontend',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_game_analytics',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إعداد قياس بسيط (أحداث لعب/إنجازات)',
    description_ar: 'ضبط تتبع أحداث اللعب الرئيسية والاحتفاظ، وإعداد لوحة بسيطة.',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'launch',
    claimable: true,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_game_docs',
    type: 'task',
    unit: 'geeks',

    title_ar: 'توثيق وصيانة اللعبة',
    description_ar: 'كتابة ملخص التثبيت، كيفية تعديل المراحل/الأصول، وقائمة الاعتماديات.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_game_archive',
    type: 'task',
    unit: 'geeks',

    title_ar: 'أرشفة لقطات اللعبة ورابط الحزمة',
    description_ar: 'تجهيز فيديو/لقطات، روابط repo أو الحزمة النهائية، وتخزينها في مجلد منظم.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_ads_brief',
    type: 'task',
    unit: 'geeks',

    title_ar: 'موجز حملة إعلانية (هدف، جمهور، ميزانية)',
    description_ar: 'تحديد الهدف، الجمهور، المنصات، الميزانية، والرسائل الأساسية.',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_tracking',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إعداد التتبع (Pixels/Tags) والتحقق',
    description_ar: 'تنصيب البكسل/التاغ، إعداد أحداث التحويل، والتحقق من الإشارات.',

    size: 'M',
    ownerFunction: 'geeks_analytics',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_structure',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تصميم هيكل الحملة (حملات/Ad sets/إعلانات)',
    description_ar: 'إنشاء الهيكل والميزانيات المبدئية ومطابقة الرسائل للجمهور.',

    size: 'M',
    ownerFunction: 'geeks_analytics',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_creatives',
    type: 'task',
    unit: 'geeks',

    title_ar: 'استلام/تهيئة التصاميم والنصوص للإعلانات',
    description_ar: 'تنسيق رفع التصاميم والنصوص وضبط الصيغ المطلوبة لكل منصة.',

    size: 'S',
    ownerFunction: 'geeks_uiux',
    stage: 'planning',
    claimable: true,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_launch',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إطلاق الحملة والتحقق من التتبع',
    description_ar: 'تشغيل الحملة، التأكد من استلام البيانات، وضبط ميزانية البداية.',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'launch',
    claimable: false,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_monitoring',
    type: 'task',
    unit: 'geeks',

    title_ar: 'مراقبة يومية/أسبوعية للأداء',
    description_ar: 'مراجعة النتائج، إيقاف الإعلانات الضعيفة، وتسجيل الملاحظات.',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_optimize',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تحسينات هيكل/استهداف/رسائل',
    description_ar: 'تجربة تحسينات معقولة بناء على البيانات (تعديلات جمهور/رسائل/ميزانية).',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_report',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تقرير ختامي (ملخص أداء + توصيات)',
    description_ar: 'تجميع النتائج في تقرير مختصر مع توصيات للحملات القادمة.',

    size: 'S',
    ownerFunction: 'geeks_analytics',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'geeks.analytics'
  },
  {
    id: 'geeks_ads_handover',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تسليم الوصول والتوثيق الأساسي للحملة',
    description_ar: 'توثيق الحسابات، التقارير، وأي إعدادات تخص التتبع، مع لقطات شاشة.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
  },
  {
    id: 'geeks_support_intake',
    type: 'task',
    unit: 'geeks',

    title_ar: 'استقبال طلب الدعم وتحديد النطاق',
    description_ar: 'تجميع تفاصيل طلب الشريك، النطاق والمهل الزمنية، وما إذا كان دعم مستمر أو إصلاح سريع.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_support_access',
    type: 'task',
    unit: 'geeks',

    title_ar: 'ضبط الوصول والحسابات للشريك',
    description_ar: 'تجميع حسابات ووردبريس/Analytics/استضافة وتأمينها.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.apps'
  },
  {
    id: 'geeks_support_audit',
    type: 'task',
    unit: 'geeks',

    title_ar: 'تدقيق سريع (أداء/أمان/إضافات)',
    description_ar: 'فحص سريع لمشاكل الأداء/الأمان والإضافات المسببة للبطء.',

    size: 'M',
    ownerFunction: 'geeks_fullstack',
    stage: 'planning',
    claimable: false,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_support_fixes',
    type: 'task',
    unit: 'geeks',

    title_ar: 'إصلاحات عاجلة وتحسينات صغيرة',
    description_ar: 'تنفيذ إصلاحات عاجلة أو تحسينات صغيرة متفق عليها، وتسجيل ما تم تغييره.',

    size: 'M',
    ownerFunction: 'geeks_fullstack',
    stage: 'build',
    claimable: true,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_support_monitor',
    type: 'task',
    unit: 'geeks',

    title_ar: 'مراقبة ومتابعة لمدة قصيرة',
    description_ar: 'مراقبة الأخطاء/الأداء خلال فترة الدعم والرد على أي تنبيهات.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'geeks.web_ops'
  },
  {
    id: 'geeks_support_docs',
    type: 'task',
    unit: 'geeks',

    title_ar: 'توثيق وحفظ اللقطات وروابط الدعم',
    description_ar: 'كتابة موجز لما تم، تحديث الروابط/الوصول، وتجهيز لقطات شاشة/فيديو قصير للتسليم.',

    size: 'S',
    ownerFunction: 'geeks_tech_pm',
    stage: 'post',
    claimable: true,
    defaultChannelKey: 'admin.docs'
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

    tags: ['إطلاق', 'توثيق']
  }
];

// ==========================
// Public API
// ==========================

const peopleStageOverrides = {
  people_feedback: 'post',
  people_event_feedback_form: 'post',
  people_event_debrief: 'post',
  people_event_photo_doc: 'shoot',
  people_event_archive_entry: 'post',
  people_live_notes_capture: 'shoot',
  people_live_notes_summary: 'post',
  people_event_visual_assets: 'planning',
  people_event_access_guide: 'planning',
  people_event_poster: 'planning',
  people_event_social_launch: 'planning',
  people_event_social_reminder: 'planning',
  people_event_logistics: 'planning',
  people_event_risk_review: 'planning',
  people_event_recording_policy: 'planning',
  people_event_concept: 'planning',
  people_event_budget_check: 'planning',
  people_event_invite_list: 'planning',
  people_log_talent: 'post',
  people_accessibility_checklist_event: 'planning'
};

const peopleCrossUnitOverrides = {
  people_tech_rehearsal: { media: false, geeks: true },
  people_event_access_guide: { media: false, geeks: true },
  people_event_visual_assets: { media: true, geeks: false },
  people_event_feedback_form: { media: false, geeks: false },
  'people.music.tech_and_safety_plan': { media: true, geeks: true },
  'people.music.digital_coordination': { media: true, geeks: true },
  'people.openmic.signup_system': { media: false, geeks: true },
  'people.openmic.safety_roles': { media: true, geeks: false },
  'people.exhibit.digital_coordination': { media: true, geeks: true },
  'people.shihan.tech_rider_master': { media: true, geeks: true },
  'people.shihan.documentation_plan': { media: true, geeks: true }
};

const geeksStageOverrides = {
  'geeks_site_setup': 'build',
  'geeks_site_frontend_build': 'build',
  'geeks_site_backend_setup': 'build',
  'geeks_site_qc': 'test',
  'geeks_site_responsive_test': 'test',
  'geeks_site_performance_check': 'test',
  'geeks_site_staging_launch': 'launch',
  'geeks_site_launch_monitor': 'launch',
  'geeks_site_docs_handover': 'post',
  'geeks_site_archive_snapshots': 'post',
  'geeks_site_launch_doc': 'post',
  'geeks.app.discovery': 'planning',
  'geeks.app.spec': 'planning',
  'geeks.app.milestone_mvp': 'build',
  'geeks.app.field_test': 'test',
  'geeks.app.deploy': 'launch',
  'geeks.app.handover_maintain': 'post',
  'geeks.stack.intake_prioritize': 'planning',
  'geeks.stack.flow_design': 'planning',
  'geeks.stack.implementation': 'build',
  'geeks.stack.sandbox_test': 'test',
  'geeks.stack.rollout': 'launch',
  'geeks.stack.docs': 'post',
  'geeks.discord.audit_current': 'planning',
  'geeks.discord.new_structure_design': 'planning',
  'geeks.discord.staging_setup': 'build',
  'geeks.discord.migration_plan': 'build',
  'geeks.discord.habapp_integration': 'build',
  'geeks.discord.moderator_guide': 'post',
  geeks_app_brief: 'planning',
  geeks_app_architecture_note: 'planning',
  geeks_app_prototype: 'build',
  geeks_app_internal_test: 'test',
  geeks_app_launch_note: 'launch',
  geeks_app_maintenance_log: 'post',
  geeks_accessibility_audit: 'planning',
  geeks_accessibility_fix_plan: 'planning',
  geeks_accessibility_fix_round: 'build',
  geeks_accessibility_user_test: 'test',
  geeks_app_maintenance: 'post',
  geeks_app_maintenance_log: 'post',
  geeks_implementation: 'build',
  geeks_review: 'post',
  geeks_test: 'test',
  geeks_launch: 'launch'
};

const normalizedGeeksTaskTemplates = geeksTaskTemplates.map(template => ({
  ...template,
  ownerFunction:
    template.ownerFunction ||
    template.defaultOwnerFunc ||
    template.defaultOwnerRole ||
    'geeks_tech_pm',
  stage: template.stage || geeksStageOverrides[template.id] || 'planning',
  claimable: typeof template.claimable === 'boolean' ? template.claimable : false
}));

const normalizedPeopleTaskTemplates = peopleTaskTemplates.map(template => ({
  ...template,
  ownerFunction:
    template.ownerFunction ||
    template.defaultOwnerFunc ||
    template.defaultOwnerRole ||
    'people_coordination',
  stage: template.stage || peopleStageOverrides[template.id] || 'planning',
  claimable: typeof template.claimable === 'boolean' ? template.claimable : false,
  crossUnit: template.crossUnit || peopleCrossUnitOverrides[template.id]
}));

const taskTemplates = [
  ...productionTaskTemplates,
  ...thinkTaskTemplates,
  ...mediaTaskTemplates,
  ...normalizedPeopleTaskTemplates,
  ...normalizedGeeksTaskTemplates
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
