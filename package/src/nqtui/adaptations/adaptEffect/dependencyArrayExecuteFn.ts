import { Getter } from "../adaptState/stateTypes";
import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "./effectAndDescendantCeanup";
import { Effect, EffectFn, EffectOptions } from "./effectTypes";

export function dependencyArrayExecuteFn<T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>,
  depArray: Getter[],
  options: EffectOptions = {}
) {
  baseExecuteFn(effect, (cleanupSet) =>
    internalFn(effect, fn, depArray, options, cleanupSet)
  );

  return () => effectAndDescendantCleanup(effect);
}

function internalFn<T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>,
  depArray: Getter[],
  options: EffectOptions = {},
  cleanupSet: Set<() => void> | undefined
) {
  //if effect is supposed to be deferred, do nothing on the first run
  if (effect.firstRun && options.defer) {
    effect.firstRun = false;
  } else {
    //call effect with previous return value and previous state values of tracking state and memos in an `argsArray`
    const fnReturnValue = fn(effect.argsArray as T);
    //create `returnValueCleanup` to be called on next run of effect
    const returnValueCleanup = () => {
      if (typeof fnReturnValue === "function") {
        fnReturnValue();
      }
    };

    //add cleanup to obtain new return value
    cleanupSet?.add(returnValueCleanup);
  }

  //set tracking to "implicit" to enable tracking by state and memos in `depArray`
  effect.tracking = "implicit";
  effect.argsArray = depArray.map((state) => state());
  //set tracking back to "depArray" to disable other forms of implicit tracking
  //(only allow state and memos in `depArray` to track effect)
  effect.tracking = "depArray";
}
