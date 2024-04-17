import { sendSignals } from "../sendSignals";
import { InternalStateObject } from "./stateTypes";

export const imperativeUpdate = Symbol("imperativeUpdate");

export default function set<T>(
  state: InternalStateObject<T>,
  nextValue: T | ((prev: T) => T),
) {
  const newStateValue =
    typeof nextValue === "function"
      ? (nextValue as (prev: T) => T)(state.value!)
      : nextValue;

  if (
    Object.is(newStateValue, state.value) &&
    newStateValue !== imperativeUpdate
  ) {
    return;
  }

  //let subscriptions know that they have a stale value so that they can notify their
  //subscriptions if any
  sendSignals(state, "stale");

  //update state value
  state.value = newStateValue;

  //let subscriptions know that their stale value has been updated so that they can notify and
  //update themselves and their subscriptions if any
  sendSignals(state, "fresh");
}
