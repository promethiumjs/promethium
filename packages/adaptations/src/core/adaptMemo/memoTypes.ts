import { InternalEffectObject } from "../adaptEffect/effectTypes.js";
import { InternalStateObject } from "../adaptState/stateTypes.js";

export type InternalMemoObject<T> = InternalStateObject<T> &
  InternalEffectObject;

export type MemoFn<T extends unknown = unknown> = () => T;
