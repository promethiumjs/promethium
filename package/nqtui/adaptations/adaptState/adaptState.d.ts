import { StateTuple } from "./stateTypes";
export declare function adaptState<T>(): StateTuple<T | undefined>;
export declare function adaptState<T>(initialValue: T | (() => T)): StateTuple<T>;
//# sourceMappingURL=adaptState.d.ts.map