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
    value: T;
};
export declare type Getter<T = any> = () => T;
export declare type Setter<T = any> = (nextValue: T) => void;
//# sourceMappingURL=stateTypes.d.ts.map