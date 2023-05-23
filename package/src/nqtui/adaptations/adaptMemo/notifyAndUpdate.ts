import observableSubscriptionsCleanup from "../observableSubscriptionsCleanup";
import getCleanupNode from "../getCleanupNode";
import { effectContexts } from "../effectContexts";
import { queueCleanupUpdates } from "../cleanupUpdateFns";
import { sendStaleSignals, sendFreshSignals } from "../sendSignals";
import { Memo } from "./memoTypes";

export function sendStaleNotifications(memo: Memo) {
  //get active subscriptions to properly manange sync effects and memos
  const activeSubscriptions = memo.activeSubscriptions;
  //toggle active subscriptions
  memo.activeSubscriptions = activeSubscriptions === "one" ? "two" : "one";

  //let subscriptions know that they have a stale value so that they can notify their
  //subscriptions if any
  sendStaleSignals(memo, activeSubscriptions);
}

//aside from a few caveats, this function basically runs like the execute function of an effect
export function updateValueAndSendFreshNotifications(
  memo: Memo,
  fn: () => any
) {
  //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
  memo.childCount = 0;

  //fire cleanups make sure proceedings go smoothly
  const cleanupSet = getCleanupNode(memo).get(0) as Set<Memo | (() => void)>;
  for (const cleanup of cleanupSet) {
    //if cleanup is a memo, return it and exit out of function because this means that if the function continues to run
    //the memo would potentially run twice and re-trigger all of its dependents
    if (typeof cleanup !== "function") {
      return cleanup;
    }
    cleanup();
  }
  cleanupSet.clear();

  //push memo onto context to enable tracking by state and other memos
  effectContexts.push(memo);

  memo.value = fn();

  if (memo.firstRun) {
    memo.firstRun = false;
    //on first run, add cleanup function to cleanupSet
    cleanupSet.add(() => observableSubscriptionsCleanup(memo));
  } else {
    //else add memo to cleanupSet so that the check that runs inside the for of loop above is able to effectively do its job
    //and prevent memos from running twice, especially when nested in effects that also depend on them or in other "edge" cases
    cleanupSet.add(memo);
    //then `queueCleanupUpdates` for later for the same reasons mentioned in the comment above
    queueCleanupUpdates(() => {
      cleanupSet.clear();
      cleanupSet.add(() => observableSubscriptionsCleanup(memo));
    });
  }

  //remove memo from context to disable tracking by state and other memos
  effectContexts.pop();

  //get `activeSubscriptions` as the opposite for `memo.activeSubscriptions` because it recently toggled in `sendStaleNotifications`
  const activeSubscriptions =
    memo.activeSubscriptions === "one" ? "two" : "one";

  //let subscriptions know that their stale value has been updated so that they can notify and
  //update themselves and their subscriptions if any
  sendFreshSignals(memo, activeSubscriptions);
}
