import { updateMemoCleanups } from "../cleanupUpdateFns";
import { sendStaleSignals, sendFreshSignals } from "../sendSignals";
import { InternalStateObject } from "./stateTypes";

export default function set<T>(
  state: InternalStateObject<T>,
  nextValue: T | ((prev: T) => T),
) {
  const newStateValue =
    typeof nextValue === "function"
      ? (nextValue as (prev: T) => T)(state.value!)
      : nextValue;

  if (Object.is(newStateValue, state.value)) {
    return;
  }

  //get active subscriptions to properly manange sync effects and memos
  const activeSubscriptions = state.activeSubscriptions;
  //toggle active subscriptions
  state.activeSubscriptions = activeSubscriptions === "one" ? "two" : "one";

  //let subscriptions know that they have a stale value so that they can notify their
  //subscriptions if any
  sendStaleSignals(state, activeSubscriptions);

  //update state value
  state.value = newStateValue;

  //let subscriptions know that their stale value has been updated so that they can notify and
  //update themselves and their subscriptions if any
  sendFreshSignals(state, activeSubscriptions);

  //update memo cleanups after all effects have been fired to ensure that no memos are run twice, triggering their effects
  updateMemoCleanups();
}
