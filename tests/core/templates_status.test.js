const test = require('node:test');
const assert = require('assert');

const { getTemplatesByUnit, getTemplateById } = require('../../src/core/work/templates');
const { getProductionTemplateByCode } = require('../../src/core/work/templates/templates.production');
const { getStatusInfoArabic, getStatusRewardsArabic } = require('../../src/core/people/status');

test('template helpers filter by unit and lookup by id regardless of case', () => {
  const productionTemplates = getTemplatesByUnit('production');
  assert.ok(productionTemplates.length > 0);
  assert.ok(productionTemplates.every(t => t.unit === 'production'));

  const tpl = getTemplateById('PROD_CALL_SHEET');
  assert.ok(tpl);
  assert.strictEqual(tpl.id, 'prod_call_sheet');
});

test('production template codes resolve to defined templates', () => {
  const tplA = getProductionTemplateByCode('a');
  const tplC = getProductionTemplateByCode('C');

  assert.ok(tplA);
  assert.ok(tplC);
  assert.strictEqual(tplA.code, 'A');
  assert.strictEqual(tplC.code, 'C');
});

test('status helpers return Arabic descriptions', () => {
  const info = getStatusInfoArabic();
  const rewards = getStatusRewardsArabic();

  assert.ok(info.includes('نظام الحالات'));
  assert.ok(rewards.includes('المنافع'));
});
