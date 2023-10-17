import { effectContexts } from "../effectContexts";
import getCleanupNode from "../getCleanupNode";
import observableSubscriptionsCleanup from "../observableSubscriptionsCleanup";
export function baseExecuteFn(effect, fn) {
    var _a;
    //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
    effect.childCount = 0;
    //fire cleanups make sure proceedings go smoothly
    const cleanupSet = (_a = getCleanupNode(effect)) === null || _a === void 0 ? void 0 : _a.get(0);
    cleanupSet === null || cleanupSet === void 0 ? void 0 : cleanupSet.forEach((cleanup) => {
        cleanup();
    });
    cleanupSet === null || cleanupSet === void 0 ? void 0 : cleanupSet.clear();
    //push effect onto context to enable tracking by state and memos
    effectContexts.push(effect);
    fn(cleanupSet);
    //add cleanup to remove effect from all old subscriptions
    cleanupSet === null || cleanupSet === void 0 ? void 0 : cleanupSet.add(() => observableSubscriptionsCleanup(effect));
    //remove effect from context to disable tracking by state and memos
    effectContexts.pop();
}
