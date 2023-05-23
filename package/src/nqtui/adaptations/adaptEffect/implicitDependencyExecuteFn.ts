import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "./effectAndDescendantCeanup";
import { Effect, EffectFn } from "./effectTypes";

export default function implicitDependencyExecuteFn(
  effect: Effect,
  fn: EffectFn
) {
  baseExecuteFn(effect, (cleanupSet) => internalFn(effect, fn, cleanupSet));

  //return cleanup function for effect and its descendants
  return () => effectAndDescendantCleanup(effect);
}

function internalFn(effect: Effect, fn: EffectFn, cleanupSet: Set<() => void>) {
  //call effect with previous return value
  const fnReturnValue = fn(effect.returnValue);
  //create `returnValueCleanup` to be called on next run of effect
  const returnValueCleanup = () => {
    if (typeof fnReturnValue === "function") {
      //extract new `returnValue` from effect's returned function
      effect.returnValue = fnReturnValue();
    }
  };

  cleanupSet.add(returnValueCleanup);
}
