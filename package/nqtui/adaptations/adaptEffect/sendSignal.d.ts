import { Getter } from "../adaptState/stateTypes";
import { ComponentFnExecuteFn, Effect, EffectFn, ExecuteFn } from "./effectTypes";
export default function sendSignal(effect: Effect, execute: ExecuteFn | ComponentFnExecuteFn, fn: EffectFn, depArray: Getter[], signal: "stale" | "fresh"): void;
//# sourceMappingURL=sendSignal.d.ts.map