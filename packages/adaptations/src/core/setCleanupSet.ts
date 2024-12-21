import { CleanupTree, InternalEffectObject } from "./adaptEffect/effectTypes";

export default function setCleanupSet(effect: InternalEffectObject) {
  //create variable to store `cleanupNode` of effect and initially set the variable to the cleanup tree
  let cleanupNode: CleanupTree | null = effect.cleanupTree;

  //extract the `cleanupNode` from the `cleanupTree` and set it to the `cleanupNode` variable
  effect.cleanupTreeNodePointer?.forEach((part) => {
    if (!cleanupNode?.get(part)) {
      cleanupNode?.set(part, new Map());
    }
    cleanupNode = cleanupNode?.get(part) as CleanupTree;
  });

  //set cleanup set for effect if it doesn't already exist in the cleanup map
  if (!cleanupNode?.get(0)) {
    cleanupNode?.set(0, new Set());
  }
}
