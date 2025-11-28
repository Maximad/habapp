const test = require('node:test');
const assert = require('assert');

const { getStateRoleName } = require('../src/core/people/memberState');

const CASES = [
  ['guest', '[STATE] Guest'],
  ['trial', '[STATE] Trial'],
  ['active', '[STATE] Active'],
  ['core', '[STATE] Core'],
  ['lead', '[STATE] Lead'],
  ['suspended', '[STATE] Suspended']
];

for (const [state, roleName] of CASES) {
  test(`getStateRoleName maps ${state} -> ${roleName}`, () => {
    assert.strictEqual(getStateRoleName(state), roleName);
  });
}

test('getStateRoleName returns null for unknown state', () => {
  assert.strictEqual(getStateRoleName('invalid'), null);
});
