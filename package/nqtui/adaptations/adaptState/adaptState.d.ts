import { State } from "./stateTypes";
export declare function adaptState<T>(): State<T | undefined>;
export declare function adaptState<T>(initialValue: T | (() => T)): State<T>;
//# sourceMappingURL=adaptState.d.ts.map