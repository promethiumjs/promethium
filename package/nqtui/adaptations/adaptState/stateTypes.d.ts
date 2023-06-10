import { Effect } from "../adaptEffect/effectTypes";
export declare type State<T = any> = {
    syncSubscriptions: {
        one: Set<Effect>;
        two: Set<Effect>;
    };
    memoSubscriptions: {
        one: Set<Effect>;
        two: Set<Effect>;
    };
    asyncAndRenderSubscriptions: Set<Effect>;
    activeSubscriptions: "one" | "two";
    value: T | undefined;
};
export declare type Getter<T = any> = () => T;
export declare type Setter<T = any> = (nextValue: T | ((prev: T) => T)) => void;
export declare type StateTuple<T> = readonly [Getter<T>, Setter<T>];
//# sourceMappingURL=stateTypes.d.ts.map