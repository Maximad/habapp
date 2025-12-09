const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStore } = require('../../src/core/store');
const {
  createProjectWithScaffold,
  resolveProjectByQuery,
  listProjectTasksForView,
  createProject,
  resolveTaskDueDateFromTemplate
} = require('../../src/core/work/services/projectsService');
const { upsertMember } = require('../../src/core/people/memberStore');
const { getPipelineByKey, pipelines } = require('../../src/core/work/units');
const { getTaskTemplateById, taskTemplates } = require('../../src/core/work/templates/task-templates');
const { createTask, completeTask } = require('../../src/core/work/tasks');
const { loadProjects, saveProjects } = require('../../src/core/work/projects');

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
    const expectedDue = resolveTaskDueDateFromTemplate(tpl, project);
    assert.strictEqual(task.due, expectedDue);
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

test('pickTaskOwner respects unit, function, and state priority', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const priorityTemplate = {
    id: 'priority_owner_test',
    type: 'task',
    unit: 'production',
    label_ar: 'تعيين مفضل للمالك',
    description_ar: 'اختبار أولوية الحالة عند تعيين المالك.',
    definitionOfDone_ar: 'يتم تعيين المهمة تلقائياً لأعلى حالة.',
    size: 'S',
    defaultOwnerFunc: 'editor',
    defaultChannelKey: 'production.edit_pipeline'
  };

  const priorityPipeline = {
    key: 'production.priority_owner',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'مسار أولوية المالك',
    description_ar: 'يتحقق من اختيار المالك بحسب الحالة.',
    templateKeys: [priorityTemplate.id]
  };

  taskTemplates.push(priorityTemplate);
  pipelines.push(priorityPipeline);
  t.after(() => {
    taskTemplates.pop();
    pipelines.pop();
  });

  upsertMember({ discordId: '111', units: ['production'], functions: ['editor'], state: 'trial' }, store);
  upsertMember({ discordId: '222', units: ['production'], functions: ['editor'], state: 'core' }, store);
  upsertMember({ discordId: '333', units: ['production'], functions: ['editor'], state: 'lead' }, store);

  const { tasks } = createProjectWithScaffold({
    title: 'مشروع أولوية',
    pipelineKey: priorityPipeline.key,
    unit: 'production',
    dueDate: '2024-11-01'
  }, store);

  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].ownerId, '333');
  assert.strictEqual(tasks[0].templateId, priorityTemplate.id);
});

test('resolveProjectByQuery picks the closest Arabic title and shows ambiguity', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  createProject({
    name: 'وثائقي البحر',
    slug: 'sea-doc',
    due: '2024-09-01',
    unit: 'production',
    pipelineKey: 'production.support'
  }, store);

  createProject({
    name: 'وثائقي الجبل',
    slug: 'mountain-doc',
    due: '2024-09-10',
    unit: 'production',
    pipelineKey: 'production.support'
  }, store);

  const specific = resolveProjectByQuery('البحر', store);
  assert.strictEqual(specific.project.slug, 'sea-doc');
  assert.ok(specific.matches.length >= 1);

  const ambiguous = resolveProjectByQuery('وثائقي', store);
  assert.strictEqual(ambiguous.project, null);
  assert.strictEqual(ambiguous.matches.length, 2);
});

test('listProjectTasksForView groups, sorts, and preserves reminders', t => {
  const { store, dir } = createTempStore();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { project } = createProject({
    name: 'ملف مهام',
    slug: 'task-file',
    due: '2024-10-01',
    unit: 'production',
    pipelineKey: 'production.support'
  }, store);

  createTask(project.slug, { title: 'مهمة أولى', title_ar: 'مهمة أولى', size: 'M', due: '2024-09-15', ownerId: '11' }, store);
  const { task: doneTask } = createTask(project.slug, { title: 'مهمة ثانية', title_ar: 'مهمة ثانية', size: 'S', due: '2024-09-10', ownerId: '22' }, store);
  completeTask(project.slug, doneTask.id, store);

  const allProjects = loadProjects(store);
  allProjects[0].tasks[0].reminders = { mainSentAt: '2024-09-01T00:00:00.000Z', handoverSentAt: null };
  saveProjects(allProjects, store);

  const view = listProjectTasksForView({ projectSlug: project.slug, status: 'all' }, store);

  assert.strictEqual(view.tasks.open.length, 1);
  assert.strictEqual(view.tasks.done.length, 1);
  assert.strictEqual(view.tasks.done[0].status, 'done');
  assert.strictEqual(view.tasks.done[0].title_ar, 'مهمة ثانية');
  assert.strictEqual(view.tasks.open[0].reminders.mainSentAt, '2024-09-01T00:00:00.000Z');
  assert.strictEqual(view.tasks.open[0].ownerId, '11');
});
