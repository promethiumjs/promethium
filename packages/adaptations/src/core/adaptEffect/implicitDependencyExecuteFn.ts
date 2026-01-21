import { baseExecuteFn } from "./baseExecuteFn.js";
import { effectAndDescendantCleanup } from "../effectAndDescendantCeanup.js";
import { InternalEffectObject, EffectFn } from "./effectTypes.js";

export function implicitDependencyExecuteFn(
  effect: InternalEffectObject,
  fn: EffectFn
) {
  baseExecuteFn(effect, (cleanupSet) => internalFn(fn, cleanupSet));

  //return cleanup function for effect and its descendants
  return () => effectAndDescendantCleanup(effect);
}

function internalFn(fn: EffectFn, cleanupSet: Set<() => void> | undefined) {
  const fnReturnValue = fn();
  //create `returnValueCleanup` to be called on next run of effect
  const returnValueCleanup = () => {
    if (typeof fnReturnValue === "function") {
      fnReturnValue();
    }
  };

  cleanupSet?.add(returnValueCleanup);
}
