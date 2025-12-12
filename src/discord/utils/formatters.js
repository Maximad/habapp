const { getPipelineByKey, getUnitByKey } = require('../../core/work/units');

function formatTaskLine(entry = {}, options = {}) {
  const { includeProject = false, showOwner = true } = options;
  const task = entry.task || entry;
  const project = entry.project || null;

  const label = task.title_ar || task.title || 'مهمة بدون عنوان';
  const sizeTag = task.size ? `[${task.size}] ` : '';
  const owner = showOwner
    ? task.ownerId
      ? `<@${task.ownerId}>`
      : 'غير معيّن بعد'
    : null;
  const due = task.due || task.dueDate || 'غير محدد';
  const projectPart = includeProject && (project?.name || project?.title)
    ? `**${project.name || project.title}**`
    : null;

  const parts = [projectPart, `${sizeTag}${label}`.trim()];
  if (showOwner && owner) parts.push(owner);

  let line = `- ${parts.filter(Boolean).join(' – ')}`;
  if (due) {
    line += ` (الموعد: ${due})`;
  }
  return line;
}

function formatTaskList(tasks = [], options = {}) {
  const { heading = 'المهمات:', includeProject = false, showOwner = true } = options;
  const lines = (tasks || []).map(task => formatTaskLine(task, { includeProject, showOwner }));
  const safeLines = lines.length > 0 ? lines : ['- لا توجد مهام جاهزة بعد.'];
  return [heading, ...safeLines].join('\n');
}

function formatProjectSummary(project = {}, tasks = [], options = {}) {
  const pipeline = project?.pipelineKey ? getPipelineByKey(project.pipelineKey) : null;
  const unitKey = (project.units && project.units[0]) || project.unit || pipeline?.unitKey || null;
  const unitMeta = unitKey ? getUnitByKey(unitKey) : null;
  const unitLabel = unitMeta?.name_ar || unitKey || '—';
  const pipelineLabel = pipeline?.name_ar || project.pipelineKey || '—';
  const dueLabel = project.dueDate || project.due || 'غير محدد';
  const desc = (project.description || '').trim();

  const heading = options.heading || 'ملخص المشروع:';
  const showOwner = options.showOwner !== false;
  const includeProject = options.includeProjectInTasks || false;

  const parts = [
    heading,
    `العنوان: **${project.name || project.title || 'بدون عنوان'}**`,
    desc ? `الوصف: ${desc}` : null,
    `الوحدة: ${unitLabel}`,
    `المسار: ${pipelineLabel}`,
    `تاريخ التسليم: ${dueLabel}`,
    '',
    formatTaskList(tasks, { heading: 'المهمات:', includeProject, showOwner })
  ];

  return parts.filter(Boolean).join('\n');
}

module.exports = {
  formatTaskLine,
  formatTaskList,
  formatProjectSummary
};
