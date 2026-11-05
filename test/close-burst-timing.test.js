import assert from 'node:assert/strict';
import test from 'node:test';
import { registerWebSocketClose } from '../lib/Socket/close-burst-timing.js';

test('allows a small canary set to reconnect immediately', () => {
    const state = { windowStartedAt: 0, count: 0 };
    for (let index = 0; index < 8; index += 1) {
        assert.deepEqual(registerWebSocketClose(state, 1000), {
            burstCount: index + 1,
            delayMs: 0
        });
    }
});

test('spreads the remainder of a close burst', () => {
    const state = { windowStartedAt: 1000, count: 8 };
    assert.deepEqual(registerWebSocketClose(state, 1200, () => 0), {
        burstCount: 9,
        delayMs: 10000
    });
    assert.deepEqual(registerWebSocketClose(state, 1300, () => 0.999), {
        burstCount: 10,
        delayMs: 11249
    });
});

test('assigns one reconnect slot per socket', () => {
    const state = { windowStartedAt: 1000, count: 8 };
    const delays = Array.from({ length: 147 }, () =>
        registerWebSocketClose(state, 1200, () => 0).delayMs
    );
    assert.equal(delays[0], 10000);
    assert.equal(delays.at(-1), 156000);
    assert.equal(new Set(delays).size, delays.length);
});

test('starts a fresh burst window after quiet time', () => {
    const state = { windowStartedAt: 1000, count: 100 };
    assert.deepEqual(registerWebSocketClose(state, 3000), {
        burstCount: 1,
        delayMs: 0
    });
});
