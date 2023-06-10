import { Getter } from "../adaptState/stateTypes";
import { Effect, EffectFn } from "./effectTypes";
export default function createEffect<T extends any[] = any[]>(type: "async" | "sync" | "render", tracking: "implicit" | "depArray" | "componentFn", fn: EffectFn<T>, depArray?: Getter<any>[]): readonly [typeof import("./implicitDependencyExecuteFn").default | typeof import("./dependencyArrayExecuteFn").dependencyArrayExecuteFn | typeof import("./componentFnExecuteFn").componentFnExecuteFn, Effect<any[]>];
//# sourceMappingURL=createEffect.d.ts.map