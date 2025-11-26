// src/discord/adapters/work-backfill.js
const { addBackfillEntry, verifyBackfillEntry } = require('../../core/work-log');

function parseList(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
}

async function handleWorkBackfillAdd(interaction) {
  const unit = interaction.options.getString('unit', true);
  const pipelineKey = interaction.options.getString('pipeline', true);
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description', true);
  const completedAt = interaction.options.getString('completed_at', true);
  const linksRaw = interaction.options.getString('links');

  addBackfillEntry(interaction.user.id, {
    unit,
    pipelineKey,
    title,
    description,
    completedAt,
    links: parseList(linksRaw)
  });

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
    return interaction.reply({ content: 'تعذّر العثور على السجل المطلوب.', ephemeral: true });
  }

  return interaction.reply({ content: 'تم تحديث حالة التحقق لهذا السجل.', ephemeral: true });
}

module.exports = {
  handleWorkBackfillAdd,
  handleWorkBackfillVerify
};
