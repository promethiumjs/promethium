import { SignalTypes } from "./adaptEffect/effectTypes";
import { InternalStateObject } from "./adaptState/stateTypes";

function sendSignals(state: InternalStateObject, signalType: SignalTypes) {
  //toggle active subscriptions for next cycle of updates
  if (signalType === "stale") {
    state.activeSubscriptions =
      state.activeSubscriptions === "one" ? "two" : "one";
  }

  //get active subscriptions for current cycle to properly manange sync effects and memos
  const activeSubscriptions =
    state.activeSubscriptions === "one" ? "two" : "one";

  state.memoSubscriptions[activeSubscriptions].forEach((subscription) => {
    subscription.sendSignal(signalType);
  });

  state.syncSubscriptions[activeSubscriptions].forEach((subscription) => {
    subscription.sendSignal(signalType);
  });

  state.asyncAndRenderSubscriptions.forEach((subscription) => {
    subscription.sendSignal(signalType);
  });
}

export { sendSignals };
