// src/core/people/memberStatsService.js
// Helpers to update member stats based on reviews

const membersStore = require('./membersStore');
const reviewsStore = require('../work/reviewsStore');

function cloneStats(stats = {}) {
  if (!stats || typeof stats !== 'object') return {};
  return JSON.parse(JSON.stringify(stats));
}

async function applyQualityReviewToMember(memberId, score, store) {
  if (!memberId || typeof score !== 'number') return null;

  const member = await membersStore.getMemberByDiscordId(memberId, store);
  if (!member) return null;

  const stats = cloneStats(member.stats || {});
  stats.quality = stats.quality || { reviews: 0, avgScore: 0 };

  const currentReviews = Number.isFinite(stats.quality.reviews) ? stats.quality.reviews : 0;
  const currentAvg = Number.isFinite(stats.quality.avgScore) ? stats.quality.avgScore : 0;

  const totalScore = currentAvg * currentReviews + score;
  const nextReviews = currentReviews + 1;
  const nextAvg = nextReviews > 0 ? totalScore / nextReviews : 0;

  const nextStats = {
    ...stats,
    quality: {
      reviews: nextReviews,
      avgScore: Number.isFinite(nextAvg) ? Number(nextAvg.toFixed(2)) : 0
    }
  };

  return membersStore.saveMember({ discordId: memberId, stats: nextStats }, store);
}

async function applyEthicsReviewToMember(memberId, status, store) {
  if (!memberId || !status) return null;

  const member = await membersStore.getMemberByDiscordId(memberId, store);
  if (!member) return null;

  const stats = cloneStats(member.stats || {});
  stats.ethics = stats.ethics || { ok: 0, needsDiscussion: 0, violation: 0 };

  const nextEthics = { ...stats.ethics };
  if (status === 'ok') nextEthics.ok = (nextEthics.ok || 0) + 1;
  if (status === 'needs_discussion') nextEthics.needsDiscussion = (nextEthics.needsDiscussion || 0) + 1;
  if (status === 'violation') nextEthics.violation = (nextEthics.violation || 0) + 1;

  const nextStats = { ...stats, ethics: nextEthics };
  return membersStore.saveMember({ discordId: memberId, stats: nextStats }, store);
}

module.exports = {
  applyQualityReviewToMember,
  applyEthicsReviewToMember,
  // keep reference to reviewsStore for potential future cross-reads
  reviewsStore
};
