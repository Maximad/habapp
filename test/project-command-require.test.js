const test = require('node:test');
const assert = require('assert');

test('project command module loads without reference errors', () => {
  assert.doesNotThrow(() => {
    delete require.cache[require.resolve('../src/commands/project')];
    require('../src/commands/project');
  });
});

test('project command exports expected handlers', () => {
  delete require.cache[require.resolve('../src/commands/project')];
  const commandModule = require('../src/commands/project');

  assert.strictEqual(typeof commandModule.execute, 'function');
  assert.strictEqual(typeof commandModule.autocomplete, 'function');
});
