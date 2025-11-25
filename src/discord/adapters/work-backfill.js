const { addBackfillEntry, verifyBackfillEntry } = require('../../core/work-log');

function parseCommaList(str) {
  if (!str) return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function handleWorkBackfillAdd(interaction) {
  const unit = interaction.options.getString('unit', true);
  const pipelineKey = interaction.options.getString('pipeline', true);
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description', true);
  const completedAt = interaction.options.getString('completed_at', true);
  const links = parseCommaList(interaction.options.getString('links'));

  try {
    addBackfillEntry(interaction.user.id, {
      unit,
      pipelineKey,
      title,
      description,
      completedAt,
      links
    });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر حفظ الإدخال. تأكد من القيم المدخلة.',
      ephemeral: true
    });
  }

  return interaction.reply({
    content:
      '✅ تم حفظ هذه المهمة السابقة في سجل أعمالك. يمكن لأعضاء القيادة مراجعتها وتأكيدها لاحقاً.',
    ephemeral: true
  });
}

async function handleWorkBackfillVerify(interaction) {
  const entryId = interaction.options.getString('entry_id', true);
  const verified = interaction.options.getBoolean('verified', true);

  try {
    verifyBackfillEntry(entryId, interaction.user.id, verified);
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر تحديث حالة هذا الإدخال. تأكد من المعرّف.',
      ephemeral: true
    });
  }

  const statusText = verified ? 'تم تأكيد هذا الإدخال.' : 'تم وضع هذا الإدخال كغير مؤكّد.';
  return interaction.reply({ content: `✅ ${statusText}`, ephemeral: true });
}

module.exports = {
  handleWorkBackfillAdd,
  handleWorkBackfillVerify
};
