import { Effect, EffectFn } from "./effectTypes";
export default function implicitDependencyExecuteFn<T = any, U extends any[] = any[]>(effect: Effect<T, U>, fn: EffectFn<T, U>): () => void;
//# sourceMappingURL=implicitDependencyExecuteFn.d.ts.map