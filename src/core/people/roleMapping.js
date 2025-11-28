// src/core/people/roleMapping.js
// تحويل أدوار ديسكورد إلى حقول عضو

const STATE_PRIORITY = {
  suspended: 6,
  lead: 5,
  core: 4,
  active: 3,
  trial: 2,
  guest: 1
};

const STATE_ALIASES = {
  lead: 'lead',
  leadership: 'lead',
  core: 'core',
  active: 'active',
  casual: 'active',
  trial: 'trial',
  guest: 'guest',
  suspended: 'suspended'
};

const IDENTITY_ALIASES = {
  verified: 'verified',
  real: 'verified',
  pseudonymous: 'pseudonymous',
  pseudo: 'pseudonymous',
  anon: 'pseudonymous'
};

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTaggedRole(roleName) {
  if (!roleName) return null;
  const match = String(roleName).match(/^\s*\[(.+?)\]\s*(.+)$/);
  if (!match) return null;

  const rawType = match[1].trim().toLowerCase();
  const value = match[2].trim();

  if (['state'].includes(rawType)) return { type: 'state', value };
  if (['unit'].includes(rawType)) return { type: 'unit', value };
  if (['func', 'function'].includes(rawType)) return { type: 'func', value };
  if (['id', 'identity'].includes(rawType)) return { type: 'identity', value };
  return null;
}

function pickState(states) {
  if (!states.length) return null;
  return states.reduce((best, current) => {
    const priority = STATE_PRIORITY[current] || 0;
    const bestPriority = best ? STATE_PRIORITY[best] || 0 : 0;
    return priority > bestPriority ? current : best;
  }, null);
}

function mapRolesToMemberFields(roles = []) {
  const units = new Set();
  const functions = new Set();
  const stateCandidates = [];
  const identityCandidates = [];

  (roles || []).forEach(role => {
    const parsed = parseTaggedRole(role?.name || role);
    if (!parsed) return;

    if (parsed.type === 'unit') {
      const slug = slugify(parsed.value);
      if (slug) units.add(slug);
      return;
    }

    if (parsed.type === 'func') {
      const slug = slugify(parsed.value);
      if (slug) functions.add(slug);
      return;
    }

    if (parsed.type === 'state') {
      const key = STATE_ALIASES[slugify(parsed.value)] || null;
      if (key) stateCandidates.push(key);
      return;
    }

    if (parsed.type === 'identity') {
      const key = IDENTITY_ALIASES[slugify(parsed.value)] || null;
      if (key) identityCandidates.push(key);
    }
  });

  const state = pickState(stateCandidates) || 'guest';
  const identityMode = identityCandidates[0] || 'unknown';

  return {
    units: Array.from(units),
    functions: Array.from(functions),
    state,
    identityMode
  };
}

module.exports = {
  mapRolesToMemberFields,
  parseTaggedRole,
  slugify
};
