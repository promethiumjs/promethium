import { Getter } from "../adaptState/stateTypes";
import { EffectFn, EffectOptions } from "./effectTypes";
export default function adaptRenderEffect(fn: EffectFn, depArray?: Getter<any>[], options?: EffectOptions): Promise<() => void>;
//# sourceMappingURL=adaptRenderEffect.d.ts.map