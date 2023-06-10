import { Getter } from "../adaptState/stateTypes";
import addAsyncEffect from "./addAsyncEffect";
import addRenderEffect from "./addRenderEffect";
import {
  ComponentFnExecuteFn,
  Effect,
  EffectFn,
  ExecuteFn,
} from "./effectTypes";

export default function sendSignal<T extends any[] = any[]>(
  effect: Effect,
  execute: ExecuteFn | ComponentFnExecuteFn,
  fn: EffectFn<T>,
  depArray: Getter[],
  signal: "stale" | "fresh"
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
  sync: <T extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T>,
    depArray: Getter[]
  ) => execute(effect, fn, depArray),
  async: <T extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T>,
    depArray: Getter[]
  ) => addAsyncEffect(() => execute(effect, fn, depArray)),
  render: <T extends any[] = any[]>(
    effect: Effect,
    execute: ExecuteFn | ComponentFnExecuteFn,
    fn: EffectFn<T>,
    depArray: Getter[]
  ) => addRenderEffect(() => execute(effect, fn, depArray)),
};
