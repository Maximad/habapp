const test = require('node:test');
const assert = require('assert');

const config = require('../../config.json');
const { resolveChannelKey } = require('../../src/discord/utils/channels');

test('resolveChannelKey fetches channel by raw snowflake id', async () => {
  const fetched = [];
  const fakeChannel = { id: '123456789012345678' };
  const client = {
    channels: {
      fetch: async id => {
        fetched.push(id);
        return fakeChannel;
      },
    },
  };

  const channel = await resolveChannelKey(client, '123456789012345678');

  assert.strictEqual(channel, fakeChannel);
  assert.deepStrictEqual(fetched, ['123456789012345678']);
});

test('resolveChannelKey fetches channel by logical key in config.channels', async () => {
  const original = config.channels.someKey;
  config.channels.someKey = '123456789012345678';

  const fetched = [];
  const fakeChannel = { id: '123456789012345678' };
  const client = {
    channels: {
      fetch: async id => {
        fetched.push(id);
        return fakeChannel;
      },
    },
  };

  try {
    const channel = await resolveChannelKey(client, 'someKey');
    assert.strictEqual(channel, fakeChannel);
    assert.deepStrictEqual(fetched, ['123456789012345678']);
  } finally {
    if (original === undefined) {
      delete config.channels.someKey;
    } else {
      config.channels.someKey = original;
    }
  }
});

test('resolveChannelKey returns null for placeholder mappings', async () => {
  const original = config.channels.placeholderKey;
  config.channels.placeholderKey = 'TO_FILL_MEDIA_WRITERS_CHANNEL';

  const client = {
    channels: {
      fetch: async () => {
        throw new Error('should not fetch');
      },
    },
  };

  try {
    const channel = await resolveChannelKey(client, 'placeholderKey');
    assert.strictEqual(channel, null);
  } finally {
    if (original === undefined) {
      delete config.channels.placeholderKey;
    } else {
      config.channels.placeholderKey = original;
    }
  }
});
