const cfg = require('../../../config.json');

const channelMap = {
  'production.crew_roster': cfg.channels?.production?.crewRosterId,
  'production.gear_log': cfg.channels?.production?.gearLogId,
  'production.post_pipeline': cfg.channels?.production?.postPipelineId,
  'production.location': cfg.channels?.production?.gearLogId,
  'production.tests': cfg.channels?.production?.postPipelineId,
  'production.post_mortem': cfg.channels?.production?.postPipelineId,
  'production.archive': cfg.channels?.production?.postPipelineId,
  'production.sound_library': cfg.channels?.production?.postPipelineId,
  'media.assignments': cfg.channels?.media?.assignmentsId,
  'media.edits': cfg.channels?.media?.editsId,
  'media.fact_check': cfg.channels?.media?.factCheckId,
  'media.photo': cfg.channels?.media?.photoId,
  'media.video': cfg.channels?.media?.videoId,
  'media.graphics': cfg.channels?.media?.graphicsId,
  'media.sound': cfg.channels?.media?.soundId,
  'media.exports': cfg.channels?.media?.exportsId,
  'admin.emergency': null
};

function getChannelIdByKey(channelKey) {
  return channelMap[channelKey] || null;
}

async function postToChannel(guild, channelId, content) {
  if (!channelId) return null;
  const ch = await guild.channels.fetch(channelId).catch(() => null);
  if (!ch) return null;
  return ch.send({ content });
}

module.exports = { postToChannel, getChannelIdByKey };
