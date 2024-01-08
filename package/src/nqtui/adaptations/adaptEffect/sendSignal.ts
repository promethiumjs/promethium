import addAsyncEffect from "./addAsyncEffect";
import addRenderEffect from "./addRenderEffect";
import {
  DepArray,
  InternalEffectObject,
  EffectFn,
  ExecuteFn,
  SignalTypes,
} from "./effectTypes";

export default function sendSignal<T = any, U extends any[] = any[]>(
  effect: InternalEffectObject,
  execute: ExecuteFn,
  fn: EffectFn<T, U>,
  signal: SignalTypes,
  depArray?: DepArray<U>,
) {
  if (signal === "stale") {
    effect.staleStateValuesCount++;
    effect.falseAlarmSignalsCount++;
  } else if (signal === "fresh" || signal === "falseAlarm") {
    effect.staleStateValuesCount--;
    if (signal === "falseAlarm") {
      effect.falseAlarmSignalsCount--;
    }
    if (effect.staleStateValuesCount <= 0) {
      if (effect.falseAlarmSignalsCount > 0) {
        executeMap[effect.type as "sync" | "render" | "async"](
          effect,
          execute,
          fn,
          depArray,
        );
      }
      effect.falseAlarmSignalsCount = 0;
      effect.staleStateValuesCount = 0;
    }
  }
}

const executeMap = {
  sync: <T = any, U extends any[] = any[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>,
  ) => execute(effect, fn, depArray!),
  async: <T = any, U extends any[] = any[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>,
  ) => addAsyncEffect(() => execute(effect, fn, depArray!)),
  render: <T = any, U extends any[] = any[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn<T, U>,
    depArray?: DepArray<U>,
  ) => addRenderEffect(() => execute(effect, fn, depArray!)),
};
