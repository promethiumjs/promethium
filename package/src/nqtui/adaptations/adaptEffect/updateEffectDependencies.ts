import { Getter } from "../adaptState/stateTypes";
import { baseExecuteFn } from "./baseExecuteFn";
import { InternalEffectObject } from "./effectTypes";

//created for the purpose of component-wrapping effects
export default function updateEffectDependencies<T>(
  effect: InternalEffectObject,
  depArray: Getter<T>[]
) {
  baseExecuteFn(effect, () => internalFn(effect, depArray));

  return effect.argsArray;
}

function internalFn<T>(effect: InternalEffectObject, depArray: Getter<T>[]) {
  effect.tracking = "implicit";
  effect.argsArray = depArray.map((state) => state());
  effect.tracking = "depArray";
}
