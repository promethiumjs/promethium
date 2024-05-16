import observableSubscriptionsCleanup from "../observableSubscriptionsCleanup";
import getCleanupNode from "../getCleanupNode";
import { effectContexts } from "../effectContexts";
import { sendSignals } from "../sendSignals";
import { InternalMemoObject } from "./memoTypes";

//aside from a few caveats, this function basically runs like the execute function of an effect
export function updateValueAndSendFreshNotifications(
  memo: InternalMemoObject,
  fn: (prev?: any) => any,
) {
  //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
  memo.childCount = 0;

  //fire cleanups make sure proceedings go smoothly
  const cleanupSet = getCleanupNode(memo)?.get(0) as
    | Set<() => void>
    | undefined;
  cleanupSet?.forEach((cleanup) => {
    cleanup();
  });
  cleanupSet?.clear();

  //push memo onto context to enable tracking by state and other memos
  effectContexts.push(memo);

  const prevMemoValue = memo.value;
  memo.value = fn(memo.value);

  cleanupSet?.add(() => observableSubscriptionsCleanup(memo));

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
