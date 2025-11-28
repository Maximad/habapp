const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const { createProjectWithScaffold } = require('../../src/core/work/services/projectsService');
const { upsertMember } = require('../../src/core/people/memberStore');
const { getPipelineByKey, pipelines } = require('../../src/core/work/units');
const { getTaskTemplateById, taskTemplates } = require('../../src/core/work/templates/task-templates');

function createTempStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'habapp-projects-scaffold-'));
  return { store: createStore({ dataDir: dir }), dir };
}

test('createProjectWithScaffold builds tasks with owners and Arabic text', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const pipelineKey = 'production.support';
  const pipeline = getPipelineByKey(pipelineKey);
  const expectedTemplateIds = pipeline.defaultTemplateIds;

  upsertMember({ discordId: '11', units: ['production'], functions: ['dp'], state: 'active' }, store);
  upsertMember({ discordId: '22', units: ['production'], functions: ['sound_mixer'], state: 'core' }, store);
  upsertMember({ discordId: '33', units: ['production'], functions: ['post_supervisor'], state: 'lead' }, store);
  upsertMember({ discordId: '44', units: ['production'], functions: ['producer'], state: 'active' }, store);

  const { project, tasks } = createProjectWithScaffold({
    title: 'مشروع دعم',
    pipelineKey,
    unit: 'production',
    dueDate: '2024-12-10',
    createdByDiscordId: '99'
  }, store);

  assert.strictEqual(project.pipelineKey, pipelineKey);
  assert.strictEqual(project.dueDate, '2024-12-10');
  assert.strictEqual(tasks.length, expectedTemplateIds.length);
  assert.strictEqual((project.tasks || []).length, expectedTemplateIds.length);

  const ownerMap = {
    prod_camera_tests: '11',
    prod_sound_library: '22',
    prod_export_presets: '33',
    prod_emergency_plan: '44'
  };

  for (const task of tasks) {
    assert.ok(expectedTemplateIds.includes(task.templateId));
    const tpl = getTaskTemplateById(task.templateId);
    assert.strictEqual(task.title_ar, tpl.label_ar);
    assert.strictEqual(task.description_ar, tpl.description_ar);
    assert.strictEqual(task.definitionOfDone_ar, tpl.definitionOfDone_ar || null);
    assert.strictEqual(task.defaultChannelKey, tpl.defaultChannelKey || null);
    assert.strictEqual(task.due, '2024-12-10');
    assert.strictEqual(task.ownerId, ownerMap[task.templateId]);
  }
});

test('createProjectWithScaffold respects due offsets and defaultOwnerFunc', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const customTemplate = {
    id: 'media_custom_offset',
    type: 'task',
    unit: 'media',
    label_ar: 'تحضير نص عاجل',
    description_ar: 'مهمة تجريبية مع موعد مبكر.',
    definitionOfDone_ar: 'نص واضح مكتوب بالعربي جاهز للمراجعة.',
    size: 'M',
    defaultOwnerFunc: 'writer',
    defaultChannelKey: 'media.writing',
    dueOffsetDays: -2
  };

  const customPipeline = {
    key: 'media.custom_offset',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مسار تجريبي',
    description_ar: 'مسار صغير لاختبار مواعيد المهام.',
    templateKeys: [customTemplate.id]
  };

  taskTemplates.push(customTemplate);
  pipelines.push(customPipeline);
  t.after(() => {
    taskTemplates.pop();
    pipelines.pop();
  });

  upsertMember({ discordId: '555', units: ['media'], functions: ['writer'], state: 'core' }, store);

  const { tasks } = createProjectWithScaffold({
    title: 'مشروع إعلامي سريع',
    pipelineKey: customPipeline.key,
    unit: 'media',
    dueDate: '2024-10-10',
    createdByDiscordId: '999'
  }, store);

  assert.strictEqual(tasks.length, 1);
  const task = tasks[0];
  assert.strictEqual(task.templateId, customTemplate.id);
  assert.strictEqual(task.ownerId, '555');
  assert.strictEqual(task.due, '2024-10-08');
  assert.strictEqual(task.defaultChannelKey, customTemplate.defaultChannelKey);
  assert.strictEqual(task.definitionOfDone_ar, customTemplate.definitionOfDone_ar);
});
