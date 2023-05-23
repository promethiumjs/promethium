import { State } from "./adaptState/stateTypes";
declare function sendStaleSignals(state: State, activeSubscriptions: "one" | "two"): void;
declare function sendFreshSignals(state: State, activeSubscriptions: "one" | "two"): void;
export { sendStaleSignals, sendFreshSignals };
//# sourceMappingURL=sendSignals.d.ts.map