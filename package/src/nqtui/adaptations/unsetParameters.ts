import { InternalEffectObject } from "./adaptEffect/effectTypes";

export default function unsetParameters(effect: InternalEffectObject) {
  effect.level = null;
  effect.position = null;
  effect.cleanupTreeNodePointer = null;
  effect.cleanupTree = null;
  effect.childCount = 0;
}
