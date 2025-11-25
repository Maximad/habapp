function stageToArabic(stage) {
  return (
    {
      planning: 'التخطيط',
      shooting: 'التصوير',
      editing: 'المونتاج',
      review: 'المراجعة',
      archived: 'مؤرشف'
    }[stage] || stage
  );
}

function unitToArabic(u) {
  return (
    {
      media: 'الإعلام',
      production: 'الإنتاج',
      think: 'فِكر',
      geeks: 'الجيكس',
      people: 'الناس',
      academy: 'الأكاديمية',
      admin: 'الإدارة'
    }[u] || u || 'غير محدّد'
  );
}

function statusToArabic(status) {
  return status === 'done' ? 'منجزة' : 'مفتوحة';
}

module.exports = {
  stageToArabic,
  unitToArabic,
  statusToArabic
};
