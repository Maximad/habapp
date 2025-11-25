// src/core/work-log.js
const { defaultStore } = require('./store');

const WORK_LOG_KEY = 'work-log';

function getStore(store = defaultStore) {
  return store || defaultStore;
}

function loadWorkLog(store = defaultStore) {
  const entries = getStore(store).read(WORK_LOG_KEY, []);
  return Array.isArray(entries) ? entries : [];
}

function saveWorkLog(entries, store = defaultStore) {
  const normalized = Array.isArray(entries) ? entries : [];
  getStore(store).write(WORK_LOG_KEY, normalized);
}

function nextId(entries) {
  const max = entries.reduce((acc, entry) => {
    const n = Number(entry && entry.id);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return String(max + 1 || Date.now());
}

function addBackfillEntry(userId, payload, store = defaultStore) {
  const entries = loadWorkLog(store);
  const now = new Date().toISOString();
  const id = nextId(entries);

  const entry = {
    id,
    userId: String(userId),
    unit: payload.unit,
    pipelineKey: payload.pipelineKey,
    title: payload.title,
    description: payload.description,
    completedAt: payload.completedAt,
    links: Array.isArray(payload.links) ? payload.links : [],
    source: 'backfill',
    verified: false,
    verificationReviewerId: null,
    createdAt: now,
    updatedAt: now
  };

  entries.push(entry);
  saveWorkLog(entries, store);
  return entry;
}

function verifyBackfillEntry(entryId, reviewerId, verifiedBoolean, store = defaultStore) {
  const entries = loadWorkLog(store);
  const idx = entries.findIndex(e => String(e.id) === String(entryId));
  if (idx === -1) throw new Error('Backfill entry not found');

  const entry = entries[idx];
  entries[idx] = {
    ...entry,
    verified: !!verifiedBoolean,
    verificationReviewerId: reviewerId,
    updatedAt: new Date().toISOString()
  };

  saveWorkLog(entries, store);
  return entries[idx];
}

function listBackfillEntries(filter = {}, store = defaultStore) {
  const entries = loadWorkLog(store);
  if (!filter) return entries;

  return entries.filter(entry => {
    if (filter.userId && String(entry.userId) !== String(filter.userId)) return false;
    if (typeof filter.verified === 'boolean' && entry.verified !== filter.verified) return false;
    if (filter.unit && entry.unit !== filter.unit) return false;
    if (filter.pipelineKey && entry.pipelineKey !== filter.pipelineKey) return false;
    return true;
  });
}

module.exports = {
  addBackfillEntry,
  verifyBackfillEntry,
  listBackfillEntries,
  loadWorkLog
};
