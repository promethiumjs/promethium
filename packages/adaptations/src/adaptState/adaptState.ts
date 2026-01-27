import {
  imperativeUpdate,
  Signal,
  type SignalOptions,
} from "../signals/signals.js";

export interface AdaptedState<T> {
  name?: string;
  get(): T;
  set(value: T): void;
  peek(): T;
  mutate(fn: () => void): void;
  subscribe(fn: (value: T) => void): () => void;
}

export interface AdaptStateOptions<T> extends SignalOptions<T> {}

export function adaptState<T>(
  value: T,
  options?: SignalOptions<T>
): AdaptedState<T>;
export function adaptState<T = undefined>(): AdaptedState<T | undefined>;
export function adaptState<T>(
  value?: T,
  options?: SignalOptions<T>
): AdaptedState<T> {
  const s = new Signal(value, options);

  return {
    name: s.name,
    get: () => s.value,
    set: (value: T) => {
      s.value = value;
    },
    mutate: (fn: () => void) => {
      fn();
      s.value = imperativeUpdate;
    },
    peek: () => s.peek(),
    subscribe: (fn) => s.subscribe(fn),
  };
}
