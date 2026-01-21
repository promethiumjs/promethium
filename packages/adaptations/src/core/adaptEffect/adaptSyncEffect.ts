import { createEffect } from "./createEffect.js";
import { EffectFn, EffectOptions, ExecuteFn } from "./effectTypes.js";

export function adaptSyncEffect<T extends unknown[]>(
  fn: EffectFn,
  options?: EffectOptions<T>
) {
  //determine if the effect is tracked by the state it uses implicitly, or using the
  //state provided by its dependency array
  const tracking =
    typeof options?.deps === "undefined" ? "implicit" : "depArray";

  const [execute, effect] = createEffect("sync", tracking, fn, options);

  //return cleanup function / component cleanup array
  return execute(effect, fn, options) as ReturnType<ExecuteFn>;
}
