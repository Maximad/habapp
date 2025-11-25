const {
  addSkill,
  updateSkill,
  getMemberProfile,
  addLearningInterest
} = require('../../core/members');

function parseExamples(str) {
  if (!str) return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function handleProfileSkills(interaction) {
  const key = interaction.options.getString('key', true);
  const level = interaction.options.getString('level', true);
  const examplesRaw = interaction.options.getString('examples');
  const examples = parseExamples(examplesRaw);

  try {
    const profile = getMemberProfile(interaction.user.id);
    const hasSkill = profile && Array.isArray(profile.skills)
      ? profile.skills.some(s => s && s.key === key)
      : false;

    if (hasSkill) {
      updateSkill(interaction.user.id, { key, level, examples });
    } else {
      addSkill(interaction.user.id, { key, level, examples });
    }
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر تحديث المهارة. حاول مرة أخرى أو تأكد من المدخلات.',
      ephemeral: true
    });
  }

  return interaction.reply({
    content:
      '✅ تم تحديث مهاراتك على حساب حبق. سنستخدم هذه المعلومات لاقتراح مهام تناسبك.',
    ephemeral: true
  });
}

async function handleProfileLearning(interaction) {
  const key = interaction.options.getString('key', true);
  const notes = interaction.options.getString('notes') || null;

  try {
    addLearningInterest(interaction.user.id, { key, notes });
  } catch (err) {
    return interaction.reply({
      content: 'تعذّر تسجيل الاهتمام. حاول مرة أخرى أو تأكد من المدخلات.',
      ephemeral: true
    });
  }

  return interaction.reply({
    content:
      '✅ تم تسجيل هذا المجال ضمن اهتماماتك للتعلم. سنحاول ربطك بمهام صغيرة في هذا الاتجاه.',
    ephemeral: true
  });
}

module.exports = {
  handleProfileSkills,
  handleProfileLearning
};
