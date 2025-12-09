const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const {
  findProject,
  upsertProject,
  deleteProject,
  ensureProject,
  listProjects
} = require('../../src/core/work/projects');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-store-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('projects persist to custom store with defaults and are case-insensitive', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.strictEqual(findProject('demo', store), null);

  const project = { slug: 'demo', name: 'Demo', stage: 'planning', tasks: [] };
  const saved = upsertProject(project, store);

  const loaded = findProject('DEMO', store);
  assert.deepStrictEqual(loaded, {
    ...saved,
    units: ['production'],
    pipelineKey: null,
    driveFolderUrl: null,
    mainDocUrl: null,
    docUrl: null,
    shootDate: null,
    metadata: {
      driveFolderUrl: null,
      mainDocUrl: null,
      docUrl: null
    }
  });

  const list = listProjects(store);
  assert.strictEqual(list.length, 1);
  assert.ok(fs.existsSync(path.join(dir, 'projects.json')));
});

test('projects without units/pipeline get defaults when loaded', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  // Manually write legacy shape
  store.write('projects', [{ slug: 'legacy', name: 'Legacy', stage: 'planning', tasks: [] }]);

  const loaded = findProject('legacy', store);
  assert.deepStrictEqual(loaded.units, ['production']);
  assert.strictEqual(loaded.pipelineKey, null);
  assert.strictEqual(loaded.driveFolderUrl, null);
  assert.strictEqual(loaded.mainDocUrl, null);
  assert.strictEqual(loaded.docUrl, null);
  assert.strictEqual(loaded.shootDate, null);
  assert.deepStrictEqual(loaded.metadata, {
    driveFolderUrl: null,
    mainDocUrl: null,
    docUrl: null
  });
});

test('deleteProject removes entries and ensureProject guards missing cases', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.throws(() => ensureProject('missing', store));

  const project = { slug: 'demo', name: 'Demo', stage: 'planning', tasks: [] };
  upsertProject(project, store);

  const removed = deleteProject('demo', store);
  assert.strictEqual(removed, true);
  assert.strictEqual(findProject('demo', store), null);
});
