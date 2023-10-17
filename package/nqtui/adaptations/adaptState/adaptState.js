import get from "../get";
import set from "./set";
export function adaptState(initialValue) {
    //create state object with three sets of subscriptions
    const state = {
        //one for sync effect subscriptions
        //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
        //and running of effects resulting in stack overflow)
        syncSubscriptions: {
            one: new Set(),
            two: new Set(),
        },
        //one for memo subscriptions
        //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
        //and running of memos resulting in stack overflow)
        memoSubscriptions: {
            one: new Set(),
            two: new Set(),
        },
        //one for async and render effect subscriptions
        //one set is enough to manage asynchronous effects
        asyncAndRenderSubscriptions: new Set(),
        //use variable to effectively switch between subscription sets (for sync effects and memos)
        activeSubscriptions: "one",
        value: typeof initialValue === "function"
            ? initialValue()
            : initialValue,
    };
    const getter = () => get(state);
    const setter = (nextValue) => set(state, nextValue);
    return [getter, setter];
}
