import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptRenderEffect<T = any, U extends any[] = any[]>(fn: EffectFn<T, U>, depArray?: DepArray<U>, options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptRenderEffect.d.ts.map