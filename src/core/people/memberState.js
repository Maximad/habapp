// src/core/people/memberState.js
// Helpers to work with member state keys and Discord role names

const STATE_PRIORITY = {
  guest: 1,
  trial: 2,
  casual: 2.5,
  active: 3,
  core: 4,
  lead: 5,
  suspended: 6
};

function getStateRoleName(state) {
  const map = {
    guest: '[STATE] Guest',
    trial: '[STATE] Trial',
    casual: '[STATE] Casual',
    active: '[STATE] Active',
    core: '[STATE] Core',
    lead: '[STATE] Lead',
    suspended: '[STATE] Suspended'
  };

  return map[state] || null;
}

/**
 * Compute a recommended state based on stats, without touching real roles.
 * This is advisory only; it does NOT change Discord roles directly.
 * @param {Object} stats - member.stats
 * @returns {string} one of 'guest' | 'trial' | 'casual' | 'active' | 'core' | 'lead'
 */
function computeRecommendedState(stats = {}) {
  const tasksCompleted = Number.isFinite(stats.tasksCompleted)
    ? stats.tasksCompleted
    : 0;

  const quality = stats.quality || {};
  const ethics = stats.ethics || {};

  const avgScore = Number.isFinite(quality.avgScore) ? quality.avgScore : 0;
  const ethicsViolation = Number.isFinite(ethics.violation) ? ethics.violation : 0;

  // Lead is usually manual; only suggest it for exceptional and clean performance.
  if (tasksCompleted >= 60 && avgScore >= 2.8 && ethicsViolation === 0) {
    return 'lead';
  }

  if (tasksCompleted >= 30 && avgScore >= 2.5 && ethicsViolation === 0) {
    return 'core';
  }

  if (tasksCompleted >= 10 && avgScore >= 2 && ethicsViolation === 0) {
    return 'active';
  }

  if (tasksCompleted >= 3) {
    return 'casual';
  }

  if (tasksCompleted > 0) {
    return 'trial';
  }

  return 'guest';
}

module.exports = {
  STATE_PRIORITY,
  getStateRoleName,
  computeRecommendedState
};
