import { effectAndDescendantCleanup } from "../effectAndDescendantCeanup.js";
import { effectContexts } from "../effectContexts.js";
import { getCleanupNode } from "../getCleanupNode.js";
import { observableSubscriptionsCleanup } from "../observableSubscriptionsCleanup.js";
import { setCleanupSet } from "../setCleanupSet.js";
import { setInitialParameters } from "../setInitialParameters.js";
import { unsetParameters } from "../unsetParameters.js";
import { InternalEffectObject } from "./effectTypes.js";

export function baseExecuteFn(
  effect: InternalEffectObject,
  fn: (cleanupSet: Set<() => void> | undefined) => void
) {
  //fire cleanups to make sure proceedings go smoothly
  effectAndDescendantCleanup(effect);

  //create `cleanupTreeNodePointer` for effect and create `cleanupTree` for effect tree if this is the
  //topmost parent effect (father of the whole tree)
  setInitialParameters(effect);
  //create `cleanupSet` for effect if it doesn't already exist
  setCleanupSet(effect);

  //push effect onto context to enable tracking by state and memos
  effectContexts.push(effect);

  const cleanupSet = getCleanupNode(effect)?.get(0) as
    | Set<() => void>
    | undefined;

  fn(cleanupSet);

  //add cleanup to remove effect from all old subscriptions
  cleanupSet?.add(() => observableSubscriptionsCleanup(effect));
  cleanupSet?.add(() => unsetParameters(effect));

  //remove effect from context to disable tracking by state and memos
  effectContexts.pop();
}
