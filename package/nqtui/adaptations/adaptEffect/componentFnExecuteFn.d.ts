import { Getter } from "../adaptState/stateTypes";
import { Effect, EffectFn, EffectOptions } from "./effectTypes";
export declare function componentFnExecuteFn<T extends any[] = any[]>(effect: Effect, fn: EffectFn<T>, depArray: Getter[], options?: EffectOptions): readonly [() => void, () => any[] | undefined, any[] | undefined];
export default function internalFn<T extends any[] = any[]>(effect: Effect, fn: EffectFn<T>, depArray: Getter[], options: EffectOptions | undefined, cleanupSet: Set<() => void> | undefined): void;
//# sourceMappingURL=componentFnExecuteFn.d.ts.map