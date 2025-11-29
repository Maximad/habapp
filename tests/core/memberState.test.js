const test = require('node:test');
const assert = require('assert');
const { computeRecommendedState } = require('../../src/core/people/memberState');

test('computeRecommendedState covers basic thresholds', () => {
  assert.strictEqual(computeRecommendedState({}), 'guest');
  assert.strictEqual(computeRecommendedState({ tasksCompleted: 1 }), 'trial');
  assert.strictEqual(computeRecommendedState({ tasksCompleted: 5 }), 'casual');

  assert.strictEqual(
    computeRecommendedState({ tasksCompleted: 12, quality: { avgScore: 2.1 }, ethics: { violation: 0 } }),
    'active'
  );

  assert.strictEqual(
    computeRecommendedState({ tasksCompleted: 35, quality: { avgScore: 2.6 }, ethics: { violation: 0 } }),
    'core'
  );

  assert.strictEqual(
    computeRecommendedState({ tasksCompleted: 70, quality: { avgScore: 3 }, ethics: { violation: 0 } }),
    'lead'
  );
});

test('computeRecommendedState accounts for ethics flags', () => {
  const withViolation = computeRecommendedState({
    tasksCompleted: 20,
    quality: { avgScore: 2.7 },
    ethics: { violation: 1 }
  });

  assert.strictEqual(withViolation, 'casual');
});
