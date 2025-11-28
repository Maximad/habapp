const test = require('node:test');
const assert = require('assert');

const {
  unitKeyToArabic,
  functionKeyToArabic,
  stateKeyToArabic,
  identityModeToArabic
} = require('../src/discord/i18n/profileLabels');

test('unitKeyToArabic maps known units', () => {
  assert.strictEqual(unitKeyToArabic('media'), 'الميديا');
  assert.strictEqual(unitKeyToArabic('production'), 'الإنتاج');
});

test('functionKeyToArabic maps functional roles', () => {
  assert.strictEqual(functionKeyToArabic('reporter'), 'صحافة / كتابة');
  assert.strictEqual(functionKeyToArabic('developer'), 'تطوير / برمجة');
});

test('stateKeyToArabic maps states', () => {
  assert.strictEqual(stateKeyToArabic('trial'), 'تجريبي');
  assert.strictEqual(stateKeyToArabic('suspended'), 'معلّق');
});

test('identityModeToArabic maps identity modes', () => {
  assert.strictEqual(identityModeToArabic('pseudonymous'), 'اسم مستعار');
  assert.strictEqual(identityModeToArabic('verified'), 'موثّق');
});

test('mappers fall back to key when unknown', () => {
  assert.strictEqual(unitKeyToArabic('custom'), 'custom');
  assert.strictEqual(functionKeyToArabic('other_func'), 'other_func');
  assert.strictEqual(stateKeyToArabic('other_state'), 'other_state');
  assert.strictEqual(identityModeToArabic('other_mode'), 'other_mode');
});
