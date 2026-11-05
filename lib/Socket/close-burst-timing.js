const DEFAULT_WINDOW_MS = 1500;
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
    const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
    const immediateLimit = options.immediateLimit || DEFAULT_IMMEDIATE_LIMIT;
    const minDelayMs = options.minDelayMs || DEFAULT_MIN_DELAY_MS;
    const slotMs = options.slotMs || DEFAULT_SLOT_MS;
    const jitterMs = options.jitterMs || DEFAULT_JITTER_MS;

    if (!state.windowStartedAt || now - state.windowStartedAt > windowMs) {
        state.windowStartedAt = now;
        state.count = 0;
    }

    state.count += 1;
    if (state.count <= immediateLimit) {
        return { burstCount: state.count, delayMs: 0 };
    }

    const randomValue = Math.min(0.999999999, Math.max(0, Number(random()) || 0));
    const queueIndex = state.count - immediateLimit - 1;
    return {
        burstCount: state.count,
        delayMs: minDelayMs + (queueIndex * slotMs) + Math.floor(randomValue * jitterMs)
    };
};
