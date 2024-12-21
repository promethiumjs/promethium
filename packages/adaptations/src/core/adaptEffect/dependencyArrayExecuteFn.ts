import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "../effectAndDescendantCeanup";
import {
  DepArray,
  InternalEffectObject,
  EffectFn,
  EffectOptions,
} from "./effectTypes";

export function dependencyArrayExecuteFn<T = any, U extends any[] = any[]>(
  effect: InternalEffectObject<T, U>,
  fn: EffectFn<T, U>,
  depArray: DepArray<U>,
  options: EffectOptions = {},
) {
  baseExecuteFn(effect, (cleanupSet) =>
    internalFn(effect, fn, depArray, options, cleanupSet),
  );

  return () => effectAndDescendantCleanup(effect);
}

function internalFn<T = any, U extends any[] = any[]>(
  effect: InternalEffectObject<T, U>,
  fn: EffectFn<T, U>,
  depArray: DepArray<U>,
  options: EffectOptions = {},
  cleanupSet: Set<() => void> | undefined,
) {
  //if effect is supposed to be deferred, do nothing on the first run
  if (effect.firstRun && options.defer) {
    effect.firstRun = false;
  } else {
    //call effect with previous return value and previous state values of tracking state and memos in an `argsArray`
    const fnReturnValue = fn(effect.returnValue, effect.argsArray);
    //create `returnValueCleanup` to be called on next run of effect
    const returnValueCleanup = () => {
      if (typeof fnReturnValue === "function") {
        //extract new `returnValue` from effect's returned function
        effect.returnValue = fnReturnValue() as T | undefined;
      }
    };

    //add cleanup to obtain new return value
    cleanupSet?.add(returnValueCleanup);
  }

  //set tracking to "implicit" to enable tracking by state and memos in `depArray`
  effect.tracking = "implicit";
  effect.argsArray = depArray.map((state) => state()) as U;
  //set tracking back to "depArray" to disable other forms of implicit tracking
  //(only allow state and memos in `depArray` to track effect)
  effect.tracking = "depArray";
}
