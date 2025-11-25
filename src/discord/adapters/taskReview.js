const {
  setTaskQualityReview,
  setTaskEthicsReview
} = require('../../core/services/tasksService');

function parseCommaList(str) {
  if (!str) return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function handleTaskReviewQuality(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const score = interaction.options.getInteger('score', true);
  const tagsRaw = interaction.options.getString('tags');
  const notes = interaction.options.getString('notes') || null;

  const tags = parseCommaList(tagsRaw);

  try {
    setTaskQualityReview(taskId, {
      score,
      tags,
      notes,
      reviewerId: interaction.user.id
    });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر العثور على هذه المهمة. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  return interaction.reply({
    content: '✔️ تم تسجيل تقييم الجودة لهذه المهمة.',
    ephemeral: true
  });
}

async function handleTaskReviewEthics(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const status = interaction.options.getString('status', true);
  const tagsRaw = interaction.options.getString('tags');
  const notes = interaction.options.getString('notes') || null;

  const tags = parseCommaList(tagsRaw);

  try {
    setTaskEthicsReview(taskId, {
      status,
      tags,
      notes,
      reviewerId: interaction.user.id
    });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر العثور على هذه المهمة. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  let content = '✔️ تم تسجيل ملاحظات الأخلاقيات لهذه المهمة.';
  if (status === 'violation') {
    content += '\nسيتم تنبيه فريق التحرير لمراجعة هذه المخالفة.';
  }

  return interaction.reply({ content, ephemeral: true });
}

module.exports = {
  handleTaskReviewQuality,
  handleTaskReviewEthics
};
