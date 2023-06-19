import { Getter } from "../adaptState/stateTypes";

export type CleanupTree = Map<number, CleanupTree | Set<() => void>>;

export type InternalEffectObject<T = any, U extends any[] = any[]> = {
  firstRun: boolean;
  type: "async" | "sync" | "render" | "memo";
  tracking?: "implicit" | "depArray" | "componentFn";
  childCount: number;
  position: number | null;
  level: number | null;
  cleanupTree: CleanupTree | null;
  cleanupTreeNodePointer: number[] | null;
  observableSubscriptionSets: Set<Set<InternalEffectObject>>;
  staleStateValuesCount: number;
  returnValue?: T;
  argsArray?: U;
  sendSignal: (signal: "stale" | "fresh") => void;
};

export type EffectOptions = {
  defer?: boolean;
  // isComponent?: boolean; // commented out because this option is only used internally
};

export type EffectFn<T = any, U extends any[] = any[]> = (
  returnValue?: T,
  argsArray?: U
) => (() => T) | void;

export type DepArray<U extends any[] = any[]> = {
  [I in keyof U]: Getter<U[I]>;
};

export type ExecuteFn = <T = any, U extends any[] = any[]>(
  effect: InternalEffectObject,
  fn: EffectFn<T, U>,
  depArray?: DepArray<U>,
  options?: EffectOptions
) => () => void;

export type ComponentFnExecuteFn = <T = any, U extends any[] = any[]>(
  effect: InternalEffectObject,
  fn: EffectFn<T, U>,
  depArray: DepArray<U>,
  options?: EffectOptions
) => readonly [() => void, () => any[], any[]] | (() => void);
