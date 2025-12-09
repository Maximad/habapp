// src/core/templates.js

// كل قالب يمثل نوع مهمة متكرر يمكن استدعاؤه بسرعة.
// الحقول:
// id: معرّف إنجليزي قصير بدون فراغات
// unit: media | production | think | geeks | people | academy | admin
// size: S | M | L
// titleAr: عنوان المهمة بالعربية
// definitionAr: تعريف الإنجاز / النتيجة المتوقعة

const templates = [
  // ───── Admin / حوكمة ─────
  {
    id: 'admin_workflow_onepager',
    unit: 'admin',
    size: 'S',
    titleAr: 'صياغة «أساليب العمل» في صفحة واحدة',
    definitionAr: 'تثبيت في #rules ونسخة PDF على Drive.'
  },
  {
    id: 'admin_quarterly_roadmap',
    unit: 'admin',
    size: 'M',
    titleAr: 'خارطة طريق ربع سنوية نسخة 1',
    definitionAr: '3 أهداف و6 نتائج ومالكون وتواريخ، منشورة في قناة العمليات.'
  },
  {
    id: 'admin_corrections_flow_poster',
    unit: 'admin',
    size: 'S',
    titleAr: 'ملصق سير التصحيحات',
    definitionAr: 'رسم سير التصحيح مثبت في #استقبال-التصحيح و#سجل-التصحيحات.'
  },

  // ───── Media / الإعلام ─────
  {
    id: 'media_quick_interview_qa',
    unit: 'media',
    size: 'S',
    titleAr: 'مقابلة سريعة سؤال وجواب',
    definitionAr: 'نص 800–1200 كلمة مع صورة وملاحظات تدقيق حقائق.'
  },
  {
    id: 'media_visual_story_6_8',
    unit: 'media',
    size: 'M',
    titleAr: 'مقال بصري مصوّر 6–8 صور',
    definitionAr: 'مجموعة تصدير + تسميات + نص بديل + موافقات.'
  },
  {
    id: 'media_short_video_60_120',
    unit: 'media',
    size: 'M',
    titleAr: 'فيديو قصير 60–120 ثانية',
    definitionAr: 'نص أولي ومونتاج أولي ونهائي في #video و#التصدير.'
  },

  // ───── Production / الإنتاج ─────
  {
    id: 'prod_crew_list',
    unit: 'production',
    size: 'S',
    titleAr: 'بناء قائمة الطاقم لمشروع محدد',
    definitionAr: 'بطاقة في #فرق-العمل بالأدوار ومواعيد النداء.'
  },
  {
    id: 'prod_call_sheet',
    unit: 'production',
    size: 'S',
    titleAr: 'ورقة نداء يوم تصوير',
    definitionAr: 'PDF بوسائل التواصل والخريطة وملاحظات السلامة.'
  },
  {
    id: 'prod_post_plan',
    unit: 'production',
    size: 'S',
    titleAr: 'خطة المونتاج أولي ثم نهائي ثم قفل',
    definitionAr: 'بطاقة في #مسار-المونتاج مع التواريخ والمالكين.'
  },

  // ───── Think / فِكر ─────
  {
    id: 'think_research_queue_sort',
    unit: 'think',
    size: 'S',
    titleAr: 'فرز طابور البحث 10 عناصر',
    definitionAr: 'قائمة مرتبة بالأولويات والمالكين في #research-queue.'
  },
  {
    id: 'think_background_memo',
    unit: 'think',
    size: 'S',
    titleAr: 'مذكرة خلفية لموضوع محدّد',
    definitionAr: '1–2 صفحة مصادر رئيسية مع ملخص.'
  },

  // ───── Geeks / الجيكس ─────
  {
    id: 'geeks_backup_routine',
    unit: 'geeks',
    size: 'S',
    titleAr: 'روتين نسخ احتياطي وتصدير شهري',
    definitionAr: 'جدول زمني ومجلد على Drive مع توثيق.'
  },
  {
    id: 'geeks_wp_webhook_bridge',
    unit: 'geeks',
    size: 'M',
    titleAr: 'جسر ووردبريس Webhook إلى ديسكورد',
    definitionAr: 'POST نموذجي من الموقع إلى قناة متابعة معيّنة.'
  },

  // ───── People / الناس ─────
  {
    id: 'people_volunteer_intake',
    unit: 'people',
    size: 'M',
    titleAr: 'استقبال المتطوعين والمواءمة',
    definitionAr: 'جدول مهارات وربطه بخيوط مهام مناسبة.'
  },

  // ───── Academy / الأكاديمية ─────
  {
    id: 'academy_factcheck_101',
    unit: 'academy',
    size: 'M',
    titleAr: 'دورة مصغّرة «تدقيق حقائق 101»',
    definitionAr: '3 فيديوهات قصيرة + اختبار + قائمة موارد.'
  }
];

// فلترة حسب الوحدة (أو الكل)
function getTemplatesByUnit(unit) {
  if (!unit || unit === 'all') return templates;
  return templates.filter(t => t.unit === unit);
}

function getTemplateById(id) {
  const key = String(id || '').toLowerCase();
  return (
    templates.find(t => t.id.toLowerCase() === key) || null
  );
}

module.exports = {
  templates,
  getTemplatesByUnit,
  getTemplateById
};
