import { DepArray, InternalEffectObject, EffectFn, EffectOptions } from "./effectTypes";
export declare function dependencyArrayExecuteFn<T = any, U extends any[] = any[]>(effect: InternalEffectObject<T, U>, fn: EffectFn<T, U>, depArray: DepArray<U>, options?: EffectOptions): () => void;
//# sourceMappingURL=dependencyArrayExecuteFn.d.ts.map