import { Getter, Setter, State, UnifiedState } from "./stateTypes";
export declare function unify<T>(state: State<T>): UnifiedState<T>;
export declare function unify<T>(state: undefined): undefined;
export declare function unify<T>(state: State<T> | undefined): UnifiedState<T> | undefined;
export declare function getValue<T>(stateOrGetter: State<T> | Getter<T>): T;
export declare function getValue<T>(stateOrGetter: undefined): undefined;
export declare function getValue<T>(stateOrGetter: State<T> | Getter<T> | undefined): T | undefined;
export declare function getGetter<T>(state: State<T>): Getter<T>;
export declare function getGetter<T>(state: undefined): undefined;
export declare function getGetter<T>(state: State<T> | undefined): Getter<T> | undefined;
export declare function getSetter<T>(state: State<T>): Setter<T>;
export declare function getSetter<T>(state: undefined): undefined;
export declare function getSetter<T>(state: State<T> | undefined): Setter<T> | undefined;
//# sourceMappingURL=utils.d.ts.map