const config = require('../../../config.json');

function isDiscordId(value) {
  return typeof value === 'string' && /^[0-9]{17,22}$/.test(value);
}

function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('TO_FILL_');
}

/**
 * Resolve a logical channel key or raw channel ID to a Discord channel.
 *
 * - If `keyOrId` is a snowflake, fetch that channel.
 * - Otherwise, look up `config.channels[keyOrId]` (if such a mapping exists).
 * - If the value in config looks like a placeholder ("TO_FILL_..."), return null.
 * - Never throw if the channel cannot be found, just return null.
 */
async function resolveChannelKey(client, keyOrId) {
  if (!keyOrId) return null;

  // Raw ID
  if (isDiscordId(keyOrId)) {
    try {
      return await client.channels.fetch(keyOrId);
    } catch {
      return null;
    }
  }

  // Logical key in config.channels, if that structure exists
  const channelsConfig = config.channels || {};
  const mapped = channelsConfig[keyOrId];

  if (!mapped || isPlaceholder(mapped)) {
    return null;
  }

  if (isDiscordId(mapped)) {
    try {
      return await client.channels.fetch(mapped);
    } catch {
      return null;
    }
  }

  // Fallback, treat original key as best-effort ID
  if (!isPlaceholder(keyOrId)) {
    try {
      return await client.channels.fetch(keyOrId);
    } catch {
      return null;
    }
  }

  return null;
}

module.exports = { resolveChannelKey };
