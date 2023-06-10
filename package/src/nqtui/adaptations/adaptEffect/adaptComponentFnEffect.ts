import createEffect from "./createEffect";
import {
  EffectFn,
  EffectOptions,
  ComponentFnExecuteFn,
  DepArray,
} from "./effectTypes";

export default function adaptComponentFnEffect<T extends any[] = any[]>(
  fn: EffectFn<T>,
  depArray: DepArray<T>,
  options?: EffectOptions
) {
  const [execute, effect] = createEffect("sync", "componentFn", fn, depArray);

  //return cleanup function / component cleanup array
  return execute(
    effect,
    fn,
    depArray,
    options
  ) as ReturnType<ComponentFnExecuteFn>;
}
