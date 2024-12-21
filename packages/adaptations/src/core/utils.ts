import { effectContexts } from "./effectContexts";
import { Getter, Setter, State, UnifiedState } from "./adaptState/stateTypes";

export function unify<T>(state: State<T>): UnifiedState<T>;
export function unify<T>(state: undefined): undefined;
export function unify<T>(
  state: State<T> | undefined,
): UnifiedState<T> | undefined;
export function unify<T>(state: State<T> | undefined) {
  if (state !== undefined) {
    function unifiedState(nextValue?: T | ((prev: T) => T)) {
      if (nextValue === undefined) {
        return state![0]();
      } else {
        return state![1](nextValue);
      }
    }

    return unifiedState as UnifiedState<T>;
  } else {
    return undefined;
  }
}

export function getValue<T>(stateOrGetter: State<T> | Getter<T>): T;
export function getValue<T>(stateOrGetter: undefined): undefined;
export function getValue<T>(
  stateOrGetter: State<T> | Getter<T> | undefined,
): T | undefined;
export function getValue<T>(stateOrGetter: State<T> | Getter<T> | undefined) {
  if (stateOrGetter !== undefined) {
    if (typeof stateOrGetter === "function") {
      return stateOrGetter();
    } else {
      return stateOrGetter[0]();
    }
  } else {
    return undefined;
  }
}

export function getGetter<T>(state: State<T>): Getter<T>;
export function getGetter<T>(state: undefined): undefined;
export function getGetter<T>(
  state: State<T> | undefined,
): Getter<T> | undefined;
export function getGetter<T>(state: State<T> | undefined) {
  if (state !== undefined) {
    return state[0];
  } else {
    return undefined;
  }
}

export function getSetter<T>(state: State<T>): Setter<T>;
export function getSetter<T>(state: undefined): undefined;
export function getSetter<T>(
  state: State<T> | undefined,
): Setter<T> | undefined;
export function getSetter<T>(state: State<T> | undefined) {
  if (state !== undefined) {
    return state[1];
  } else {
    return undefined;
  }
}

export function untrack<T>(stateOrEffectFn: (...args: any[]) => T): T {
  const _effectContexts = effectContexts.slice();
  effectContexts.length = 0;
  const returnValue = stateOrEffectFn();
  effectContexts.length = 0;
  effectContexts.push(..._effectContexts);

  return returnValue;
}
