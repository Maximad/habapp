// src/discord/adapters/task-review.js
const { setTaskQuality, setTaskEthics } = require('../../core/tasks');

function parseTags(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

async function handleTaskReviewQuality(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const score = interaction.options.getInteger('score', true);
  const tagsRaw = interaction.options.getString('tags');
  const notes = interaction.options.getString('notes') || null;

  if (![1, 2, 3].includes(score)) {
    return interaction.reply({
      content: 'الدرجة يجب أن تكون بين 1 و 3.',
      ephemeral: true
    });
  }

  try {
    setTaskQuality(taskId, {
      score,
      tags: parseTags(tagsRaw),
      notes,
      reviewerId: interaction.user.id
    });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر العثور على هذه المهمة. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  return interaction.reply({ content: '✔️ تم تسجيل تقييم الجودة لهذه المهمة.', ephemeral: true });
}

async function handleTaskReviewEthics(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const status = interaction.options.getString('status', true);
  const tagsRaw = interaction.options.getString('tags');
  const notes = interaction.options.getString('notes') || null;

  try {
    setTaskEthics(taskId, {
      status,
      tags: parseTags(tagsRaw),
      notes,
      reviewerId: interaction.user.id
    });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر العثور على هذه المهمة. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  const base = '✔️ تم تسجيل ملاحظات الأخلاقيات لهذه المهمة.';
  const extra = status === 'violation' ? '\nسيتم تنبيه فريق التحرير لمراجعة هذه المخالفة.' : '';

  return interaction.reply({ content: `${base}${extra}`.trim(), ephemeral: true });
}

module.exports = {
  handleTaskReviewQuality,
  handleTaskReviewEthics
};
