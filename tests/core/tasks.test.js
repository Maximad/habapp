test('createTasksFromTemplates scaffolds geeks pipelines and dedupes', async t => {
  const { store, dir } = setupProject('geeks.app_small');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('geeks.app_small');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);
});

test('createTasksFromTemplates scaffolds geeks automation pipeline and dedupes', async t => {
  const { store, dir } = setupProject('geeks.automation_stack');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const created = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  const expectedTemplateIds = collectPipelineTemplateIds('geeks.automation_stack');

  assert.strictEqual(created.length, expectedTemplateIds.length);
  assert.ok(created.every(task => expectedTemplateIds.includes(task.templateId)));

  const createdAgain = await createTasksFromTemplates({ projectSlug: 'proj' }, store);
  assert.strictEqual(createdAgain.length, 0);
});

test('setTaskQuality and setTaskEthics update existing tasks', t => {
  const { store, dir } = setupProject();
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { task } = createTask('proj', { title: 'Assess me' }, store);
  const updatedQuality = setTaskQuality(
    task.id,
    {
      score: 3,
      tags: ['clear'],
      notes: 'Great quality',
      reviewerId: 'user-1'
    },
    store
  );

  assert.strictEqual(updatedQuality.quality.score, 3);
  assert.deepStrictEqual(updatedQuality.quality.tags, ['clear']);
  assert.strictEqual(updatedQuality.quality.reviewerId, 'user-1');
  assert.ok(updatedQuality.quality.updatedAt);

  const updatedEthics = setTaskEthics(
    task.id,
    {
      status: 'ok',
      tags: ['balanced'],
      notes: 'No issues',
      reviewerId: 'user-2'
    },
    store
  );

  assert.strictEqual(updatedEthics.ethics.status, 'ok');
  assert.deepStrictEqual(updatedEthics.ethics.tags, ['balanced']);
  assert.strictEqual(updatedEthics.ethics.reviewerId, 'user-2');
  assert.ok(updatedEthics.ethics.updatedAt);

  const fetched = getTaskById(task.id, store);
  assert.strictEqual(fetched.task.quality.score, 3);
  assert.strictEqual(fetched.task.ethics.status, 'ok');
});
