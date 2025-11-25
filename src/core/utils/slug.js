// src/core/utils/slug.js
// Utilities to normalize and validate slugs across the app.

const arabicMap = {
  ا: 'a', أ: 'a', إ: 'i', آ: 'a',
  ب: 'b', ت: 't', ث: 'th', ج: 'j', ح: 'h', خ: 'kh',
  د: 'd', ذ: 'dh', ر: 'r', ز: 'z', س: 's', ش: 'sh',
  ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a', غ: 'gh',
  ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n',
  ه: 'h', و: 'w', ي: 'y', ة: 'h', ى: 'a', ئ: 'y', ؤ: 'w'
};

function basicTransliterate(value) {
  return String(value || '')
    .split('')
    .map(ch => arabicMap[ch] || ch)
    .join('');
}

function normalizeSlugCandidate(input) {
  const transliterated = basicTransliterate(input).normalize('NFD').replace(/\p{Diacritic}+/gu, '');
  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim();
}

function validateSlugFormat(slug) {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized || !/^[a-z0-9]+([_-][a-z0-9]+)*$/.test(normalized)) {
    const err = new Error('INVALID_SLUG');
    err.code = 'INVALID_SLUG';
    throw err;
  }
  return normalized;
}

function generateUniqueSlug(candidate, existingSlugs = []) {
  const existing = new Set(existingSlugs.map(s => String(s || '').toLowerCase()));
  let slug = candidate;
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${candidate}-${counter}`;
    counter += 1;
  }
  return slug;
}

function resolveSlug({ name, slug }, existingSlugs = []) {
  const base = slug
    ? validateSlugFormat(slug)
    : normalizeSlugCandidate(name || '') || 'project';

  return generateUniqueSlug(base, existingSlugs);
}

module.exports = {
  normalizeSlugCandidate,
  validateSlugFormat,
  generateUniqueSlug,
  resolveSlug
};
