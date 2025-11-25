const { addSkill, updateSkill, addLearningInterest } = require('../../core/members');

function parseCommaList(str) {
  if (!str) return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function handleProfileSkills(interaction) {
  const key = interaction.options.getString('key', true);
  const level = interaction.options.getString('level', true);
  const examples = parseCommaList(interaction.options.getString('examples'));

  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return interaction.reply({ content: 'مستوى المهارة غير صالح.', ephemeral: true });
  }

  try {
    addSkill(interaction.user.id, { key, level, examples });
  } catch (err) {
    if (err && err.message && err.message.includes('exists')) {
      try {
        updateSkill(interaction.user.id, { key, level, examples });
      } catch (err2) {
        return interaction.reply({ content: 'تعذّر تحديث المهارة.', ephemeral: true });
      }
    } else {
      return interaction.reply({ content: 'تعذّر إضافة المهارة.', ephemeral: true });
    }
  }

  return interaction.reply({
    content: '✅ تم تحديث مهاراتك على حساب حبق. سنستخدم هذه المعلومات لاقتراح مهام تناسبك.',
    ephemeral: true
  });
}

async function handleProfileLearning(interaction) {
  const key = interaction.options.getString('key', true);
  const notes = interaction.options.getString('notes');

  try {
    addLearningInterest(interaction.user.id, { key, notes });
  } catch (err) {
    return interaction.reply({ content: 'تعذّر تسجيل هذا الاهتمام.', ephemeral: true });
  }

  return interaction.reply({
    content: '✅ تم تسجيل هذا المجال ضمن اهتماماتك للتعلم. سنحاول ربطك بمهام صغيرة في هذا الاتجاه.',
    ephemeral: true
  });
}

module.exports = {
  handleProfileSkills,
  handleProfileLearning
};
