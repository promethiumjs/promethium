import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptSyncEffect<T = any, U extends any[] = any[]>(fn: EffectFn<T, U>, depArray?: DepArray<U>, options?: EffectOptions): () => void;
//# sourceMappingURL=adaptSyncEffect.d.ts.map