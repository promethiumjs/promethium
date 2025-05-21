import { Getter } from "../adaptState/stateTypes";

export type CleanupTree = Map<number, CleanupTree | Set<() => void>>;

export type SignalTypes = "stale" | "fresh" | "falseAlarm";

export type InternalEffectObject<
  T extends unknown[] = unknown[],
  U extends unknown = unknown
> = {
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
  returnValue?: U;
  argsArray?: T;
  sendSignal: (signal: SignalTypes) => void;
};

export type EffectOptions = {
  defer?: boolean;
};

export type EffectFn<
  T extends unknown[] = unknown[],
  U extends unknown = unknown,
  V extends U = U
> = (
  prev?: U,
  input?: T,
  prevInput?: T
) => (() => V) | void | Promise<() => V> | Promise<void>;

// transforms a tuple to an tuple of getters in a way that allows generics to be inferred
export type DepArray<T extends unknown[] = unknown[]> = [
  ...Extract<{ [K in keyof T]: Getter<T[K]> }, readonly unknown[]>
];

export type ExecuteFn = <
  T extends unknown[] = unknown[],
  U extends unknown = unknown
>(
  effect: InternalEffectObject,
  fn: EffectFn<T, U>,
  depArray?: DepArray<T>,
  options?: EffectOptions
) => () => void;
