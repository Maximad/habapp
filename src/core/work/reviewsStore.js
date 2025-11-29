// src/core/work/reviewsStore.js
// Simple JSON storage for task reviews

const { defaultStore } = require('../store');

const REVIEWS_KEY = 'reviews';

function ensureStore(store = defaultStore) {
  return store || defaultStore;
}

function loadReviews(store = defaultStore) {
  const list = ensureStore(store).read(REVIEWS_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveReviews(list, store = defaultStore) {
  ensureStore(store).write(REVIEWS_KEY, Array.isArray(list) ? list : []);
}

function nextId(reviews) {
  const max = reviews.reduce((acc, review) => {
    const n = Number(review && review.id);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  const next = max + 1;
  return String(next || Date.now());
}

function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean).map(t => String(t));
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

function add(review, store = defaultStore) {
  const reviews = loadReviews(store);
  const now = new Date().toISOString();

  const record = {
    id: nextId(reviews),
    taskId: review.taskId ? String(review.taskId) : '',
    projectSlug: review.projectSlug ? String(review.projectSlug) : '',
    type: review.type,
    score: typeof review.score === 'number' ? review.score : null,
    ethicsStatus: review.ethicsStatus || null,
    tags: normalizeTags(review.tags),
    notes: review.notes || '',
    reviewerId: review.reviewerId ? String(review.reviewerId) : '',
    createdAt: review.createdAt || now
  };

  reviews.push(record);
  saveReviews(reviews, store);
  return record;
}

function list(store = defaultStore) {
  return loadReviews(store);
}

function listByTask(taskId, store = defaultStore) {
  return loadReviews(store).filter(r => String(r.taskId) === String(taskId));
}

module.exports = {
  list,
  listByTask,
  add
};
