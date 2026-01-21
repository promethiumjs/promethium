import { SignalTypes } from "./adaptEffect/effectTypes.js";
import { InternalStateObject } from "./adaptState/stateTypes.js";

const subscriptionTypes = [
  "memoSubscriptions",
  "syncSubscriptions",
  "asyncAndRenderSubscriptions",
] as const;

function sendSignals(state: InternalStateObject, signalType: SignalTypes) {
  subscriptionTypes.forEach((subscriptionType) => {
    state[subscriptionType].forEach((subscription) => {
      subscription.sendSignal(signalType);
    });
  });
}

export { sendSignals };
