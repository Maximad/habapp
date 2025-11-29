// src/core/work/taskReviewService.js
// Core orchestration for task reviews

const { getTaskById } = require('./tasks');
const reviewsStore = require('./reviewsStore');
const { applyQualityReviewToMember, applyEthicsReviewToMember } = require('../people/memberStatsService');

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return String(tags)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

function loadTaskOrThrow(taskId, store) {
  try {
    return getTaskById(taskId, store);
  } catch (err) {
    const error = new Error('TASK_NOT_FOUND');
    error.cause = err;
    throw error;
  }
}

async function addQualityReview(params = {}, store) {
  const { taskId, projectSlug, score, tags, notes, reviewerId } = params;
  if (![1, 2, 3].includes(Number(score))) {
    const error = new Error('INVALID_SCORE');
    error.code = 'INVALID_SCORE';
    throw error;
  }

  const { task, project } = loadTaskOrThrow(taskId, store);
  const review = reviewsStore.add(
    {
      taskId: taskId,
      projectSlug: projectSlug || project?.slug || project?.id || '',
      type: 'quality',
      score: Number(score),
      ethicsStatus: null,
      tags: normalizeTags(tags),
      notes: notes || '',
      reviewerId: reviewerId || null
    },
    store
  );

  if (task.ownerId) {
    await applyQualityReviewToMember(task.ownerId, Number(score), store);
  }

  return { review, task, project };
}

async function addEthicsReview(params = {}, store) {
  const { taskId, projectSlug, ethicsStatus, tags, notes, reviewerId } = params;
  const allowedStatuses = ['ok', 'needs_discussion', 'violation'];
  if (!allowedStatuses.includes(ethicsStatus)) {
    const error = new Error('INVALID_ETHICS_STATUS');
    error.code = 'INVALID_ETHICS_STATUS';
    throw error;
  }

  const { task, project } = loadTaskOrThrow(taskId, store);
  const review = reviewsStore.add(
    {
      taskId: taskId,
      projectSlug: projectSlug || project?.slug || project?.id || '',
      type: 'ethics',
      score: null,
      ethicsStatus,
      tags: normalizeTags(tags),
      notes: notes || '',
      reviewerId: reviewerId || null
    },
    store
  );

  if (task.ownerId) {
    await applyEthicsReviewToMember(task.ownerId, ethicsStatus, store);
  }

  return { review, task, project };
}

module.exports = {
  addQualityReview,
  addEthicsReview
};
