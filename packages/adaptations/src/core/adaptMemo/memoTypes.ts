import { InternalEffectObject } from "../adaptEffect/effectTypes";
import { InternalStateObject } from "../adaptState/stateTypes";

export type InternalMemoObject<T> = InternalStateObject<T> &
  InternalEffectObject;

export type MemoFn<T extends unknown = unknown, U extends unknown = unknown> = (
  prev?: NoInfer<U>
) => T;
