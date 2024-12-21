import { InternalEffectObject } from "../adaptEffect/effectTypes";
import { InternalStateObject } from "../adaptState/stateTypes";

export type InternalMemoObject = InternalStateObject & InternalEffectObject;
