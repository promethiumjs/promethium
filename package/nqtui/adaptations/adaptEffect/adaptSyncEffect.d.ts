import { EffectFn, EffectOptions, DepArray } from "./effectTypes";
export default function adaptSyncEffect<T extends any[] = any[]>(fn: EffectFn<T>, depArray?: DepArray<T>, options?: EffectOptions): () => void;
//# sourceMappingURL=adaptSyncEffect.d.ts.map