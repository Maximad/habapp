const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const storeModule = require('../../src/core/store');
const { createStore } = require('../../src/core/store');
const { createProject } = require('../../src/core/work/services/projectsService');
const { upsertProject } = require('../../src/core/work/projects');
const projectHandlers = require('../../src/discord/commands/project');

function useTempStore(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-project-autocomplete-'));
  const tempStore = createStore({ dataDir: dir });
  const original = { ...storeModule.defaultStore };
  Object.assign(storeModule.defaultStore, tempStore);

  t.after(() => {
    Object.assign(storeModule.defaultStore, original);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  return tempStore;
}

function createInteraction({ focusName, focusValue, unit = null } = {}) {
  const responses = [];
  return {
    options: {
      getFocused: () => ({ name: focusName, value: focusValue }),
      getString: name => {
        if (name === 'unit') return unit;
        return null;
      },
    },
    respond: payload => {
      responses.push(payload);
      return Promise.resolve(true);
    },
    getResponses: () => responses,
  };
}

test('project autocomplete suggests projects by slug/title and hides archived', async t => {
  useTempStore(t);
  createProject({ name: 'مشروع 1925', pipelineKey: 'media.article_short', due: '2024-03-01' });
  const { project } = createProject({
    name: 'قديمة',
    pipelineKey: 'people.event_small',
    due: '2024-04-01',
  });
  project.stage = 'archived';
  upsertProject(project);

  const interaction = createInteraction({ focusName: 'project', focusValue: '192' });
  await projectHandlers.handleProjectAutocomplete(interaction);

  const [choices] = interaction.getResponses();
  assert.ok(Array.isArray(choices));
  assert.equal(choices.length, 1);
  assert.ok(choices[0].value);
  assert.ok(choices[0].name.includes('1925'));
});

test('project autocomplete keeps pipeline suggestions filtered by unit', async () => {
  const interaction = {
    options: {
      getFocused: () => ({ name: 'pipeline', value: 'media' }),
      getString: name => (name === 'unit' ? 'media' : null),
    },
    respond: payload => {
      interaction.responses.push(payload);
      return Promise.resolve(true);
    },
    responses: [],
  };

  await projectHandlers.handleProjectAutocomplete(interaction);

  const [choices] = interaction.responses;
  assert.ok(Array.isArray(choices));
  assert.ok(choices.length > 0);
  choices.forEach(choice => {
    assert.ok(choice.value.includes('media'));
  });
});
