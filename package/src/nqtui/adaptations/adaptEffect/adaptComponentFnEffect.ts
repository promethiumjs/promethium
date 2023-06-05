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
  const [execute, effect] = createEffect(
    "sync",
    "componentFn",
    fn as EffectFn,
    depArray
  );

  //return cleanup function / component cleanup array
  return execute(
    effect,
    fn as EffectFn,
    depArray,
    options
  ) as ReturnType<ComponentFnExecuteFn>;
}
