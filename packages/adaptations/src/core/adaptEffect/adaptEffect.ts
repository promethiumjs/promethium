import { EffectFn, EffectOptions, ExecuteFn } from "./effectTypes.js";
import { createEffect } from "./createEffect.js";

export function adaptEffect<T extends unknown[]>(
  fn: EffectFn,
  options?: EffectOptions<T>
) {
  //determine if the effect is tracked by the state it uses implicitly, or using the
  //state provided by its dependency array
  const tracking =
    typeof options?.deps === "undefined" ? "implicit" : "depArray";

  const [execute, effect] = createEffect("async", tracking, fn, options);

  //execute effect asynchronously after next screen paint and return a promise that
  //resolves with the cleanup function / component cleanup array
  return new Promise<() => void>((resolve) =>
    setTimeout(() => {
      resolve(execute(effect, fn, options) as ReturnType<ExecuteFn>);
    })
  );
}
