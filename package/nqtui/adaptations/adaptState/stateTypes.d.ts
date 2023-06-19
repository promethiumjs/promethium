import { InternalEffectObject } from "../adaptEffect/effectTypes";
export declare type InternalStateObject<T = any> = {
    syncSubscriptions: {
        one: Set<InternalEffectObject>;
        two: Set<InternalEffectObject>;
    };
    memoSubscriptions: {
        one: Set<InternalEffectObject>;
        two: Set<InternalEffectObject>;
    };
    asyncAndRenderSubscriptions: Set<InternalEffectObject>;
    activeSubscriptions: "one" | "two";
    value: T | undefined;
};
export declare type Getter<T> = () => T;
export declare type Setter<T> = (nextValue: T | ((prev: T) => T)) => void;
export declare type State<T> = readonly [Getter<T>, Setter<T>];
export interface UnifiedState<T> {
    (): T;
    (nextValue: T | ((prev: T) => T)): void;
}
//# sourceMappingURL=stateTypes.d.ts.map