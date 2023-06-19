import { InternalEffectObject } from "./adaptEffect/effectTypes";
import { effectContexts } from "./effectContexts";

export default function setInitialParameters(effect: InternalEffectObject) {
  const parentEffect = effectContexts[effectContexts.length - 1];
  if (parentEffect) {
    //use "position" and "level" to determine location of effect cleanup
    //in cleanup tree
    //increment the parent effect's child count to account for its new child effect
    parentEffect.childCount++;
    //the effect's position "n" shows that it's the "nth" child of its parent effect
    effect.position = parentEffect.childCount;
    //the effect's level shows how many levels deep it is nested (one level deeper than its parent effect)
    effect.level = (parentEffect.level as number) + 1;
    //all effects in a tree have the same cleanup tree
    effect.cleanupTree = parentEffect.cleanupTree;
    //copy parent's `cleanupTreeNodePointer` and continue from there
    effect.cleanupTreeNodePointer = [
      ...(parentEffect.cleanupTreeNodePointer as number[]),
    ];

    //complete `cleanupTreeNodePointer` for the effect
    //every number's presence in the array represents an extra level of nesting (eg. one number for the first
    //and topmost level, three numbers for two levels deeper than the topmost level, etc)
    //the value "n" of every number in the array shows that the effect is the "nth" effect in that level of nesting
    let effectCleanupTreeNodePointerLength =
      effect.cleanupTreeNodePointer.length;
    if (effectCleanupTreeNodePointerLength === effect.level) {
      effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength - 1] =
        effect.position;
    } else if (effectCleanupTreeNodePointerLength < effect.level) {
      effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength] =
        effect.position;
    } else if (effectCleanupTreeNodePointerLength > effect.level) {
      effect.cleanupTreeNodePointer.pop();
      effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength - 2] =
        effect.position;
    }
  } else {
    //do this for the topmost parent effect (father of the whole tree)
    effect.level = 1;
    effect.position = 1;
    effect.cleanupTreeNodePointer = [1];
    effect.cleanupTree = new Map();
  }
}
