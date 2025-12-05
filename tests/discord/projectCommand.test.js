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

test('project create pipeline option relies on autocomplete', () => {
  const json = data.toJSON();
  const pipelineOption = findOption(json, 'create', 'pipeline');

  assert.ok(pipelineOption, 'pipeline option should exist');
  assert.equal(pipelineOption.autocomplete, true);
  assert.ok(!pipelineOption.choices || pipelineOption.choices.length === 0);
});

test('pipeline autocomplete surfaces pipelines beyond the initial 25', async () => {
  const lastPipeline = pipelines[pipelines.length - 1];
  const interaction = createAutocompleteInteraction({ value: lastPipeline.key });

  await projectHandlers.handleProjectAutocomplete(interaction);

  const [response] = interaction.getResponses();
  assert.ok(Array.isArray(response));
  assert.ok(
    response.some(choice => choice.value === lastPipeline.key),
    'expected autocomplete results to include the requested pipeline'
  );
});
