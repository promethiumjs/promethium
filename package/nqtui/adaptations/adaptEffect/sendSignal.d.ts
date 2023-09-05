import { DepArray, InternalEffectObject, EffectFn, ExecuteFn } from "./effectTypes";
export default function sendSignal<T = any, U extends any[] = any[]>(effect: InternalEffectObject, execute: ExecuteFn, fn: EffectFn<T, U>, signal: "stale" | "fresh", depArray?: DepArray<U>): void;
//# sourceMappingURL=sendSignal.d.ts.map