import { baseExecuteFn } from "./baseExecuteFn";
//created for the purpose of component-wrapping effects
export default function updateEffectDependencies(effect, depArray) {
    baseExecuteFn(effect, () => internalFn(effect, depArray));
    return effect.argsArray;
}
function internalFn(effect, depArray) {
    effect.tracking = "implicit";
    effect.argsArray = depArray.map((state) => state());
    effect.tracking = "depArray";
}
