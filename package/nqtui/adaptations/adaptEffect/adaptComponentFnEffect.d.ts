import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptComponentFnEffect<T = any, U extends any[] = any[]>(fn: EffectFn<T, U>, depArray: DepArray<U>, options?: EffectOptions): readonly [() => void, () => any[], any[]] | (() => void);
//# sourceMappingURL=adaptComponentFnEffect.d.ts.map