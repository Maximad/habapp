const { findProject, upsertProject, deleteProject, applyProjectDefaults } = require('../projects');
const { listTasks } = require('../tasks');
const { getProductionTemplateByCode } = require('../templates/templates.production');

const ALLOWED_STAGES = ['planning', 'shooting', 'editing', 'review', 'archived'];

function assertStage(stage) {
  if (!ALLOWED_STAGES.includes(stage)) {
    const error = new Error('INVALID_STAGE');
    error.code = 'INVALID_STAGE';
    throw error;
  }
}

function ensureProjectExists(slug) {
  const project = findProject(slug);
  if (!project) {
    const error = new Error('PROJECT_NOT_FOUND');
    error.code = 'PROJECT_NOT_FOUND';
    throw error;
  }
  return project;
}

function ensureProjectAvailable(slug) {
  const existing = findProject(slug);
  if (existing) {
    const error = new Error('PROJECT_EXISTS');
    error.code = 'PROJECT_EXISTS';
    throw error;
  }
}

function getProductionTemplate(code) {
  if (!code) return null;
  const normalized = String(code || '').trim().toUpperCase();
  const tpl = getProductionTemplateByCode(normalized);
  if (!tpl) {
    const error = new Error('TEMPLATE_NOT_FOUND');
    error.code = 'TEMPLATE_NOT_FOUND';
    throw error;
  }
  return tpl;
}

function summarizeProductionTemplate(template) {
  if (!template) return null;
  const stageMap = {
    planning: 'التخطيط',
    shooting: 'التصوير',
    editing: 'المونتاج',
    review: 'المراجعة',
    archived: 'مؤرشف'
  };

  const stages = template.allowedStages
    .map(s => stageMap[s] || s)
    .join(' → ');

  const reviewSteps =
    template.extraReviewSteps && template.extraReviewSteps.length > 0
      ? template.extraReviewSteps.map(s => `• ${s.label_ar}`).join(' / ')
      : 'لا يوجد متطلبات مراجعة إضافية محددة.';

  const crew =
    template.crewRoles && template.crewRoles.length > 0
      ? template.crewRoles
        .map(r => `${r.label_ar} (${r.min}-${r.max})`)
        .join('، ')
      : 'طاقم بسيط حسب الحاجة.';

  const gear = template.gearPackage
    ? `${template.gearPackage.label_ar} — ${template.gearPackage.description_ar}`
    : 'لا توجد حزمة معدّات محددة.';

  const clientLabel = template.clientType === 'internal'
    ? 'عميل داخلي / حبق'
    : template.clientType === 'external'
      ? 'عميل أو شريك خارجي'
      : 'مختلط (داخلي/خارجي)';

  const qualityLabel =
    template.quality === 'premium'
      ? 'جودة عالية'
      : template.quality === 'standard'
        ? 'جودة قياسية'
        : 'جودة بسيطة';

  return (
    `**القالب ${template.code}: ${template.short_ar}**\n` +
    `- نوع العميل: ${clientLabel}\n` +
    `- جودة الإنتاج: ${qualityLabel}\n` +
    `- المراحل المسموح بها: ${stages}\n` +
    `- خطوات مراجعة إضافية: ${reviewSteps}\n` +
    `- عقد رسمي: ${template.needsContract ? 'مطلوب' : 'غير مطلوب'} | موافقة عميل قبل النشر: ${template.needsClientApprovalBeforePublish ? 'نعم' : 'لا'}\n` +
    `- الطاقم المقترح: ${crew}\n` +
    `- حزمة المعدّات: ${gear}`
  );
}

function createProject({
  name,
  slug,
  due = null,
  createdBy,
  threadId = null,
  templateCode = null,
  units = ['production'],
  pipelineKey = null
}) {
  ensureProjectAvailable(slug);

  const template = templateCode ? getProductionTemplate(templateCode) : null;

  const now = new Date().toISOString();
  const project = applyProjectDefaults({
    slug,
    name,
    due,
    stage: 'planning',
    threadId,
    createdAt: now,
    createdBy: createdBy || null,
    templateCode: template ? template.code : null,
    tasks: [],
    units,
    pipelineKey
  });

  upsertProject(project);
  return { project, template };
}

function setProjectStage(slug, stage) {
  assertStage(stage);
  const project = ensureProjectExists(slug);

  project.stage = stage;
  upsertProject(project);
  return project;
}

function removeProject(slug) {
  const project = ensureProjectExists(slug);
  deleteProject(slug);
  return project;
}

function listProjectTasks(slug, status = 'open') {
  return listTasks(slug, status);
}

module.exports = {
  ALLOWED_STAGES,
  createProject,
  setProjectStage,
  removeProject,
  listProjectTasks,
  ensureProjectExists,
  ensureProjectAvailable,
  getProductionTemplate,
  summarizeProductionTemplate
};
