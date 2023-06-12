import { DepArray, Effect, EffectFn, EffectOptions } from "./effectTypes";
export declare function componentFnExecuteFn<T = any, U extends any[] = any[]>(effect: Effect<T, U>, fn: EffectFn<T, U>, depArray: DepArray<U>, options?: EffectOptions): readonly [() => void, () => any[] | undefined, U | undefined];
export default function internalFn<T = any, U extends any[] = any[]>(effect: Effect<T, U>, fn: EffectFn<T, U>, depArray: DepArray<U>, options: EffectOptions | undefined, cleanupSet: Set<() => void> | undefined): void;
//# sourceMappingURL=componentFnExecuteFn.d.ts.map