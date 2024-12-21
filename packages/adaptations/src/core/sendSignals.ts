import { SignalTypes } from "./adaptEffect/effectTypes";
import { InternalStateObject } from "./adaptState/stateTypes";

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
