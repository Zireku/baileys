const DEFAULT_QUIET_RESET_MS = 30000;
const DEFAULT_IMMEDIATE_LIMIT = 8;
const DEFAULT_MIN_DELAY_MS = 10000;
const DEFAULT_SLOT_MS = 1000;
const DEFAULT_JITTER_MS = 250;

export const registerWebSocketClose = (
    state,
    now,
    random = Math.random,
    options = {}
) => {
    const quietResetMs = options.quietResetMs || DEFAULT_QUIET_RESET_MS;
    const immediateLimit = options.immediateLimit || DEFAULT_IMMEDIATE_LIMIT;
    const minDelayMs = options.minDelayMs || DEFAULT_MIN_DELAY_MS;
    const slotMs = options.slotMs || DEFAULT_SLOT_MS;
    const jitterMs = options.jitterMs || DEFAULT_JITTER_MS;

    const queueStillDraining = Number.isFinite(state.nextSlotAt) &&
        state.nextSlotAt > 0 &&
        now <= state.nextSlotAt + quietResetMs;
    const closeStreamIsActive = Number.isFinite(state.lastCloseAt) &&
        state.lastCloseAt > 0 &&
        now - state.lastCloseAt <= quietResetMs;

    // A recovery generation only resets after both the raw-close stream has been quiet and
    // every assigned reconnect slot has drained. Reconnect failures that arrive while the queue
    // is active join the same generation instead of receiving a fresh set of immediate canaries.
    if (!queueStillDraining && !closeStreamIsActive) {
        state.count = 0;
        state.nextSlotAt = 0;
        state.recoveryStartedAt = now;
    }

    state.lastCloseAt = now;
    state.count += 1;
    if (state.count <= immediateLimit) {
        return { burstCount: state.count, delayMs: 0 };
    }

    const randomValue = Math.min(0.999999999, Math.max(0, Number(random()) || 0));
    const earliestSlotAt = now + minDelayMs;
    const scheduledAt = Math.max(
        earliestSlotAt,
        (Number(state.nextSlotAt) || 0) + slotMs
    );
    state.nextSlotAt = scheduledAt;
    return {
        burstCount: state.count,
        delayMs: scheduledAt - now + Math.floor(randomValue * jitterMs)
    };
};
