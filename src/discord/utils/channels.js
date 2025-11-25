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
