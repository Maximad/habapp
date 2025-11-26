const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { createProject } = require('../../src/core/work/services/projectsService');
const { createTasksFromTemplates } = require('../../src/core/work/tasks');
const { getPipelineByKey } = require('../../src/core/work/units');
const { getTaskTemplateById } = require('../../src/core/work/templates/task-templates');

const PIPELINE_KEY = 'people.event_shihan_black_hall';
const STAGES = [
  'curatorial_concept',
  'partners_and_support',
  'artist_booking',
  'site_and_safety',
  'tech_and_logistics',
  'comms_and_ticketing',
  'festival_days',
  'documentation',
  'report_and_debrief'
];

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-shihan-store-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('project creation with Shihan pipeline stores unit and stages', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { project } = createProject(
    { name: 'مهرجان شيحان', due: '2024-11-20', pipelineKey: PIPELINE_KEY },
    store
  );

  assert.strictEqual(project.pipelineKey, PIPELINE_KEY);
  assert.ok(project.units.includes('people'));

  const pipeline = getPipelineByKey(PIPELINE_KEY);
  assert.deepStrictEqual(pipeline.stages, STAGES);
  assert.deepStrictEqual(pipeline.suggestedStages, STAGES);
});

test('scaffolding Shihan pipeline spawns expected templates', async t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  store.write('projects', [
    {
      slug: 'shihan',
      name: 'Shihan Fest',
      stage: 'planning',
      pipelineKey: PIPELINE_KEY,
      tasks: []
    }
  ]);

  const created = await createTasksFromTemplates({ projectSlug: 'shihan' }, store);
  const pipeline = getPipelineByKey(PIPELINE_KEY);
  const expectedIds = pipeline.defaultTemplateIds;

  assert.strictEqual(created.length, expectedIds.length);
  assert.ok(created.every(task => expectedIds.includes(task.templateId)));
});

test('Shihan templates expose Arabic text fields', () => {
  const templateIds = [
    'people.shihan.curatorial_brief',
    'people.shihan.partner_matrix',
    'people.shihan.artist_contracts',
    'people.shihan.site_plan_quarry',
    'people.shihan.site_plan_hall',
    'people.shihan.safety_plan',
    'people.shihan.tech_rider_master',
    'people.shihan.schedule_run_sheet',
    'people.shihan.comms_campaign',
    'people.shihan.ticketing_and_entry',
    'people.shihan.documentation_plan',
    'people.shihan.post_report'
  ];

  for (const id of templateIds) {
    const tpl = getTaskTemplateById(id);
    assert.ok(tpl, `${id} is defined`);
    assert.ok((tpl.label_ar || '').length > 0, `${id} label`);
    assert.ok((tpl.description_ar || '').length > 0, `${id} description`);
    assert.ok((tpl.definitionOfDone_ar || '').length > 0, `${id} DoD`);
  }
});
