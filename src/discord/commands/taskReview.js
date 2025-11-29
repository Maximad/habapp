// src/discord/commands/taskReview.js
// Discord adapter for /task_review

const { addQualityReview, addEthicsReview } = require('../../core/work/taskReviewService');

function formatTitle(task) {
  return task?.title_ar || task?.title || `المهمة ${task?.id || ''}`.trim();
}

function formatStatusLabel(status) {
  const map = {
    ok: 'سليم',
    needs_discussion: 'يحتاج نقاش',
    violation: 'مخالفة'
  };
  return map[status] || status;
}

async function handleQuality(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const score = interaction.options.getInteger('score', true);
  const tags = interaction.options.getString('tags') || '';
  const notes = interaction.options.getString('notes') || '';

  try {
    const { task } = await addQualityReview({
      taskId,
      score,
      tags,
      notes,
      reviewerId: interaction.user.id
    });

    return interaction.reply({
      content: `✅ تم تسجيل تقييم الجودة للمهمة:\n• المهمة: ${formatTitle(task)}\n• الدرجة: ${score}/3`,
      ephemeral: true
    });
  } catch (err) {
    const reason = err?.message || err?.code;
    if (reason === 'TASK_NOT_FOUND') {
      return interaction.reply({
        content: '❌ لم يتم العثور على هذه المهمة. تأكد من المعرّف.',
        ephemeral: true
      });
    }
    if (reason === 'INVALID_SCORE') {
      return interaction.reply({
        content: '❌ الدرجة يجب أن تكون بين 1 و 3.',
        ephemeral: true
      });
    }
    throw err;
  }
}

async function handleEthics(interaction) {
  const taskId = interaction.options.getString('task_id', true);
  const status = interaction.options.getString('status', true);
  const tags = interaction.options.getString('tags') || '';
  const notes = interaction.options.getString('notes') || '';

  try {
    const { task } = await addEthicsReview({
      taskId,
      ethicsStatus: status,
      tags,
      notes,
      reviewerId: interaction.user.id
    });

    return interaction.reply({
      content: `✅ تم تسجيل مراجعة الأخلاقيات للمهمة:\n• المهمة: ${formatTitle(task)}\n• الحالة: ${formatStatusLabel(status)}`,
      ephemeral: true
    });
  } catch (err) {
    const reason = err?.message || err?.code;
    if (reason === 'TASK_NOT_FOUND') {
      return interaction.reply({
        content: '❌ لم يتم العثور على هذه المهمة. تأكد من المعرّف.',
        ephemeral: true
      });
    }
    if (reason === 'INVALID_ETHICS_STATUS') {
      return interaction.reply({
        content: '❌ الحالة الأخلاقية غير صحيحة.',
        ephemeral: true
      });
    }
    throw err;
  }
}

async function handleTaskReview(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'quality') return handleQuality(interaction);
  if (sub === 'ethics') return handleEthics(interaction);

  return interaction.reply({ content: 'هذا الخيار غير مدعوم حالياً.', ephemeral: true });
}

module.exports = handleTaskReview;
