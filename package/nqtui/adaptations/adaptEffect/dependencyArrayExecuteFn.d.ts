import { Getter } from "../adaptState/stateTypes";
import { Effect, EffectFn, EffectOptions } from "./effectTypes";
export declare function dependencyArrayExecuteFn<T extends any[] = any[]>(effect: Effect, fn: EffectFn<T>, depArray: Getter[], options?: EffectOptions): () => void;
//# sourceMappingURL=dependencyArrayExecuteFn.d.ts.map