import createEffect from "./createEffect";
import {
  EffectFn,
  EffectOptions,
  ComponentFnExecuteFn,
  DepArray,
} from "./effectTypes";

export default function adaptComponentFnEffect<
  T = any,
  U extends any[] = any[]
>(fn: EffectFn<T, U>, depArray: DepArray<U>, options?: EffectOptions) {
  const [execute, effect] = createEffect("sync", "componentFn", fn, depArray);

  //return cleanup function / component cleanup array
  return execute(
    effect,
    fn,
    depArray,
    options
  ) as ReturnType<ComponentFnExecuteFn>;
}
