const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const {
  createProject,
  listProjectsForView,
} = require('../../src/core/work/services/projectsService');
const { findProject, upsertProject } = require('../../src/core/work/projects');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-projects-list-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('listProjectsForView orders by due date and exposes view fields', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  createProject(
    { name: 'لاحق', pipelineKey: 'people.event_small', due: '2024-02-15' },
    store,
  );
  createProject(
    { name: 'أقرب', pipelineKey: 'media.article_short', due: '2024-01-10' },
    store,
  );
  const { project: undated } = createProject(
    { name: 'بدون موعد', pipelineKey: 'geeks.support_external_media', due: '2024-03-01' },
    store,
  );
  const undatedProject = findProject(undated.slug, store);
  undatedProject.due = null;
  undatedProject.dueDate = null;
  upsertProject(undatedProject, store);

  const projects = listProjectsForView({ status: 'all' }, store);
  assert.equal(projects.length, 3);
  assert.equal(projects[0].title.includes('أقرب'), true);
  assert.equal(projects[1].title.includes('لاحق'), true);
  assert.equal(projects[2].title.includes('بدون موعد'), true);
  assert.ok(projects[0].dueDate);
  assert.ok(projects[0].pipelineKey);
});

test('listProjectsForView filters by unit and status', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  createProject(
    { name: 'نشط إعلام', pipelineKey: 'media.article_short', due: '2024-01-10' },
    store,
  );
  const { project } = createProject(
    { name: 'مؤرشف إعلام', pipelineKey: 'media.photo_story', due: '2024-02-10' },
    store,
  );

  const archived = findProject(project.slug, store);
  archived.stage = 'archived';
  upsertProject(archived, store);

  const mediaActive = listProjectsForView({ unitKey: 'media', status: 'active' }, store);
  assert.equal(mediaActive.length, 1);
  assert.equal(mediaActive[0].stageNormalized === 'archived', false);

  const mediaArchived = listProjectsForView({ unitKey: 'media', status: 'archived' }, store);
  assert.equal(mediaArchived.length, 1);
  assert.equal(mediaArchived[0].stageNormalized, 'archived');

  const allMedia = listProjectsForView({ unitKey: 'media', status: 'all' }, store);
  assert.equal(allMedia.length, 2);
});

