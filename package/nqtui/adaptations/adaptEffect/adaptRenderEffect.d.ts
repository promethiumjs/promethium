import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptRenderEffect<T extends any[] = any[]>(fn: EffectFn<T>, depArray?: DepArray<T>, options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptRenderEffect.d.ts.map