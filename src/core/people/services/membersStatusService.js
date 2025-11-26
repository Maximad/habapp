const { defaultStore } = require('../../store');
const { loadWorkLog } = require('../work-log');
const { getMemberProfile, upsertMemberProfile } = require('../members');

const STATUS_TIERS = {
  Lead: 'Lead',
  Core: 'Core',
  Active: 'Active',
  Casual: 'Casual',
  Trial: 'Trial',
  Guest: 'Guest',
  Suspended: 'Suspended'
};

function isVerified(entry) {
  if (typeof entry.verified === 'boolean') {
    return entry.verified;
  }
  return true;
}

function normalizeDate(raw) {
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.valueOf()) ? d : null;
}

function countSince(entries, now, days) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return entries.filter(e => {
    const completedAt = normalizeDate(e.completedAt);
    return completedAt && completedAt >= cutoff;
  }).length;
}

function computeWorkLogStats(entries, now = new Date()) {
  const verified = entries.filter(isVerified);
  const last7Days = countSince(verified, now, 7);
  const last14Days = countSince(verified, now, 14);
  const last30Days = countSince(verified, now, 30);

  const lastCompletedAt = verified.reduce((latest, entry) => {
    const date = normalizeDate(entry.completedAt);
    if (!date) return latest;
    if (!latest || date > latest) return date;
    return latest;
  }, null);

  return {
    totalVerified: verified.length,
    last7Days,
    last14Days,
    last30Days,
    lastCompletedAt: lastCompletedAt ? lastCompletedAt.toISOString() : null
  };
}

function deriveStatusTier(stats, previousTier = null) {
  if (previousTier === STATUS_TIERS.Suspended) return STATUS_TIERS.Suspended;

  if (stats.last7Days >= 3) return STATUS_TIERS.Lead;
  if (stats.last7Days >= 2) return STATUS_TIERS.Core;
  if (stats.last14Days >= 1) return STATUS_TIERS.Active;

  if (stats.last30Days >= 1) {
    return previousTier === STATUS_TIERS.Trial ? STATUS_TIERS.Trial : STATUS_TIERS.Casual;
  }

  if (previousTier === STATUS_TIERS.Trial) return STATUS_TIERS.Trial;
  return STATUS_TIERS.Guest;
}

function updateMemberStatus(userId, store = defaultStore, now = new Date()) {
  const entries = loadWorkLog(store).filter(e => String(e.userId) === String(userId));
  const stats = computeWorkLogStats(entries, now);

  const existing = getMemberProfile(userId, store);
  const previousTier = existing?.status?.tier || null;
  const tier = deriveStatusTier(stats, previousTier);

  const nextStatus = {
    tier,
    updatedAt: now.toISOString ? now.toISOString() : new Date(now).toISOString(),
    workLogStats: stats
  };

  return upsertMemberProfile(
    userId,
    {
      ...(existing || {}),
      status: nextStatus
    },
    store
  );
}

module.exports = {
  updateMemberStatus,
  deriveStatusTier,
  computeWorkLogStats,
  STATUS_TIERS
};
