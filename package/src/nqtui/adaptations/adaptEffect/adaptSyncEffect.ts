import createEffect from "./createEffect";
import { EffectFn, EffectOptions, ExecuteFn, DepArray } from "./effectTypes";

export default function adaptSyncEffect<T extends any[] = any[]>(
  fn: EffectFn<T>,
  depArray?: DepArray<T>,
  options?: EffectOptions
) {
  //determine if the effect is tracked by the state it uses implicitly, or using the
  //state provided by its dependency array
  const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";

  const [execute, effect] = createEffect("sync", tracking, fn, depArray);

  //return cleanup function / component cleanup array
  return execute(effect, fn, depArray!, options) as ReturnType<ExecuteFn>;
}
