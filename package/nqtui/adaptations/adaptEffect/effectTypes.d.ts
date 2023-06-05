import { Getter } from "../adaptState/stateTypes";
export declare type CleanupTree = Map<number, CleanupTree | Set<() => void>>;
export declare type Effect<T = any, U = any[]> = {
    firstRun: boolean;
    type: "async" | "sync" | "render" | "memo";
    tracking?: "implicit" | "depArray" | "componentFn";
    childCount: number;
    position: number | null;
    level: number | null;
    cleanupTree: CleanupTree | null;
    cleanupTreeNodePointer: number[] | null;
    observableSubscriptionSets: Set<Set<Effect>>;
    staleStateValuesCount: number;
    returnValue?: T;
    argsArray?: U;
    sendSignal: (signal: "stale" | "fresh") => void;
};
export declare type EffectOptions = {
    defer?: boolean;
    isComponent?: boolean;
};
export declare type EffectFn<T = any, U = any[]> = (returnValue?: T, argsArray?: U) => (() => T) | void;
export declare type DepArray<U> = {
    [I in keyof U]: Getter<U[I]>;
};
export declare type ExecuteFn = (effect: Effect, fn: EffectFn, depArray?: Getter<any>[], options?: EffectOptions) => () => void;
export declare type ComponentFnExecuteFn = (effect: Effect, fn: EffectFn, depArray: Getter<any>[], options?: EffectOptions) => readonly [() => void, () => any[], any[]] | (() => void);
//# sourceMappingURL=effectTypes.d.ts.map