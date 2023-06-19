import { State, UnifiedState } from "./stateTypes";

export default function unify<T>(state: State<T>) {
  function unifiedState(nextValue?: T | ((prev: T) => T)) {
    if (nextValue === undefined) {
      return state[0]();
    } else {
      return state[1](nextValue);
    }
  }
  return unifiedState as UnifiedState<T>;
}
