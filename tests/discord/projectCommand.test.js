const test = require('node:test');
const assert = require('node:assert/strict');

const { data } = require('../../src/commands/project');
const projectHandlers = require('../../src/discord/commands/project');
const { pipelines } = require('../../src/core/work/units');

function findOption(json, subcommandName, optionName) {
  const subcommand = (json.options || []).find(opt => opt.name === subcommandName);
  if (!subcommand) return null;
  return (subcommand.options || []).find(opt => opt.name === optionName) || null;
}

function createAutocompleteInteraction({ value = '', unit = null } = {}) {
  const responses = [];
  return {
    options: {
      getFocused: () => ({ name: 'pipeline', value }),
      getString: name => (name === 'unit' ? unit : null)
    },
    respond: async payload => {
      responses.push(payload);
      return true;
    },
    getResponses: () => responses
  };
}

test('project create pipeline option exposes static choices', () => {
  const json = data.toJSON();
  const pipelineOption = findOption(json, 'create', 'pipeline');

  assert.ok(pipelineOption, 'pipeline option should exist');
  assert.ok(!pipelineOption.autocomplete, 'pipeline option should not use autocomplete');
  assert.ok(Array.isArray(pipelineOption.choices));
  assert.ok(pipelineOption.choices.length > 0, 'pipeline choices should be predefined');
});

test('pipeline autocomplete handler is effectively disabled', async () => {
  const interaction = createAutocompleteInteraction({ value: pipelines[0].key });

  await projectHandlers.handleProjectAutocomplete(interaction);

  const [response] = interaction.getResponses();
  assert.ok(Array.isArray(response));
  assert.equal(response.length, 0);
});
