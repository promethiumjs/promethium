import { baseExecuteFn } from "./baseExecuteFn.js";
import { effectAndDescendantCleanup } from "../effectAndDescendantCeanup.js";
import {
  InternalEffectObject,
  EffectFn,
  EffectOptions,
} from "./effectTypes.js";

export function dependencyArrayExecuteFn<T extends unknown[] = unknown[]>(
  effect: InternalEffectObject,
  fn: EffectFn,
  options?: EffectOptions<T>
) {
  baseExecuteFn(effect, (cleanupSet) =>
    internalFn(effect, fn, cleanupSet, options)
  );

  return () => effectAndDescendantCleanup(effect);
}

function internalFn<T extends unknown[] = unknown[]>(
  effect: InternalEffectObject,
  fn: EffectFn,
  cleanupSet: Set<() => void> | undefined,
  options?: EffectOptions<T>
) {
  //set tracking to "implicit" to enable tracking by state and memos in `depArray`
  effect.tracking = "implicit";
  options?.deps?.forEach((state) => state());
  //set tracking back to "depArray" to disable other forms of implicit tracking
  //(only allow state and memos in `depArray` to track effect)
  effect.tracking = "depArray";
  //if effect is supposed to be deferred, do nothing on the first run
  if (effect.firstRun && options?.defer) {
    effect.firstRun = false;
  } else {
    const fnReturnValue = fn();
    //create `returnValueCleanup` to be called on next run of effect
    const returnValueCleanup = () => {
      if (typeof fnReturnValue === "function") {
        fnReturnValue();
      }
    };
    //add cleanup to obtain new return value
    cleanupSet?.add(returnValueCleanup);
  }
}
