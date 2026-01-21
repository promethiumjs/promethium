import { addAsyncEffect } from "./addAsyncEffect.js";
import { addRenderEffect } from "./addRenderEffect.js";
import {
  InternalEffectObject,
  EffectFn,
  ExecuteFn,
  SignalTypes,
  EffectOptions,
} from "./effectTypes.js";

export function sendSignal<T extends unknown[] = unknown[]>(
  effect: InternalEffectObject,
  execute: ExecuteFn,
  fn: EffectFn,
  signal: SignalTypes,
  options?: EffectOptions<T>
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
          options
        );
      }
      effect.falseAlarmSignalsCount = 0;
      effect.staleStateValuesCount = 0;
    }
  }
}

const executeMap = {
  sync: <T extends unknown[] = unknown[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn,
    options?: EffectOptions<T>
  ) => execute(effect, fn, options),
  async: <T extends unknown[] = unknown[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn,
    options?: EffectOptions<T>
  ) => addAsyncEffect(() => execute(effect, fn, options)),
  render: <T extends unknown[] = unknown[]>(
    effect: InternalEffectObject,
    execute: ExecuteFn,
    fn: EffectFn,
    options?: EffectOptions<T>
  ) => addRenderEffect(() => execute(effect, fn, options)),
};
