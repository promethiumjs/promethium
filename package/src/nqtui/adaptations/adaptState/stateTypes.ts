import { InternalEffectObject } from "../adaptEffect/effectTypes";
import { imperativeUpdate } from "./set";

export type InternalStateObject<T = any> = {
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

export type Getter<T> = () => T;
export type Setter<T> = (
  nextValue:
    | T
    | typeof imperativeUpdate
    | ((prev: T) => T | typeof imperativeUpdate),
) => void;
export type State<T> = readonly [Getter<T>, Setter<T>];
export interface UnifiedState<T> {
  (): T;
  (nextValue: T | ((prev: T) => T)): void;
}
