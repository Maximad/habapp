const test = require('node:test');
const assert = require('assert');

const { mapRolesToMemberFields, parseTaggedRole, slugify } = require('../../src/core/people/roleMapping');

test('parseTaggedRole detects type and value', () => {
  const parsed = parseTaggedRole('[STATE] Lead');
  assert.deepStrictEqual(parsed, { type: 'state', value: 'Lead' });
  assert.strictEqual(parseTaggedRole('no tag'), null);
});

test('slugify converts names to safe keys', () => {
  assert.strictEqual(slugify('Media Team'), 'media-team');
  assert.strictEqual(slugify('  VIDEO_edit '), 'video-edit');
});

test('mapRolesToMemberFields builds units, functions, and state', () => {
  const roles = [
    { name: '[UNIT] Media' },
    { name: '[FUNC] Reporter' },
    { name: '[STATE] Lead' },
    { name: '[IDENTITY] Verified' }
  ];

  const mapped = mapRolesToMemberFields(roles);
  assert.deepStrictEqual(mapped.units, ['media']);
  assert.deepStrictEqual(mapped.functions, ['reporter']);
  assert.strictEqual(mapped.state, 'lead');
  assert.strictEqual(mapped.identityMode, 'verified');
});

test('suspended state overrides other states', () => {
  const roles = [
    { name: '[STATE] Lead' },
    { name: '[STATE] Suspended' }
  ];

  const mapped = mapRolesToMemberFields(roles);
  assert.strictEqual(mapped.state, 'suspended');
});

test('falls back to guest and unknown when tags are missing', () => {
  const mapped = mapRolesToMemberFields([{ name: 'Member' }]);
  assert.strictEqual(mapped.state, 'guest');
  assert.strictEqual(mapped.identityMode, 'unknown');
});
