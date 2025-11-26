// src/core/templates/index.js

const {
  taskTemplates,
  getTaskTemplateById,
  listTaskTemplatesByUnit
} = require('./task-templates');

// لاحقاً سنضيف project-templates.js و bundles.js هنا.

module.exports = {
  taskTemplates,
  getTaskTemplateById,
  listTaskTemplatesByUnit
};
