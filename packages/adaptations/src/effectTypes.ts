import { Getter } from "../adaptState/stateTypes.js";

export type CleanupTree = Map<number, CleanupTree | Set<() => void>>;

export type SignalTypes = "stale" | "fresh" | "falseAlarm";

export type InternalEffectObject = {
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
  falseAlarmSignalsCount: number;
  sendSignal: (signal: SignalTypes) => void;
};

export type EffectOptions<T extends unknown[] = unknown[]> = {
  defer?: boolean;
  deps?: DepArray<T>;
};

export type EffectFn = () =>
  | (() => void)
  | void
  | Promise<() => void>
  | Promise<void>;

// transforms a tuple to an tuple of getters in a way that allows generics to be inferred
export type DepArray<T extends unknown[] = unknown[]> = [
  ...Extract<{ [K in keyof T]: Getter<T[K]> }, readonly unknown[]>
];

export type ExecuteFn = <T extends unknown[] = unknown[]>(
  effect: InternalEffectObject,
  fn: EffectFn,
  options?: EffectOptions<T>
) => () => void;
