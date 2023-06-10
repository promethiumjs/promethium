import { Getter } from "../adaptState/stateTypes";

export type CleanupTree = Map<number, CleanupTree | Set<() => void>>;

export type Effect<T extends any[] = any[]> = {
  firstRun: boolean;
  type: "async" | "sync" | "render" | "memo";
  tracking?: "implicit" | "depArray" | "componentFn";
  childCount: number;
  position: number | null;
  level: number | null;
  cleanupTree: CleanupTree | null;
  cleanupTreeNodePointer: number[] | null;
  observableSubscriptionSets: Set<Set<Effect>>;
  staleStateValuesCount: number;
  argsArray?: T;
  sendSignal: (signal: "stale" | "fresh") => void;
};

export type EffectOptions = {
  defer?: boolean;
  isComponent?: boolean;
};

export type EffectFn<T extends any[] = any[]> = (
  argsArray?: T
) => (() => void) | void;

export type DepArray<U extends ReadonlyArray<any>> = {
  [I in keyof U]: Getter<U[I]>;
};

export type ExecuteFn = <T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>,
  depArray?: Getter<any>[],
  options?: EffectOptions
) => () => void;

export type ComponentFnExecuteFn = <T extends any[] = any[]>(
  effect: Effect,
  fn: EffectFn<T>,
  depArray: Getter<any>[],
  options?: EffectOptions
) => readonly [() => void, () => any[], any[]] | (() => void);
