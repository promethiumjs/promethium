import { Getter } from "../adaptState/stateTypes";
import { Effect, EffectFn } from "./effectTypes";
export default function createEffect(type: "async" | "sync" | "render", tracking: "implicit" | "depArray" | "componentFn", fn: EffectFn, depArray?: Getter<any>[]): readonly [typeof import("./implicitDependencyExecuteFn").default | typeof import("./dependencyArrayExecuteFn").dependencyArrayExecuteFn | typeof import("./componentFnExecuteFn").componentFnExecuteFn, Effect];
//# sourceMappingURL=createEffect.d.ts.map