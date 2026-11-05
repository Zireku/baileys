import assert from 'node:assert/strict';
import test from 'node:test';
import {
    getKeepAliveRecoveryDelay,
    getKeepAliveRecoveryUntil,
    getKeepAliveTimerLag,
    shouldRecoverFromKeepAliveTimerLag
} from '../lib/Socket/keepalive-timing.js';

test('normal timer jitter does not enter recovery', () => {
    const lag = getKeepAliveTimerLag(30_250, 30_000);
    assert.equal(lag, 250);
    assert.equal(shouldRecoverFromKeepAliveTimerLag(lag, 30_000, 45_000), false);
});

test('long event-loop pause enters recovery instead of closing every socket', () => {
    const lag = getKeepAliveTimerLag(120_000, 30_000);
    assert.equal(lag, 90_000);
    assert.equal(shouldRecoverFromKeepAliveTimerLag(lag, 30_000, 45_000), true);
    assert.equal(getKeepAliveRecoveryUntil(120_000, 30_000, 45_000), 195_000);
});

test('recovery delay re-staggers probes over one keepalive interval', () => {
    assert.equal(getKeepAliveRecoveryDelay(30_000, () => 0), 30_000);
    assert.equal(getKeepAliveRecoveryDelay(30_000, () => 0.5), 45_000);
    assert.equal(getKeepAliveRecoveryDelay(30_000, () => 0.999999), 59_999);
});
