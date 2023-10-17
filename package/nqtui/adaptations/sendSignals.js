function sendStaleSignals(state, activeSubscriptions) {
    state.memoSubscriptions[activeSubscriptions].forEach((subscription) => {
        subscription.sendSignal("stale");
    });
    state.syncSubscriptions[activeSubscriptions].forEach((subscription) => {
        subscription.sendSignal("stale");
    });
    state.asyncAndRenderSubscriptions.forEach((subscription) => {
        subscription.sendSignal("stale");
    });
}
function sendFreshSignals(state, activeSubscriptions) {
    state.memoSubscriptions[activeSubscriptions].forEach((subscription) => {
        subscription.sendSignal("fresh");
    });
    state.syncSubscriptions[activeSubscriptions].forEach((subscription) => {
        subscription.sendSignal("fresh");
    });
    state.asyncAndRenderSubscriptions.forEach((subscription) => {
        subscription.sendSignal("fresh");
    });
}
export { sendStaleSignals, sendFreshSignals };
