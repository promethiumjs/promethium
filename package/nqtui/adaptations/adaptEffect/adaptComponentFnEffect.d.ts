import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptComponentFnEffect<T extends any[] = any[]>(fn: EffectFn<T>, depArray: DepArray<T>, options?: EffectOptions): readonly [() => void, () => any[], any[]] | (() => void);
//# sourceMappingURL=adaptComponentFnEffect.d.ts.map