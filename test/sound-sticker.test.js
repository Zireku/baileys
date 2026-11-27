import assert from 'node:assert/strict';
import test from 'node:test';

import { generateWAMessage, normalizeMessageContent } from '../lib/Utils/messages.js';

const silentLogger = {
    child: () => silentLogger,
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
};

test('native sound sticker uses wrapper 134 and embeds playable audio metadata', async () => {
    const uploads = [];
    const upload = async (_path, options) => {
        uploads.push(options.mediaType);
        return {
            mediaUrl: 'https://example.invalid/media',
            directPath: '/media'
        };
    };
    const message = await generateWAMessage('628123456789@s.whatsapp.net', {
        sticker: Buffer.from('RIFF____WEBP_sound_sticker_test'),
        stickerAudio: Buffer.alloc(70_000, 7),
        stickerAudioSeconds: 4,
        isAnimated: true,
        width: 512,
        height: 512
    }, {
        upload,
        logger: silentLogger,
        userJid: '628987654321@s.whatsapp.net'
    });

    assert.deepEqual(uploads.sort(), ['audio', 'sticker']);
    assert.ok(message.message.audioStickerMessage);
    const normalized = normalizeMessageContent(message.message);
    const sticker = normalized.stickerMessage;
    assert.ok(sticker);
    assert.equal(sticker.isAnimated, true);
    assert.equal(sticker.width, 512);
    assert.equal(sticker.height, 512);
    assert.ok(sticker.audioMessage);
    assert.equal(sticker.audioMessage.mimetype, 'audio/ogg; codecs=opus');
    assert.equal(sticker.audioMessage.seconds, 4);
    assert.notEqual(sticker.audioMessage.ptt, true);
    assert.equal(sticker.audioMessage.streamingSidecar.length, 20);
});

test('regular stickers remain regular stickerMessage payloads', async () => {
    const message = await generateWAMessage('628123456789@s.whatsapp.net', {
        sticker: Buffer.from('RIFF____WEBP_regular_sticker_test'),
        isAnimated: true
    }, {
        upload: async () => ({ mediaUrl: 'https://example.invalid/media', directPath: '/media' }),
        logger: silentLogger,
        userJid: '628987654321@s.whatsapp.net'
    });

    assert.ok(message.message.stickerMessage);
    assert.equal(message.message.audioStickerMessage, null);
});
