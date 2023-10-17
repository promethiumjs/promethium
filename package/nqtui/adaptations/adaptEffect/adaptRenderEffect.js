import createEffect from "./createEffect";
export default function adaptRenderEffect(fn, depArray, options) {
    //determine if the effect is tracked by the state it uses implicitly, or using the
    //state provided by its dependency array
    const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";
    const [execute, effect] = createEffect("render", tracking, fn, depArray);
    //execute effect asynchronously before next screen paint and return a promise that
    //resolves with the cleanup function / component cleanup array
    return new Promise((resolve) => {
        queueMicrotask(() => resolve(execute(effect, fn, depArray, options)));
    });
}
