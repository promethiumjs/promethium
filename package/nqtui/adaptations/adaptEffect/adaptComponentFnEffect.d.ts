import { Getter } from "../adaptState/stateTypes";
import { EffectFn, EffectOptions } from "./effectTypes";
export default function adaptComponentFnEffect(fn: EffectFn, depArray?: Getter<any>[], options?: EffectOptions): (() => void) | readonly [() => void, () => any[], any[]];
//# sourceMappingURL=adaptComponentFnEffect.d.ts.map