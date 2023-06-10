import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptEffect<T extends any[] = any[]>(fn: EffectFn<T>, depArray?: DepArray<T>, options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptEffect.d.ts.map