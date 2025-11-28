const { createProjectWithScaffold } = require('../../core/work/services/projectsService');
const { getPipelineByKey, getUnitByKey } = require('../../core/work/units');
const { notifyProjectCreated } = require('../adapters/projectNotifications');
const { buildErrorMessage, buildSuccessMessage } = require('../i18n/messages');

async function handleCreate(interaction) {
  const title = interaction.options.getString('title', true);
  const unitKey = interaction.options.getString('unit', true);
  const pipelineKey = interaction.options.getString('pipeline', true);
  const due = interaction.options.getString('due', true);

  const unit = getUnitByKey(unitKey);
  if (!unit) {
    return interaction.reply({ content: buildErrorMessage('invalid_unit'), ephemeral: true });
  }

  const pipeline = getPipelineByKey(pipelineKey);
  if (!pipeline) {
    return interaction.reply({ content: buildErrorMessage('invalid_pipeline'), ephemeral: true });
  }

  if (pipeline.unitKey && pipeline.unitKey !== unit.key) {
    return interaction.reply({ content: buildErrorMessage('pipeline_unit_mismatch'), ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  let result;
  try {
    result = createProjectWithScaffold({
      title,
      unit: unit.key,
      pipelineKey: pipeline.key,
      dueDate: due,
      createdByDiscordId: interaction.user.id
    });
  } catch (err) {
    if (err.code === 'PROJECT_EXISTS') {
      return interaction.editReply(buildErrorMessage('project_exists'));
    }
    if (err.code === 'INVALID_DUE_DATE') {
      return interaction.editReply(buildErrorMessage('invalid_due_date'));
    }
    if (err.code === 'PIPELINE_UNIT_MISMATCH') {
      return interaction.editReply(buildErrorMessage('pipeline_unit_mismatch'));
    }
    throw err;
  }

  await notifyProjectCreated({
    interaction,
    project: result.project,
    tasks: result.tasks
  });

  return interaction.editReply(buildSuccessMessage('project_created', { title }));
}

async function handleProject(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') {
    return handleCreate(interaction);
  }

  return interaction.reply({
    content: buildErrorMessage('not_available'),
    ephemeral: true
  });
}

module.exports = handleProject;
