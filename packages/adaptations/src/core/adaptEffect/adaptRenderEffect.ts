import { createEffect } from "./createEffect.js";
import { EffectFn, EffectOptions, ExecuteFn } from "./effectTypes.js";

export function adaptRenderEffect<T extends unknown[]>(
  fn: EffectFn,
  options?: EffectOptions<T>
) {
  //determine if the effect is tracked by the state it uses implicitly, or using the
  //state provided by its dependency array
  const tracking =
    typeof options?.deps === "undefined" ? "implicit" : "depArray";

  const [execute, effect] = createEffect("render", tracking, fn, options);

  //execute effect asynchronously before next screen paint and return a promise that
  //resolves with the cleanup function / component cleanup array
  return new Promise<() => void>((resolve) => {
    queueMicrotask(() =>
      resolve(execute(effect, fn, options) as ReturnType<ExecuteFn>)
    );
  });
}
