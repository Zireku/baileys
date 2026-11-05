const MIN_TIMER_LAG_MS = 1000;

export const getKeepAliveTimerLag = (now, expectedAt) => {
    if (!Number.isFinite(now) || !Number.isFinite(expectedAt) || expectedAt <= 0) {
        return 0;
    }
    return Math.max(0, now - expectedAt);
};

export const shouldRecoverFromKeepAliveTimerLag = (timerLagMs, keepAliveIntervalMs, keepAliveGracePeriodMs) => {
    const threshold = Math.max(
        MIN_TIMER_LAG_MS,
        Number(keepAliveIntervalMs) || 0,
        Number(keepAliveGracePeriodMs) || 0
    );
    return Number.isFinite(timerLagMs) && timerLagMs > threshold;
};

export const getKeepAliveRecoveryDelay = (keepAliveIntervalMs, random = Math.random) => {
    const interval = Math.max(1, Number(keepAliveIntervalMs) || 1);
    const randomValue = Math.min(0.999999999, Math.max(0, Number(random()) || 0));
    return interval + Math.floor(randomValue * interval);
};

export const getKeepAliveRecoveryUntil = (now, keepAliveIntervalMs, keepAliveGracePeriodMs) => {
    return now + Math.max(1, Number(keepAliveIntervalMs) || 1) +
        Math.max(1, Number(keepAliveGracePeriodMs) || 1);
};
