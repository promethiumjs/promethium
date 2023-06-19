import { InternalStateObject } from "./adaptState/stateTypes";

function sendStaleSignals(
  state: InternalStateObject,
  activeSubscriptions: "one" | "two"
) {
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

function sendFreshSignals(
  state: InternalStateObject,
  activeSubscriptions: "one" | "two"
) {
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
