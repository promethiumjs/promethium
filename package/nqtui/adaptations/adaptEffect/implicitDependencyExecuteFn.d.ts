import { Effect, EffectFn } from "./effectTypes";
export default function implicitDependencyExecuteFn<T extends any[] = any[]>(effect: Effect, fn: EffectFn<T>): () => void;
//# sourceMappingURL=implicitDependencyExecuteFn.d.ts.map