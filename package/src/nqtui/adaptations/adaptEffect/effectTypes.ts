import { Getter } from "../adaptState/stateTypes";

export type CleanupTree = Map<number, CleanupTree | Set<() => void>>;

export type Effect = {
  firstRun: boolean;
  type: "async" | "sync" | "render" | "memo";
  tracking?: "implicit" | "depArray" | "componentFn";
  childCount: number;
  position: number | null;
  level: number | null;
  cleanupTree: CleanupTree;
  cleanupTreeNodePointer: number[];
  observableSubscriptionSets: Set<Set<Effect>>;
  staleStateValuesCount: number;
  returnValue?: any;
  argsArray?: any[];
  sendSignal: (signal: "stale" | "fresh") => void;
};

export type EffectOptions = {
  defer?: boolean;
  isComponent?: boolean;
};

export type EffectFn = (returnValue?: any, argsArray?: any[]) => any | void;

export type ExecuteFn = (
  effect: Effect,
  fn: EffectFn,
  depArray: Getter<any>[],
  options?: EffectOptions
) => () => void;

export type ComponentFnExecuteFn = (
  effect: Effect,
  fn: EffectFn,
  depArray: Getter<any>[],
  options?: EffectOptions
) => readonly [() => void, () => any[], any[]] | (() => void);
