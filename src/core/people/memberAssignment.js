// src/core/people/memberAssignment.js
// Helper to pick the best task owner based on unit, function, and member state.

/**
 * Pick best owner for a task given unit + function preference.
 * @param {Object[]} members - list from membersStore (already enriched with units/functions/state)
 * @param {string} unitKey   - e.g. 'production', 'media', 'people', 'geeks', 'think'
 * @param {string} funcKey   - e.g. 'producer', 'editor', 'video', 'event_host'
 * @returns {string|null} discordUserId or null if none
 */
function pickTaskOwner(members, unitKey, funcKey) {
  if (!Array.isArray(members) || members.length === 0) return null;

  // 1) filter by unit
  let candidates = members.filter(m => {
    if (!m || !Array.isArray(m.units)) return false;
    return m.units.some(u => (u || '').toLowerCase() === (unitKey || '').toLowerCase());
  });

  // 2) filter by function if possible
  const normalizedFunc = (funcKey || '').toLowerCase();
  if (normalizedFunc) {
    const funcFiltered = candidates.filter(m =>
      Array.isArray(m.functions)
        ? m.functions.some(f => (f || '').toLowerCase() === normalizedFunc)
        : false
    );
    if (funcFiltered.length) {
      candidates = funcFiltered;
    }
  }

  if (!candidates.length) return null;

  // 3) sort by state priority
  const statePriority = ['lead', 'core', 'active', 'casual', 'trial', 'guest', 'suspended'];
  const priorityOf = s => {
    const idx = statePriority.indexOf((s || '').toLowerCase());
    return idx === -1 ? statePriority.length : idx;
  };

  candidates.sort((a, b) => {
    const pa = priorityOf(a.state);
    const pb = priorityOf(b.state);
    if (pa !== pb) return pa - pb;
    // optional tie-breaker by current open tasks count if available
    const ta = typeof a.openTasksCount === 'number' ? a.openTasksCount : 0;
    const tb = typeof b.openTasksCount === 'number' ? b.openTasksCount : 0;
    return ta - tb;
  });

  return candidates[0].id || candidates[0].discordId || null;
}

module.exports = { pickTaskOwner };
