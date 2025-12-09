// src/discord/i18n/profileLabels.js
// خرائط الكلمات المفتاحية لأسماء عربية لعرض الملف الشخصي

const unitLabels = {
  media: 'الإعلام',
  production: 'الإنتاج',
  think: 'فِكر',
  geeks: 'الجيكس',
  people: 'الناس',
  academy: 'الأكاديمية'
};

const functionLabels = {
  reporter: 'صحافة / كتابة',
  producer: 'إنتاج',
  director: 'مخرج',
  dop: 'مدير تصوير',
  video: 'فيديو',
  photo: 'تصوير فوتوغرافي',
  graphics: 'غرافيك',
  sound: 'صوت',
  post: 'مونتاج / بوست برودكشن',
  developer: 'تطوير / برمجة',
  researcher: 'بحث',
  data_analyst: 'تحليل بيانات',
  data: 'بيانات / تصور بيانات',
  event_host: 'استضافة فعاليات',
  field_ops: 'ميدان ولوجستيات',
  people_programmer: 'برمجة الفعاليات والمحتوى',
  people_coordination: 'تنسيق ولوجستيات الفعاليات',
  designer: 'تصميم / غرافيك',
  ethics: 'أخلاقيات وسلامة',
  media_documentation: 'توثيق إعلامي',
  archive: 'أرشيف',
  desk_editor: 'تحرير / نشر الموقع',
  geeks_tech_pm: 'إدارة تقنية / PM',
  geeks_frontend: 'تطوير واجهات',
  geeks_backend: 'تطوير خلفيات / CMS',
  geeks_fullstack: 'تطوير متكامل',
  geeks_uiux: 'تصميم وتجربة مستخدم',
  geeks_qa: 'اختبارات وضمان جودة',
  geeks_analytics: 'تحليل وقياس رقمي'
};

const stateLabels = {
  guest: 'ضيف',
  trial: 'تجريبي',
  casual: 'مشارك',
  active: 'نشط',
  core: 'نواة',
  lead: 'قيادة',
  suspended: 'معلّق'
};

const identityLabels = {
  pseudonymous: 'اسم مستعار',
  verified: 'موثّق',
  unknown: 'غير محدد'
};

function mapWithFallback(map, key) {
  if (!key) return null;
  return map[key] || map[String(key).toLowerCase()] || null;
}

function unitKeyToArabic(key) {
  return mapWithFallback(unitLabels, key) || key;
}

function functionKeyToArabic(key) {
  return mapWithFallback(functionLabels, key) || key;
}

function stateKeyToArabic(key) {
  return mapWithFallback(stateLabels, key) || key;
}

function identityModeToArabic(key) {
  return mapWithFallback(identityLabels, key) || key;
}

module.exports = {
  unitLabels,
  functionLabels,
  stateLabels,
  identityLabels,
  unitKeyToArabic,
  functionKeyToArabic,
  stateKeyToArabic,
  identityModeToArabic
};
