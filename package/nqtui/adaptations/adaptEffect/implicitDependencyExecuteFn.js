import { baseExecuteFn } from "./baseExecuteFn";
import effectAndDescendantCleanup from "./effectAndDescendantCeanup";
export default function implicitDependencyExecuteFn(effect, fn) {
    baseExecuteFn(effect, (cleanupSet) => internalFn(effect, fn, cleanupSet));
    //return cleanup function for effect and its descendants
    return () => effectAndDescendantCleanup(effect);
}
function internalFn(effect, fn, cleanupSet) {
    //call effect with previous return value
    const fnReturnValue = fn(effect.returnValue);
    //create `returnValueCleanup` to be called on next run of effect
    const returnValueCleanup = () => {
        if (typeof fnReturnValue === "function") {
            //extract new `returnValue` from effect's returned function
            effect.returnValue = fnReturnValue();
        }
    };
    cleanupSet === null || cleanupSet === void 0 ? void 0 : cleanupSet.add(returnValueCleanup);
}
