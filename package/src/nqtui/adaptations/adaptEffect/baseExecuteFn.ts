import { effectContexts } from "../effectContexts";
import getCleanupNode from "../getCleanupNode";
import observableSubscriptionsCleanup from "../observableSubscriptionsCleanup";
import { Effect } from "./effectTypes";

export function baseExecuteFn(
  effect: Effect,
  fn: (cleanupSet: Set<() => void>) => void
) {
  //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
  effect.childCount = 0;

  //fire cleanups make sure proceedings go smoothly
  const cleanupSet = getCleanupNode(effect).get(0) as Set<() => void>;
  cleanupSet.forEach((cleanup) => {
    cleanup();
  });
  cleanupSet.clear();

  //push effect onto context to enable tracking by state and memos
  effectContexts.push(effect);

  fn(cleanupSet);

  //add cleanup to remove effect from all old subscriptions
  cleanupSet.add(() => observableSubscriptionsCleanup(effect));

  //remove effect from context to disable tracking by state and memos
  effectContexts.pop();
}
