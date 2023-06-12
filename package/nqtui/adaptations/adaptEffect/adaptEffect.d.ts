import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptEffect<T = any, U extends any[] = any[]>(fn: EffectFn<T, U>, depArray?: DepArray<U>, options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptEffect.d.ts.map