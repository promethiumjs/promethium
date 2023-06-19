import { CleanupTree, InternalEffectObject } from "./adaptEffect/effectTypes";

//use `cleanupTreeNodePointer` of effect to get `cleanupNode` of effect
//this is basically the cleanup tree for the effect tree that begins with this effect
export default function getCleanupNode(effect: InternalEffectObject) {
  let cleanupNode = effect.cleanupTree;

  effect.cleanupTreeNodePointer?.forEach((part) => {
    cleanupNode = cleanupNode?.get(part) as CleanupTree;
  });

  return cleanupNode;
}
