import { InternalEffectObject } from "./adaptEffect/effectTypes.js";

export function unsetParameters(effect: InternalEffectObject) {
  effect.level = null;
  effect.position = null;
  effect.cleanupTreeNodePointer = null;
  effect.cleanupTree = null;
  effect.childCount = 0;
}
