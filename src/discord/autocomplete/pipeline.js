const { pipelines, getUnitByKey } = require('../../core/work/units');

function matchPipeline(pipeline, term) {
  if (!term) return true;
  const normalized = term.toLowerCase();
  return (
    pipeline.key.includes(normalized) ||
    (pipeline.name_ar && pipeline.name_ar.toLowerCase().includes(normalized))
  );
}

async function handlePipelineAutocomplete(interaction) {
  const focused = interaction.options.getFocused(true);
  const unitKey = interaction.options.getString('unit');
  const selectedUnit = unitKey ? getUnitByKey(unitKey) : null;

  const filtered = pipelines
    .filter(p => !selectedUnit || p.key.startsWith(`${selectedUnit.key}.`))
    .filter(p => matchPipeline(p, focused?.value))
    .slice(0, 25)
    .map(p => ({
      name: `${p.name_ar} (${p.key})`,
      value: p.key
    }));

  await interaction.respond(filtered);
}

module.exports = handlePipelineAutocomplete;
