// src/discord/adapters/profile.js
const { addSkill, updateSkill, addLearningInterest, getMemberProfile } = require('../../core/members');

function parseExamples(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
}

async function handleProfileSkills(interaction) {
  const key = interaction.options.getString('key', true);
  const level = interaction.options.getString('level', true);
  const examplesRaw = interaction.options.getString('examples');
  const examples = parseExamples(examplesRaw);
  const userId = interaction.user.id;

  const profile = getMemberProfile(userId);
  const existing = profile?.skills?.find(s => s && s.key === key);

  try {
    if (existing) {
      updateSkill(userId, { key, level, examples });
    } else {
      addSkill(userId, { key, level, examples });
    }
  } catch (err) {
    return interaction.reply({ content: 'تعذّر تحديث المهارة. حاول مجدداً.', ephemeral: true });
  }

  return interaction.reply({
    content: '✅ تم تحديث مهاراتك على حساب حبق. سنستخدم هذه المعلومات لاقتراح مهام تناسبك.',
    ephemeral: true
  });
}

async function handleProfileLearning(interaction) {
  const key = interaction.options.getString('key', true);
  const notes = interaction.options.getString('notes') || null;

  try {
    addLearningInterest(interaction.user.id, { key, notes });
  } catch (err) {
    return interaction.reply({ content: 'تعذّر تحديث الاهتمامات التعليمية.', ephemeral: true });
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
