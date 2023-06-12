import { ComponentFnExecuteFn, DepArray, Effect, EffectFn, ExecuteFn } from "./effectTypes";
export default function sendSignal<T = any, U extends any[] = any[]>(effect: Effect, execute: ExecuteFn | ComponentFnExecuteFn, fn: EffectFn<T, U>, signal: "stale" | "fresh", depArray?: DepArray<U>): void;
//# sourceMappingURL=sendSignal.d.ts.map