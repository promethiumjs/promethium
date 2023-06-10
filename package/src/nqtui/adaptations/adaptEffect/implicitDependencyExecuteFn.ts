import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "./effectAndDescendantCeanup";
import { Effect, EffectFn } from "./effectTypes";

export default function implicitDependencyExecuteFn<T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>
) {
  baseExecuteFn(effect, (cleanupSet) => internalFn(effect, fn, cleanupSet));

  //return cleanup function for effect and its descendants
  return () => effectAndDescendantCleanup(effect);
}

function internalFn<T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>,
  cleanupSet: Set<() => void> | undefined
) {
  //call effect with previous return value
  const fnReturnValue = fn();
  //create `returnValueCleanup` to be called on next run of effect
  const returnValueCleanup = () => {
    if (typeof fnReturnValue === "function") {
      fnReturnValue();
    }
  };

  cleanupSet?.add(returnValueCleanup);
}
