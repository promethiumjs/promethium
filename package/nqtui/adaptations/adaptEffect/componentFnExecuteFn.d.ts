import { Getter } from "../adaptState/stateTypes";
import { Effect, EffectFn, EffectOptions } from "./effectTypes";
export declare function componentFnExecuteFn(effect: Effect, fn: EffectFn, depArray: Getter[], options?: EffectOptions): readonly [() => void, () => any[], any[]];
export default function internalFn(effect: Effect, fn: EffectFn, depArray: Getter[], options: EffectOptions, cleanupSet: Set<() => void>): void;
//# sourceMappingURL=componentFnExecuteFn.d.ts.map