import { Computed, type SignalOptions } from "../signals/signals.js";

export interface AdaptedMemo<T> {
  name?: string;
  get(): T;
  peek(): T;
  subscribe(fn: (value: T) => void): () => void;
}

export interface AdaptMemoOptions<T> extends SignalOptions<T> {}

export function adaptMemo<T>(
  fn: () => T,
  options?: AdaptMemoOptions<T>
): AdaptedMemo<T> {
  const c = new Computed(fn, options);

  return {
    name: c.name,
    get: () => c.value,
    peek: () => c.peek(),
    subscribe: (fn) => c.subscribe(fn),
  };
}
