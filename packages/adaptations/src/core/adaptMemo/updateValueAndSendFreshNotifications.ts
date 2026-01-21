import { observableSubscriptionsCleanup } from "../observableSubscriptionsCleanup.js";
import { getCleanupNode } from "../getCleanupNode.js";
import { effectContexts } from "../effectContexts.js";
import { sendSignals } from "../sendSignals.js";
import { InternalMemoObject, MemoFn } from "./memoTypes.js";
import { effectAndDescendantCleanup } from "../effectAndDescendantCeanup.js";
import { setInitialParameters } from "../setInitialParameters.js";
import { setCleanupSet } from "../setCleanupSet.js";
import { unsetParameters } from "../unsetParameters.js";

//aside from a few differences, this function basically runs like the execute function of an effect
export function updateValueAndSendFreshNotifications<T>(
  memo: InternalMemoObject<T>,
  fn: MemoFn<T>
) {
  //fire cleanups to make sure proceedings go smoothly
  effectAndDescendantCleanup(memo);

  //do some setup to make sure proceedings go smoothly
  setInitialParameters(memo);
  setCleanupSet(memo);

  //push memo onto context to enable tracking by state and other memos
  effectContexts.push(memo);

  //let subscriptions know that they have a stale value so that they can notify their
  //subscriptions if any
  sendSignals(memo, "stale");

  const prevMemoValue = memo.value;
  memo.value = fn();

  const cleanupSet = getCleanupNode(memo)?.get(0) as
    | Set<() => void>
    | undefined;
  cleanupSet?.add(() => observableSubscriptionsCleanup(memo));
  cleanupSet?.add(() => unsetParameters(memo));

  //remove memo from context to disable tracking by state and other memos
  effectContexts.pop();

  //let subscriptions know that their stale value has been updated so that they can notify and
  //update themselves and their subscriptions if any
  if (prevMemoValue === memo.value) {
    sendSignals(memo, "falseAlarm");
  } else {
    sendSignals(memo, "fresh");
  }
}
