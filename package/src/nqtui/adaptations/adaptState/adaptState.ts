import get from "../get";
import set from "./set";
import { InternalStateObject, State } from "./stateTypes";

export function adaptState<T>(): State<T | undefined>;
export function adaptState<T>(initialValue: T | (() => T)): State<T>;
export function adaptState<T>(initialValue?: T | (() => T)): State<T> {
  //create state object with three sets of subscriptions
  const state: InternalStateObject<T> = {
    //one for sync effect subscriptions
    //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
    //and running of effects resulting in stack overflow)
    syncSubscriptions: {
      one: new Set(),
      two: new Set(),
    },
    //one for memo subscriptions
    //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
    //and running of memos resulting in stack overflow)
    memoSubscriptions: {
      one: new Set(),
      two: new Set(),
    },
    //one for async and render effect subscriptions
    //one set is enough to manage asynchronous effects
    asyncAndRenderSubscriptions: new Set(),
    //use variable to effectively switch between subscription sets (for sync effects and memos)
    activeSubscriptions: "one",
    value:
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue,
  };

  const getter = () => get(state);
  const setter = (nextValue: T | ((prev: T) => T)) => set(state, nextValue);

  return [getter, setter] as State<T>;
}
