import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "../effectAndDescendantCeanup";
import { InternalEffectObject, EffectFn } from "./effectTypes";

export default function implicitDependencyExecuteFn<
  T extends unknown[] = unknown[],
  U extends unknown = unknown
>(effect: InternalEffectObject<T, U>, fn: EffectFn<T, U>) {
  baseExecuteFn(effect, (cleanupSet) => internalFn(effect, fn, cleanupSet));

  //return cleanup function for effect and its descendants
  return () => effectAndDescendantCleanup(effect);
}

function internalFn<
  T extends unknown[] = unknown[],
  U extends unknown = unknown
>(
  effect: InternalEffectObject<T, U>,
  fn: EffectFn<T, U>,
  cleanupSet: Set<() => void> | undefined
) {
  //call effect with previous return value
  const fnReturnValue = fn(effect.returnValue);
  //create `returnValueCleanup` to be called on next run of effect
  const returnValueCleanup = () => {
    if (typeof fnReturnValue === "function") {
      //extract new `returnValue` from effect's returned function
      effect.returnValue = fnReturnValue();
    }
  };

  cleanupSet?.add(returnValueCleanup);
}
