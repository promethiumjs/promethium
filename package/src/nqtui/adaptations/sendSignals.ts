import { State } from "./adaptState/stateTypes";

function sendStaleSignals(state: State, activeSubscriptions: "one" | "two") {
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

function sendFreshSignals(state: State, activeSubscriptions: "one" | "two") {
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
