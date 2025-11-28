// src/core/people/memberState.js
// Helpers to work with member state keys and Discord role names

const STATE_PRIORITY = {
  guest: 1,
  trial: 2,
  active: 3,
  core: 4,
  lead: 5,
  suspended: 6
};

function getStateRoleName(state) {
  const map = {
    guest: '[STATE] Guest',
    trial: '[STATE] Trial',
    active: '[STATE] Active',
    core: '[STATE] Core',
    lead: '[STATE] Lead',
    suspended: '[STATE] Suspended'
  };

  return map[state] || null;
}

module.exports = {
  STATE_PRIORITY,
  getStateRoleName
};
