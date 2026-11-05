import assert from 'node:assert/strict';
import test from 'node:test';
import { registerWebSocketClose } from '../lib/Socket/close-burst-timing.js';

test('allows a small canary set to reconnect immediately', () => {
    const state = { count: 0, lastCloseAt: 0, nextSlotAt: 0 };
    for (let index = 0; index < 8; index += 1) {
        assert.deepEqual(registerWebSocketClose(state, 1000), {
            burstCount: index + 1,
            delayMs: 0
        });
    }
});

test('spreads the remainder of a close burst', () => {
    const state = { count: 8, lastCloseAt: 1000, nextSlotAt: 0 };
    assert.deepEqual(registerWebSocketClose(state, 1200, () => 0), {
        burstCount: 9,
        delayMs: 10000
    });
    assert.deepEqual(registerWebSocketClose(state, 1300, () => 0.999), {
        burstCount: 10,
        delayMs: 11149
    });
});

test('assigns one reconnect slot per socket', () => {
    const state = { count: 8, lastCloseAt: 1000, nextSlotAt: 0 };
    const delays = Array.from({ length: 147 }, () =>
        registerWebSocketClose(state, 1200, () => 0).delayMs
    );
    assert.equal(delays[0], 10000);
    assert.equal(delays.at(-1), 156000);
    assert.equal(new Set(delays).size, delays.length);
});

test('does not reset while assigned reconnect slots are still draining', () => {
    const state = { count: 100, lastCloseAt: 1000, nextSlotAt: 60000 };
    assert.deepEqual(registerWebSocketClose(state, 40000, () => 0), {
        burstCount: 101,
        delayMs: 21000
    });
});

test('starts a fresh recovery generation only after queue and close stream are quiet', () => {
    const state = { count: 100, lastCloseAt: 1000, nextSlotAt: 2000 };
    assert.deepEqual(registerWebSocketClose(state, 40000), {
        burstCount: 1,
        delayMs: 0
    });
});
