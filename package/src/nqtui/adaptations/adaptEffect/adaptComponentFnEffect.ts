import { Getter } from "../adaptState/stateTypes";
import createEffect from "./createEffect";
import { EffectFn, EffectOptions } from "./effectTypes";

export default function adaptComponentFnEffect(
  fn: EffectFn,
  depArray?: Getter<any>[],
  options?: EffectOptions
) {
  const [execute, effect] = createEffect("sync", "componentFn", fn, depArray);

  //return cleanup function / component cleanup array
  return execute(effect, fn, depArray, options);
}
