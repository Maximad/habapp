const cfg = require('../../../config.json');

function getChannelMap() {
  const productionChannels = cfg.channels?.production || cfg.production || {};
  const mediaChannels = cfg.channels?.media || cfg.media || {};

  return {
    'production.crew_roster': productionChannels.crewRosterId,
    'production.gear_log': productionChannels.gearLogId,
    'production.post_pipeline': productionChannels.postPipelineId,
    'production.location': productionChannels.gearLogId,
    'production.tests': productionChannels.postPipelineId,
    'production.post_mortem': productionChannels.postPipelineId,
    'production.archive': productionChannels.postPipelineId,
    'production.sound_library': productionChannels.postPipelineId,
    'media.assignments': mediaChannels.assignmentsId,
    'media.edits': mediaChannels.editsId,
    'media.fact_check': mediaChannels.factCheckId,
    'media.photo': mediaChannels.photoId,
    'media.video': mediaChannels.videoId,
    'media.graphics': mediaChannels.graphicsId,
    'media.sound': mediaChannels.soundId,
    'media.exports': mediaChannels.exportsId,
    'admin.emergency': null
  };
}

function getChannelIdByKey(channelKey) {
  const channelMap = getChannelMap();
  return channelMap[channelKey] || null;
}

async function postToChannel(guild, channelId, content) {
  if (!channelId) return null;
  const ch = await guild.channels.fetch(channelId).catch(() => null);
  if (!ch) return null;
  return ch.send({ content });
}

async function postToChannelByKey(guild, channelKey, content) {
  return postToChannel(guild, getChannelIdByKey(channelKey), content);
}

module.exports = { postToChannel, postToChannelByKey, getChannelIdByKey };
