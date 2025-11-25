const { setTaskQuality, setTaskEthics } = require('../../core/tasks');

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
  const tags = parseCommaList(interaction.options.getString('tags'));
  const notes = interaction.options.getString('notes');

  if (![1, 2, 3].includes(Number(score))) {
    return interaction.reply({
      content: 'الرجاء اختيار تقييم بين ١ و٣.',
      ephemeral: true
    });
  }

  try {
    setTaskQuality(taskId, { score: Number(score), tags, notes, reviewerId: interaction.user.id });
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
  const tags = parseCommaList(interaction.options.getString('tags'));
  const notes = interaction.options.getString('notes');

  const allowed = ['ok', 'needs_discussion', 'violation'];
  if (!allowed.includes(status)) {
    return interaction.reply({
      content: 'حالة الأخلاقيات غير صالحة.',
      ephemeral: true
    });
  }

  try {
    setTaskEthics(taskId, { status, tags, notes, reviewerId: interaction.user.id });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر العثور على هذه المهمة. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  const warning = status === 'violation' ? '\nسيتم تنبيه فريق التحرير لمراجعة هذه المخالفة.' : '';

  return interaction.reply({
    content: `✔️ تم تسجيل ملاحظات الأخلاقيات لهذه المهمة.${warning}`,
    ephemeral: true
  });
}

module.exports = {
  handleTaskReviewQuality,
  handleTaskReviewEthics
};
