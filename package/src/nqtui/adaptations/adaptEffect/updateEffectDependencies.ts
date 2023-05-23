import { Getter } from "../adaptState/stateTypes";
import { baseExecuteFn } from "./baseExecuteFn";
import { Effect } from "./effectTypes";

//created for the purpose of component-wrapping effects
export default function updateEffectDependencies(
  effect: Effect,
  depArray: Getter[]
) {
  baseExecuteFn(effect, () => internalFn(effect, depArray));

  return effect.argsArray;
}

function internalFn(effect: Effect, depArray: Getter[]) {
  effect.tracking = "implicit";
  effect.argsArray = depArray.map((state) => state());
  effect.tracking = "depArray";
}
