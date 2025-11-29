function validateDueDate(dueStr) {
  if (!dueStr || typeof dueStr !== 'string') {
    return { ok: false, error: 'صيغة التاريخ غير صحيحة. استخدم الشكل YYYY-MM-DD (مثلاً 2025-12-30) ويجب أن يكون التاريخ في المستقبل.' };
  }

  const trimmed = dueStr.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { ok: false, error: 'صيغة التاريخ غير صحيحة. استخدم الشكل YYYY-MM-DD (مثلاً 2025-12-30) ويجب أن يكون التاريخ في المستقبل.' };
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, error: 'صيغة التاريخ غير صحيحة. استخدم الشكل YYYY-MM-DD (مثلاً 2025-12-30) ويجب أن يكون التاريخ في المستقبل.' };
  }

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return { ok: false, error: 'صيغة التاريخ غير صحيحة. استخدم الشكل YYYY-MM-DD (مثلاً 2025-12-30) ويجب أن يكون التاريخ في المستقبل.' };
  }

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (parsed <= todayUtc) {
    return { ok: false, error: 'صيغة التاريخ غير صحيحة. استخدم الشكل YYYY-MM-DD (مثلاً 2025-12-30) ويجب أن يكون التاريخ في المستقبل.' };
  }

  return { ok: true, date: parsed };
}

module.exports = { validateDueDate };
