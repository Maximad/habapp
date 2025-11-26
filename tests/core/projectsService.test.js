const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { createProject } = require('../../src/core/work/services/projectsService');
const { getPipelineByKey } = require('../../src/core/work/units');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-service-store-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('createProject auto-generates unique slugs and normalizes due date', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { project } = createProject({ name: 'مشروع تجربة', due: '2024-01-01' }, store);
  assert.ok(project.slug.length > 0);
  assert.strictEqual(project.dueDate, '2024-01-01');

  const { project: second } = createProject({ name: 'مشروع تجربة', due: '2024-01-02' }, store);
  assert.ok(second.slug.endsWith('-2'));
});

test('createProject validates due date and slug format', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.throws(
    () => createProject({ name: 'x', due: 'not-a-date' }, store),
    err => err.code === 'INVALID_DUE_DATE'
  );

  assert.throws(
    () => createProject({ name: 'x', due: '2024-02-31' }, store),
    err => err.code === 'INVALID_DUE_DATE'
  );

  const { project } = createProject({ name: 'y', due: new Date('2024-05-10T12:00:00Z') }, store);
  assert.strictEqual(project.dueDate, '2024-05-10');

  assert.throws(
    () => createProject({ name: 'x', slug: 'bad slug', due: '2024-01-01' }, store),
    err => err.code === 'INVALID_SLUG'
  );
});

test('createProject enforces pipeline/unit alignment and derives unit from pipeline', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.throws(
    () =>
      createProject(
        { name: 'media mismatch', unit: 'production', pipelineKey: 'media.article_short', due: '2024-02-01' },
        store
      ),
    err => err.code === 'PIPELINE_UNIT_MISMATCH'
  );

  const mediaPipeline = getPipelineByKey('media.article_short');
  const { project } = createProject(
    { name: 'مقال', pipelineKey: mediaPipeline.key, due: '2024-03-01' },
    store
  );
  assert.ok(project.units.includes(mediaPipeline.unitKey));
});

test('validateUnitPipeline handles case-insensitive unit and pipeline keys', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { project } = createProject(
    {
      name: 'Mixed Case',
      unit: 'Production',
      pipelineKey: 'Production.Video_Basic',
      due: '2024-06-01'
    },
    store
  );

  assert.strictEqual(project.units[0], 'production');
  assert.strictEqual(project.pipelineKey, 'production.video_basic');
});
