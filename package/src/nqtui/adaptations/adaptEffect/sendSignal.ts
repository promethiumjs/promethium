import { Getter } from "../adaptState/stateTypes";
import addAsyncEffect from "./addAsyncEffect";
import addRenderEffect from "./addRenderEffect";
import {
  ComponentFnExecuteFn,
  Effect,
  EffectFn,
  ExecuteFn,
} from "./effectTypes";

export default function sendSignal(
  effect: Effect,
  execute: ExecuteFn | ComponentFnExecuteFn,
  fn: EffectFn,
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
      executeMap[effect.type](effect, execute, fn, depArray);
    }
  }
}

const executeMap = {
  sync: (
    effect: Effect,
    execute: ExecuteFn,
    fn: EffectFn,
    depArray: Getter[]
  ) => execute(effect, fn, depArray),
  async: (
    effect: Effect,
    execute: ExecuteFn,
    fn: EffectFn,
    depArray: Getter[]
  ) => addAsyncEffect(() => execute(effect, fn, depArray)),
  render: (
    effect: Effect,
    execute: ExecuteFn,
    fn: EffectFn,
    depArray: Getter[]
  ) => addRenderEffect(() => execute(effect, fn, depArray)),
};
