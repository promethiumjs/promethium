import { InternalStateObject } from "./adaptState/stateTypes";
declare function sendStaleSignals(state: InternalStateObject, activeSubscriptions: "one" | "two"): void;
declare function sendFreshSignals(state: InternalStateObject, activeSubscriptions: "one" | "two"): void;
export { sendStaleSignals, sendFreshSignals };
//# sourceMappingURL=sendSignals.d.ts.map