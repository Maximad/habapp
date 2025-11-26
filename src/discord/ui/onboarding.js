// src/discord/ui/onboarding.js
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const {
  getMemberProfile,
  upsertMemberProfile,
  addLearningInterest
} = require('../../core/members');

function createOnboardingEmbed() {
  return new EmbedBuilder()
    .setColor(0x1abc9c)
    .setTitle('👋 أهلاً بك في حبق')
    .setDescription('اختر المجال الأقرب لك للبدء:');
}

function createUnitButtons() {
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('onboard_media')
      .setLabel('📣 الإعلام')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('onboard_production')
      .setLabel('🎬 الإنتاج')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('onboard_people')
      .setLabel('🤝 الناس')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('onboard_geeks')
      .setLabel('🧠 الجيكس')
      .setStyle(ButtonStyle.Primary)
  );
  return [row];
}

function selectOptionsForUnit(unit) {
  if (unit === 'media') {
    return [
      { label: 'كتابة/تحرير', value: 'writing' },
      { label: 'تصوير', value: 'photo' },
      { label: 'مونتاج', value: 'video_edit' },
      { label: 'إدارة سوشال', value: 'social' },
      { label: 'ترجمة', value: 'translation' }
    ];
  }
  if (unit === 'production') {
    return [
      { label: 'منتج', value: 'producer' },
      { label: 'مدير تصوير', value: 'dp' },
      { label: 'صوت', value: 'sound' },
      { label: 'مشرف مونتاج', value: 'post_supervisor' }
    ];
  }
  if (unit === 'people') {
    return [
      { label: 'فعاليات', value: 'events' },
      { label: 'مجتمع', value: 'community' },
      { label: 'وصول/تواصل', value: 'outreach' }
    ];
  }
  return [
    { label: 'تطوير ويب', value: 'web_dev' },
    { label: 'أتمتة', value: 'automation' },
    { label: 'بيانات', value: 'data' }
  ];
}

function buildSelectMenu(unit) {
  const options = selectOptionsForUnit(unit);
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`onboard_${unit}_select`)
      .setPlaceholder('اختر ما يناسبك أكثر')
      .addOptions(options)
      .setMinValues(1)
      .setMaxValues(options.length)
  );
}

function buildModal(unit, selections) {
  const modal = new ModalBuilder()
    .setCustomId(`onboard_${unit}_modal_${selections.join(',') || 'none'}`)
    .setTitle('تحديث ملفك في حبق');

  const examplesInput = new TextInputBuilder()
    .setCustomId('examples')
    .setLabel('أمثلة أو روابط لأعمالك (اختياري)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const learningInput = new TextInputBuilder()
    .setCustomId('learning')
    .setLabel('ما الذي تود أن تتعلمه أو تجربه مع حبق؟')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(examplesInput),
    new ActionRowBuilder().addComponents(learningInput)
  );

  return modal;
}

async function sendOnboardingMessage(interaction) {
  const embed = createOnboardingEmbed();
  const components = createUnitButtons();

  return interaction.reply({ embeds: [embed], components });
}

function unitFromCustomId(customId) {
  if (!customId?.startsWith('onboard_')) return null;
  if (customId.includes('_media')) return 'media';
  if (customId.includes('_production')) return 'production';
  if (customId.includes('_people')) return 'people';
  if (customId.includes('_geeks')) return 'geeks';
  return null;
}

async function handleOnboardingButton(interaction) {
  if (!interaction.customId?.startsWith('onboard_')) return;

  const unit = unitFromCustomId(interaction.customId);
  if (!unit) return;

  const prompts = {
    media: 'اختر ما يناسبك أكثر في فريق الإعلام:',
    production: 'اختر ما يناسبك أكثر في فريق الإنتاج:',
    people: 'اختر ما يناسبك أكثر في فريق الناس:',
    geeks: 'اختر ما يناسبك أكثر في فريق الجيكس:'
  };

  const selectRow = buildSelectMenu(unit);

  return interaction.reply({
    content: prompts[unit] || 'اختر ما يناسبك أكثر:',
    components: [selectRow],
    ephemeral: true
  });
}

function ensureProfileWithUnitAndRoles(userId, unit, selections) {
  const profile = getMemberProfile(userId) || upsertMemberProfile(userId, {});
  const units = new Set(profile.units || []);
  if (unit) units.add(unit);

  const roles = new Set(profile.roles || []);
  (selections || []).forEach(s => roles.add(s));

  const skills = Array.isArray(profile.skills) ? [...profile.skills] : [];
  (selections || []).forEach(key => {
    const idx = skills.findIndex(s => s && s.key === key);
    if (idx === -1) {
      skills.push({ key, level: null, examples: [] });
    }
  });

  return upsertMemberProfile(userId, {
    units: Array.from(units),
    roles: Array.from(roles),
    skills
  });
}

async function handleOnboardingSelect(interaction) {
  if (!interaction.customId?.startsWith('onboard_')) return;

  const match = interaction.customId.match(/^onboard_(\w+)_select$/);
  const unit = match ? match[1] : null;
  if (!unit) return;

  const selections = interaction.values || [];
  ensureProfileWithUnitAndRoles(interaction.user.id, unit, selections);

  const modal = buildModal(unit, selections);
  return interaction.showModal(modal);
}

function mergeExamplesIntoSkills(profile, selections, exampleText) {
  const skills = Array.isArray(profile.skills) ? [...profile.skills] : [];
  (selections || []).forEach(key => {
    const idx = skills.findIndex(s => s && s.key === key);
    if (idx === -1) {
      skills.push({ key, level: null, examples: exampleText ? [exampleText] : [] });
      return;
    }

    if (!exampleText) return;
    const existing = skills[idx] || { key, level: null, examples: [] };
    const examples = Array.isArray(existing.examples) ? [...existing.examples] : [];
    examples.push(exampleText);
    skills[idx] = { ...existing, key, level: existing.level || null, examples };
  });

  return skills;
}

async function handleOnboardingModal(interaction) {
  if (!interaction.customId?.startsWith('onboard_')) return;

  const match = interaction.customId.match(/^onboard_(\w+)_modal_?(.*)$/);
  const unit = match ? match[1] : null;
  const selectionsRaw = match && match[2] ? match[2] : '';
  const selections = selectionsRaw ? selectionsRaw.split(',').filter(Boolean) : [];

  const examplesText = interaction.fields.getTextInputValue('examples')?.trim();
  const learningText = interaction.fields.getTextInputValue('learning')?.trim();

  const profile = getMemberProfile(interaction.user.id) || upsertMemberProfile(interaction.user.id, {});
  const units = new Set(profile.units || []);
  if (unit) units.add(unit);

  const roles = new Set(profile.roles || []);
  selections.forEach(s => roles.add(s));

  const skills = mergeExamplesIntoSkills(profile, selections, examplesText);

  upsertMemberProfile(interaction.user.id, {
    units: Array.from(units),
    roles: Array.from(roles),
    skills
  });

  if (learningText) {
    const key = unit ? `onboarding_${unit}` : 'onboarding_general';
    try {
      addLearningInterest(interaction.user.id, { key, notes: learningText });
    } catch (err) {
      // ignore learning interest errors to avoid blocking the flow
    }
  }

  return interaction.reply({
    content: '✅ تم تحديث ملفك في حبق. سنستخدم هذه المعلومات عند توزيع المهام.',
    ephemeral: true
  });
}

module.exports = {
  sendOnboardingMessage,
  handleOnboardingButton,
  handleOnboardingSelect,
  handleOnboardingModal
};
