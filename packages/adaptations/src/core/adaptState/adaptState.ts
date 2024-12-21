import get from "../get";
import set, { imperativeUpdate } from "./set";
import { InternalStateObject, State } from "./stateTypes";

export function adaptState<T>(): State<T | undefined>;
export function adaptState<T>(initialValue: T | (() => T)): State<T>;
export function adaptState<T>(initialValue?: T | (() => T)): State<T> {
  //create state object with sets of subscriptions
  const state: InternalStateObject<T> = {
    //one for sync effect subscriptions
    syncSubscriptions: new Set(),
    //one for memo subscriptions
    memoSubscriptions: new Set(),
    //one for async and render effect subscriptions
    asyncAndRenderSubscriptions: new Set(),
    //use variable to effectively switch between subscription sets (for sync effects and memos)
    value:
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue,
  };

  const getter = () => get(state);
  const setter = (
    nextValue:
      | T
      | typeof imperativeUpdate
      | ((prev: T) => T | typeof imperativeUpdate),
  ) => set(state, nextValue);

  return [getter, setter] as State<T>;
}
