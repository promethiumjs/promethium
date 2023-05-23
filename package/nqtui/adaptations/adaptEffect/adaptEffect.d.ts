import { Getter } from "../adaptState/stateTypes";
import { EffectFn, EffectOptions } from "./effectTypes";
export default function adaptEffect(fn: EffectFn, depArray?: Getter<any>[], options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptEffect.d.ts.map