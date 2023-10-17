import createEffect from "./createEffect";
export default function adaptSyncEffect(fn, depArray, options) {
    //determine if the effect is tracked by the state it uses implicitly, or using the
    //state provided by its dependency array
    const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";
    const [execute, effect] = createEffect("sync", tracking, fn, depArray);
    //return cleanup function / component cleanup array
    return execute(effect, fn, depArray, options);
}
