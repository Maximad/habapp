// src/core/templates.production.js
// تعريف قوالب الإنتاج المرئي والصوتي (A / B / C) مع بيانات وافية
// هذه القوالب لا تغيّر أي سلوك حالياً، بل هي مصدر بيانات يمكن استدعاؤه من project logic لاحقاً.

/**
 * مراحل الإنتاج المسموح بها في نظام حبق للإنتاج
 * نفس المراحل التي نستعملها في المنتدى:
 * planning, shooting, editing, review, archived
 */
const PRODUCTION_STAGE_ORDER = [
  'planning',
  'shooting',
  'editing',
  'review',
  'archived',
];

/**
 * @typedef {'internal' | 'external' | 'mixed'} ClientType
 * @typedef {'minimal' | 'standard' | 'premium'} ProductionQualityLevel
 */

/**
 * @typedef {Object} CrewRoleConfig
 * @property {string} key         // مفتاح داخلي مثل 'producer', 'dp'
 * @property {string} label_ar    // اسم الدور بالعربية كما يظهر في التكليف
 * @property {number} min         // الحد الأدنى المقترح لعدد الأشخاص
 * @property {number} max         // الحد الأعلى المقترح (مرن)
 */

/**
 * @typedef {Object} GearPackageConfig
 * @property {string} key         // مفتاح داخلي مثل 'minimal_kit'
 * @property {string} label_ar    // اسم الحزمة بالعربية
 * @property {string} description_ar // وصف مختصر للحزمة
 */

/**
 * @typedef {Object} ReviewStepConfig
 * @property {string} key
 * @property {string} label_ar
 * @property {string} description_ar
 */

/**
 * @typedef {Object} ProductionTemplate
 * @property {string} id                     // معرف ثابت مثل 'prod_template_A'
 * @property {string} code                   // A أو B أو C
 * @property {string} name_ar                // الاسم الظاهر بالعربية
 * @property {string} short_ar               // اسم مختصر لعرض سريع
 * @property {string} description_ar         // وصف القالب
 * @property {ClientType} clientType         // internal أو external أو mixed
 * @property {ProductionQualityLevel} quality // minimal أو standard أو premium
 * @property {boolean} isDefaultForInternal  // هل هو القالب الافتراضي للانتاج الداخلي
 * @property {boolean} isDefaultForExternal  // هل هو القالب الافتراضي للانتاج مع عميل خارجي
 * @property {string[]} allowedStages        // قائمة المراحل المسموح بها لهذا القالب
 * @property {ReviewStepConfig[]} extraReviewSteps // خطوات مراجعة إضافية
 * @property {boolean} needsContract         // هل يحتاج عقد رسمي
 * @property {boolean} needsClientApprovalBeforePublish // موافقة العميل قبل النشر
 * @property {CrewRoleConfig[]} crewRoles    // أدوار الطاقم المقترَحة
 * @property {GearPackageConfig} gearPackage // حزمة المعدّات الأساسية
 */

