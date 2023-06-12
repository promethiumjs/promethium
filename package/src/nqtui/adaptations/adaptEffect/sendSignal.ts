import { Getter } from "../adaptState/stateTypes";
import addAsyncEffect from "./addAsyncEffect";
import addRenderEffect from "./addRenderEffect";
import {
  ComponentFnExecuteFn,
  DepArray,
  Effect,
  EffectFn,
  ExecuteFn,
} from "./effectTypes";

export default function sendSignal<T = any, U extends any[] = any[]>(
  effect: Effect,
  execute: ExecuteFn | ComponentFnExecuteFn,
  fn: EffectFn<T, U>,
  signal: "stale" | "fresh",
  depArray?: DepArray<U>
) {
  if (signal === "stale") {
    effect.staleStateValuesCount++;
  } else if (signal === "fresh") {
    effect.staleStateValuesCount--;
    if (effect.staleStateValuesCount <= 0) {
      //to make sure "effect.stateStateValuesCount" doesn't go beyond zero
      effect.staleStateValuesCount = 0;
      executeMap[effect.type as "sync" | "render" | "async"](
        effect,
        execute,
        fn,
        depArray
      );
    }
  }
}

const executeMap = {
  sync: <T = any, U extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>
  ) => execute(effect, fn, depArray!),
  async: <T = any, U extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>
  ) => addAsyncEffect(() => execute(effect, fn, depArray!)),
  render: <T = any, U extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>
  ) => addRenderEffect(() => execute(effect, fn, depArray!)),
};