const productionTemplates = /** @type {ProductionTemplate[]} */ ([
  // Template A: Minimal internal
  {
    id: 'prod_template_A',
    code: 'A',
    name_ar: 'قالب أ: مقابلة بسيطة / إنتاج داخلي',
    short_ar: 'قالب أ - داخلي بسيط',
    description_ar:
      'مقابلة بسيطة أو توثيق خفيف لفيديو قصير، موجه أساساً لمواد حبق الداخلية أو لمحتوى مجتمعي، بطاقم صغير وإضاءة متاحة أو إضاءة خفيفة جداً.',

    clientType: 'internal',
    quality: 'minimal',
    isDefaultForInternal: true,
    isDefaultForExternal: false,

    allowedStages: ['planning', 'shooting', 'editing', 'review', 'archived'],

    extraReviewSteps: [
      {
        key: 'editorial_check',
        label_ar: 'مراجعة تحريرية سريعة',
        description_ar: 'تحقق أساسي من اللغة، المحتوى الحساس، وغياب الأخطاء الواضحة قبل النشر.',
      },
    ],

    needsContract: false,
    needsClientApprovalBeforePublish: false,

    crewRoles: [
      {
        key: 'videographer',
        label_ar: 'مصوّر فيديو (كاميرا + صوت بسيط)',
        min: 1,
        max: 1,
      },
      {
        key: 'coord',
        label_ar: 'منسق إنتاج خفيف / مضيف',
        min: 0,
        max: 1,
      },
    ],

    gearPackage: {
      key: 'minimal_kit',
      label_ar: 'عدة تصوير بسيطة',
      description_ar:
        'كاميرا واحدة مع حامل ثلاثي، ميكروفون لاسلكي واحد، وإضاءة متاحة من المكان أو لوحة LED صغيرة إذا لزم الأمر.',
    },
  },

  // Template B: Standard NGO / documentary
  {
    id: 'prod_template_B',
    code: 'B',
    name_ar: 'قالب ب: مقابلة وثائقية قياسية',
    short_ar: 'قالب ب - وثائقي قياسي',
    description_ar:
      'مقابلة وثائقية قياسية أو مادة لمنظمة شريكة، بجودة مهنية مستقرة، إضاءة خفيفة أو عاكس، وطاقم صغير لكن موزع بوضوح.',

    clientType: 'external',
    quality: 'standard',
    isDefaultForInternal: false,
    isDefaultForExternal: false,

    allowedStages: ['planning', 'shooting', 'editing', 'review', 'archived'],

    extraReviewSteps: [
      {
        key: 'editorial_review',
        label_ar: 'مراجعة تحريرية كاملة',
        description_ar:
          'تحرير نصي وجمالي متكامل يشمل العنوان والوصف والترجمة والحقوق الافتتاحية والنصوص الظاهرة على الشاشة.',
      },
      {
        key: 'fact_check',
        label_ar: 'تدقيق معلومات أساسي',
        description_ar:
          'مراجعة الادعاءات الحساسة والتواريخ والأسماء والخرائط وأي أرقام ظاهرة في المادة.',
      },
    ],

    needsContract: true,
    needsClientApprovalBeforePublish: true,

    crewRoles: [
      {
        key: 'producer',
        label_ar: 'منتج / منسق رئيسي',
        min: 1,
        max: 1,
      },
      {
        key: 'videographer',
        label_ar: 'مصوّر رئيسي',
        min: 1,
        max: 1,
      },
      {
        key: 'ac_audio',
        label_ar: 'مساعد كاميرا وصوت',
        min: 1,
        max: 1,
      },
    ],

    gearPackage: {
      key: 'standard_kit',
      label_ar: 'عدة تصوير وثائقي قياسي',
      description_ar:
        'كاميرا رئيسية مع حامل ثلاثي، ميكروفون لاسلكي، عاكس ضوء أو لوحة LED صغيرة، سماعات مراقبة، وملحقات أساسية.',
    },
  },

  // Template C: High quality client benchmark
  {
    id: 'prod_template_C',
    code: 'C',
    name_ar: 'قالب ج: مقابلة عالية الجودة وفق معيار العميل',
    short_ar: 'قالب ج - جودة عالية',
    description_ar:
      'إنتاج بمستوى بصري وصوتي أعلى، يستجيب لمعايير تقنية واضحة للعميل، مع إدارة إنتاج أوضح، وطاقم أكبر، وإضاءة كاملة للمشهد.',

    clientType: 'external',
    quality: 'premium',
    isDefaultForInternal: false,
    isDefaultForExternal: true,

    allowedStages: ['planning', 'shooting', 'editing', 'review', 'archived'],

    extraReviewSteps: [
      {
        key: 'editorial_review',
        label_ar: 'مراجعة تحريرية مفصلة',
        description_ar:
          'صياغة دقيقة للنص والرواية، مع مراجعة حساسية سياسية واجتماعية وحقوقية قبل مشاركة المادة مع العميل.',
      },
      {
        key: 'fact_check',
        label_ar: 'تدقيق معلومات موسع',
        description_ar:
          'مراجعة الادعاءات والأرقام والأسماء والمواقع، مع توثيق مصادر واضحة يمكن مشاركتها عند الحاجة.',
      },
      {
        key: 'client_prelock_review',
        label_ar: 'مراجعة عميل قبل قفل المونتاج',
        description_ar:
          'إرسال نسخة مونتاج شبه نهائية للعميل لتجميع ملاحظات نهائية قبل قفل التعديلات التقنية.',
      },
    ],

    needsContract: true,
    needsClientApprovalBeforePublish: true,

    crewRoles: [
      {
        key: 'producer',
        label_ar: 'منتج / منسق رئيسي',
        min: 1,
        max: 1,
      },
      {
        key: 'dp',
        label_ar: 'مدير تصوير (DP)',
        min: 1,
        max: 1,
      },
      {
        key: 'gaffer',
        label_ar: 'مساعد إضاءة وصوت',
        min: 1,
        max: 1,
      },
      {
        key: 'camera_tech',
        label_ar: 'تقني كاميرا أو مشغل ثانوي',
        min: 0,
        max: 1,
      },
      {
        key: 'ops_support',
        label_ar: 'دعم عمليات / صور خلف الكواليس',
        min: 0,
        max: 1,
      },
    ],

    gearPackage: {
      key: 'premium_fx3_kit',
      label_ar: 'عدة تصوير متقدمة',
      description_ar:
        'كاميرا مثل FX3 أو ما يعادلها، ثلاث نقاط إضاءة أو ما يقارب ذلك، ميكروفون لاسلكي ويفضل إضافة بوم، وملحقات كاملة لإدارة اللون والصوت.',
    },
  },
]);

/**
 * احصل على قالب إنتاج وفق الكود A أو B أو C
 * @param {string} code
 * @returns {ProductionTemplate | undefined}
 */
function getProductionTemplateByCode(code) {
  const normalized = String(code || '').trim().toUpperCase();
  return productionTemplates.find((t) => t.code === normalized);
}

/**
 * اختر قالباً وفق نوع العميل وجودة مطلوبة
 * @param {{ clientType?: ClientType, quality?: ProductionQualityLevel }} ctx
 * @returns {ProductionTemplate}
 */
function chooseProductionTemplate(ctx = {}) {
  const clientType = ctx.clientType || 'internal';
  const quality = ctx.quality || (clientType === 'internal' ? 'minimal' : 'standard');

  // محاولة مطابقة مباشرة
  const direct = productionTemplates.find(
    (t) => t.clientType === clientType && t.quality === quality
  );
  if (direct) return direct;

  // محاولة اختيار الافتراضي للعميل
  const fallbackForClient = productionTemplates.find((t) =>
    clientType === 'internal' ? t.isDefaultForInternal : t.isDefaultForExternal
  );
  if (fallbackForClient) return fallbackForClient;

  // آخر حل: أول قالب في القائمة
  return productionTemplates[0];
}

module.exports = {
  PRODUCTION_STAGE_ORDER,
  productionTemplates,
  getProductionTemplateByCode,
  chooseProductionTemplate,
};
